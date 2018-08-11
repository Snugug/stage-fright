export function removeLazyLoading(e) {
  e.target.removeAttribute('data-lazy-loading');
}

export function loadImage(elem) {
  let loading = elem;
  let load = false;

  if (elem.tagName === 'PICTURE') {
    const sets = elem.querySelectorAll('[data-srcset]');
    const srcs = elem.querySelectorAll('[data-src]');

    loading = elem.querySelector('img');

    sets.forEach((set) => {
      load = true;
      set.srcset = set.dataset.srcset; // eslint-disable-line no-param-reassign
      delete set.dataset.srcset; // eslint-disable-line no-param-reassign
    });

    srcs.forEach((src) => {
      load = true;
      src.src = src.dataset.src; // eslint-disable-line no-param-reassign
      delete src.dataset.src; // eslint-disable-line no-param-reassign
    });
  } else if (elem.tagName === 'IMG') {
    if (elem.dataset.src) {
      load = true;
      elem.src = elem.dataset.src; // eslint-disable-line no-param-reassign
      delete elem.dataset.src; // eslint-disable-line no-param-reassign
    }
  }

  if (load) {
    loading.setAttribute('data-lazy-loading', true);
    loading.addEventListener('load', removeLazyLoading);
  }
}

export function loadImageObserver(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
    }
  });
}

export default function () {
  const images = document.querySelectorAll('picture', 'img');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(loadImageObserver);
    images.forEach(image => observer.observe(image));
  } else {
    images.forEach(img => loadImage(img));
  }
}
