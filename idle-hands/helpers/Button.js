import Element from "./Element.js";

class Button extends Element {

  constructor(id, text) {
    super()

    this.element = this.create(
      'button',
      id,
      [],
      {},
      text
    );
  }

}

export default Button;