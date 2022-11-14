import Element from "./Element.js";

class Span {

  static create(text = '', children = [], styles = {}, allowHtml) {
    return Element.create(
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