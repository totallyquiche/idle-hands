class ConfigManager {

  constructor(configValues) {
    if (!configValues['logoutUrl']) {
      throw new TypeError('logoutUrl must be defined');
    }

    this.applicationId = window.location.hostname;
    this.cancelButtonText = 'Stay Logged In';
    this.containerSelector = 'body';
    this.containerTitle = 'Session Expiration Warning Prompt';
    this.debug = false;
    this.dialogText = 'Your session will expire in %time seconds due to inactivity.';
    this.dialogTextAllowHtml = false;
    this.documentTitle = 'Session Expiration Warning';
    this.duration = 30 * 1000; // 30 seconds;
    this.events =  ['click', 'keypress', 'scroll', 'wheel', 'mousewheel'];
    this.headerText = 'Session Expiration Warning';
    this.heartbeatInterval = 60 * 1000; // 1 minute;
    this.heartbeatUrl = window.location.href;
    this.logoutButtonText = 'Log Out Now';
    this.logoutDocumentTitle = 'Logging out...';
    this.logoutText = 'Logging out...';
    this.maximumIdleDuration = 60 * 1000 * 60; // 1 hoor;
    this.shiftFocus = true;
    this.zIndex = 9999;

    for (const key in configValues) {
      this[key] = configValues[key];
    }

    this.manualLogoutUrl = this.logoutUrl;
  }

}

export default ConfigManager;