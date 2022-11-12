class PropertyManager {

  properties = [];

  set(key, value) {
    this.properties[key] = value;
  }

  get(key) {
    if (!this.properties[key]) throw new TypeError(`Property "${key}" does not exist`);

    return this.properties[key];
  }

}

export default PropertyManager;