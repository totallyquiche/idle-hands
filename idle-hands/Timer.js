class Timer {

  storage;

  constructor(storage) {
    if (!storage) throw new TypeError('storage must be defined');

    this.storage = storage;

    this.storage.set('startTime', this.getCurrentTime());
  }

  getCurrentTime() {
    return (new Date).getTime();
  }

}

export default Timer;