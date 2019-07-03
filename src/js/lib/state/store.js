import PubSub from './pubsub.js';

export default class Store {
  constructor(params = {}) {
    const self = this;

    this.actions = params.actions || {};
    this.mutations = params.mutations || {};
    this.status = 'resting';
    this.changes = new PubSub();
    this.stage = params.stage || {};
    this.progress = params.progress || [];
    this.root = params.root || document.body;
    this.help = params.help || false;
    this.overview = params.overview || false;
    this.broadcast = params.broadcast || true;

    this.state = new Proxy(params.state || {}, {
      set(state, key, value) {
        state[key] = value;

        if (self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }

        self.changes.publish(`${key}`, self.state);
        self.changes.publish('stateChange', self.state);

        return true;
      },
    });
  }

  dispatch(action, payload, ...options) {
    if (typeof this.actions[action] !== 'function') {
      console.error(`Action "${action}" doesn't exist`);
      return false;
    }

    this.status = 'action';

    this.actions[action](this, payload, options);

    return true;
  }

  async commit(mutation, payload, ...options) {
    if (typeof this.mutations[mutation] !== 'function') {
      console.error(`Mutation "${mutation}" doesn't exist`);
      return false;
    }

    this.status = 'mutation';

    let newState = this.mutations[mutation](Object.assign({}, this.state), payload, options);

    if ('then' in newState) {
      newState = await newState;
      this.state = Object.assign(this.state, newState);
    } else {
      this.state = Object.assign(this.state, newState);
    }

    return true;
  }
}
