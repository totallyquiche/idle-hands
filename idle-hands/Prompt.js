import PropertyManager from "./PropertyManager.js";

class Prompt extends PropertyManager{

  constructor(containerSelector) {
    super();

    this.set('isDisplayed', false);
    this.set('timeElement', document.createElement('span'));
    this.set('promptElement', this.getPromptElement());

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

  getPromptElement() {
    const PROMPT_ELEMENT = document.createElement('div');

    PROMPT_ELEMENT.style.display = 'none';
    PROMPT_ELEMENT.style.height = '100vh';
    PROMPT_ELEMENT.style.justifyContent = 'center';
    PROMPT_ELEMENT.style.alignItems = 'center';
    PROMPT_ELEMENT.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    PROMPT_ELEMENT.style.color = 'white';

    PROMPT_ELEMENT.appendChild(this.getDialogElement());

    return PROMPT_ELEMENT;
  }

  getDialogElement() {
    const DIALOG_ELEMENT = document.createElement('div');

    DIALOG_ELEMENT.appendChild(this.getHeaderElement());
    DIALOG_ELEMENT.appendChild(this.getTimeElement());
    DIALOG_ELEMENT.appendChild(this.getCancelButtonElement());
    DIALOG_ELEMENT.appendChild(this.getLogoutButtonElement());

    return DIALOG_ELEMENT;
  }

  getTimeElement() {
    return this.get('timeElement');
  }

  getHeaderElement() {
    const HEADER_ELEMENT = document.createElement('div');

    HEADER_ELEMENT.innerText = 'Session Expiration Warning';
    HEADER_ELEMENT.style.fontSize = '1.5em';

    return HEADER_ELEMENT;
  }

  getCancelButtonElement() {
    const CANCEL_BUTTON_ELEMENT = document.createElement('button');

    CANCEL_BUTTON_ELEMENT.innerText = 'Cancel';

    return CANCEL_BUTTON_ELEMENT;
  }

  getLogoutButtonElement() {
    const LOGOUT_BUTTON_ELEMENT = document.createElement('button');

    LOGOUT_BUTTON_ELEMENT.innerText = 'Log Out';

    return LOGOUT_BUTTON_ELEMENT;
  }

}

export default Prompt;