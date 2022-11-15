import Div from "../helpers/Div.js";

class ButtonContainer extends Div {

  cancelButton;
  logoutButton;

  constructor(cancelButton, logoutButton) {
    super(
      '',
      [cancelButton.element, logoutButton.element],
      {
        'display': 'flex',
        'justify-content': 'space-evenly',
        'margin': '1em 0',
      }
    );

    this.cancelButton = cancelButton;
    this.logoutButton = logoutButton;
  }

}

export default ButtonContainer;