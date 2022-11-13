import PropertyManager from "./PropertyManager.js";

class Prompt extends PropertyManager{

  constructor(
    containerSelector,
    zIndex,
    timeRemainingTemplate,
    headerText
  ) {
    super();

    this.set('isDisplayed', false);
    this.set('headerElement', this.buildHeaderElement(headerText));
    this.set('timeElement', this.buildTimeElement());
    this.set(
      'timeRemainingElement',
      this.buildTimeRemainingElement(timeRemainingTemplate)
    );
    this.set('logoutMessageElement', this.buildLogoutMessageElement());
    this.set('cancelButtonElement', this.buildCancelButtonElement());
    this.set('logoutButtonElement', this.buildLogoutButtonElement());
    this.set('promptElement', this.buildPromptElement(zIndex));

    document.querySelector(containerSelector)
      .appendChild(this.get('promptElement'));
  }

  updateTimeRemaining(timeRemaining) {
    this.get('timeElement').innerText = timeRemaining;
  }

  display() {
    this.set('isDisplayed', true);
    this.get('promptElement').style.display = 'flex';
  }

  hide() {
    this.set('isDisplayed', false);
    this.get('promptElement').style.display = 'none';
  }

  buildPromptElement(zIndex) {
    const PROMPT_ELEMENT = document.createElement('div');

    PROMPT_ELEMENT.style.display = 'none';
    PROMPT_ELEMENT.style.height = '100vh';
    PROMPT_ELEMENT.style.justifyContent = 'center';
    PROMPT_ELEMENT.style.alignItems = 'center';
    PROMPT_ELEMENT.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    PROMPT_ELEMENT.style.color = 'white';
    PROMPT_ELEMENT.style.zIndex = zIndex;

    PROMPT_ELEMENT.appendChild(this.buildDialogElement());

    PROMPT_ELEMENT.classList.add('idle-hands-prompt');

    return PROMPT_ELEMENT;
  }

  buildDialogElement() {
    const DIALOG_ELEMENT = document.createElement('div');

    DIALOG_ELEMENT.appendChild(this.getHeaderElement());
    DIALOG_ELEMENT.appendChild(this.getTimeRemainingElement());
    DIALOG_ELEMENT.appendChild(this.getLogoutMessageElement());
    DIALOG_ELEMENT.appendChild(this.getCancelButtonElement());
    DIALOG_ELEMENT.appendChild(this.getLogoutButtonElement());

    return DIALOG_ELEMENT;
  }

  buildTimeElement() {
    return document.createElement('span');
  }

  getTimeElement() {
    return this.get('timeElement');
  }

  buildHeaderElement(headerText) {
    const HEADER_ELEMENT = document.createElement('div');

    HEADER_ELEMENT.innerText = headerText;
    HEADER_ELEMENT.style.fontSize = '1.5em';

    return HEADER_ELEMENT;
  }

  getHeaderElement() {
    return this.get('headerElement');
  }

  buildTimeRemainingElement(timeRemainingTemplate) {
    const TIME_REMAINING_ELEMENT = document.createElement('span');
    const TEMPLATE_PARTS = timeRemainingTemplate.split('%time');

    if (TEMPLATE_PARTS.length !== 2) {
      throw new SyntaxError(
        'timeRemainingTemplate must contain a single "%time" placeholder'
      );
    }

    const PREFIX_ELEMENT = document.createElement('span');
    const SUFFIX_ELEMENT = document.createElement('span');

    PREFIX_ELEMENT.innerText = TEMPLATE_PARTS[0];
    SUFFIX_ELEMENT.innerText = TEMPLATE_PARTS[1];

    TIME_REMAINING_ELEMENT.appendChild(PREFIX_ELEMENT);
    TIME_REMAINING_ELEMENT.appendChild(this.getTimeElement());
    TIME_REMAINING_ELEMENT.appendChild(SUFFIX_ELEMENT);

    return TIME_REMAINING_ELEMENT;
  }

  getTimeRemainingElement() {
    return this.get('timeRemainingElement');
  }

  buildCancelButtonElement() {
    const CANCEL_BUTTON_ELEMENT = document.createElement('button');

    CANCEL_BUTTON_ELEMENT.innerText = 'Cancel';
    CANCEL_BUTTON_ELEMENT.id = 'idle-hands-prompt-cancel-button';

    return CANCEL_BUTTON_ELEMENT;
  }

  getCancelButtonElement() {
    return this.get('cancelButtonElement');
  }

  buildLogoutButtonElement() {
    const LOGOUT_BUTTON_ELEMENT = document.createElement('button');

    LOGOUT_BUTTON_ELEMENT.innerText = 'Log Out';
    LOGOUT_BUTTON_ELEMENT.id = 'idle-hands-prompt-logout-button';

    return LOGOUT_BUTTON_ELEMENT;
  }

  getLogoutButtonElement() {
    return this.get('logoutButtonElement');
  }

  buildLogoutMessageElement() {
    const LOGOUT_MESSAGE_ELEMENT = document.createElement('span');

    LOGOUT_MESSAGE_ELEMENT.innerText = 'Logging out...';
    LOGOUT_MESSAGE_ELEMENT.style.display = 'none';
    LOGOUT_MESSAGE_ELEMENT.id = 'idle-hands-prompt-logout-message';

    return LOGOUT_MESSAGE_ELEMENT;
  }

  getLogoutMessageElement() {
    return this.get('logoutMessageElement');
  }

  displayLogoutMessage() {
    this.getTimeRemainingElement().style.display = 'none';
    this.getCancelButtonElement().disabled = true;
    this.getLogoutButtonElement().disabled = true;
    this.getLogoutMessageElement().style.display = 'inline';
  }

}

export default Prompt;