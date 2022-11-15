import Header from "./elements/Header.js";
import DialogText from "./elements/DialogText.js";
import Time from "./elements/Time.js"
import TimeRemaining from "./elements/TimeRemaining.js";
import LogoutMessage from "./elements/LogoutMessage.js";
import CancelButton from "./elements/CancelButton.js";
import LogoutButton from "./elements/LogoutButton.js";
import Dialog from "./elements/Dialog.js";
import Prompt from "./elements/Prompt.js";
import ButtonContainer from "./elements/ButtonContainer.js";

class PromptFactory {

  static create(
    headerText,
    dialogText,
    dialogTextAllowHtml,
    timeRemainingTemplate,
    logoutText,
    cancelButtonText,
    logoutButtonText,
    zIndex,
    fontSize
  ) {

    const CANCEL_BUTTON = new CancelButton(cancelButtonText);
    const LOGOUT_BUTTON = new LogoutButton(logoutButtonText);

    const DIALOG = new Dialog(
      new Header(headerText),
      new DialogText(dialogText, dialogTextAllowHtml),
      new TimeRemaining(timeRemainingTemplate, new Time()),
      new LogoutMessage(logoutText),
      new ButtonContainer(CANCEL_BUTTON, LOGOUT_BUTTON)
  );

    return new Prompt(DIALOG, zIndex, fontSize);
  }

}

export default PromptFactory;