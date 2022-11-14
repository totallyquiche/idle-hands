import Span from "../helpers/Span.js";

class TimeRemaining extends Span {

  time;

  constructor(timeRemainingTemplate, time) {
    const TEMPLATE_PARTS = timeRemainingTemplate.split('%time');

    if (TEMPLATE_PARTS.length > 2) {
      throw new SyntaxError(
        'timeRemainingTemplate must contain a single "%time" placeholder'
      );
    }

    let children;

    if (TEMPLATE_PARTS.length === 2) {
      children = [
        new Span(TEMPLATE_PARTS[0]).element,
        time.element,
        new Span(TEMPLATE_PARTS[1]).element,
      ];
    } else {
      children = [new Span(timeRemainingTemplate).element];
    }

    super(
      '',
      children,
      {
        'display': 'block',
        'margin': '0 14px',
      }
    );

    this.time = time;
  }

}

export default TimeRemaining;