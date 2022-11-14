import Span from "../helpers/Span.js";

class TimeRemaining {

  static create(timeRemainingTemplate, timeElement) {
    const TEMPLATE_PARTS = timeRemainingTemplate.split('%time');

    if (TEMPLATE_PARTS.length > 2) {
      throw new SyntaxError(
        'timeRemainingTemplate must contain a single "%time" placeholder'
      );
    }

    let children;

    if (TEMPLATE_PARTS.length === 2) {
      children = [
        Span.create(TEMPLATE_PARTS[0]),
        timeElement,
        Span.create(TEMPLATE_PARTS[1]),
      ];
    } else {
      children = [Span.create(timeRemainingTemplate)];
    }

    return Span.create(
      '',
      children,
      {
        'display': 'block',
        'margin': '0 14px',
      }
    );
  }

}

export default TimeRemaining;