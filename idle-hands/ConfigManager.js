class ConfigManager {

  constructor(configValues) {
    this.debug = false;
    this.applicationId = window.location.hostname;
    this.maximumIdleDuration = 60 * 1000 * 60; // 1 hoor;
    this.heartbeatUrl = window.location.href;
    this.heartbeatInterval = 60 * 1000; // 1 minute;
    this.documentTitle = 'Session Expiration Warning';
    this.logoutDocumentTitle = 'Logging out...';
    this.promptDuration = 30 * 1000; // 30 seconds;
    this.promptContainerSelector = 'body';
    this.promptZindex = 9999;
    this.promptDialogTextAllowHtml = false;
    this.promptTimeRemainingTemplate = '%time seconds remaining';
    this.promptHeaderText = 'Session Expiration Warning';
    this.promptDialogText = 'Your session is about to expire due to inactivity.';
    this.promptCancelButtonText = 'Stay Logged In';
    this.promptLogoutButtonText = 'Log Out Now';
    this.promptLogoutText = 'Logging out...';
    this.events =  ['click', 'keypress', 'scroll', 'wheel', 'mousewheel'];
    this.manualLogoutUrl = this.logoutUrl;

    if (!configValues['logoutUrl']) {
      throw new TypeError('logoutUrl must be defined');
    }

    for (const key in configValues) {
      this[key] = configValues[key];
    }
  }

}

export default ConfigManager;