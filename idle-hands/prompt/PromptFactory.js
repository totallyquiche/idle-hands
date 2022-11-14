import Header from "./elements/Header.js";
import Dialog from "./elements/Dialog.js";
import DialogText from "./elements/DialogText.js";
import Time from "./elements/Time.js";
import LogoutMessage from "./elements/LogoutMessage.js";
import CancelButton from "./elements/CancelButton.js";
import LogoutButton from "./elements/LogoutButton.js";
import TimeRemaining from "./elements/TimeRemaining.js";
import Prompt from "./elements/Prompt.js";

class PromptFactory {

  constructor(
    containerSelector,
    zIndex,
    timeRemainingTemplate,
    headerText,
    dialogText,
    promptDialogTextAllowHtml,
    cancelButtonText,
    logoutButtonText,
    logoutText
  ) {
    this.isDisplayed = false;
    this.headerElement = Header.create(headerText);
    this.dialogTextElement = DialogText.create(
      dialogText,
      promptDialogTextAllowHtml
    );
    this.timeElement = Time.create();
    this.timeRemainingElement = TimeRemaining.create(
      timeRemainingTemplate,
      this.timeElement
    );
    this.logoutMessageElement = LogoutMessage.create(logoutText);
    this.cancelButtonElement = CancelButton.create(cancelButtonText);
    this.logoutButtonElement = LogoutButton.create(logoutButtonText);
    this.dialogElement = Dialog.create(
        this.headerElement,
        this.dialogTextElement,
        this.timeRemainingElement,
        this.logoutMessageElement,
        this.cancelButtonElement,
        this.logoutButtonElement,
    );
    this.promptElement = Prompt.create(zIndex, this.dialogElement);

    document.querySelector(containerSelector)
      .appendChild(this.promptElement);
  }

  updateTimeRemaining(timeRemaining) {
    this.timeElement.innerText = timeRemaining;
  }

  display() {
    this.isDisplayed = true;
    this.promptElement.style.display = 'flex';
  }

  hide() {
    this.isDisplayed = false;
    this.promptElement.style.display = 'none';
  }

  displayLogoutMessage() {
    this.timeRemainingElement.style.display = 'none';
    this.cancelButtonElement.disabled = true;
    this.logoutButtonElement.disabled = true;
    this.logoutMessageElement.style.display = 'block';
  }

}

export default PromptFactory;