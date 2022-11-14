import Span from "../helpers/Span.js"

class DialogText {

  static create(text, allowHtml) {
    return Span.create(
      text,
      [],
      {
        'display': 'block',
        'margin': '14px',
      },
      allowHtml
    );
  }

}

export default DialogText;