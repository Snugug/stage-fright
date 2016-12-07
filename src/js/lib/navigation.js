import {getActiveSlide} from './helpers';
import {updateProgress} from './progress';
import translate from './translate';
import {sendMessage, sendNotes} from './notes';

export default class {
  static next(matrix, notes) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return next(section, slide, fragment, matrix);
  }

  static previous(matrix, notes) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return previous(section, slide, fragment, matrix);
  }

  static left(matrix, notes) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return left(section, slide, fragment, matrix);
  }

  static right(matrix, notes) {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;
    let fragment = active.fragment;

    return right(section, slide, fragment, matrix);
  }

  static move(section, slide, fragment) {
    // console.log(section);
    // console.log(slide);
    // console.log(fragment);
    // updateProgress(section, slide, fragment);
    return translate(section, slide, fragment);
  }
}

function move(mv) {
  let path = `#/${mv.section}/${mv.slide}`;
  const fragments = document.querySelector(`[data-slide="${mv.slide}"][data-section="${mv.section}"]`).querySelectorAll('.fragment[data-active]').length;

  if (isNaN(mv.fragment)) {
    updateProgress(mv.section, mv.slide);
    translate(mv.section, mv.slide);
    if (fragments !== 0) {
      updateProgress(mv.section, mv.slide, fragments);
      path += `/${fragments}`;
    }
  }
  else {
    updateProgress(mv.section, mv.slide, mv.fragment);
    path += `/${mv.fragment}`;
  }

  history.pushState(null, null, path);
  sendNotes(mv.section, mv.slide, mv.matrix);

  return {
    section: mv.section,
    slide: mv.slide,
    fragment: mv.fragment,
  };
}

function right(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  sendMessage(matrix.notes, {
    move: 'right',
  });

  section = nextSection(section, matrix);
  if (slide > lastSlide(section, matrix)) {
    slide = 0;
  }

  return move({section, slide, matrix});
}

function left(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  sendMessage(matrix.notes, {
    move: 'left',
  });

  section = previousSection(section);
  if (slide > lastSlide(section, matrix)) {
    slide = 0;
  }

  return move({section, slide, matrix});
}

function previous(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;

  sendMessage(matrix.notes, {
    move: 'previous',
  });

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

  return move({section, slide, matrix});
}

function next(sec, sld, frag, matrix) {
  let section = sec;
  let slide = sld;
  let fragment = frag;
  const sectionLength = matrix.slides.length;

  sendMessage(matrix.notes, {
    move: 'next',
  });

  if (Array.isArray(matrix.slides[section][slide])) {
    let inactiveFragment = matrix.slides[section][slide][0].querySelector('.fragment:not([data-active])');
    if (inactiveFragment) {
      const fragments = matrix.slides[section][slide][0].querySelectorAll('.fragment[data-active]').length + 1;
      inactiveFragment.setAttribute('data-active', true);

      return move({section, slide, fragments, matrix});
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

  return move({section, slide, fragment, matrix});
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
