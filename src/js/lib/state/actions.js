export default {
  navigate(context, payload) {
    if (payload === 'next' || payload === 'previous') {
      context.commit('navigate', payload);  
    } else {
      const found = context.stage.find(payload);
      context.commit('navigate', found);
      context.commit('updateIndex', payload);
    }
  }
}
