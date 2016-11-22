import {getActiveSlide} from './helpers';

export default function() {
  const active = getActiveSlide();
  let slide = 0;
  let section = 0;

  if (isNaN(active.section) || isNaN(active.slide)) {
    history.pushState(null, null, `#/${section}/${slide}`);
  }
}
