import Span from "../helpers/Span.js"

class DialogText {

  static create(text) {
    return Span.create(
      text,
      [],
      {
        'display': 'block',
        'margin': '14px',
      }
    );
  }

}

export default DialogText;