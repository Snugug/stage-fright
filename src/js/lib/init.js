import { StageFrightList } from './structure';

import Store from './state/store';
import mutations from './state/mutations';
import actions from './state/actions';

import translate from './display/translate';
import fragments from './display/fragments';

import buildMinimap from './minimap/build';
import minimapNav from './navigation/minimap';

import navInit from './navigation/init';
import updateHistory from './navigation/history';
import keys from './navigation/keys';

import lazyload from './lazyload';

export default class StageFright {
  constructor(root) {
    const rootNode = document.querySelector(root);
    // Make the Stage Fright Stage
    rootNode.parentNode.classList.add('stage-fright');

    const items = Array.from(rootNode.querySelectorAll('._stage--slide, .fragment'));

    // Stage
    const stage = new StageFrightList();
    items.forEach(item => {
      stage.add(item);
    });

    // Minimap
    const minimap = buildMinimap(stage);
    rootNode.parentNode.appendChild(minimap.map);

    // Starting Index
    const start = navInit(stage.length - 1);

    // Set up state and store
    this.store = new Store({
      actions,
      mutations,
      progress: 'foo',
      state: {
        current: stage._head,
        progress: minimap.list[start],
        index: start,
      },
      stage,
      progress: minimap.list,
    });

    this.store.events.subscribe('stateChange', (state) => {
      translate(rootNode, state.current);
      fragments(state.current);
      updateHistory(state.index);
    });

    keys(this.store);

    for (const item of Object.entries(minimap.list)) {
      console.log(item);
      item[1].addEventListener('click', minimapNav(this.store, item[0]));
    }

    this.goto(start);

    lazyload();
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
