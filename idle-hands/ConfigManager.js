import PropertyManager from "./PropertyManager.js";

class ConfigManager extends PropertyManager {

  constructor(configValues) {
    super();

    this.set('debug', false);
    this.set('applicationId', window.location.hostname);
    this.set('maximumIdleDuration', 60 * 1000 * 60); // 1 hour
    this.set('heartbeatUrl', window.location.href);
    this.set('heartbeatInterval', 60 * 1000); // 1 minute
    this.set('promptDuration', 30 * 1000); // 30 seconds
    this.set('promptContainerSelector', 'body');
    this.set('promptZindex', 9999);
    this.set('events',  [ 'click', 'keypress', 'scroll', 'wheel', 'mousewheel' ]);

    // this.set('automaticLogOutUrl', window.location.href);
    // this.set('dialogCountDownMessage', 'Time remaining: ');
    // this.set('dialogLogOutButtonText', 'Log Out Now');
    // this.set('dialogMessage', 'Your session is about to expire due to inactivity.');
    // this.set('dialogStayLoggedInButtonText', 'Stay Logged In');
    // this.set('dialogTitle', 'Session Expiration Warning');
    // this.set('documentTitle', 'Session Expiration Warning');
    // this.set('loggingOutDocumentTitle', 'Logging Out...');
    // this.set('manualLogOutUrl', window.location.href);

    if (!configValues['logoutUrl']) {
      throw new TypeError('logoutUrl must be defined');
    }

    for (const key in configValues) {
      this.set(key, configValues[key]);
    }
  }

}

export default ConfigManager;