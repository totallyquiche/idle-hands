import Div from "../helpers/Div.js"

class Dialog extends Div {

  header;
  textContainer;
  logoutMessage;
  buttonContainer;

  constructor(
    header,
    textContainer,
    logoutMessage,
    buttonContainer
  ) {
    const CHILDREN = [
      header.element,
      textContainer.element,
      logoutMessage.element,
      buttonContainer.element,
    ];

    const STYLES = {
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'transform': 'translate(-50%, -50%)',
      'min-width': '350px',
      'padding-bottom': '8px',
      'border': '1px solid black',
      'border-radius': '4px',
      'background-color': 'white',
      'color': '#152b22',
    };

    super('idle-hands-dialog', CHILDREN, STYLES);

    this.header = header;
    this.textContainer = textContainer;
    this.logoutMessage = logoutMessage;
    this.buttonContainer = buttonContainer;
  }

}

export default Dialog;