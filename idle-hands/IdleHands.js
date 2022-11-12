import PropertyManager from './PropertyManager.js';
import ConfigManager from './ConfigManager.js';
import Storage from './storage.js';
import Timer from './timer.js';

class IdleHands extends PropertyManager {

  constructor(config = {}) {
    super()

    this.set('config', new ConfigManager(config));

    this.set(
      'timer',
      new Timer(
        new Storage(
          this.getConfig('applicationId')
        )
      )
    );
  }

  getConfig(key) {
    return this.get('config').get(key);
  }

};

export default IdleHands;