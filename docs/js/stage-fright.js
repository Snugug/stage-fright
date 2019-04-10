import { createPresentation } from './presentation.js';

class StageFrightNode {
  constructor(item) {
    this.elem = item;
    this.previous = null;
    this.next = null;
    this.first = false;
    this.notes = null;

    if (item.classList.contains('_stage--slide')) {
      this.type = 'slide';

      if (item.parentNode.firstElementChild === item) {
        this.first = true;
      }
    } else if (item.classList.contains('fragment')) {
      this.type = 'fragment';
    }

    const notes = item.querySelector('._stage--notes');

    if (notes) {
      this.notes = notes.innerHTML;
    }
  }

}

class StageFrightList {
  constructor() {
    this._head = null;
    this._tail = null;
    this._length = 0;
    this._depth = 0;
    this._sectionHolder = -1;
    this._depthHolder = 0;
    this._fragmentHolder = 0;
    this._fragmentDepth = [];
  }

  add(item) {
    const node = new StageFrightNode(item);
    let current = this._head;

    if (node.first) {
      this._sectionHolder++;

      if (this._depthHolder > this._depth) {
        this._depth = this._depthHolder;
      }

      this._depthHolder = 0;
    } else if (node.type !== 'fragment') {
      this._depthHolder++;
    }

    if (node.type !== 'fragment') {
      if (this._fragmentHolder !== 0) {
        this._fragmentDepth.push(this._fragmentHolder);

        this._fragmentHolder = 0;
      }
    } else {
      this._fragmentHolder++;
      node.fragment = this._fragmentHolder;
    }

    node.section = this._sectionHolder;
    node.depth = this._depthHolder;
    node.previous = this._tail;
    this._length++;

    if (node.type === 'slide') {
      node.number = this._length - 1;
    } // If there isn't a head, make head, tail, and current our node! then increase the length;


    if (!current) {
      this._head = node;
      this._tail = node;
      return node;
    } // If there is a current, update the tail


    this._tail.next = node;
    this._tail = node;

    if (node.type === 'fragment' && node.previous.type !== 'fragment') {
      node.previous.fragment = 0;
    }

    if (node.type === 'fragment' && node.previous.notes) {
      node.notes = node.previous.notes;
    }

    return node;
  }

  find(index) {
    index = parseInt(index);

    if (index > this._length - 1 || index < 0) {
      return false;
    } // First


    if (index === 0) {
      return this._head;
    } // Last


    if (index === this._length - 1) {
      return this._tail;
    } // Start from the end or the beginning?


    const headToTail = index <= Math.floor(this._length / 2);
    let current = this._head;
    let i = 1;

    if (headToTail) {
      do {
        current = current.next;
        i++;
      } while (i <= index);
    } else {
      current = this._tail;
      i = this._length - 2;

      do {
        current = current.previous;
        i--;
      } while (i >= index);
    }

    return current;
  }

  forEach(cb) {
    let current = this._head;
    let i = 0;

    while (current.next) {
      cb(current, i);
      current = current.next;
      i++;
    }

    cb(current);
  }

  updateFragments() {
    const fragTotals = this._fragmentDepth.reverse();

    let currentFrag = fragTotals.pop();
    this.forEach(item => {
      if (item.hasOwnProperty('fragment')) {
        item.totalFragments = currentFrag;

        if (item.next.type !== 'fragment') {
          currentFrag = fragTotals.pop();
        }
      }
    });
  }

  buildProgress(store, createMinimapLink) {
    this.forEach((item, i) => {
      if (item.type === 'slide') {
        if (typeof i === 'undefined') {
          i = this._length - 1;
        }

        item.progress = createMinimapLink(i, item.section, item.depth, item.hasOwnProperty('fragment'));
      } else {
        item.progress = item.previous.progress;
      }
    });
  }

}

