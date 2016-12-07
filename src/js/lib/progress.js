import {idleRun, getActiveSlide, nodeMap} from './helpers';
import translate from './translate';
import {sendMessage} from './notes';

export default function(matrix) {
  idleRun(() => {
    // Create Progress
    const progress = document.createElement('nav');
    progress.classList.add('progress');

    // Get active slide
    const active = getActiveSlide();

    // Build Sections
    let sections = 0;
    matrix.slides.forEach(section => {
      const sec = document.createElement('div');
      sec.setAttribute('data-section', sections);
      sec.classList.add('progress--section');

      let slides = 0;
      section.forEach(slide => {
        const sld = document.createElement('a');
        sld.href = `#/${sections}/${slides}`;
        sld.classList.add('progress--slide');
        sld.setAttribute('data-slide', slides);
        sld.setAttribute('data-section', sections);
        sld.setAttribute('tabindex', '-1');
        sld.textContent = `Section ${sections}, Slide ${slides}`;

        if (Array.isArray(slide)) {
          sld.style.opacity = .5;
          sld.setAttribute('data-fragments', slide.length - 1);
        }

        if (active.section === sections && active.slide === slides) {
          sld.setAttribute('data-active', 'true');
        }

        sec.appendChild(sld);

        if (Array.isArray(slide)) {
          slide[0].setAttribute('data-slide', slides);
          slide[0].setAttribute('data-section', sections);
          if (active.section === sections && active.slide === slides) {
            slide[0].setAttribute('data-active', true);
          }
        }
        else {
          slide.setAttribute('data-slide', slides);
          slide.setAttribute('data-section', sections);
          if (active.section === sections && active.slide === slides) {
            slide.setAttribute('data-active', true);
          }
        }

        slides++;
      });

      progress.appendChild(sec);

      sections++;
    });

    if (matrix.options.progress !== false) {
      document.body.appendChild(progress);
    }

    translate(active.section, active.slide, active.fragment);
    updateProgress(active.section, active.slide, active.fragment);
  });

  window.addEventListener('hashchange', e => {
    const active = getActiveSlide();
    updateProgress(active.section, active.slide, active.fragment);
    translate(active.section, active.slide, active.fragment);
    sendMessage(matrix.notes, {
      go: active,
    });
  });
}

export function updateProgress(section, slide, fragment) {
  const current = document.querySelectorAll('[data-active]:not(.fragment)');
  const next = document.querySelectorAll(`[data-section="${section}"][data-slide="${slide}"`);
  const progress = document.querySelector('.progress--slide[data-active]');

  if (progress) {
    if (fragment) {
      const fragments = parseInt(progress.getAttribute('data-fragments'));
      if (fragment === fragments) {
        progress.style.transitionProperty = 'none';
        progress.style.opacity = 1;
      }
      else {
        progress.style.transitionProperty = 'none';
        progress.style.opacity = .5;
      }
    }
    else {
      progress.style.transitionProperty = 'all';
      nodeMap(current, node => {
        node.removeAttribute('data-active');
      });

      nodeMap(next, node => {
        node.setAttribute('data-active', 'true');
      });
    }
  }
}
