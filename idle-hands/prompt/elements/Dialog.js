import Div from "../helpers/Div.js"

class Dialog {

  static create(
    headerElement,
    dialogElement,
    timeRemainingElement,
    logoutMessageElement,
    cancelButtonElement,
    logoutButtonElement
  ) {
    const CHILDREN = [
      headerElement,
      dialogElement,
      timeRemainingElement,
      logoutMessageElement,
      cancelButtonElement,
      logoutButtonElement,
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

    const ELEMENT = Div.create('idle-hands-dialog', CHILDREN, STYLES);

    ELEMENT.headerElement = headerElement;
    ELEMENT.dialogElement = dialogElement;
    ELEMENT.timeRemainingElement = timeRemainingElement;
    ELEMENT.logoutMessageElement = logoutMessageElement;
    ELEMENT.cancelButtonElement = cancelButtonElement;
    ELEMENT.logoutButtonElement = logoutButtonElement;

    return ELEMENT;
  }

}

export default Dialog;