import { notesBody, buildNotesPreviewLink, updateNotes, advancePresentation } from '../presentation';

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

    return state;
  },
  index(state, payload) {
    state.index = payload;

    return state;
  },
  progress(state, payload) {
    // Only works going forward or direct, need to figure out different option for going backwards
    if (payload.progress[payload.index]) {
      // Remove current active state
      delete state.progress.dataset.active;

      state.progress = payload.progress[payload.index];

      state.progress.dataset.active = true;
    }

    if (payload.progress[payload.index + 1]) {
      state.progress.style.opacity = 1;
    } else {
      // Half works for backwards
      state.progress.style.opacity = .5;
    }
    
    return state;
  },
  async notes(state, root) {
    if (state.presentation.request) {
      if (!state.presentation.connection) {
        try {
          const connection = await state.presentation.request.start();
          state.presentation.connection = connection;

          connection.addEventListener('message', e => {
            console.log(e.data);
            advancePresentation(connection, state.index);
          });

          // Need a way to reverse this
          const builtNotes = notesBody();
          root.parentNode.insertBefore(builtNotes._notes, root);
          root.dataset.hidden = true;
          root.parentNode.dataset.notes = true;

          updateNotes(builtNotes, state.index, state.current);
          state.presentation.notes = builtNotes;

        } catch(e) {
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
  }
}
