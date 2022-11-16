import Div from "../helpers/Div.js";

class ButtonContainer extends Div {

  cancelButton;
  logoutButton;

  constructor(cancelButton, logoutButton) {
    super(
      [cancelButton.element, logoutButton.element],
      {
        'display': 'flex',
        'justify-content': 'space-evenly',
      }
    );

    this.cancelButton = cancelButton;
    this.logoutButton = logoutButton;
  }

}

export default ButtonContainer;