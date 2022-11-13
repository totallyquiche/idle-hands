import Span from "../helpers/Span.js";

class TimeRemaining {

  static create(timeRemainingTemplate, timeElement) {
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
      [PREFIX_ELEMENT, timeElement, SUFFIX_ELEMENT],
      {
        'display': 'block',
        'margin': '0 14px',
      }
    );
  }

}

export default TimeRemaining;