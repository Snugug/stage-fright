import {getActiveSlide} from './helpers';

export default function() {
  const active = getActiveSlide();
  let slide = 0;
  let section = 0;

  if (isNaN(active.section) || isNaN(active.slide)) {
    console.log('in')
    history.pushState(null, null, `#/${section}/${slide}`);
  }
}
