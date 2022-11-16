import Button from "./helpers/Button.js";
import Header from "./elements/Header.js";
import Dialog from "./elements/Dialog.js";
import Prompt from "./elements/Prompt.js";
import ButtonContainer from "./elements/ButtonContainer.js";
import TextContainer from "./elements/TextContainer.js";

class PromptFactory {

  static create(
    headerText,
    dialogText,
    cancelButtonText,
    logoutButtonText,
    zIndex
  ) {

    const CANCEL_BUTTON = new Button(cancelButtonText);
    const LOGOUT_BUTTON = new Button(logoutButtonText);

    const DIALOG = new Dialog(
      new Header(headerText),
      new TextContainer(dialogText),
      new ButtonContainer(CANCEL_BUTTON, LOGOUT_BUTTON)
  );

    return new Prompt(DIALOG, zIndex);
  }

}

export default PromptFactory;