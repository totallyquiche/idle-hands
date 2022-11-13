import Div from "../helpers/Div.js"

class Dialog {

  static create(
    header,
    dialog,
    timeRemaining,
    logoutMessage,
    cancelButton,
    logoutButton
  ) {
    const CHILDREN = [
      header,
      dialog,
      timeRemaining,
      logoutMessage,
      cancelButton,
      logoutButton
    ];

    const STYLES = {
      'min-width': '350px',
      'padding': '4px',
      'border': '1px solid black',
      'line-height': '1.5',
      'background-color': 'white',
      'color': '#333',
    };

    return Div.create('idle-hands-dialog', CHILDREN, STYLES);
  }

}

export default Dialog;