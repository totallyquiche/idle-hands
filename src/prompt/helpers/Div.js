import Element from "./Element.js";

class Div extends Element {

  constructor(children, styles = {}) {
    super();

    this.element = this.create(
      'div',
      [],
      styles,
      '',
      children
    );
  }

}

export default Div;