export function createPresentation() {
  return {
    channel: window.BroadcastChannel ? new BroadcastChannel('presentation') : null,
  };
}

export function buildNotesPreviewLink(index, upcoming = false) {
  const locale = window.location;
  const search = new URLSearchParams();
  const link = new URL(locale.origin + locale.pathname);
  link.hash = `#/${index}`;
  search.set('embedded', true);
  if (upcoming) {
    search.set('upcoming', true);
  }

  link.search = search.toString();

  return link.toString();
}

export function updateNotes(notes, index, current) {
  // Update Notes preview URLs on index change;
  if (current.notes) {
    notes.content.innerHTML = current.notes;
  } else {
    notes.content.innerHTML = '';
  }

  notes.index.textContent = index;

  if (current.hasOwnProperty('fragment')) {
    notes.fragments.dataset.active = true;
    notes.currentFrag.textContent = current.fragment;
    notes.totalFrag.textContent = current.totalFragments;
  } else {
    if (notes.fragments.dataset.hasOwnProperty('active')) {
      delete notes.fragments.dataset.active;
    }
    notes.currentFrag.textContent = '';
    notes.totalFrag.textContent = '';
  }
}

export function timing(parent) {
  const clock = parent.querySelector('.clock--value');
  const timer = parent.querySelector('.timer');
  const hour = parent.querySelector('.timer--hours');
  const minute = parent.querySelector('.timer--minutes');
  const second = parent.querySelector('.timer--seconds');
  let start = new Date();

  // Update to begin
  update();

  // Update every second
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
    const seconds = Math.floor((diff / 1000) % 60);

    clock.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    hour.textContent = timePad(hours);
    minute.textContent = `:${timePad(minutes)}`;
    second.textContent = `:${timePad(seconds)}`;

    hour.setAttribute('data-mute', hours <= 0);
    minute.setAttribute('data-mute', minutes <= 0);
  }

  function timePad(time) {
    const str = `00${parseInt(time)}`;
    return str.substring(str.length - 2);
  }
}

export function notesBody(index, current) {
  const notes = document.createElement('section');
  notes.classList.add('_speaker-notes');

  const currentSrc = buildNotesPreviewLink(index);

  let nextSlideIndex = index + 1;

  if (!current.next) {
    nextSlideIndex--;
  }

  const nextSrc = buildNotesPreviewLink(nextSlideIndex, true);

  notes.innerHTML = `<div class="_speaker-notes--current"> <iframe src="${currentSrc}" class="_speaker-notes--slide-preview" frameborder="0" height="1024" width="1280"></iframe> </div><div class="_speaker-notes--upcoming"> <span class="_speaker-notes--label">Upcoming:</span> <iframe src="${nextSrc}" class="_speaker-notes--slide-preview" frameborder="0" height="1024" width="1280"></iframe> </div><div class="_speaker-notes--controls"> <div class="controls"> <div class="controls--time"> <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4> <button class="timer"> <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span> </button><div class="clock"> <span class="clock--value">0:00 AM</span> </div></div><div class="controls--position"> <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p><p class="controls--slide">Step <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p></div></div></div><article class="_speaker-notes--notes"> <div class="slide-notes"> <h4 class="slide-notes--label">Notes</h4> <div class="slide-notes--content"></div></div></article>`;

  timing(notes);

  return {
    _notes: notes,
    current: notes.querySelector('._speaker-notes--current ._speaker-notes--slide-preview'),
    next: notes.querySelector('._speaker-notes--upcoming ._speaker-notes--slide-preview'),
    content: notes.querySelector('.slide-notes--content'),
    index: notes.querySelector('.controls--slide-current'),
    total: notes.querySelector('.controls--slide-total'),
    fragments: notes.querySelector('.controls--fragment'),
    currentFrag: notes.querySelector('.controls--fragment-current'),
    totalFrag: notes.querySelector('.controls--fragment-total'),
  };
}
