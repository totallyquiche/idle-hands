import PropertyManager from "./PropertyManager.js";

class Prompt extends PropertyManager{

  constructor(containerSelector) {
    super();

    this.set('timeElement', this.getTimeElement());
    this.set('promptElement', this.getPromptElement());

    document.querySelector(containerSelector)
      .appendChild(this.get('promptElement'));
  }

  getTimeElement() {
    return document.createElement('span');
  }

  getPromptElement() {
    const TIME_ELEMENT = this.get('timeElement');
    const PROMPT_ELEMENT = document.createElement('div');

    PROMPT_ELEMENT.appendChild(TIME_ELEMENT);
    PROMPT_ELEMENT.style.display = 'none';

    return PROMPT_ELEMENT;
  }

  display(timeRemaining) {
    this.get('timeElement').innerText = timeRemaining;
    this.get('promptElement').style.display = 'block';
  }

}

export default Prompt;