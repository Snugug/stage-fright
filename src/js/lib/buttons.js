import { loadImage } from './lazyload';

export default function(store) {
  const holder = document.createElement('div');
  holder.classList.add('btns');

  holder.appendChild(downloadImages());
  holder.appendChild(toggleDisplay(store));
  holder.appendChild(hiddenPresButton());

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
  const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M24.708 13.207l-1.414-1.415L17 18.087V1.5h-2v16.585l-6.292-6.293-1.414 1.415 8.707 8.707z"/><path d="M29 18.5v8H3v-8H1v12h30v-12z"/></svg>';
  const btn = buildButton('Download All Assets', icon);

  btn.addEventListener('click', () => {
    const images = document.querySelectorAll('picture', 'img');
    images.forEach(image => loadImage(image));  
    btn.parentNode.removeChild(btn);
  });

  return btn;
}

function toggleDisplay(store) {
  const presentation = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M19 3h10v10H19z"/><path d="M17 3H3v26h26V15H17V3zm-2 24H5V17h10v10zm12-10v10H17V17h10zM5 15V5h10v10H5z"/></svg>';
  const article = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M3 6h22v2H3zM3 12h14v2H3zM3 18h26v2H3zM3 24h14v2H3z"/></svg>';
  const btn = buildButton('Toggle Article/Presentation Display', article);

  btn.addEventListener('click', () => {
    store.dispatch('display', 'toggle');
  });

  store.changes.subscribe('display', (state) => {
    if (state.display === 'presentation') {
      btn.innerHTML = article;
    } else {
      btn.innerHTML = presentation;
    }
  });

  return btn;
}
