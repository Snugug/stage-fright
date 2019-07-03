import { loadImage, loadMedia } from './lazyload.js';

var icons = {
  download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M26 15l-1.41-1.41L17 21.17V2h-2v19.17l-7.59-7.58L6 15l10 10 10-10z"/><path d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4z"/></svg>',
  presentation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M15 10h2v8h-2zm5 4h2v4h-2zm-10-2h2v6h-2z"/><path d="M25 4h-8V2h-2v2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v6h-4v2h10v-2h-4v-6h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H7V6h18z"/></svg>',
  article: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M4 24h10v2H4zm0-6h10v2H4zm22-4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2zM6 6v6h20V6zm20 22h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2zm-6-8v6h6v-6z"/></svg>',
  help: '<svg role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"/><circle cx="16" cy="23.5" r="1.5"/><path d="M17 8h-1.5a4.49 4.49 0 0 0-4.5 4.5v.5h2v-.5a2.5 2.5 0 0 1 2.5-2.5H17a2.5 2.5 0 0 1 0 5h-2v4.5h2V17a4.5 4.5 0 0 0 0-9z"/></svg>',
  speaker: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="transform: rotate(180deg)"><path d="M28 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H10V6h18z"/><path d="M16 26H4V16h2v-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2h-2z"/></svg>'
};

function help(store) {
  let previousFocus = null;
  const dialog = buildHelp(store);
  const close = dialog.querySelector('.sf-dialog--close');
  const overlay = document.createElement('div');
  overlay.classList.add('sf-overlay'); // Make Overlay click close

  overlay.addEventListener('click', e => {
    store.dispatch('toggle', 'help');
  });
  store.changes.subscribe('help', state => {
    if (state.help) {
      dialog.style.display = 'block';
      overlay.style.display = 'block';
      previousFocus = document.activeElement;
      close.focus();
    } else {
      dialog.style.display = 'none';
      overlay.style.display = 'none';

      if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
      }
    }
  });
  document.body.appendChild(dialog);
  document.body.appendChild(overlay);
}

