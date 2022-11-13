class Logger {

  constructor(applicationId) {
    if (!applicationId) throw new TypeError('applicationId must be defined');

    this.applicationId = applicationId;
  }

  log(message) {
    console.log(`[IDLE HANDS - ${this.applicationId}] ${message}`);
  }

}

export default Logger;