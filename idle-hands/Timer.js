import PropertyManager from "./PropertyManager.js";

class Timer extends PropertyManager {

  constructor(storage, tick = () => {}) {
    super();

    if (!storage) throw new TypeError('storage must be defined');

    this.set('storage', storage);
    this.set('startTime', this.getCurrentTime());

    this.get('storage').set('startTime', this.get('startTime'));

    this.set('tickInterval', setInterval(tick, 1000));
  }

  getCurrentTime() {
    return (new Date).getTime();
  }

  getIdleTime() {
    const REAL_IDLE_TIME = this.getCurrentTime() - this.get('startTime');

    return REAL_IDLE_TIME - (REAL_IDLE_TIME % 1000);
  }

  atInterval(interval) {
    return (this.getIdleTime() % interval === 0);
  }

  getTimeRemaining(timeAllowed) {
    return (timeAllowed - this.getIdleTime());
  }

  stop() {
    clearInterval(this.get('tickInterval'));
  }

}

export default Timer;