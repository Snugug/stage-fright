export default class {
  constructor(opts = {}) {
    this.options = opts;

    this._find = (obj, lookup, defaultValue) => {
      const items = lookup.split('.');
      const top = items[0];

      // Flat object syntax
      if (obj.hasOwnProperty(lookup)) {
        return obj[lookup];
      }

      // Recursive Find
      if (obj.hasOwnProperty(top)) {
        if (typeof obj[top] === 'object') {
          items.shift();
          return this._find(obj[top], items.join('.'), defaultValue);
        }

        return obj[top];
      }

      // Default Value
      return defaultValue;
    }
  }

  get(lookup, defaultValue) {
    return this._find(this.options, lookup, defaultValue);
  }
}