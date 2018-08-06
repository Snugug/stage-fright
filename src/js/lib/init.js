import { StageFrightList } from './structure';

import Store from './state/store';
import mutations from './state/mutations';
import actions from './state/actions';

import translate from './display/translate';
import fragments from './display/fragments';

import buildMinimap from './minimap/build';

import navInit from './navigation/init';
import updateHistory from './navigation/history';
import keys from './navigation/keys';

export default class StageFright {
  constructor(root) {
    // Make the Stage Fright Stage
    root.parentNode.classList.add('stage-fright');

    const items = Array.from(root.querySelectorAll('._stage--slide, .fragment'));

    // Stage
    const stage = new StageFrightList();
    items.forEach(item => {
      stage.add(item);
    });

    // Minimap
    const minimap = buildMinimap(stage);
    root.parentNode.appendChild(minimap.map);

    // Starting Index
    const start = navInit(stage.length - 1);

    // Set up state and store
    this.store = new Store({
      actions,
      mutations,
      state: {
        current: stage._head,
        progress: minimap.list._head,
        index: start,
      },
      stage,
      minimap: minimap.list,
    });

    this.store.events.subscribe('stateChange', (state) => {
      translate(root, state.current);
      fragments(state.current);
      updateHistory(state.index);
    });

    keys(this.store);

    this.goto(start);
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
