import PropertyManager from './PropertyManager.js';
import Logger from './Logger.js';
import ConfigManager from './ConfigManager.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';

class IdleHands extends PropertyManager {

  constructor(config = {}) {
    super()

    this.set('logger', new Logger);

    this.set('config', new ConfigManager(config));

    this.set(
      'timer',
      new Timer(
        new Storage(
          this.getConfig('applicationId')
        ),
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

    return this.getConfig('maximumIdleTime') - TIMER.getIdleTime();
  }

  tick() {
    const TIMER = this.get('timer');
    const HEARTBEAT_INTERVAL = this.get('config').get('heartbeatInterval');
    const MAXIMUM_IDLE_TIME = this.getConfig('maximumIdleTime');
    const DEBUG = this.getConfig('debug');

    this.log('Tick...');

    if (TIMER.atInterval(HEARTBEAT_INTERVAL)) {
      this.log('Heartbeat...');
      this.get('heartbeat').beat();
    }

    if (TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME) <= 0) {
      this.log('Stopping timer...');
      TIMER.stop();
    }
  }

};

export default IdleHands;