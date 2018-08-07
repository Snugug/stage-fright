export default function(store, opts = {}) {
  document.addEventListener('keydown', (e) => {
    const whereto = spaceMove(e);
    if (whereto) {
      store.dispatch('navigate', whereto);  
    }
  });
}

function spaceMove(e) {
  if (e.shiftKey === true && e.keyCode === 32) {
    return 'previous';
  }

  if (e.keyCode === 32) {
    return 'next';
  }

  return false;
}
