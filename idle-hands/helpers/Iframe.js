import Element from "./Element.js";

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

export default Iframe;