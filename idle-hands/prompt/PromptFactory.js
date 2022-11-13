import PropertyManager from "../PropertyManager.js";
import Header from "./elements/Header.js";
import Dialog from "./elements/Dialog.js";
import DialogText from "./elements/DialogText.js";
import Time from "./elements/Time.js";
import LogoutMessage from "./elements/LogoutMessage.js";
import CancelButton from "./elements/CancelButton.js";
import LogoutButton from "./elements/LogoutButton.js";
import TimeRemaining from "./elements/TimeRemaining.js";
import Prompt from "./elements/Prompt.js";

class PromptFactory extends PropertyManager {

  constructor(
    containerSelector,
    zIndex,
    timeRemainingTemplate,
    headerText,
    dialogText,
    cancelButtonText,
    logoutButtonText,
    logoutText
  ) {
    super();

    this.set('isDisplayed', false);
    this.set('headerElement', Header.create(headerText));
    this.set('dialogTextElement', DialogText.create(dialogText));
    this.set('timeElement', Time.create());
    this.set(
      'timeRemainingElement',
      TimeRemaining.create(
        timeRemainingTemplate,
        this.get('timeElement')
      )
    );
    this.set('logoutMessageElement', LogoutMessage.create(logoutText));
    this.set('cancelButtonElement', CancelButton.create(cancelButtonText));
    this.set('logoutButtonElement', LogoutButton.create(logoutButtonText));
    this.set(
      'dialogElement',
      Dialog.create(
        this.get('headerElement'),
        this.get('dialogTextElement'),
        this.get('timeRemainingElement'),
        this.get('logoutMessageElement'),
        this.get('cancelButtonElement'),
        this.get('logoutButtonElement')
      )
      );
    this.set('promptElement', Prompt.create(zIndex, this.get('dialogElement')));

    document.querySelector(containerSelector)
      .appendChild(this.get('promptElement'));
  }

  updateTimeRemaining(timeRemaining) {
    this.get('timeElement').innerText = timeRemaining;
  }

  display() {
    this.set('isDisplayed', true);
    this.get('promptElement').style.display = 'flex';
  }

  hide() {
    this.set('isDisplayed', false);
    this.get('promptElement').style.display = 'none';
  }

  displayLogoutMessage() {
    this.get('timeRemainingElement').style.display = 'none';
    this.get('cancelButtonElement').disabled = true;
    this.get('logoutButtonElement').disabled = true;
    this.get('logoutMessageElement').style.display = 'block';
  }

}

export default PromptFactory;