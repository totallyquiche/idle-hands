import Button from "../helpers/Button.js";

class CancelButton {

  static create(text) {
    return Button.create('idle-hands-prompt-cancel-button', text);
  }

}

export default CancelButton;