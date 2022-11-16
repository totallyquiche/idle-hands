import Element from "./Element.js";

class Span extends Element {

  constructor(text = '', children = [], styles = {}, allowHtml = false) {
    super();

    this.element = this.create(
      'span',
      '',
      [],
      styles,
      text,
      children,
      allowHtml
    );
  }

}

export default Span;