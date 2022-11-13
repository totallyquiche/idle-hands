import PropertyManager from "./PropertyManager.js";
import Button from "./elements/Button.js";
import Span from "./elements/Span.js";
import Div from "./elements/Div.js";

class Prompt extends PropertyManager{

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
    this.set('headerElement', Span.create(headerText));
    this.set('dialogTextElement', Span.create(dialogText));
    this.set('timeElement', Span.create());
    this.set(
      'timeRemainingElement',
      this.buildTimeRemainingElement(timeRemainingTemplate)
    );
    this.set(
      'logoutMessageElement',
      Span.create(logoutText, [], {display: 'none'})
    );
    this.set(
      'cancelButtonElement',
      Button.create('idle-hands-prompt-cancel-button', cancelButtonText)
    );
    this.set(
      'logoutButtonElement',
      Button.create('idle-hands-prompt-logout-button', logoutButtonText)
    );
    this.set('dialogElement', this.buildDialogElement());
    this.set('promptElement', this.buildPromptElement(zIndex));

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

  buildPromptElement(zIndex) {
    const STYLES = {
      display: 'none',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      zIndex: zIndex,
    };

    return Div.create(
      'idle-hands-prompt',
      [this.get('dialogElement')],
      STYLES
    );
  }

  buildDialogElement() {
    const CHILDREN = [
      this.get('headerElement'),
      this.get('dialogTextElement'),
      this.get('timeRemainingElement'),
      this.get('logoutMessageElement'),
      this.get('cancelButtonElement'),
      this.get('logoutButtonElement'),
    ];

    return Div.create('idle-hands-dialog', CHILDREN);
  }

  buildTimeRemainingElement(timeRemainingTemplate) {
    const TEMPLATE_PARTS = timeRemainingTemplate.split('%time');

    if (TEMPLATE_PARTS.length !== 2) {
      throw new SyntaxError(
        'timeRemainingTemplate must contain a single "%time" placeholder'
      );
    }

    const PREFIX_ELEMENT = Span.create(TEMPLATE_PARTS[0]);
    const SUFFIX_ELEMENT = Span.create(TEMPLATE_PARTS[1]);

    return Span.create(
      '',
      [PREFIX_ELEMENT, this.get('timeElement'), SUFFIX_ELEMENT]
    );
  }

  displayLogoutMessage() {
    this.get('timeRemainingElement').style.display = 'none';
    this.get('cancelButtonElement').disabled = true;
    this.get('logoutButtonElement').disabled = true;
    this.get('logoutMessageElement').style.display = 'inline';
  }

}

export default Prompt;