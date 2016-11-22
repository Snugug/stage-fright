import {idleRun, getActiveSlide, nodeMap} from './helpers';
import translate from './translate';

export default function(nav) {
  idleRun(() => {
    // Create Progress
    const progress = document.createElement('nav');
    progress.classList.add('progress');

    // Get active slide
    const active = getActiveSlide();

    // Build Sections
    let sections = 0;
    nav.slides.forEach(section => {
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
        sld.textContent = `Slide ${sections}/${slides}`;

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

    document.body.appendChild(progress);

    translate(active.section, active.slide);
  });

  window.addEventListener('hashchange', e => {
    const active = getActiveSlide();
    updateProgress(active.section, active.slide);
    translate(active.section, active.slide);
  });
}

export function updateProgress(section, slide) {
  const current = document.querySelectorAll('[data-active]');
  const next = document.querySelectorAll(`[data-section="${section}"][data-slide="${slide}"`);

  nodeMap(current, node => {
    node.removeAttribute('data-active');
  });

  nodeMap(next, node => {
    node.setAttribute('data-active', 'true');
  });
}
