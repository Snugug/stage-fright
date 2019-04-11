export default {
  navigate(state, payload) {
    if (payload === 'next' && state.current.next) {
      state.current = state.current.next;
      state.index = state.index + 1;
    } else if (payload === 'previous' && state.current.previous) {
      state.current = state.current.previous;
      state.index = state.index - 1;
    } else if (payload !== 'next' && payload !== 'previous') {
      state.current = payload;
    }

    state.overview = false;

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
    if (state.presentation.request) {
      if (!state.presentation.connection) {
        try {
          const connection = await state.presentation.request.start();
          state.presentation.connection = connection;

          // Need a way to reverse this
          const { notesBody, updateNotes, advancePresentation } = await import('../presentation');
          const builtNotes = notesBody();
          root.parentNode.insertBefore(builtNotes._notes, root);
          root.dataset.hidden = true;
          root.parentNode.dataset.notes = true;

          updateNotes(builtNotes, state.index, state.current);
          builtNotes.total.textContent = length - 1;
          state.presentation.notes = builtNotes;
        } catch (e) {
          console.log(e);
          console.error('There was an error establishing a connection');
        }
      } else {
        root.parentNode.removeChild(state.presentation.notes._notes);
        delete root.dataset.hidden;
        delete root.parentNode.dataset.notes;
        state.presentation.connection.terminate();
        state.presentation.connection = null;
        state.presentation.notes = null;
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
