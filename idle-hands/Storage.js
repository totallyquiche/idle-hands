class Storage {

  prefix;

  constructor(applicationId) {
    if (!applicationId) throw new TypeError('applicationId must be defined');

    this.prefix = applicationId + '_';
  }

  set(key, value) {
    localStorage.setItem(this.prefix + key, value);
  }

  get(key) {
    return localStorage.getItem(this.prefix + key);
  }

  delete(key) {
    localStorage.removeItem(this.prefix + key);
  }

};

export default Storage;