import Iframe from "../helpers/Iframe.js";

class Container extends Iframe {

  prompt;
  isDisplayed;

  constructor(title, prompt) {
    super();

    this.element.title = title;
    this.prompt = prompt;
    this.isDisplayed = false;

  }

  display() {
    this.element.style.display = 'block';
    this.isDisplayed = 'true';
  }

  hide() {
    this.element.style.display = 'none';
    this.isDisplayed = false;
  }

}

export default Container;