import PropertyManager from './PropertyManager.js';
import ConfigManager from './ConfigManager.js';
import Logger from './Logger.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import Prompt from './Prompt.js';

class IdleHands extends PropertyManager {

  constructor(config = {}) {
    super()

    this.set('config', new ConfigManager(config));
    this.set('logger', new Logger(this.getConfig('applicationId')));
    this.set('prompt', this.getPrompt());
    this.set('storage', new Storage(this.getConfig('applicationId')));
    this.set('timer', this.createTimer());
    this.set('heartbeat', new Heartbeat(this.getConfig('heartbeatUrl')));
    this.set('resetHandler', this.reset.bind(this));
    this.set('logoutHandler', this.logOut.bind(this));

    this.setEventListeners();
    this.setCancelButtonEventListener();
    this.setLogoutButtonEventListener();
  }

  getPrompt() {
    return new Prompt(
      this.getConfig('promptContainerSelector'),
      this.getConfig('promptZindex'),
      this.getConfig('promptTimeRemainingTemplate'),
      this.getConfig('promptHeaderText'),
      this.getConfig('promptCancelButtonText'),
      this.getConfig('promptLogoutButtonText'),
      this.getConfig('promptLogoutText')
    );
  }

  setEventListeners() {
    this.getConfig('events').forEach(function(event) {
      document.addEventListener(event, this.get('resetHandler'));
    }.bind(this));
  }

  unsetEventListeners() {
    this.getConfig('events').forEach(function(event) {
      document.removeEventListener(event, this.get('resetHandler'));
    }.bind(this));
  }

  setCancelButtonEventListener() {
    document.getElementById('idle-hands-prompt-cancel-button')
      .addEventListener('click', this.get('resetHandler'));
  }

  setLogoutButtonEventListener() {
    document.getElementById('idle-hands-prompt-logout-button')
      .addEventListener('click', this.get('logoutHandler'));
  }

  createTimer() {
    return new Timer(this.get('storage'), this.tick.bind(this));
  }

  log(message) {
    if (this.getConfig('debug')) this.get('logger').log(message);
  }

  getConfig(key) {
    return this.get('config').get(key);
  }

  getTimeRemaining() {
    const TIMER = this.get('timer');

    return this.getConfig('maximumIdleDuration') - TIMER.getIdleTime();
  }

  reset() {
    this.log('Setting event listeners...');
    this.setEventListeners();

    this.log('Hiding prompt...');
    this.get('prompt').hide();

    this.log('Stopping timer...');
    this.get('timer').stop();

    this.log('Assigning new timer...');
    this.set('timer', this.createTimer());
  }

  logOut() {
    this.log('Stopping timer...');
    this.get('timer').stop();

    this.log('Clearing start time...');
    this.get('timer').clearStartTime();

    this.log('Displaying logout message...');
    this.get('prompt').displayLogoutMessage();

    this.log('Redirecting to logout URL...');
    window.location.replace(this.getConfig('logoutUrl'));
  }

  tick() {
    const TIMER = this.get('timer');
    const HEARTBEAT_INTERVAL = this.get('config').get('heartbeatInterval');
    const MAXIMUM_IDLE_TIME = this.getConfig('maximumIdleDuration');
    const TIME_REMAINING = TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME);
    const PROMPT_DURATION = this.getConfig('promptDuration');
    const PROMPT = this.get('prompt');
    const PROMPT_IS_DISPLAYED = PROMPT.get('isDisplayed');

    this.log('Tick...');

    if (TIME_REMAINING < 0) {
      this.log('Logging out...');
      this.get('logoutHandler')();

      return;
    }

    this.log('Updating prompt...');
    PROMPT.updateTimeRemaining(TIME_REMAINING / 1000);

    if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
      this.log('Hiding prompt...');
      PROMPT.hide();
    }

    if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT_IS_DISPLAYED) {
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
      this.get('heartbeat').beat();
    }
  }

};

export default IdleHands;