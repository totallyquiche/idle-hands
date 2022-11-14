import Element from "./Element.js";

class Button extends Element {

  constructor(id, text) {
    super()

    this.element = this.create(
      'button',
      id,
      [],
      {
        'width': '40%',
        'padding': '2% 0',
        'margin': '14px 0',
        'margin-left': '6%'
      },
      text
    );
  }

}

export default Button;