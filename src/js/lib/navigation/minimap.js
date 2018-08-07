export default function(store, slide) {
  return function(e) {
    e.preventDefault();
    store.dispatch('navigate', slide);
  }
}
