import ConfigManager from './ConfigManager.js';
import Logger from './Logger.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import PromptFactory from './prompt/PromptFactory.js';

class IdleHands {

  constructor(config = {}) {
    this.originalDocumentTitle = document.title;
    this.config = new ConfigManager(config);
    this.logger = new Logger(this.getConfig('applicationId'));
    this.prompt = this.getPrompt();
    this.storage = new Storage(this.getConfig('applicationId'));
    this.timer = this.createTimer();
    this.heartbeat = new Heartbeat(this.getConfig('heartbeatUrl'));
    this.resetHandler = this.reset.bind(this);
    this.logoutHandler = this.logOut.bind(this);
    this.storage.set('logoutUrl', this.getConfig('logoutUrl'));

    this.setEventListeners();
    this.setCancelButtonEventListener();
    this.setLogoutButtonEventListener();
  }

  getPrompt() {
    return new PromptFactory(
      this.getConfig('promptContainerSelector'),
      this.getConfig('promptZindex'),
      this.getConfig('promptTimeRemainingTemplate'),
      this.getConfig('promptHeaderText'),
      this.getConfig('promptDialogText'),
      this.getConfig('promptCancelButtonText'),
      this.getConfig('promptLogoutButtonText'),
      this.getConfig('promptLogoutText')
    );
  }

  setEventListeners() {
    this.getConfig('events').forEach(function(event) {
      document.addEventListener(event, this.resetHandler);
    }.bind(this));
  }

  unsetEventListeners() {
    this.getConfig('events').forEach(function(event) {
      document.removeEventListener(event, this.resetHandler);
    }.bind(this));
  }

  setCancelButtonEventListener() {
    this.prompt
      .cancelButtonElement
      .addEventListener('click', this.resetHandler);
  }

  setLogoutButtonEventListener() {
    this.prompt
      .logoutButtonElement
      .addEventListener('click', function() {
        this.storage.set('logoutUrl', this.getConfig('manualLogoutUrl'));
        this.logoutHandler();
      }.bind(this));
  }

  createTimer() {
    return new Timer(this.storage, this.tick.bind(this));
  }

  log(message) {
    if (this.getConfig('debug')) this.logger.log(message);
  }

  getConfig(key) {
    return this.config[key];
  }

  getTimeRemaining() {
    return this.getConfig('maximumIdleDuration') - this.timer.getIdleTime();
  }

  reset() {
    this.log('Reverting document title...');
    document.title = this.originalDocumentTitle;

    this.log('Setting event listeners...');
    this.setEventListeners();

    this.log('Hiding prompt...');
    this.prompt.hide();

    this.log('Stopping timer...');
    this.timer.stop();

    this.log('Assigning new timer...');
    this.timer = this.createTimer();
  }

  logOut() {
    this.log('Updating document title...');
    document.title = this.getConfig('logoutDocumentTitle');

    this.log('Stopping timer...');
    this.timer.stop();

    this.log('Clearing start time...');
    this.timer.clearStartTime();

    this.log('Displaying logout message...');
    this.prompt.displayLogoutMessage();

    this.log('Redirecting to logout URL...');
    window.location.replace(this.storage.get('logoutUrl'));
  }

  tick() {
    const TIMER = this.timer;
    const HEARTBEAT_INTERVAL = this.config['heartbeatInterval'];
    const MAXIMUM_IDLE_TIME = this.getConfig('maximumIdleDuration');
    const TIME_REMAINING = TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME);
    const PROMPT_DURATION = this.getConfig('promptDuration');
    const PROMPT = this.prompt;
    const PROMPT_IS_DISPLAYED = PROMPT.isDisplayed;

    this.log('Tick...');

    if (TIME_REMAINING < 0) {
      this.log('Logging out...');
      this.logoutHandler();

      return;
    }

    this.log('Updating prompt...');
    PROMPT.updateTimeRemaining(TIME_REMAINING / 1000);

    if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.originalDocumentTitle;

      this.log('Hiding prompt...');
      PROMPT.hide();
    }

    if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT_IS_DISPLAYED) {
      this.log('Updating document title...');
      document.title = this.getConfig('documentTitle');

      this.log('Unsetting event listeners...');
      this.unsetEventListeners();

      this.log('Displaying prompt...');
      PROMPT.display();
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