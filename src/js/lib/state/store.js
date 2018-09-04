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

    this.state = new Proxy((params.state || {}), {
      set: function(state, key, value) {
        state[key] = value;

        if(self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }
        
        self.changes.publish(`${key}`, self.state);
        self.changes.publish('stateChange', self.state);

        return true;
      }
    });
  }

  dispatch(action, payload) {
    if (typeof this.actions[action] !== 'function') {
      console.error(`Action "${action}" doesn't exist`);
      return false;
    }

    this.status = 'action';

    this.actions[action](this, payload);

    return true;
  }

  commit(mutation, payload) {
    if (typeof this.mutations[mutation] !== 'function') {
      console.error(`Mutation "${mutation}" doesn't exist`);
      return false;
    }

    this.status = 'mutation';

    const newState = this.mutations[mutation](Object.assign({}, this.state), payload);

    this.state = Object.assign(this.state, newState);

    return true;
  }
}
