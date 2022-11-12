import PropertyManager from './PropertyManager.js';
import Logger from './Logger.js';
import ConfigManager from './ConfigManager.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';
import Prompt from './Prompt.js';

class IdleHands extends PropertyManager {

  constructor(config = {}) {
    super()

    this.set('logger', new Logger);

    this.set('config', new ConfigManager(config));

    this.set('prompt', new Prompt(this.getConfig('promptContainerSelector')));

    this.set(
      'timer',
      new Timer(
        new Storage(this.getConfig('applicationId')),
        this.tick.bind(this)
      )
    );

    this.set('heartbeat', new Heartbeat(this.getConfig('heartbeatUrl')))
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

  tick() {
    const TIMER = this.get('timer');
    const HEARTBEAT_INTERVAL = this.get('config').get('heartbeatInterval');
    const MAXIMUM_IDLE_TIME = this.getConfig('maximumIdleDuration');
    const TIME_REMAINING = TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME);
    const PROMPT_DURATION = this.getConfig('promptDuration');
    const PROMPT = this.get('prompt');
    const LOGOUT_URL = this.getConfig('logoutUrl');

    this.log('Tick...');

    this.log('Updating prompt...');
    PROMPT.updateTimeRemaining(TIME_REMAINING / 1000);

    if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT.get('isDisplayed')) {
      this.log('Displaying prompt...');
      PROMPT.display();
    }

    if (TIME_REMAINING <= 0) {
      this.log('Stopping timer...');
      TIMER.stop();

      this.log('Redirecting...');
      window.location.replace(LOGOUT_URL);
    } else if (TIMER.atInterval(HEARTBEAT_INTERVAL)) {
      this.log('Heartbeat...');
      this.get('heartbeat').beat();
    }
  }

};

export default IdleHands;