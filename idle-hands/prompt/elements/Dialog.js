import Div from "../helpers/Div.js"

class Dialog extends Div {

  header;
  dialog;
  timeRemaining;
  logoutMessage;
  buttonContainer;

  constructor(
    header,
    dialog,
    timeRemaining,
    logoutMessage,
    buttonContainer
  ) {
    const CHILDREN = [
      header.element,
      dialog.element,
      timeRemaining.element,
      logoutMessage.element,
      buttonContainer.element,
    ];

    const STYLES = {
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'transform': 'translate(-50%, -50%)',
      'min-width': '350px',
      'padding': '4px',
      'border': '1px solid black',
      'line-height': '1.5',
      'background-color': 'white',
      'color': '#333',
    };

    super('idle-hands-dialog', CHILDREN, STYLES);

    this.header = header;
    this.dialog = dialog;
    this.timeRemaining = timeRemaining;
    this.logoutMessage = logoutMessage;
    this.buttonContainer = buttonContainer;
  }

}

export default Dialog;