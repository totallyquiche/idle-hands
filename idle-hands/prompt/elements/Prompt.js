import Div from "../helpers/Div.js";

class Prompt {

  static create(zIndex, dialog) {
    return Div.create(
      'idle-hands-prompt',
      [dialog],
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
  }

}

export default Prompt;