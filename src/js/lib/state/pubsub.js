export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, cb) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    return this.events[event].push(cb);
  }

  publish(event, data = {}) {
    if (!this.events[event]) {
      return [];
    }

    return this.events[event].map(cb => cb(data));
  }
}
