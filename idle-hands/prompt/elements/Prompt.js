import Div from "../helpers/Div.js";

class Prompt {

  static create(zIndex, dialog) {
    return Div.create(
      'idle-hands-prompt',
      [dialog],
      {
        'display': 'none',
        'height': '100vh',
        'justify-content': 'center',
        'align-items': 'center',
        'background-image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNksAcAAEUAQRtOwGEAAAAASUVORK5CYII=")',
        'z-index': zIndex,
      }
    );
  }

}

export default Prompt;