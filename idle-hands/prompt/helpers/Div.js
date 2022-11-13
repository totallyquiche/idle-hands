import Element from "./Element.js";

class Div {

  static create(id, children, styles = {}) {
    return Element.create(
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