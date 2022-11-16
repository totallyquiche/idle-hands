(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.IdleHands = factory());
})(this, (function () { 'use strict';

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

  class Logger {

    constructor(applicationId) {
      if (!applicationId) throw new TypeError('applicationId must be defined');

      this.applicationId = applicationId;
    }

    log(message) {
      console.log(`[IDLE HANDS - ${this.applicationId}] ${message}`);
    }

  }

  class Storage {

    prefix;

    constructor(applicationId) {
      if (!applicationId) throw new TypeError('applicationId must be defined');

      this.prefix = applicationId + '_';
    }

    set(key, value) {
      localStorage.setItem(this.prefix + key, value);
    }

    get(key) {
      return localStorage.getItem(this.prefix + key);
    }

    delete(key) {
      localStorage.removeItem(this.prefix + key);
    }

  }

  class Timer {

    constructor(storage, tick = () => {}) {
      if (!storage) throw new TypeError('storage must be defined');

      this.storage = storage;

      this.setStartTime();

      this.tickInterval = setInterval(tick, 1000);
    }

    getCurrentTime() {
      return (new Date).getTime();
    }

    setStartTime() {
      this.storage.set('startTime', this.getCurrentTime());
    }

    getStartTime() {
      return this.storage.get('startTime');
    }

    clearStartTime() {
      this.storage.delete('startTime');
    }

    getIdleTime() {
      const REAL_IDLE_TIME = this.getCurrentTime() - this.getStartTime();

      return REAL_IDLE_TIME - (REAL_IDLE_TIME % 1000);
    }

    atInterval(interval) {
      return (this.getIdleTime() % interval === 0);
    }

    getTimeRemaining(timeAllowed) {
      return (timeAllowed - this.getIdleTime());
    }

    stop() {
      clearInterval(this.tickInterval);
    }

  }

  class Heartbeat {

    constructor(url) {
      this.url = url;
    }

    beat() {
      fetch(this.url);
    }

  }

  class Element {

    element;

    create(
      tagName,
      id = '',
      classNames = [],
      styles = {},
      text = '',
      children = [],
      allowHtml = false
    ) {
      const ELEMENT = document.createElement(tagName);

      ELEMENT.id = id;

      classNames.forEach(function(className) {
        ELEMENT.classList.add(className);
      });

      for (const style in styles) {
        ELEMENT.style.setProperty(style, styles[style], 'important');
      }

      if (allowHtml) {
        ELEMENT.innerHTML = text;
      } else {
        ELEMENT.innerText = text;
      }

      children.forEach(function(child) {
        ELEMENT.appendChild(child);
      });

      return ELEMENT;
    }

  }

  class Span extends Element {

    constructor(text = '', children = [], styles = {}, allowHtml = false) {
      super();

      this.element = this.create(
        'span',
        '',
        [],
        styles,
        text,
        children,
        allowHtml
      );
    }

  }

  class Header extends Span {

    constructor(text) {
      super(
        text,
        [],
        {
          'display': 'block',
          'font-size': '1.15em',
          'font-weight': 'bold',
          'color': '#fff',
          'text-align': 'center',
          'background-color': '#1d4289',
          'padding': '8px',
          'font-family': 'sans-serif',
        }
      );
    }

  }

  class Button extends Element {

    constructor(id, text) {
      super();

      this.element = this.create(
        'button',
        id,
        [],
        {},
        text
      );
    }

  }

  class CancelButton extends Button {

    constructor(text) {
      super('idle-hands-prompt-cancel-button', text);
    }

  }

  class LogoutButton extends Button {

    constructor(text) {
      super('idle-hands-prompt-logout-button', text);
    }

  }

  class Div extends Element {

    constructor(id, children, styles = {}) {
      super();

      this.element = this.create(
        'div',
        id,
        [],
        styles,
        '',
        children
      );
    }

  }

  class Dialog extends Div {

    header;
    textContainer;
    buttonContainer;

    constructor(
      header,
      textContainer,
      buttonContainer
    ) {
      const CHILDREN = [
        header.element,
        textContainer.element,
        buttonContainer.element,
      ];

      const STYLES = {
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)',
        'min-width': '400px',
        'padding-bottom': '8px',
        'background-color': 'white',
        'color': '#152b22',
      };

      super('idle-hands-dialog', CHILDREN, STYLES);

      this.header = header;
      this.textContainer = textContainer;
      this.buttonContainer = buttonContainer;
    }

  }

  class Prompt extends Div {

    dialog;

    constructor(dialog, zIndex, fontSize) {
      super(
        'idle-hands-prompt',
        [dialog.element],
        {
          'position': 'fixed',
          'height': '100%',
          'width': '100%',
          'top': '0',
          'left': '0',
          'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII=")',
          'z-index': zIndex,
          'font-size': fontSize,
        }
      );

      this.dialog = dialog;
    }

  }

  class ButtonContainer extends Div {

    cancelButton;
    logoutButton;

    constructor(cancelButton, logoutButton) {
      super(
        '',
        [cancelButton.element, logoutButton.element],
        {
          'display': 'flex',
          'justify-content': 'space-evenly',
        }
      );

      this.cancelButton = cancelButton;
      this.logoutButton = logoutButton;
    }

  }

  class TextContainer extends Div {

    dialogText;

    constructor(dialogText) {
      super(
        '',
        [dialogText.element],
        {
          'margin': '1em 0.5em',
          'line-height': '1.5',
        }
      );

      this.dialogText = dialogText;
    }

  }

  class PromptFactory {

    static create(
      headerText,
      dialogText,
      cancelButtonText,
      logoutButtonText,
      zIndex,
      fontSize
    ) {

      const CANCEL_BUTTON = new CancelButton(cancelButtonText);
      const LOGOUT_BUTTON = new LogoutButton(logoutButtonText);

      const DIALOG = new Dialog(
        new Header(headerText),
        new TextContainer(dialogText),
        new ButtonContainer(CANCEL_BUTTON, LOGOUT_BUTTON)
    );

      return new Prompt(DIALOG, zIndex, fontSize);
    }

  }

  class Iframe extends Element {

    constructor() {
      super();

      this.element = this.create(
        'iframe',
        '',
        [],
        {
          'display': 'none',
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'height': '100vh',
          'width': '100vw',
          'border': 'none',
        }
      );
    }



  }

  class Container extends Iframe {

    prompt;
    isDisplayed;

    constructor(title, prompt) {
      super();

      this.element.title = title;
      this.prompt = prompt;
      this.isDisplayed = false;

    }

    display() {
      this.element.style.display = 'block';
      this.isDisplayed = 'true';
    }

    hide() {
      this.element.style.display = 'none';
      this.isDisplayed = false;
    }

  }

  class DialogText extends Span {

    time;
    renderedText;

    constructor(dialogText, time, allowHtml) {
      const TEMPLATE_PARTS = dialogText.split('%time');

      if (TEMPLATE_PARTS.length > 2) {
        throw new SyntaxError(
          'dialogText must contain no more than one "%time" placeholder'
        );
      }

      let renderedText;

      if (TEMPLATE_PARTS.length === 2) {
        renderedText = TEMPLATE_PARTS[0] + time + TEMPLATE_PARTS[1];
      } else {
        renderedText = dialogText;
      }

      super(
        renderedText,
        [],
        {},
        allowHtml
      );

      this.time = time;
      this.renderedText = renderedText;
    }

  }

  class IdleHands {

    config;
    originalDocumentTitle;
    logger;
    storage;
    timer;
    heartbeat;
    resetHandler;
    logoutHandler;
    container;
    parent;
    originalActiveElement;

    constructor(config = {}) {
      this.config = new ConfigManager(config);

      const APPLICATION_ID = this.config.applicationId;

      this.logger = new Logger(APPLICATION_ID);
      this.storage = new Storage(APPLICATION_ID);
      this.timer = this.createTimer();
      this.heartbeat = new Heartbeat(this.config.heartbeatUrl);
      this.resetHandler = this.reset.bind(this);
      this.logoutHandler = this.logOut.bind(this);
      this.originalDocumentTitle = document.title;
      this.originalActiveElement = (document.activeElement || document.body);
      this.parent = document.querySelector(this.config.containerSelector);

      this.storage.set('logoutUrl', this.config.logoutUrl);

      this.setContainerElement();
      this.setDocumentEventListeners();
      this.setCancelButtonEventListener();
      this.setLogoutButtonEventListener();
    }

    setContainerElement() {
      this.container = new Container(
        this.config.containerTitle,
        this.createPromptElement()
      );

      this.parent.appendChild(this.container.element);

      this.container
        .element
        .contentWindow
        .document
        .body
        .appendChild(this.container.prompt.element);
    }

    createPromptElement() {
      return PromptFactory.create(
        this.config.headerText,
        this.createDialogText(),
        this.config.cancelButtonText,
        this.config.logoutButtonText,
        this.config.zIndex,
        window.getComputedStyle(document.body, null)
          .getPropertyValue('font-size')
      );
    }

    createDialogText() {
      return new DialogText(
        this.config.dialogText,
        this.timer.getTimeRemaining(this.config.maximumIdleDuration) / 1000,
        this.config.dialogTextAllowHtml
      );
    }

    displayLogoutMessage() {
      this.container
        .prompt
        .dialog
        .header
        .element
        .innerText = this.config.logoutText;

      this.container
        .prompt
        .dialog
        .buttonContainer
        .cancelButton
        .element
        .disabled = true;

      this.container
        .prompt
        .dialog
        .buttonContainer
        .logoutButton
        .element
        .disabled = true;
    }

    hideContainer() {
      this.log('Hiding container...');
      this.container.hide();

      this.log('Removing focus from container...');
      this.container.element.blur();

      this.log('Returning focus to original active element...');
      this.originalActiveElement.focus();
    }

    setDocumentEventListeners() {
      this.config.events.forEach(function(event) {
        this.log(`Setting ${event} event listener on document`);
        document.addEventListener(event, this.resetHandler);
      }.bind(this));
    }

    unsetDocumentEventListeners() {
      this.config.events.forEach(function(event) {
        this.log(`Removing ${event} event listener from document`);
        document.removeEventListener(event, this.resetHandler);
      }.bind(this));
    }

    setCancelButtonEventListener() {
      this.container
        .prompt
        .dialog
        .buttonContainer
        .cancelButton
        .element
        .addEventListener('click', this.resetHandler);
    }

    setLogoutButtonEventListener() {
      this.container
        .prompt
        .dialog
        .buttonContainer
        .logoutButton
        .element
        .addEventListener('click', function() {
          this.storage.set('logoutUrl', this.config.manualLogoutUrl);
          this.logoutHandler();
        }.bind(this));
    }

    createTimer() {
      return new Timer(this.storage, this.tick.bind(this));
    }

    log(message) {
      if (this.config.debug) this.logger.log(message);
    }

    reset() {
      this.log('Reverting document title...');
      document.title = this.originalDocumentTitle;

      this.setDocumentEventListeners();

      this.hideContainer();

      this.log('Stopping timer...');
      this.timer.stop();

      this.log('Assigning new timer...');
      this.timer = this.createTimer();
    }

    logOut() {
      this.log('Updating document title...');
      document.title = this.config.logoutDocumentTitle;

      this.log('Stopping timer...');
      this.timer.stop();

      this.log('Clearing start time...');
      this.timer.clearStartTime();

      this.log('Displaying logout message...');
      this.displayLogoutMessage();

      this.log('Redirecting to logout URL...');
      window.location.replace(this.storage.get('logoutUrl'));
    }

    tick() {
      const TIMER = this.timer;
      const HEARTBEAT_INTERVAL = this.config['heartbeatInterval'];
      const MAXIMUM_IDLE_TIME = this.config.maximumIdleDuration;
      const TIME_REMAINING = TIMER.getTimeRemaining(MAXIMUM_IDLE_TIME);
      const PROMPT_DURATION = this.config.duration;
      const PROMPT_IS_DISPLAYED = this.container.isDisplayed;
      const DIALOG_TEXT_HTML = this.createDialogText(TIME_REMAINING / 1000)
        .element
        .innerHTML;

      this.log('Tick...');

      if (TIME_REMAINING < 0) {
        this.log('Logging out...');
        this.logoutHandler();

        return;
      }

      this.log('Updating prompt...');

      this.container
        .prompt
        .dialog
        .textContainer
        .dialogText
        .element
        .innerHTML = DIALOG_TEXT_HTML;

      if (TIME_REMAINING > PROMPT_DURATION && PROMPT_IS_DISPLAYED) {
        this.log('Updating document title...');
        document.title = this.originalDocumentTitle;

        this.hideContainer();
      }

      if (TIME_REMAINING <= PROMPT_DURATION && !PROMPT_IS_DISPLAYED) {
        this.log('Updating document title...');
        document.title = this.config.documentTitle;

        this.log('Unsetting event listeners...');
        this.unsetDocumentEventListeners();

        this.log('Displaying prompt...');
        this.container.display();

        if (this.config.shiftFocus) {
          this.log('Shifting focus to cancel button...');
          this.container
            .prompt
            .dialog
            .buttonContainer
            .cancelButton
            .element
            .focus();
        }
      }

      if (TIME_REMAINING <= 0) {
        this.log('Logging out...');
        this.logOut();
      } else if (TIMER.atInterval(HEARTBEAT_INTERVAL)) {
        this.log('Heartbeat...');
        this.heartbeat.beat();
      }
    }

  }

  return IdleHands;

}));
