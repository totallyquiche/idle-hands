import Header from "./elements/Header.js";
import CancelButton from "./elements/CancelButton.js";
import LogoutButton from "./elements/LogoutButton.js";
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
    zIndex,
    fontSize
  ) {

    const CANCEL_BUTTON = new CancelButton(cancelButtonText);
    const LOGOUT_BUTTON = new LogoutButton(logoutButtonText);

    const DIALOG = new Dialog(
      new Header(headerText),
      new TextContainer(dialogText),
      new ButtonContainer(CANCEL_BUTTON, LOGOUT_BUTTON)
  );

    return new Prompt(DIALOG, zIndex, fontSize);
  }

}

export default PromptFactory;