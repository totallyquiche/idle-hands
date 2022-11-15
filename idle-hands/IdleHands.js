import ConfigManager from './ConfigManager.js';
import Logger from './Logger.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import PromptFactory from './PromptFactory.js';
import Container from './elements/Container.js';

class IdleHands {

  config;
  originalDocumentTitle;
  logger;
  storage;
  timer;
  heartbeat;
  resetHandler;
  logoutHandler;
  container;

  constructor(config = {}) {
    this.config = new ConfigManager(config);

    const APPLICATION_ID = this.config.applicationId;

    this.originalDocumentTitle = document.title;
    this.logger = new Logger(APPLICATION_ID);
    this.storage = new Storage(APPLICATION_ID);
    this.timer = this.createTimer();
    this.heartbeat = new Heartbeat(this.config.heartbeatUrl);
    this.resetHandler = this.reset.bind(this);
    this.logoutHandler = this.logOut.bind(this);

    this.storage.set('logoutUrl', this.config.logoutUrl);

    this.setContainerElement();
    this.setDocumentEventListeners();
    this.setCancelButtonEventListener();
    this.setLogoutButtonEventListener();
  }

  setContainerElement() {
    this.container = new Container(
      this.config.containerTitle,
      this.createPromptElement()
    );

    document.querySelector(this.config.promptContainerSelector)
      .appendChild(this.container.element);

    this.container
      .element
      .contentWindow
      .document
      .body
      .appendChild(this.container.prompt.element);
  }

  createPromptElement() {
    return PromptFactory.create(
      this.config.promptHeaderText,
      this.config.promptDialogText,
      this.config.promptLogoutText,
      this.config.promptCancelButtonText,
      this.config.promptLogoutButtonText,
      this.config.promptZindex,
      window.getComputedStyle(document.body, null)
        .getPropertyValue('font-size')
    );
  }

  displayLogoutMessage() {
    this.container
      .prompt
      .dialog
      .textContainer
      .dialogText
      .element
      .style
      .display = 'none';

    this.container
      .prompt
      .dialog
      .buttonContainer
      .cancelButton
      .element
      .disabled = true;

    this.container
      .prompt
      .dialog
      .buttonContainer
      .logoutButton
      .element
      .disabled = true;

    this.container
      .prompt
      .dialog
      .logoutMessage
      .element
      .style
      .display = 'block';
  }

  setDocumentEventListeners() {
    this.config.events.forEach(function(event) {
      document.addEventListener(event, this.resetHandler);
    }.bind(this));
  }

  unsetDocumentEventListeners() {
    this.config.events.forEach(function(event) {
      document.removeEventListener(event, this.resetHandler);
    }.bind(this));
  }

  setCancelButtonEventListener() {
    this.container
      .prompt
      .dialog
      .buttonContainer
      .cancelButton
      .element
      .addEventListener('click', this.resetHandler);
  }

  setLogoutButtonEventListener() {
    this.container
      .prompt
      .dialog
      .buttonContainer
      .logoutButton
      .element
      .addEventListener('click', function() {
        this.storage.set('logoutUrl', this.config.manualLogoutUrl);
        this.logoutHandler();
      }.bind(this));
  }

  createTimer() {
    return new Timer(this.storage, this.tick.bind(this));
  }

  log(message) {
    if (this.config.debug) this.logger.log(message);
  }

  reset() {
    this.log('Reverting document title...');
    document.title = this.originalDocumentTitle;

    this.log('Setting event listeners...');
    this.setDocumentEventListeners();

    this.log('Hiding container...');
    this.container.hide();

    this.log('Stopping timer...');
    this.timer.stop();

    this.log('Assigning new timer...');
    this.timer = this.createTimer();
  }

  logOut() {
    this.log('Updating document title...');
    document.title = this.config.logoutDocumentTitle;

    this.log('Stopping timer...');
    this.timer.stop();

    this.log('Clearing start time...');
    this.timer.clearStartTime();

    this.log('Displaying logout message...');
    this.displayLogoutMessage();

    this.log('Redirecting to logout URL...');
    window.location.replace(this.storage.get('logoutUrl'));
  }

  tick() {
    const TIMER = this.timer;
    const HEARTBEAT_INTERVAL = this.config['heartbeatInterval'];
    const MAXIMUM_IDLE_TIME = this.config.maximumIdleDuration;
    const TIME_REMAINING = TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME);
    const PROMPT_DURATION = this.config.promptDuration;
    const PROMPT_IS_DISPLAYED = this.container.isDisplayed;

    this.log('Tick...');

    if (TIME_REMAINING < 0) {
      this.log('Logging out...');
      this.logoutHandler();

      return;
    }

    this.log('Updating prompt...');
    this.container
      .prompt
      .dialog
      .textContainer
      .dialogText
      .time
      .update(TIME_REMAINING / 1000);

    if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.originalDocumentTitle;

      this.log('Hiding prompt...');
      this.container.hide();
    }

    if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.config.documentTitle;

      this.log('Unsetting event listeners...');
      this.unsetDocumentEventListeners();

      this.log('Displaying prompt...');
      this.container.display();

      if (this.config.shiftFocus) {
        this.log('Shifting focus to cancel button...');
        this.container
          .prompt
          .dialog
          .buttonContainer
          .cancelButton
          .element
          .focus();
      }
    }

    if (TIME_REMAINING <= 0) {
      this.log('Logging out...');
      this.logOut();
    } else if (TIMER.atInterval(HEARTBEAT_INTERVAL)) {
      this.log('Heartbeat...');
      this.heartbeat.beat();
    }
  }

};

export default IdleHands;