class PubSub {
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

class Store {
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
    this.state = new Proxy(params.state || {}, {
      set: function (state, key, value) {
        state[key] = value;

        if (self.status !== 'mutation') {
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

  async commit(mutation, payload) {
    if (typeof this.mutations[mutation] !== 'function') {
      console.error(`Mutation "${mutation}" doesn't exist`);
      return false;
    }

    this.status = 'mutation';
    let newState = this.mutations[mutation](Object.assign({}, this.state), payload);

    if ('then' in newState) {
      newState = await newState;
      this.state = Object.assign(this.state, newState);
    } else {
      this.state = Object.assign(this.state, newState);
    }

    return true;
  }

}

var mutations = {
  navigate(state, payload) {
    if (payload === 'next' && state.current.next) {
      state.current = state.current.next;
      state.index = state.index + 1;
    } else if (payload === 'previous' && state.current.previous) {
      state.current = state.current.previous;
      state.index = state.index - 1;
    } else if (payload !== 'next' && payload !== 'previous') {
      state.current = payload;
    }

    state.overview = false;
    return state;
  },

  index(state, payload) {
    state.index = payload;
    return state;
  },

  progress(state, payload) {
    const previous = state.progress;
    state.progress = state.current.progress;

    if (state.progress) {
      if (previous && previous !== state.progress && previous.dataset.hasOwnProperty('active')) {
        delete previous.dataset.active;
      }

      state.progress.dataset.active = true;

      if (state.current.hasOwnProperty('fragment')) {
        if (state.current.fragment === state.current.totalFragments) {
          state.progress.dataset.fragments = false;
        } else {
          state.progress.dataset.fragments = true;
        }
      }
    }

    return state;
  },

  async notes(state, {
    root,
    length
  }) {
    if (state.presentation.request) {
      if (!state.presentation.connection) {
        try {
          const connection = await state.presentation.request.start();
          state.presentation.connection = connection; // Need a way to reverse this

          const {
            notesBody,
            updateNotes,
            advancePresentation
          } = await import("./presentation.js");
          const builtNotes = notesBody();
          root.parentNode.insertBefore(builtNotes._notes, root);
          root.dataset.hidden = true;
          root.parentNode.dataset.notes = true;
          updateNotes(builtNotes, state.index, state.current);
          builtNotes.total.textContent = length - 1;
          state.presentation.notes = builtNotes;
        } catch (e) {
          console.log(e);
          console.error('There was an error establishing a connection');
        }
      } else {
        root.parentNode.removeChild(state.presentation.notes._notes);
        delete root.dataset.hidden;
        delete root.parentNode.dataset.notes;
        state.presentation.connection.terminate();
        state.presentation.connection = null;
        state.presentation.notes = null;
      }
    }

    return state;
  },

  display(state, payload) {
    if (state.display === 'presentation') {
      state.display = 'article';
    } else {
      state.display = 'presentation';
    }

    return state;
  },

  toggle(state, payload) {
    state[payload] = !state[payload];
    return state;
  }

};

var actions = {
  navigate(context, payload) {
    if (payload === 'next' || payload === 'previous') {
      context.commit('navigate', payload);
    } else {
      const found = context.stage.find(payload);
      context.commit('navigate', found);
      context.commit('index', payload);
    }

    if (!context.embedded) {
      context.commit('progress', 'toggle');
    }
  },

  notes(context, payload) {
    context.commit('notes', {
      root: context.root,
      length: context.stage._length
    });
  },

  display(context, payload) {
    context.commit('display', payload);
  },

  toggle(context, payload) {
    context.commit('toggle', payload);
  }

};

function translate (root, current) {
  const transform = `translate(${-100 * current.section}vw) translateY(${-100 * current.depth}vh)`;
  root.style.transform = transform;
}

function fragments (current) {
  let active = false; // Make the current fragment active (only will happen on _next_)

  if (current.type === 'fragment') {
    const dataset = current.elem.dataset;

    if (!dataset.hasOwnProperty('active') || dataset.active === 'false') {
      dataset.active = true;
      let previous = current.previous;

      while (previous && previous.type === 'fragment') {
        previous.elem.dataset.active = true;
        previous = previous.previous;
      }

      active = true;
    }
  } // Make the next fragment inactive if we didn't make the current one active


  if (active === false && current.next && current.next.type === 'fragment') {
    delete current.next.elem.dataset.active;
  }
}

function navHash (max) {
  const starter = new URL(window.location);
  let pos = 0;

  if (starter.hash) {
    pos = parseInt(starter.hash.split('/')[1]);
  }

  if (pos < 0) {
    pos = 0;
  } else if (pos > max) {
    pos = max;
  }

  return pos;
}

function updateHistory(index) {
  history.pushState(null, null, `#/${index}`);
}

class StageFright {
  constructor(root, options = {
    spacebar: true,
    remote: true
  }) {
    const rootNode = document.querySelector(root); // Make the Stage Fright Stage

    rootNode.parentNode.classList.add('stage-fright');
    const items = Array.from(rootNode.querySelectorAll('._stage--slide, .fragment')); // Stage

    const stage = new StageFrightList();
    items.forEach(item => {
      stage.add(item);
    });
    stage.updateFragments();
    const embedded = new URLSearchParams(window.location.search).get('embedded') === 'true';

    if (embedded) {
      rootNode.parentNode.classList.add('embedded');
    } // Presentation Awesomeness

    const start = navHash(stage.length - 1); // Set up state and store

    this.store = new Store({
      actions,
      mutations,
      progress: 'foo',
      state: {
        current: stage._head,
        progress: null,
        index: start,
        notes: false,
        presentation: createPresentation(),
        display: 'presentation',
        help: false
      },
      stage,
      embedded,
      root: rootNode
    });
    this.store.changes.subscribe('current', async state => {
      translate(rootNode, state.current);
      fragments(state.current);

      if (state.presentation.notes) {
        const {
          updateNotes
        } = await import("./presentation.js");
        updateNotes(state.presentation.notes, state.index, state.current);
      }
    });
    this.store.changes.subscribe('index', async state => {
      updateHistory(state.index);

      if (!embedded) {
        const {
          advancePresentation
        } = await import("./presentation.js");
        advancePresentation(state.presentation.connection, state.index);
      }

      if (state.presentation.notes) {
        const {
          updateNotes
        } = await import("./presentation.js");
        updateNotes(state.presentation.notes, state.index, state.current);
      }
    });
    this.store.changes.subscribe('display', state => {
      if (state.display === 'presentation') {
        rootNode.parentNode.classList.add('stage-fright');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      } else {
        rootNode.parentNode.classList.remove('stage-fright');
      }
    });
    this.store.changes.subscribe('presentation', async state => {
      if (state.presentation.connection) {
        const {
          advancePresentation
        } = await import("./presentation.js");
        state.presentation.connection.addEventListener('message', e => {
          const message = JSON.parse(e.data);

          if (message.start) {
            advancePresentation(state.presentation.connection, state.index);
          }

          if (message.goto !== state.index) {
            this.goto(message.goto);
          }
        });
      }
    });
    this.store.changes.subscribe('overview', state => {
      const scale = stage._sectionHolder > stage._depth ? stage._sectionHolder : stage._depth;
      let transform = `scale(${1 / (scale + 1)})`;
      const diff = Math.abs(stage._depth - stage._sectionHolder);

      if (scale === stage._depth) {
        transform += `translateX(-${50 * (scale - diff)}vw) translateY(-${50 * scale}vh)`;
      } else {
        transform += `translateX(-${50 * scale}vw) translateY(-${50 * (scale - diff)}vh)`;
      }

      if (state.overview) {
        // TODO: Make keyboard accessible
        rootNode.style.transform = transform;
        stage.forEach(item => {
          if (item.type === 'slide') {
            item.elem.style.cursor = 'pointer';
            item.elem.addEventListener('click', e => {
              e.preventDefault();
              e.stopPropagation();
              this.goto(item.number);
            });
          }
        });
      } else {
        stage.forEach(item => {
          item.elem.style.cursor = 'initial';
        });
      }
    });
    requestIdleCallback(() => {
      if (!embedded) {
        import("./upgrade.js").then(({
          upgrade
        }) => {
          upgrade.bind(this)(stage, rootNode, start, options);
        });
      } else {
        this.goto(start);
      }
    }, {
      timeout: 500
    }); // Set up progress

    window.addEventListener('hashchange', () => {
      const pos = navHash(stage.length - 1);
      this.goto(pos);
    });
    import("./lazyload.js").then(({
      default: lazyload
    }) => lazyload());
  }

  next() {
    this.store.dispatch('navigate', 'next');
  }

  previous() {
    this.store.dispatch('navigate', 'previous');
  }

  goto(slide) {
    this.store.dispatch('navigate', slide);
  }

}

window.addEventListener('DOMContentLoaded', () => {
  const stage = new StageFright('._stage');
  window.stage = stage;
});
//# sourceMappingURL=stage-fright.js.map
