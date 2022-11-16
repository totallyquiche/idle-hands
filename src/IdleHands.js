import ConfigManager from './ConfigManager.js';
import Logger from './Logger.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import PromptFactory from './prompt/PromptFactory.js';
import Container from './prompt/elements/Container.js';
import DialogText from './prompt/elements/DialogText.js';

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
  parent;
  originalActiveElement;

  constructor(config = {}) {
    this.config = new ConfigManager(config);

    const APPLICATION_ID = this.config.applicationId;

    this.logger = new Logger(APPLICATION_ID);
    this.storage = new Storage(APPLICATION_ID);
    this.timer = this.createTimer();
    this.heartbeat = new Heartbeat(this.config.heartbeatUrl);
    this.resetHandler = this.reset.bind(this);
    this.logoutHandler = this.logOut.bind(this);
    this.originalDocumentTitle = document.title;
    this.originalActiveElement = (document.activeElement || document.body);
    this.parent = document.querySelector(this.config.containerSelector);

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

    this.parent.appendChild(this.container.element);

    this.container
      .element
      .contentWindow
      .document
      .body
      .appendChild(this.container.prompt.element);

    this.container
      .element
      .contentWindow
      .document
      .body
      .style
      .fontSize = window.getComputedStyle(document.body, null)
        .getPropertyValue('font-size');
  }

  createPromptElement() {
    return PromptFactory.create(
      this.config.headerText,
      this.createDialogText(),
      this.config.cancelButtonText,
      this.config.logoutButtonText,
      this.config.zIndex
    );
  }

  createDialogText() {
    return new DialogText(
      this.config.dialogText,
      this.timer.getTimeRemaining(this.config.maximumIdleDuration) / 1000,
      this.config.dialogTextAllowHtml
    );
  }

  displayLogoutMessage() {
    this.container
      .prompt
      .dialog
      .header
      .element
      .innerText = this.config.logoutText;

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
  }

  hideContainer() {
    this.log('Hiding container...');
    this.container.hide();

    this.log('Removing focus from container...');
    this.container.element.blur();

    this.log('Returning focus to original active element...');
    this.originalActiveElement.focus();
  }

  setDocumentEventListeners() {
    this.config.events.forEach(function(event) {
      this.log(`Setting ${event} event listener on document`);
      document.addEventListener(event, this.resetHandler);
    }.bind(this));
  }

  unsetDocumentEventListeners() {
    this.config.events.forEach(function(event) {
      this.log(`Removing ${event} event listener from document`);
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

    this.setDocumentEventListeners();

    this.hideContainer();

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
    const PROMPT_DURATION = this.config.duration;
    const PROMPT_IS_DISPLAYED = this.container.isDisplayed;
    const DIALOG_TEXT_HTML = this.createDialogText(TIME_REMAINING / 1000)
      .element
      .innerHTML;

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
      .element
      .innerHTML = DIALOG_TEXT_HTML;

    if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.originalDocumentTitle;

      this.hideContainer();
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