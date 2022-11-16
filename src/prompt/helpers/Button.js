import Element from "./Element.js";

class Button extends Element {

  constructor(text) {
    super()

    this.element = this.create(
      'button',
      [],
      {},
      text
    );
  }

}

export default Button;