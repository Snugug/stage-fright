export default function(store, opts = {}) {
  document.addEventListener('keydown', e => {
    if (store.state.display === 'presentation' && !e.target.classList.contains('btns--btn')) {
      const whereto = spaceMove(e, opts);
      if (whereto) {
        if (whereto !== 'notes') {
          store.dispatch('navigate', whereto);    
        } else {
          store.dispatch('notes', 'toggle');
        }
      }  
    }
  });
}

function spaceMove(e, opts) {
  const modifiers = {
    ctrl: e.ctrlKey === true, // ⌃
    alt: e.altKey === true, // ⌥
    meta: e.metaKey === true, // ⌘
    shift: e.shiftKey === true, // ⇧
  };

  let previous = false;
  let next = false;

  // Set up Spacebar nav, with or without modifiers
  if (opts.spacebar !== false) {
    let spacebar = e.keyCode === 32;
    let shiftSpacebar = spacebar && modifiers['shift'];

    if (opts.spacebar !== true) {
      spacebar = spacebar && modifiers[opts.spacebar];
      shiftSpacebar = shiftSpacebar && modifiers[opts.spacebar];
    }

    previous = shiftSpacebar;
    next = spacebar;
  }

  // Set up Remote nav, with or without modifiers
  if (opts.remote !== false) {
    let pageUp = e.keyCode === 33;
    let pageDown = e.keyCode === 34;

    if (opts.remote !== true) {
      pageUp = pageUp && modifiers[opts.remote];
      pageDown = pageDown && modifiers[opts.remote];
    }

    previous = previous || pageUp;
    next = next || pageDown;
  }

  // Do previous or next navigation
  if (previous) {
    return 'previous';
  }

  if (next) {
    return 'next';
  }

  // S + CMD + Shift key
  if (e.keyCode === 83 && modifiers['alt'] && modifiers['shift']) {
    return 'notes';
  }

  return false;
}
