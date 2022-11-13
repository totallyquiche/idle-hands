import Span from "../helpers/Span.js"

class LogoutMessage {

  static create(text) {
    return Span.create(
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