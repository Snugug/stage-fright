export function createPresentation() {
  const request = window.PresentationRequest ? new PresentationRequest([window.location.origin + window.location.pathname]) : null;

  const presentation = {
    request,
    connection: null,
  };

  if (request) {
    // Make the default presentation request our presentation request
    navigator.presentation.defaultRequest = presentation.request;
  }

  return presentation;
}

export async function receivePresentationControls(state) {
  if (navigator.presentation && navigator.presentation.receiver) {
    const list = await navigator.presentation.receiver.connectionList;

    list.connections.map(connection => addPresentationConnection(connection, state));
  }
}

export function addPresentationConnection(connection, state) {
  connection.send('Connected, from the other side!');

  connection.addEventListener('message', e => {
    const message = JSON.parse(e.data);

    if (message.hasOwnProperty('goto')) {
      state.dispatch('navigate', message.goto);
    }
  });
}

export function advancePresentation(connection, goto) {
  if (connection) {
    connection.send(JSON.stringify({
      goto,
    }));
  }
}

export function buildNotesPreviewLink(index) {
  const locale = window.location;
  const search = new URLSearchParams();
  const link = new URL(locale.origin + locale.pathname);
  link.hash = `#/${index}`;
  search.set('embedded', true);

  link.search = search.toString();

  return link.toString();
}

export function updateNotes(notes, index, current) {
  // Update Notes preview URLs on index change;
  notes.current.src = buildNotesPreviewLink(index);

  let nextSlideIndex = index + 1;

  if (!current.next) {
    nextSlideIndex--;
  }

  notes.next.src = buildNotesPreviewLink(nextSlideIndex);

  if (current.notes) {
    notes.content.innerHTML = current.notes;
  } else {
    notes.content.innerHTML = '';
  }

  notes.index.textContent = index;
}

export function timing(parent) {
  const clock = parent.querySelector('.clock--value');
  const hour = parent.querySelector('.timer--hours');
  const minute = parent.querySelector('.timer--minutes');
  const second = parent.querySelector('.timer--seconds');
  const timer = parent.querySelector('.controls--time');
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

export function notesBody() {
  const notes = document.createElement('section');
  notes.classList.add('_speaker-notes');

  notes.innerHTML = '<div class="_speaker-notes--current"> <iframe class="_speaker-notes--slide-preview" frameborder="0" height="1024" width="1280"></iframe> </div><div class="_speaker-notes--upcoming"> <span class="_speaker-notes--label">Upcoming:</span> <iframe class="_speaker-notes--slide-preview" frameborder="0" height="1024" width="1280"></iframe> </div><div class="_speaker-notes--controls"> <div class="controls"> <div class="controls--time"> <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4> <button class="timer"> <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span> </button><div class="clock"> <span class="clock--value">0:00 AM</span> </div></div><div class="controls--position"> <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p><p class="controls--slide">Step <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p></div></div></div><article class="_speaker-notes--notes"> <div class="slide-notes"> <h4 class="slide-notes--label">Notes</h4> <div class="slide-notes--content"></div></div></article>';

  timing(notes);

  return {
    _notes: notes,
    current: notes.querySelector('._speaker-notes--current ._speaker-notes--slide-preview'),
    next: notes.querySelector('._speaker-notes--upcoming ._speaker-notes--slide-preview'),
    content: notes.querySelector('.slide-notes--content'),
    index: notes.querySelector('.controls--slide-current'),
    total: notes.querySelector('.controls--slide-total'),
  }
}
