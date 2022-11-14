import ConfigManager from './ConfigManager.js';
import Logger from './Logger.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import PromptFactory from './prompt/PromptFactory.js';
import Iframe from './prompt/helpers/Iframe.js';

class IdleHands {

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

    this.setIframeElement();
    this.setEventListeners();
    this.setCancelButtonEventListener();
    this.setLogoutButtonEventListener();
  }

  setIframeElement() {
    this.iframeElement = Iframe.create(this.createPromptElement());

    document.querySelector(this.config.promptContainerSelector)
      .appendChild(this.iframeElement);

    this.iframeElement
    .contentWindow
    .document
    .body
    .appendChild(this.iframeElement.promptElement);

    this.iframeElement
      .contentWindow
      .document
      .body
      .style
      .setProperty(
        'font-size',
        window.getComputedStyle(document.body, null)
        .getPropertyValue('font-size')
      );
  }

  createPromptElement() {
    return PromptFactory.create(
      this.config.promptHeaderText,
      this.config.promptDialogText,
      this.config.promptDialogTextAllowHtml,
      this.config.promptTimeRemainingTemplate,
      this.config.promptLogoutText,
      this.config.promptCancelButtonText,
      this.config.promptLogoutButtonText,
      this.config.promptZindex
    );
  }

  displayLogoutMessage() {
    this.iframeElement
      .promptElement
      .dialogElement
      .timeRemainingElement
      .style
      .display = 'none';

    this.iframeElement
      .promptElement
      .dialogElement
      .cancelButtonElement
      .disabled = true;

    this.iframeElement
      .promptElement
      .dialogElement
      .logoutButtonElement
      .disabled = true;

    this.iframeElement
      .promptElement
      .dialogElement
      .logoutMessageElement
      .style
      .display = 'block';
  }

  setEventListeners() {
    this.config.events.forEach(function(event) {
      document.addEventListener(event, this.resetHandler);
    }.bind(this));
  }

  unsetEventListeners() {
    this.config.events.forEach(function(event) {
      document.removeEventListener(event, this.resetHandler);
    }.bind(this));
  }

  setCancelButtonEventListener() {
    this.iframeElement
      .promptElement
      .dialogElement
      .cancelButtonElement
      .addEventListener('click', this.resetHandler);
  }

  setLogoutButtonEventListener() {
    this.iframeElement
      .promptElement
      .dialogElement
      .logoutButtonElement
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

  getTimeRemaining() {
    return this.config.maximumIdleDuration - this.timer.getIdleTime();
  }

  reset() {
    this.log('Reverting document title...');
    document.title = this.originalDocumentTitle;

    this.log('Setting event listeners...');
    this.setEventListeners();

    this.log('Hiding prompt...');
    this.iframeElement.hide();

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
    const PROMPT_IS_DISPLAYED = this.iframeElement.promptElement.isDisplayed;

    this.log('Tick...');

    if (TIME_REMAINING < 0) {
      this.log('Logging out...');
      this.logoutHandler();

      return;
    }

    this.log('Updating prompt...');
    this.iframeElement
      .promptElement
      .dialogElement
      .timeRemainingElement
      .updateTime(TIME_REMAINING / 1000);

    if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.originalDocumentTitle;

      this.log('Hiding prompt...');
      this.iframeElement.promptElement.hide();
    }

    if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.config.documentTitle;

      this.log('Unsetting event listeners...');
      this.unsetEventListeners();

      this.log('Displaying prompt...');
      this.iframeElement.display();

      if (this.config.shiftFocus) {
        this.log('Shifting focus to cancel button...');
        this.iframeElement
          .promptElement
          .dialogElement
          .cancelButtonElement
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