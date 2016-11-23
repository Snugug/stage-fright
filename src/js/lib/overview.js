import {nodeMap} from './helpers';
import {updateProgress} from './progress';
import translate from './translate';

export default function(matrix) {
  let open = false;
  const slides = matrix._raw.slides;

  document.addEventListener('keydown', e => {
    console.log(open);
    if (e.keyCode === 27) {
      if (open) {
        open = false;
      }
      else {
        open = true;
      }

      // Translate back to active
      if (open === false) {
        matrix.stage.removeAttribute('data-overlay');
        removeClick(slides);
        translate();
        return;
      }

      // Move to overview
      const wwidth = window.innerWidth;
      const wheight = window.innerHeight;
      const width = matrix.stage.scrollWidth;
      const height = matrix.stage.scrollHeight;
      const wratio = wwidth / width;
      const hratio = wheight / height;

      if (wratio <= hratio) {
        let offset = 64 / wratio;
        let scale = wwidth / (width + offset);
        matrix.stage.style.transform = `scale(${scale})`;
        matrix.stage.style.transformOrigin = `32px ${height * wratio / 2 - 32}px`;
      }
      else {
        let offset = 64 / hratio;
        let scale = hwidth / (width + offset);
        matrix.stage.style.transform = `scale(${scale})`;
        matrix.stage.style.transformOrigin = `${width * hratio / 2 - 32}px 32px`;
      }

      matrix.stage.setAttribute('data-overlay', 'true');

      // Make slides clickable
      nodeMap(slides, slide => {
        slide.addEventListener('click', addClick);
      });

      function addClick(e) {
        const target = e.target.closest('[data-section][data-slide]');
        let section = target.getAttribute('data-section');
        let slide = target.getAttribute('data-slide');

        removeClick(slides);
        matrix.stage.removeAttribute('data-overlay');
        history.pushState(null, null, `#/${section}/${slide}`);
        updateProgress(section, slide);
        translate(section, slide);
        open = false;
      }

      function removeClick(slides) {
        nodeMap(slides, slide => {
          slide.removeEventListener('click', addClick);
        });
      }
    }
  });
}
