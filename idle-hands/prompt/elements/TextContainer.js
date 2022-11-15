import Div from "../helpers/Div.js";

class TextContainer extends Div {

  dialogText;

  constructor(dialogText) {
    super(
      '',
      [dialogText.element],
      {
        'margin': '1em 0.5em',
        'line-height': '1.5',
      }
    );

    this.dialogText = dialogText;
  }

}

export default TextContainer;