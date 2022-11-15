import Div from "../helpers/Div.js"

class Dialog extends Div {

  header;
  textContainer;
  buttonContainer;

  constructor(
    header,
    textContainer,
    buttonContainer
  ) {
    const CHILDREN = [
      header.element,
      textContainer.element,
      buttonContainer.element,
    ];

    const STYLES = {
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'transform': 'translate(-50%, -50%)',
      'min-width': '400px',
      'padding-bottom': '8px',
      'border': '1px solid black',
      'background-color': 'white',
      'color': '#152b22',
    };

    super('idle-hands-dialog', CHILDREN, STYLES);

    this.header = header;
    this.textContainer = textContainer;
    this.buttonContainer = buttonContainer;
  }

}

export default Dialog;