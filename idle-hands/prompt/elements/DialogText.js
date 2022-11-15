import Span from "../helpers/Span.js";

class DialogText extends Span {

  time;

  constructor(dialogText, time) {
    const TEMPLATE_PARTS = dialogText.split('%time');

    if (TEMPLATE_PARTS.length > 2) {
      throw new SyntaxError(
        'dialogText must contain no more than one "%time" placeholder'
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
      children = [new Span(dialogText).element];
    }

    super(
      '',
      children,
    );

    this.time = time;
  }

}

export default DialogText;