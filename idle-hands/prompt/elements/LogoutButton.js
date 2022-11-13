import Button from "../helpers/Button.js";

class LogoutButton {

  static create(text) {
    return Button.create('idle-hands-prompt-logout-button', text);
  }

}

export default LogoutButton;