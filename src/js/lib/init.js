import { StageFrightList } from './structure';

import Store from './state/store';
import mutations from './state/mutations';
import actions from './state/actions';

import translate from './display/translate';
import fragments from './display/fragments';

import navHash from './navigation/hash';
import updateHistory from './navigation/history';

import { createPresentation } from './presentation';

export default class StageFright {
  constructor(root, options = { spacebar: true, remote: true }) {
    const rootNode = document.querySelector(root);
    // Make the Stage Fright Stage
    rootNode.parentNode.classList.add('stage-fright');

    const items = Array.from(rootNode.querySelectorAll('._stage--slide, .fragment'));

    // Stage
    const stage = new StageFrightList();
    items.forEach(item => {
      stage.add(item);
    });
    stage.updateFragments();

    const embedded = new URLSearchParams(window.location.search).get('embedded') === 'true';

    const upcoming = new URLSearchParams(window.location.search).get('upcoming') === 'true';

    const display = new URLSearchParams(window.location.search).get('display') === 'true';

    if (embedded) {
      rootNode.parentNode.classList.add('embedded');
    }

    if (display) {
      rootNode.parentNode.classList.add('display');
      options._display = true;
    } else {
      options._display = false;
    }

    // Starting Index
    const start = navHash(stage.length - 1);

    // Set up state and store
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
        help: false,
        broadcast: true,
      },
      stage,
      embedded,
      display,
      root: rootNode,
    });

    this.store.changes.subscribe('current', async state => {
      translate(rootNode, state.current);
      fragments(state.current);
    });

    this.store.changes.subscribe('index', async state => {
      updateHistory(state.index);
      if (state.broadcast && state.presentation.channel) {
        state.presentation.channel.postMessage(state.index);
      }

      if (state.presentation.notes) {
        const { updateNotes } = await import('./presentation');
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
        const { advancePresentation } = await import('./presentation');

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

    if (this.store.state.presentation.channel) {
      this.store.state.presentation.channel.onmessage = e => {
        if (upcoming) {
          this.goto(e.data + 1, false);
        } else {
          this.goto(e.data, false);
        }
      };
    }

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

    // Look how awesome this upgrade is now
    if (!embedded) {
      this.upgrade(stage, rootNode, start, options);
    } else {
      this.goto(start);
    }

    // Set up progress
    window.addEventListener('hashchange', () => {
      const pos = navHash(stage.length - 1);
      this.goto(pos);
    });

    import('./lazyload').then(({ default: lazyload }) => lazyload());
  }

  async upgrade(stage, rootNode, start, options) {
    if (!('requestIdleCallback' in window)) {
      await import('requestidlecallback');
    }

    requestIdleCallback(
      async () => {
        try {
          const { upgrade } = await import('./upgrade');
          upgrade.bind(this)(stage, rootNode, start, options);
        } catch (e) {
          console.error(e);
        }
      },
      { timeout: 500 },
    );
  }

  next() {
    this.store.dispatch('navigate', 'next');
  }

  previous() {
    this.store.dispatch('navigate', 'previous');
  }

  goto(slide, broadcast = true) {
    this.store.dispatch('navigate', slide, broadcast);
  }
}
