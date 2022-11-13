import PropertyManager from "./PropertyManager.js";

class Timer extends PropertyManager {

  constructor(storage, tick = () => {}) {
    super();

    if (!storage) throw new TypeError('storage must be defined');

    this.set('storage', storage);

    this.setStartTime();

    this.set('tickInterval', setInterval(tick, 1000));
  }

  getCurrentTime() {
    return (new Date).getTime();
  }

  setStartTime() {
    this.get('storage').set('startTime', this.getCurrentTime());
  }

  getStartTime() {
    return this.get('storage').get('startTime');
  }

  clearStartTime() {
    this.get('storage').delete('startTime');
  }

  getIdleTime() {
    const REAL_IDLE_TIME = this.getCurrentTime() - this.getStartTime();

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