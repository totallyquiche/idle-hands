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
    zIndex
  ) {

    this.dialogElement = Dialog.create(
      Header.create(headerText),
      DialogText.create(dialogText, dialogTextAllowHtml),
      TimeRemaining.create(timeRemainingTemplate, Time.create()),
      LogoutMessage.create(logoutText),
      CancelButton.create(cancelButtonText),
      LogoutButton.create(logoutButtonText)
  );

    return Prompt.create(this.dialogElement, zIndex);
  }

}

export default PromptFactory;