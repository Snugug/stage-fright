import PubSub from './pubsub.js';

export default class Store {
  constructor(params = {}) {
    const self = this;

    this.actions = params.actions || {};
    this.mutations = params.mutations || {};
    this.status = 'resting';
    this.events = new PubSub();
    this.stage = params.stage || {}

    this.state = new Proxy((params.state || {}), {
      set: function(state, key, value) {
        state[key] = value;

        if(self.status !== 'mutation') {
                    console.warn(`You should use a mutation to set ${key}`);
                }

        self.events.publish('stateChange', self.state);

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

// export default class Store {
//   constructor(root) {
//     this.actions = {};
//     this.mutations = {};
//     this.state = {};
//     this.status = 'resting';
//     this.events = new PubSub();
//   }

//   update(key, value) {
//     if (!this._state[key]) {
//       this._state[key] = value;  
//     } else {
//       this._state[key] = value;
//     }
    
//     const event = new CustomEvent(`${key} state change`, { detail: value });

//   }
// }
