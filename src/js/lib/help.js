import icons from './icons';

export default function help(store) {
  let previousFocus = null;

  const dialog = buildHelp(store);
  const close = dialog.querySelector('.sf-dialog--close');
  const overlay = document.createElement('div');
  overlay.classList.add('sf-overlay');

  // Make Overlay click close
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
  <p id="sf-dialog--description" class="sf-dialog--sr-only">Controls and actions you can take in this presentation</p><div class="sf-dialog--body">`;

  // Keyboard Shortcuts
  const keyboard = [
    {
      desc: 'Navigate presentation forward',
      opts: ['<kbd>space</kbd>', '<kbd>page up</kbd> (presenter remote forward)'],
    },
    {
      desc: 'Navigate presentation backward',
      opts: ['<kbd>shift</kbd>+<kbd>space</kbd>', '<kbd>page down</kbd> (presenter remote back)'],
    },
    {
      desc: 'Presentation overview',
      opts: ['<kbd>esc</kbd>'],
    },
  ];

  if (store.state.presentation.request) {
    keyboard.push({
      desc: 'Toggle speaker notes/presentation view (requires external monitor)',
      opts: ['<kbd>alt</kbd>+<kbd>shift</kbd>+<kbd>s</kbd>'],
    });
  }

  innerHTML += `<div class="sf-dialog--keyboard"><h3>Keyboard Navigation</h3><p>Keyboard shortcuts to use the presentation.</p><dl>${keyboard
    .map(i => `<dt>${i.desc}</dt>${i.opts.map(opt => `<dd>${opt}</dd>`).join('')}`)
    .join('')}</dl></div>`;

  // Icons
  const iconography = [
    {
      icon: icons.download,
      desc: 'Download all images and videos that would otherwise be lazyloaded.',
    },
    {
      icon: icons.article,
      desc:
        'Toggle from presentation view to article view. Article view includes visible speaker notes',
    },
    {
      icon: icons.presentation,
      desc: 'Toggle from article view to presentation view.',
    },
    {
      icon: icons.help,
      desc: 'Launch the help overlay.',
    },
  ];

  if (store.state.presentation.request) {
    iconography.push({
      desc: 'Toggle speaker notes/presentation view (requires external monitor)',
      icon: icons.speaker,
    });
  }

  innerHTML += `<div class="sf-dialog--iconography"><h3>Iconography</h3><p>Icons used throughout the presentation.</p><dl>${iconography
    .map(i => `<dt>${i.icon}</dt><dd>${i.desc}</dd>`)
    .join('')}</dl></div>`;

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
    e.stopPropagation();

    // Escape key, Enter key, Space
    if (e.keyCode === 27 || e.keyCode === 13 || e.keyCode === 32) {
      store.dispatch('toggle', 'help');
    }
  });

  return dialog;
}
