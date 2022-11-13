import Element from "./Element.js";

class Button {

  static create(id, text) {
    return Element.create(
      'button',
      id,
      [],
      {},
      text
    );
  }

}

export default Button;