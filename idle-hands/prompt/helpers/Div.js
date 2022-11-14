import Element from "./Element.js";

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

export default Div;