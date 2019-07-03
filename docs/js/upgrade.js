import { loadImage, loadMedia } from './lazyload.js';

var icons = {
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M18.32 4.26A9.949 9.949 0 0 0 13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43zM19.93 11h2.02c-.2-2.01-1-3.84-2.21-5.32L18.31 7.1a7.941 7.941 0 0 1 1.62 3.9zm-1.62 5.9l1.43 1.43a9.981 9.981 0 0 0 2.21-5.32h-2.02a7.945 7.945 0 0 1-1.62 3.89zM13 19.93v2.02c2.01-.2 3.84-1 5.32-2.21l-1.43-1.43c-1.1.86-2.43 1.44-3.89 1.62zm2.59-9.34L13 13.17V7h-2v6.17l-2.59-2.59L7 12l5 5 5-5-1.41-1.41zM11 19.93v2.02c-5.05-.5-9-4.76-9-9.95 0-5.19 3.95-9.45 9-9.95v2.02C7.05 4.56 4 7.92 4 12s3.05 7.44 7 7.93z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
  presentation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.5 6.5H4v11H2.5zM20 6.5h1.5v11H20zM22.5 8H24v8h-1.5zM0 8h1.5v8H0z"/><path fill="none" d="M7 17h10V7H7v10zm2.8-5l1.5 2 2.4-2.8 2.9 3.8h-9l2.2-3z"/><path d="M13.6 11.2L11.2 14l-1.4-2-2.3 3h9z"/><path d="M18 5H6c-.5 0-1 .5-1 1v12c0 .5.5 1 1 1h12c.5 0 1-.5 1-1V6c0-.5-.5-1-1-1zm-1 12H7V7h10v10z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
  article: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>',
  help: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
  speaker: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zM6 12h2v2H6zm0-3h2v2H6zm0-3h2v2H6zm4 6h5v2h-5zm0-3h8v2h-8zm0-3h8v2h-8z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'
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

  if (store.state.presentation.channel) {
    keyboard.push({
      desc: 'Toggle speaker notes/presentation view',
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

  if (store.state.presentation.channel) {
    iconography.push({
      desc: 'Toggle speaker notes/presentation view',
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
