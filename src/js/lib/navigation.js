import {getActiveSlide} from './helpers';
import {updateProgress} from './progress';
import translate from './translate';

export default function(matrix) {
  const sectionLength = matrix.slides.length;

  document.addEventListener('keydown', (e) => {
    const active = getActiveSlide();
    let section = active.section;
    let slide = active.slide;

    console.log(e.keyCode);

    if (e.keyCode === 37) {
      // Left
      section = previousSection(section);
      if (slide > lastSlide(section, matrix)) {
        slide = 0;
      }
    }
    else if (e.keyCode === 39) {
      // Right
      section = nextSection(section, matrix);
      if (slide > lastSlide(section, matrix)) {
        slide = 0;
      }
    }
    else if (e.keyCode === 38 || e.keyCode === 33) {
      // Up
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
    }
    else if (e.keyCode === 40 || e.keyCode === 34 || e.keyCode === 32) {
      // Down
      slide += 1;
      if (slide > lastSlide(section, matrix)) {
        section = nextSection(section, matrix);
        let last = lastSlide(section, matrix);
        if (section === sectionLength - 1 && slide > last) {
          slide = last;
        }
        else if (section <= sectionLength - 1) {
          slide = 0;
        }
        // else if () {
        //   slide = last;
        // }
      }
    }
    else {
      return;
    }

    updateProgress(section, slide);
    translate(section, slide);
    history.pushState(null, null, `#/${section}/${slide}`);
  });
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
