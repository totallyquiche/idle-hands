import Span from "../helpers/Span.js";

class DialogText extends Span {

  time;
  renderedText;

  constructor(dialogText, time, allowHtml) {
    const TEMPLATE_PARTS = dialogText.split('%time');

    if (TEMPLATE_PARTS.length > 2) {
      throw new SyntaxError(
        'dialogText must contain no more than one "%time" placeholder'
      );
    }

    let renderedText;

    if (TEMPLATE_PARTS.length === 2) {
      renderedText = TEMPLATE_PARTS[0] + time + TEMPLATE_PARTS[1];
    } else {
      renderedText = dialogText;
    }

    super(
      renderedText,
      [],
      {},
      allowHtml
    );

    this.time = time;
    this.renderedText = renderedText;
  }

}

export default DialogText;