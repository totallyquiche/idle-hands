import Span from "../helpers/Span.js"

class DialogText extends Span {

  constructor(text, allowHtml) {
    super(
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