import Element from "./Element.js";

class Iframe {

  static create(promptElement) {
    const ELEMENT = Element.create(
      'iframe',
      '',
      [],
      {
        'display': 'none',
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'height': '100vh',
        'width': '100vw'
      }
    );

    ELEMENT.promptElement = promptElement;
    ELEMENT.isDisplayed = false;
    ELEMENT.display = function() {
      ELEMENT.style.display = 'block';
      ELEMENT.isDisplayed = true;
    }
    ELEMENT.hide = function() {
      ELEMENT.style.display = 'none';
      ELEMENT.isDisplayed = false;
    }

    return ELEMENT;
  }

}

export default Iframe;