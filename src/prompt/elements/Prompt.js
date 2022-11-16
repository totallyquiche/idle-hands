import Div from "../helpers/Div.js";

class Prompt extends Div {

  dialog;

  constructor(dialog, zIndex) {
    super(
      [dialog.element],
      {
        'position': 'fixed',
        'height': '100%',
        'width': '100%',
        'top': '0',
        'left': '0',
        'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII=")',
        'z-index': zIndex,
      }
    );

    this.dialog = dialog;
  }

}

export default Prompt;