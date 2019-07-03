export default {
  navigate(context, payload, options) {
    // console.log(options);
    if (payload === 'next' || payload === 'previous') {
      context.commit('navigate', payload, options[0]);
    } else {
      const found = context.stage.find(payload, options[0]);
      context.commit('navigate', found, options[0]);
      context.commit('index', payload, options[0]);
    }

    if (!context.embedded) {
      context.commit('progress', 'toggle');
    }
  },
  notes(context, payload) {
    // console.log('Notes');
    // console.log(payload);
    context.commit('notes', { root: context.root, length: context.stage._length });
  },
  display(context, payload) {
    context.commit('display', payload);
  },
  toggle(context, payload) {
    context.commit('toggle', payload);
  },
};
