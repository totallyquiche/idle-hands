import PropertyManager from "./PropertyManager.js";

class Heartbeat extends PropertyManager {

  constructor(url) {
    super();

    this.set('url', url);
  }

  beat() {
    fetch(this.get('url'));
  }

}

export default Heartbeat;