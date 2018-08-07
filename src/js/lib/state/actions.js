export default {
  navigate(context, payload) {
    if (payload === 'next' || payload === 'previous') {
      context.commit('navigate', payload);  
    } else {
      const found = context.stage.find(payload);
      context.commit('navigate', found);
      context.commit('index', payload);
    }

    context.commit('progress', { index: context.state.index, progress: context.progress, length: context.stage._length - 1 });
  },
}
