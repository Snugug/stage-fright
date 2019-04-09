import { loadImage, loadMedia } from './lazyload';
import help from './help';
import icons from './icons';

export default function(store) {
  const holder = document.createElement('div');
  holder.classList.add('btns');

  holder.appendChild(downloadImages());
  holder.appendChild(getHelp(store));
  holder.appendChild(toggleDisplay(store));

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
  const presentation = icons.presentation;
  const article = icons.article;
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

function getHelp(store) {
  const icon = icons.help;
  const btn = buildButton('Help', icon);

  btn.addEventListener('click', e => {
    store.dispatch('toggle', 'help');
  });

  return btn;
}
