export default {
  navigate(state, payload, options) {
    // console.log(options);
    if (payload === 'next' && state.current.next) {
      state.current = state.current.next;
      state.index += 1;
    } else if (payload === 'previous' && state.current.previous) {
      state.current = state.current.previous;
      state.index -= 1;
    } else if (payload !== 'next' && payload !== 'previous') {
      state.current = payload;
    }

    state.overview = false;

    if (options[0] === false) {
      state.broadcast = false;
    } else {
      state.broadcast = true;
    }

    return state;
  },
  index(state, payload) {
    state.index = payload;

    return state;
  },
  progress(state, payload) {
    const previous = state.progress;
    state.progress = state.current.progress;

    if (state.progress) {
      if (previous && previous !== state.progress && previous.dataset.hasOwnProperty('active')) {
        delete previous.dataset.active;
      }

      state.progress.dataset.active = true;

      if (state.current.hasOwnProperty('fragment')) {
        if (state.current.fragment === state.current.totalFragments) {
          state.progress.dataset.fragments = false;
        } else {
          state.progress.dataset.fragments = true;
        }
      }
    }

    return state;
  },
  async notes(state, { root, length }) {
    if (state.presentation.channel) {
      if (!state.presentation.notes) {
        const url = new URL(window.location.toString());
        const params = new URLSearchParams(url.search.slice(1));
        params.append('display', true);
        url.search = `?${params}`;

        state.presentation.window = window.open(
          url.toString(),
          null,
          'menubar=0,toolbar=0,location=0,dependent=1,fullscreen=1,left-0,top=0',
        );

        const { notesBody, updateNotes } = await import('../presentation');
        const builtNotes = notesBody(state.index, state.current);
        root.parentNode.insertBefore(builtNotes._notes, root);
        root.dataset.hidden = true;
        root.parentNode.dataset.notes = true;
        updateNotes(builtNotes, state.index, state.current);
        builtNotes.total.textContent = length - 1;
        state.presentation.notes = builtNotes;

        // TODO reset notes when popup closed
        // state.presentation.window.addEventListener('unload', () => {
        //   setTimeout(() => {
        //     if (state.presentation.window.closed) {
        //       console.log('Closed!');
        //     }
        //   }, 500);
        //   // store.dispatch('notes', 'toggle');
        // });
      } else {
        root.parentNode.removeChild(state.presentation.notes._notes);
        delete root.dataset.hidden;
        delete root.parentNode.dataset.notes;
        state.presentation.notes = null;
        state.presentation.window.close();
      }
    }

    return state;
  },
  display(state, payload) {
    if (state.display === 'presentation') {
      state.display = 'article';
    } else {
      state.display = 'presentation';
    }

    return state;
  },
  toggle(state, payload) {
    state[payload] = !state[payload];

    return state;
  },
};
