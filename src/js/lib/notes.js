import nav from './navigation';
import {getActiveSlide} from './helpers';

export function openNotes(matrix) {
  const active = {
    go: getActiveSlide(),
  };
  const locale = window.location;

  const notes = window.open(`${locale.origin}?notes=true`, 'Stage Fright - Notes', 'width=1100,height=700');

  setTimeout(() => {
    sendMessage(notes, active);
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
    display: flex;
    overflow: hidden;
    font-size: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .clock,
  .timer {
    flex: 1;
    font-family: sans-serif;
    font-size: 2em;
  }
  .timer {
    text-align: left;
  }
  .clock {
    text-align: right;
  }


  [data-mute] {
    opacity: .5;
  }

  .slide {
    position: relative;
  }

  .slide--current {
    width: calc(60vw - 1em);
    height: calc(100vh - 1em);
    padding: .25em;
  }

  .slide--upcoming {
    width: calc(40vw - 1em);
    height: calc(40vh - 1em);
  }

  .slide--frame {
    // border: 1px solid black;
  }

  .slide--label {
    text-transform: uppercase;
    position: absolute;
    color: white;
    background: black;
    opacity: .5;
    width: 100%;
    padding: .25rem;
    font-size: .5em;
  }

  .current {
    width: 60vw;
    padding: .5em;
  }

  .speaker-notes {
    width: 40vw;
    padding: .5em;
  }

  .controls {
    font-size: .8em;
  }

  .controls--time {
    display: flex;
    flex-wrap: wrap;
  }

  .controls--label {
    font-family: sans-serif;
    opacity: .5;
    text-transform: lowercase;
    margin: 0;
    flex-shrink: 0;
    width: 100%;
    font-size: .75em;
  }

  .controls--reset {
    color: transparent;
    font-size: 1px;
  }

  .slide-notes {
    font-family: sans-serif;
    margin-top: 1rem;
  }

  .slide-notes--label {
    font-size: 1px;
    color: transparent;
  }

</style>
<div class="current">
    <div class="slide">
      <div class="slide--holder">
        <iframe src="${locale.origin}?progress=false&responsive=true&listen=true${locale.hash}" frameborder="0" class="slide--current" height="1024" width="1280"></iframe>
      </div>
    </div>
  </div>
  <div class="speaker-notes">
    <div class="slide">
      <span class="slide--label">Upcoming:</span>
      <div class="slide--holder">
        <iframe src="${locale.origin}?progress=false&responsive=true&listen=true${locale.hash}" frameborder="0" class="slide--upcoming" height="1024" width="1280"></iframe>
      </div>
    </div>
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
    </div>
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
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
  const start = new Date();

  update();
  setInterval(update, 1000);

  function update() {
    const now = new Date();

    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / (1000)) % 60);

    clock.textContent = now.toLocaleTimeString('en-US', {
      hour12: true,
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
  const notes = document.querySelector('.slide-notes--content');


  window.addEventListener('message', e => {
    const origin = e.origin || event.originalEvent.origin;
    if (origin !== window.location.origin) {
      return;
    }

    // console.log(e);

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
