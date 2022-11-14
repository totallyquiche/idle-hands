import Header from "./elements/Header.js";
import DialogText from "./elements/DialogText.js";
import Time from "./elements/Time.js"
import TimeRemaining from "./elements/TimeRemaining.js";
import LogoutMessage from "./elements/LogoutMessage.js";
import CancelButton from "./elements/CancelButton.js";
import LogoutButton from "./elements/LogoutButton.js";
import Dialog from "./elements/Dialog.js";
import Prompt from "./elements/Prompt.js";

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

    const DIALOG = new Dialog(
      new Header(headerText),
      new DialogText(dialogText, dialogTextAllowHtml),
      new TimeRemaining(timeRemainingTemplate, new Time()),
      new LogoutMessage(logoutText),
      new CancelButton(cancelButtonText),
      new LogoutButton(logoutButtonText)
  );

    return new Prompt(DIALOG, zIndex, fontSize);
  }

}

export default PromptFactory;