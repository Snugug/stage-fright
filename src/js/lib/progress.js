export default function(nav) {
  // Create Progress
  const progress = document.createElement('nav');
  progress.classList.add('progress');

  // Get active slide
  const active = getActiveSlide();
  console.log(active);

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
      sld.setAttribute('data-page', slides);
      sld.setAttribute('data-section', sections);
      sld.setAttribute('tabindex', '-1');
      sld.textContent = `Slide ${sections}/${slides}`;

      if (active.section === sections && active.slide === slides) {
        sld.setAttribute('data-active', 'true');
      }

      sec.appendChild(sld);

      slides++;
    });

    progress.appendChild(sec);

    sections++;
  });

  document.body.appendChild(progress);

  window.addEventListener('hashchange', e => {
    const slide = getActiveSlide();
    const current = document.querySelector('.progress--slide[data-active]');
    const next = document.querySelector(`[data-section="${slide.section}"][data-page="${slide.slide}"`);

    current.removeAttribute('data-active');
    next.setAttribute('data-active', 'true');
  });
}

function getActiveSlide() {
  const hash = location.hash.split('/');
  hash.shift();

  return {
    section: parseInt(hash[0]),
    slide: parseInt(hash[1]),
  };
};
