import Div from "../helpers/Div.js";

class Prompt {

  static create(dialogElement, zIndex) {
    const ELEMENT = Div.create(
      'idle-hands-prompt',
      [dialogElement],
      {
        'display': 'none',
        'position': 'fixed',
        'height': '100%',
        'width': '100%',
        'top': '0',
        'left': '0',
        'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII=")',
        'z-index': zIndex,
      }
    );

    ELEMENT.dialogElement = dialogElement;
    ELEMENT.isDisplayed = false;
    ELEMENT.display = function() {
      ELEMENT.style.display = 'block';
      ELEMENT.isDisplayed = true;
    }
    ELEMENT.hide = function() {
      ELEMENT.style.display = 'none';
      ELEMENT.isDisplayed = false;
    }

    return ELEMENT;
  }

}

export default Prompt;