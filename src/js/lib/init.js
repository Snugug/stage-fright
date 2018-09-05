import { StageFrightList } from './structure';

import Store from './state/store';
import mutations from './state/mutations';
import actions from './state/actions';

import translate from './display/translate';
import fragments from './display/fragments';

import buildMinimap from './minimap/build';
import minimapNav from './navigation/minimap';

import { updateNotes } from './presentation';

import navHash from './navigation/hash';
import updateHistory from './navigation/history';
import keys from './navigation/keys';

import lazyload from './lazyload';
import autoplay from './autoplay';

import { createPresentation, receivePresentationControls, advancePresentation } from './presentation';

import buttons from './buttons';

export default class StageFright {
  constructor(root, options = {spacebar: true, remote: true}) {
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

    if (embedded) {
      rootNode.parentNode.classList.add('embedded');
    }

    // Presentation Awesomeness
    let presentation = false;

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
      },
      stage,
      embedded,
      root: rootNode,
    });

    this.store.changes.subscribe('current', (state) => {
      translate(rootNode, state.current);
      fragments(state.current);
      if (state.presentation.notes) {
        updateNotes(state.presentation.notes, state.index, state.current);  
      }
    });

    this.store.changes.subscribe('index', (state) => {
      updateHistory(state.index);

      if (!embedded) {
        advancePresentation(state.presentation.connection, state.index);  
      }
      
      if (state.presentation.notes) {
        updateNotes(state.presentation.notes, state.index, state.current);  
      }
    });

    this.store.changes.subscribe('display', (state) => {
      if (state.display === 'presentation') {
        rootNode.parentNode.classList.add('stage-fright');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      } else {
        rootNode.parentNode.classList.remove('stage-fright');
      }
    });
    
    // Set up progress
    if (!embedded) {
      stage.buildProgress(this.store);
      rootNode.parentNode.appendChild(buildMinimap(stage));
    }

    // Go to first slide
    this.goto(start);

    // Set up keyboard navigation
    keys(this.store, options);

    lazyload();

    if (!embedded) {
      autoplay();  
    }
    
    receivePresentationControls(this.store);

    window.addEventListener('hashchange', () => {
      const pos = navHash(stage.length - 1);
      this.goto(pos);
    });

    stage._head.elem.querySelector('._stage--content').insertAdjacentElement('beforebegin', buttons(this.store));
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
