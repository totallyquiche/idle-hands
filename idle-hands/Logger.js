import PropertyManager from "./PropertyManager.js";

class Logger extends PropertyManager{

  constructor(applicationId) {
    super();

    if (!applicationId) throw new TypeError('applicationId must be defined');

    this.set('applicationId', applicationId);
  }

  log(message) {
    const APPLICATION_ID = this.get('applicationId');

    console.log(`[IDLE HANDS - ${APPLICATION_ID}] ${message}`);
  }

}

export default Logger;