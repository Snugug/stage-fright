export function removeLazyLoading(e) {
  e.target.removeAttribute('data-lazy-loading');
}

export function loadImage(elem) {
  let loading = elem;
  let load = false;

  if (elem.tagName === 'PICTURE') {
    const sets = elem.querySelectorAll('[data-srcset]');
    const srcs = elem.querySelectorAll('[data-src]');

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

export function loadMedia(elem) {
  let loading = elem;
  let load = false;

  if (elem.dataset.src) {
    load = true;
    loading.src = loading.dataset.src;
    delete loading.dataset.src;
  } else {
    const srcs = elem.querySelectorAll('[data-src]');
    srcs.forEach((src) => {
      load = true;
      src.src = src.dataset.src;
      delete src.dataset.src;
    });
  }

  loading.preload = 'auto';

  if (load) {
    loading.setAttribute('data-lazy-loading', true);
    loading.addEventListener('loadeddata', removeLazyLoading);
  }
}

export function loadMultimediaObserver(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;

      if (target.tagName === 'IMG' || target.targetName === 'PICTURE') {
        loadImage(target);  
      } else {
        loadMedia(target);
      }
    }
  });
}

export default function () {
  const multimedia = document.querySelectorAll('picture, img, video, audio, iframe');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(loadMultimediaObserver);
    multimedia.forEach(m => observer.observe(m));
  } else {
    multimedia.forEach((m) => {
      if (m.tagName === 'IMG' || m.tagName === 'PICTURE') {
        loadImage(m);
      } else {
        loadMedia(m)
      }
    });
  }
}
