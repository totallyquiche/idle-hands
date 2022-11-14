import Element from "./Element.js";

class Iframe extends Element {

  prompt;
  isDisplayed;

  constructor(prompt) {
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

export default Iframe;