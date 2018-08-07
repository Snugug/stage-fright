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
    console.log(payload);
    if (payload.progress[payload.index]) {
      // Remove current active state
      delete state.progress.dataset.active;

      state.progress = payload.progress[payload.index];

      state.progress.dataset.active = true;
    }

    if (payload.progress[payload.index + 1]) {
      state.progress.style.opacity = 1;
    }
    
    return state;
  }
}
