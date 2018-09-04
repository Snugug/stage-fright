export default function(store, opts = {}) {
  document.addEventListener('keydown', (e) => {
    if (store.state.display === 'presentation' && !e.target.classList.contains('btns--btn')) {
      const whereto = spaceMove(e);
      if (whereto) {
        if (whereto !== 'notes') {
          store.dispatch('navigate', whereto);    
        } else {
          store.dispatch('notes', 'toggle');
        }
      }  
    }
  });
}

function spaceMove(e) {
  // Shift + Spacebar
  if (e.shiftKey === true && e.keyCode === 32) {
    return 'previous';
  }

  // Spacebar
  if (e.keyCode === 32) {
    return 'next';
  }

  // S + CMD + Shift key
  if (e.keyCode === 83 && e.metaKey === true && e.shiftKey === true) {
    return 'notes';
  }

  return false;
}
