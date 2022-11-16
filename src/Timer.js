class Timer {

  constructor(storage, tick = () => {}) {
    if (!storage) throw new TypeError('storage must be defined');

    this.storage = storage;

    this.setStartTime();

    this.tickInterval = setInterval(tick, 1000);
  }

  getCurrentTime() {
    return (new Date).getTime();
  }

  setStartTime() {
    this.storage.set('startTime', this.getCurrentTime());
  }

  getStartTime() {
    return this.storage.get('startTime');
  }

  clearStartTime() {
    this.storage.delete('startTime');
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
    clearInterval(this.tickInterval);
  }

}

export default Timer;