function buildHelp(store) {
  const dialog = document.createElement('div');
  dialog.classList.add('sf-dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'sf-dialog--title');
  dialog.setAttribute('aria-describedby', 'sf-dialog--description');
  let innerHTML = `<h2 id="sf-dialog--title">Using This Presentation</h2>
  <p id="sf-dialog--description" class="sf-dialog--sr-only">Controls and actions you can take in this presentation</p><div class="sf-dialog--body">`; // Keyboard Shortcuts

  const keyboard = [{
    desc: 'Navigate presentation forward',
    opts: ['<kbd>space</kbd>', '<kbd>page up</kbd> (presenter remote forward)']
  }, {
    desc: 'Navigate presentation backward',
    opts: ['<kbd>shift</kbd>+<kbd>space</kbd>', '<kbd>page down</kbd> (presenter remote back)']
  }, {
    desc: 'Presentation overview',
    opts: ['<kbd>esc</kbd>']
  }];

  if (store.state.presentation.request) {
    keyboard.push({
      desc: 'Toggle speaker notes/presentation view (requires external monitor)',
      opts: ['<kbd>alt</kbd>+<kbd>shift</kbd>+<kbd>s</kbd>']
    });
  }

  innerHTML += `<div class="sf-dialog--keyboard"><h3>Keyboard Navigation</h3><p>Keyboard shortcuts to use the presentation.</p><dl>${keyboard.map(i => `<dt>${i.desc}</dt>${i.opts.map(opt => `<dd>${opt}</dd>`).join('')}`).join('')}</dl></div>`; // Icons

  const iconography = [{
    icon: icons.download,
    desc: 'Download all images and videos that would otherwise be lazyloaded.'
  }, {
    icon: icons.article,
    desc: 'Toggle from presentation view to article view. Article view includes visible speaker notes'
  }, {
    icon: icons.presentation,
    desc: 'Toggle from article view to presentation view.'
  }, {
    icon: icons.help,
    desc: 'Launch the help overlay.'
  }];

  if (store.state.presentation.request) {
    iconography.push({
      desc: 'Toggle speaker notes/presentation view (requires external monitor)',
      icon: icons.speaker
    });
  }

  innerHTML += `<div class="sf-dialog--iconography"><h3>Iconography</h3><p>Icons used throughout the presentation.</p><dl>${iconography.map(i => `<dt>${i.icon}</dt><dd>${i.desc}</dd>`).join('')}</dl></div>`;
  innerHTML += '</div>';
  dialog.innerHTML = innerHTML;
  const close = document.createElement('button');
  close.classList.add('sf-dialog--close');
  close.setAttribute('aria-label', 'Close Help');
  close.innerText = 'x';
  dialog.appendChild(close);
  close.addEventListener('click', e => {
    store.dispatch('toggle', 'help');
  });
  dialog.addEventListener('keydown', e => {
    // No key presses allowed in here!
    e.preventDefault();
    e.stopPropagation(); // Escape key, Enter key, Space

    if (e.keyCode === 27 || e.keyCode === 13 || e.keyCode === 32) {
      store.dispatch('toggle', 'help');
    }
  });
  return dialog;
}

function buttons (store) {
  const holder = document.createElement('div');
  holder.classList.add('btns');
  holder.appendChild(downloadImages());

  if (store.state.presentation.channel) {
    holder.appendChild(toggleSpeaker(store));
  }

  holder.appendChild(toggleDisplay(store));
  holder.appendChild(getHelp(store));
  holder.appendChild(hiddenPresButton());
  help(store);
  return holder;
}

function buildButton(title, image) {
  const btn = document.createElement('button');
  btn.classList.add(`btns--btn`);
  btn.setAttribute('aria-label', title);
  btn.innerHTML = image;
  return btn;
}

function hiddenPresButton() {
  const btn = document.createElement('button');
  btn.classList.add('btns--hidden');
  btn.setAttribute('aria-label', 'Presentation Navigation Keyboard Focus');
  btn.innerHTML = '';
  return btn;
}

function downloadImages() {
  const icon = icons.download;
  const btn = buildButton('Download All Assets', icon);
  btn.addEventListener('click', () => {
    // Swap in
    const images = document.querySelectorAll('picture, img');
    const media = document.querySelectorAll('video, audio');
    images.forEach(image => loadImage(image));
    media.forEach(item => loadMedia(item));
    btn.parentNode.removeChild(btn);
  });
  return btn;
}

function toggleDisplay(store) {
  const {
    presentation
  } = icons;
  const {
    article
  } = icons;
  const btn = buildButton('Toggle Article/Presentation Display', article);
  btn.addEventListener('click', () => {
    store.dispatch('display', 'toggle');
  });
  store.changes.subscribe('display', state => {
    if (state.display === 'presentation') {
      btn.innerHTML = article;
    } else {
      btn.innerHTML = presentation;
    }
  });
  return btn;
}

function toggleSpeaker(store) {
  const btn = buildButton('Toggle Speaker Note/Presentation Display', icons.speaker);
  btn.addEventListener('click', () => {
    store.dispatch('notes', 'toggle');
  });
  return btn;
}

function getHelp(store) {
  const icon = icons.help;
  const btn = buildButton('Help', icon);
  btn.addEventListener('click', e => {
    store.dispatch('toggle', 'help');
  });
  return btn;
}

function buildMinimap(stage) {
  const minimap = document.createElement('nav');
  minimap.classList.add('minimap');
  stage.forEach(item => {
    if (item.first) {
      const section = document.createElement('div');
      section.classList.add('minimap--section');
      minimap.appendChild(section);
    }

    minimap.lastChild.appendChild(item.progress);
  });
  return minimap;
}
function createMinimapLink(to, section, depth, fragment = false) {
  const link = document.createElement('a');
  link.classList.add('minimap--slide');
  link.href = `#/${to}`;
  link.innerText = `Section ${section}, Slide ${depth}`;
  link.dataset.fragments = fragment;
  return link;
}

function keys (store, opts = {}) {
  document.addEventListener('keydown', e => {
    if (store.state.display === 'presentation' && !e.target.classList.contains('btns--btn')) {
      const whereto = spaceMove(e, opts);

      if (whereto) {
        if (whereto !== 'notes' && whereto !== 'esc') {
          store.dispatch('navigate', whereto);
        } else if (whereto === 'notes') {
          store.dispatch('notes', 'toggle');
        } else if (whereto === 'esc') {
          store.dispatch('toggle', 'overview');
        }
      }
    }
  });
}

function spaceMove(e, opts) {
  const modifiers = {
    ctrl: e.ctrlKey === true,
    // ⌃
    alt: e.altKey === true,
    // ⌥
    meta: e.metaKey === true,
    // ⌘
    shift: e.shiftKey === true // ⇧

  };
  let previous = false;
  let next = false; // Set up Spacebar nav, with or without modifiers

  if (opts.spacebar !== false) {
    let spacebar = e.keyCode === 32;
    let shiftSpacebar = spacebar && modifiers['shift'];

    if (opts.spacebar !== true) {
      spacebar = spacebar && modifiers[opts.spacebar];
      shiftSpacebar = shiftSpacebar && modifiers[opts.spacebar];
    }

    previous = shiftSpacebar;
    next = spacebar;
  } // Set up Remote nav, with or without modifiers


  if (opts.remote !== false) {
    let pageUp = e.keyCode === 33;
    let pageDown = e.keyCode === 34;

    if (opts.remote !== true) {
      pageUp = pageUp && modifiers[opts.remote];
      pageDown = pageDown && modifiers[opts.remote];
    }

    previous = previous || pageUp;
    next = next || pageDown;
  } // Do previous or next navigation


  if (previous) {
    return 'previous';
  }

  if (next) {
    return 'next';
  } // S + CMD + Shift key


  if (e.keyCode === 83 && modifiers['alt'] && modifiers['shift']) {
    return 'notes';
  } // Escape Key


  if (e.keyCode === 27) {
    return 'esc';
  }

  return false;
}

function playVideo(entry) {
  const elem = entry.target;
  elem.pause();
  elem.currentTime = 0;

  if (entry.isIntersecting) {
    if (!elem.src) {
      loadMedia(elem);
    }

    window.setTimeout(() => {
      elem.play();
    }, 200);
  }
}
function playVideoObserver(entries) {
  entries.forEach(entry => {
    playVideo(entry);
  });
}
function autoplay () {
  const videos = document.querySelectorAll('video[data-autoplay]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(playVideoObserver);
    videos.forEach(video => observer.observe(video));
  }
}

function upgrade(stage, rootNode, start, options) {
  // Add Buttons
  // console.log(options._display);
  if (!options._display) {
    stage._head.elem.prepend(buttons(this.store));
  }

  stage.buildProgress(this.store, createMinimapLink);
  rootNode.parentNode.appendChild(buildMinimap(stage));
  this.goto(start); // Set up keyboard navigation

  keys(this.store, options); // Set up Autoplay

  autoplay();
}

export { upgrade };
//# sourceMappingURL=upgrade.js.map
