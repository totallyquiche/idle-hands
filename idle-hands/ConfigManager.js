class ConfigManager {

  constructor(configValues) {
    if (!configValues['logoutUrl']) {
      throw new TypeError('logoutUrl must be defined');
    }

    this.applicationId = window.location.hostname;
    this.containerTitle = 'Session Expiration Warning Prompt';
    this.debug = false;
    this.documentTitle = 'Session Expiration Warning';
    this.events =  ['click', 'keypress', 'scroll', 'wheel', 'mousewheel'];
    this.heartbeatInterval = 60 * 1000; // 1 minute;
    this.heartbeatUrl = window.location.href;
    this.logoutDocumentTitle = 'Logging out...';
    this.maximumIdleDuration = 60 * 1000 * 60; // 1 hoor;
    this.promptCancelButtonText = 'Stay Logged In';
    this.promptContainerSelector = 'body';
    this.promptDialogText = 'Your session will expire in %time seconds due to inactivity.';
    this.promptDialogTextAllowHtml = false;
    this.promptDuration = 30 * 1000; // 30 seconds;
    this.promptHeaderText = 'Session Expiration Warning';
    this.promptLogoutButtonText = 'Log Out Now';
    this.promptLogoutText = 'Logging out...';
    this.promptZindex = 9999;
    this.shiftFocus = true;

    for (const key in configValues) {
      this[key] = configValues[key];
    }

    this.manualLogoutUrl = this.logoutUrl;
  }

}

export default ConfigManager;