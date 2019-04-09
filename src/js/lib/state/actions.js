export default {
  navigate(context, payload) {
    if (payload === 'next' || payload === 'previous') {
      context.commit('navigate', payload);
    } else {
      const found = context.stage.find(payload);
      context.commit('navigate', found);
      context.commit('index', payload);
    }

    if (!context.embedded) {
      context.commit('progress', 'toggle');
    }
  },
  notes(context, payload) {
    context.commit('notes', { root: context.root, length: context.stage._length });
  },
  display(context, payload) {
    context.commit('display', payload);
  },
  toggle(context, payload) {
    context.commit('toggle', payload);
  },
};
