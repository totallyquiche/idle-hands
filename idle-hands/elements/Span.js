import Element from "./Element.js";

class Span {

  static create(text = '', children = [], styles = {}) {
    return Element.create(
      'span',
      '',
      [],
      styles,
      text,
      children
    );
  }

}

export default Span;