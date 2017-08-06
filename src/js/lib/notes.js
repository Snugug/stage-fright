import nav from './navigation';
import {getActiveSlide} from './helpers';

export function openNotes(matrix) {
  const active = {
    go: getActiveSlide(),
  };

  const fragmentTotal = matrix.slides[active.go.section][active.go.slide].length - 1;
  let currentFragment = active.go.fragment;
  if (Number.isInteger(fragmentTotal) && isNaN(active.go.fragment)) {
    currentFragment = 0;
  }

  const position = {
    position: {
      section: active.go.section + 1,
      slide: active.go.slide + 1,
      fragment: currentFragment,
      fragmentTotal: fragmentTotal,
      sectionTotal: matrix.slides.length,
      slideTotal: matrix.slides[active.go.section].length,
    }
  };
  const locale = window.location;

  // console.log(locale);

  const notes = window.open(`${locale.origin}${locale.pathname}?notes=true`, 'Stage Fright - Notes', 'width=1100,height=700');

  console.log(position);

  setTimeout(() => {
    sendMessage(notes, active);
    sendMessage(notes, position);
    sendNotes(active.go.section, active.go.slide, matrix);
  }, 1000);

  return notes;
}

export function body() {
  const locale = window.location;
  const html = `
<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
<div class="_speaker-notes">
  <!-- Slide Preview -->
  <!-- Current Slide -->
  <div class="_speaker-notes--current">
    <div class="_speaker-notes--slide">
      <div class="_speaker-notes--holder">
        <iframe src="${locale.origin}${locale.pathname}?progress=false&responsive=true&listen=true${locale.hash}" frameborder="0" class="slide--current" height="1024" width="1280"></iframe>
      </div>
    </div>
  </div>

  <!-- Upcoming Slide Slide -->
  <div class="_speaker-notes--upcoming">
    <div class="_speaker-notes--slide">
      <span class="_speaker-notes--label">Upcoming:</span>
      <div class="_speaker-notes--holder">
        <iframe src="${locale.origin}${locale.pathname}?progress=false&responsive=true&listen=true${locale.hash}" frameborder="0" class="slide--upcoming" height="1024" width="1280"></iframe>
      </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="_speaker-notes--controls">
    <div class="controls">
      <div class="controls--time">
        <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4>
        <div class="timer">
          <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span>
        </div>
        <div class="clock">
          <span class="clock--value">0:00 AM</span>
        </div>
        <div class="controls--clear"></div>
      </div>
      <div class="controls--position">
        <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p>

        <p class="controls--slide">Slide <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p>

        <p class="controls--section">Section <span class="controls--section-current"></span>/<span class="controls--section-total"></span></p>

      </div>
    </div>
  </div>

  <article class="_speaker-notes--notes">
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
  </article>

</div>
`;
  document.body.innerHTML = html;
  return html;
}

export function sendNotes(section, slide, matrix) {
  let notes = document.querySelector(`[data-slide="${slide}"][data-section="${section}"] ._stage--notes`);
  if (notes) {
    notes = notes.innerHTML;
  }
  else {
    notes = '<p></p>';
  }

  sendMessage(matrix.notes, {
    notes,
  });

  return notes;
}

export function timing() {
  const clock = document.querySelector('.clock--value');
  const hour = document.querySelector('.timer--hours');
  const minute = document.querySelector('.timer--minutes');
  const second = document.querySelector('.timer--seconds');
  const timer = document.querySelector('.controls--time');
  let start = new Date();

  update();
  let runningClock = setInterval(update, 1000);

  timer.addEventListener('click', e => {
    start = new Date();

    clearInterval(runningClock);

    hour.textContent = timePad(0);
    minute.textContent = `:${timePad(0)}`;
    second.textContent = `:${timePad(0)}`;

    runningClock = setInterval(update, 1000);
  });

  function update() {
    const now = new Date();

    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / (1000)) % 60);

    clock.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    hour.textContent = timePad(hours);
    minute.textContent = `:${timePad(minutes)}`;
    second.textContent = `:${timePad(seconds)}`;

    if (hours <= 0) {
      hour.setAttribute('data-mute', true);
    }
    else {
      hour.removeAttribute('data-mute');
    }

    if (minutes <= 0) {
      minute.setAttribute('data-mute', true);
    }
    else {
      minute.removeAttribute('data-mute');
    }
  }

  function timePad(time) {
    const str = `00${parseInt(time)}`;
    return str.substring(str.length - 2);
  }
}

export function sendMessage(target, message) {
  const locale = window.location;
  if (target) {
    target.postMessage(message, locale.origin);
  }
}

export function slideMessage(matrix) {
  window.addEventListener('message', e => {
    // console.log(e);
    const origin = e.origin || event.originalEvent.origin;
    if (origin !== window.location.origin) {
      return;
    }

    if (e.data.move) {
      return nav[e.data.move](matrix);
    }
  }, false);
}

export function notesMessage() {
  const current = document.querySelector('.slide--current');
  const upcoming = document.querySelector('.slide--upcoming');


  const fragments = document.querySelector('.controls--fragment');
  const fragmentCurrent = document.querySelector('.controls--fragment-current');
  const fragmentTotal = document.querySelector('.controls--fragment-total');

  const slideCurrent = document.querySelector('.controls--slide-current');
  const slideTotal = document.querySelector('.controls--slide-total');

  const sectionCurrent = document.querySelector('.controls--section-current');
  const sectionTotal = document.querySelector('.controls--section-total');


  const notes = document.querySelector('.slide-notes--content');


  window.addEventListener('message', e => {
    const origin = e.origin || event.originalEvent.origin;
    if (origin !== window.location.origin) {
      return;
    }

    if (e.data.position) {

      slideCurrent.textContent = e.data.position.slide;
      slideTotal.textContent = e.data.position.slideTotal;

      sectionCurrent.textContent = e.data.position.section;
      sectionTotal.textContent = e.data.position.sectionTotal;

      if (Number.isInteger(e.data.position.fragmentTotal)) {
        fragments.setAttribute('data-active', true);

        let frag = e.data.position.fragment;

        fragmentCurrent.textContent = e.data.position.fragment;
        fragmentTotal.textContent = e.data.position.fragmentTotal;
      }
      else {
        fragments.removeAttribute('data-active');
        fragmentCurrent.textContent = 1;
        fragmentTotal.textContent = 1;
      }
    }

    if (e.data.move) {
      sendMessage(current.contentWindow, {move: e.data.move});
      sendMessage(upcoming.contentWindow, {move: e.data.move});
    }

    if (e.data.go) {
      let hash = `#/${e.data.go.section}/${e.data.go.slide}`;
      if (e.data.go.fragment) {
        hash += `/${e.data.go.fragment}`;
      }

      current.src = current.src + hash;
      upcoming.src = upcoming.src + hash;
      sendMessage(upcoming.contentWindow, {move: 'next'});
    }

    if (e.data.notes) {

      notes.innerHTML = e.data.notes;
    }
  }, false);
}
