import Span from "../helpers/Span.js"

class Time extends Span {

  constructor() {
    super();
  }

  update(time) {
    this.element.innerText = time;
  }

}

export default Time;