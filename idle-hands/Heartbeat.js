class Heartbeat {

  constructor(url) {
    this.url = url;
  }

  beat() {
    fetch(this.url);
  }

}

export default Heartbeat;