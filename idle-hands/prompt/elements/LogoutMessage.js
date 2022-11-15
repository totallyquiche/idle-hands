import Span from "../helpers/Span.js"

class LogoutMessage extends Span {

  constructor(text) {
    super(
      text,
      [],
      {
        'display': 'none',
        'margin': '0 14px',
      }
    );
  }

}

export default LogoutMessage;