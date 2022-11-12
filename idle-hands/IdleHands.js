import PropertyManager from './PropertyManager.js';
import ConfigManager from './ConfigManager.js';
import Storage from './Storage.js';
import Timer from './Timer.js';
import Heartbeat from './Heartbeat.js';

class IdleHands extends PropertyManager {

  constructor(config = {}) {
    super()

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

  getConfig(key) {
    return this.get('config').get(key);
  }

  getTimeRemaining() {
    const TIMER = this.get('timer');

    return this.getConfig('maximumIdleTime') - TIMER.getIdleTime();
  }

  tick() {
    this.get('heartbeat').beat();
  }

};

export default IdleHands;