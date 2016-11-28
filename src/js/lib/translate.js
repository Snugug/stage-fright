import {getActiveSlide} from './helpers';

export default function(s, p, f) {
  const stage = document.querySelector('._stage');
  let section = s;
  let slide = p;
  let fragment = f;

  if (!(s && p) && s !== 0 && p !== 0) {
    const active = getActiveSlide();
    if (!s) {
      section = active.section;
    }
    if (!p) {
      slide = active.slide;
    }
  }

  const fragments = document.querySelector(`[data-slide="${slide}"][data-section="${section}"]`).querySelectorAll('.fragment');
  for (let i = 0; i < fragment; i++) {
    fragments[i].setAttribute('data-active', true);
  }

  stage.style.transform = `translateX(${-100 * section}vw) translateY(${-100 * slide}vh)`;
}
