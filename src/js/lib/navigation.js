import {getActiveSlide} from './helpers';
import {updateProgress} from './progress';
import translate from './translate';

export default class {
  static next(matrix) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return next(section, slide, fragment, matrix);
  }

  static previous(matrix) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return previous(section, slide, fragment, matrix);
  }

  static left(matrix) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return left(section, slide, fragment, matrix);
  }

  static right(matrix) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return right(section, slide, fragment, matrix);
  }
}

function move(section, slide, fragment) {
  let path = `#/${section}/${slide}`;
  const fragments = document.querySelector(`[data-slide="${slide}"][data-section="${section}"]`).querySelectorAll('.fragment[data-active]').length;

  if (isNaN(fragment)) {
    updateProgress(section, slide);
    translate(section, slide);
    if (fragments !== 0) {
      path += `/${fragments}`;
    }
  }
  else {
    updateProgress(section, slide, fragment);
    path += `/${fragment}`;
  }

  history.pushState(null, null, path);

  return {
    section,
    slide,
    fragment,
  };
}

function right(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  section = nextSection(section, matrix);
  if (slide > lastSlide(section, matrix)) {
    slide = 0;
  }

  return move(section, slide);
}

function left(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  section = previousSection(section);
  if (slide > lastSlide(section, matrix)) {
    slide = 0;
  }

  return move(section, slide);
}

function previous(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  slide -= 1;
  if (slide < 0) {
    section = previousSection(section);

    if (section !== 0) {
      slide = lastSlide(section, matrix);
    }
    else {
      slide = 0;
    }
  }

  return move(section, slide);
}

function next(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;
  const sectionLength = matrix.slides.length;

  if (Array.isArray(matrix.slides[section][slide])) {
    let inactiveFragment = matrix.slides[section][slide][0].querySelector('.fragment:not([data-active])');
    if (inactiveFragment) {
      const fragments = matrix.slides[section][slide][0].querySelectorAll('.fragment[data-active]').length + 1;
      inactiveFragment.setAttribute('data-active', true);

      return move(section, slide, fragments);
    }
  }

  slide += 1;
  fragment = undefined;

  if (slide > lastSlide(section, matrix)) {
    section = nextSection(section, matrix);
    let last = lastSlide(section, matrix);
    if (section === sectionLength - 1 && slide > last) {
      slide = last;
    }
    else if (section <= sectionLength - 1) {
      slide = 0;
    }
  }

  return move(section, slide, fragment);
}

function previousSection(sec) {
  let section = sec;

  section -= 1;
  if (section < 0) {
    section = 0;
  }

  return section;
}

function nextSection(sec, matrix) {
  let section = sec;
  const length = matrix.slides.length;

  section += 1;
  if (section >= length) {
    section = length - 1;
  }

  return section;
}

function lastSlide(sec, matrix) {
  let section = sec;
  const length = matrix.slides[section].length;

  return length - 1;
}
