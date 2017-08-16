import nav from './navigation';
import { openNotes } from './notes';

export default function(matrix, opts) {
  const arrowNav = opts.get('navigation.arrows', true);
  const remoteNav = opts.get('navigation.remote', true);
  const spaceNav = opts.get('navigation.spacebar', true);
  const notes = opts.get('notes', true);

  function arrowMove(e) {
    // Left Arrow
    if (e.keyCode === 37) {
      return nav.left(matrix);
    }

    // Right Arrow
    if (e.keyCode === 39) {
      return nav.right(matrix);
    }

    // Up Arrow
    if (e.keyCode === 38) {
      return nav.previous(matrix);
    }

    // Down Arrow
    if (e.keyCode === 40) {
      return nav.next(matrix);
    }
  }

  function spaceMove(e) {
    // Shift + Spacebar
    if (e.shiftKey === true && e.keyCode === 32) {
      return nav.previous(matrix);
    }

    // Spacebar
    if (e.keyCode === 32) {
      return nav.next(matrix);
    }
  }

  function notesOpen(e) {
    // S
    if (e.keyCode === 83) {
      matrix.notes = openNotes(matrix);
      return matrix;
    }
  }

  function modifierScaffold(identifier, action, e) {
    if (identifier === true) {
      action(e);
    }
    else if (identifier === 'ctrl') {
      if (e.ctrlKey) {
        action(e);
      }
    }
    else if (identifier === 'alt') {
      if (e.altKey) {
        action(e);
      }
    }
    else if (identifier === 'meta') {
      if (e.metaKey) {
        action(e);
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (matrix.stage.hasAttribute('data-overlay')) {
      return;
    }

    //////////////////////////////
    // Arrow Navigation
    //////////////////////////////
    modifierScaffold(arrowNav, arrowMove, e);

    //////////////////////////////
    // Remote Navigation
    //////////////////////////////
    if (remoteNav === true) {
      // Page Up
      if (e.keyCode === 33) {
        return nav.previous(matrix);
      }

      // Page Down
      if (e.keyCode === 34) {
        return nav.next(matrix);
      }
    }

    //////////////////////////////
    // Spacebar Navigation
    //////////////////////////////
    modifierScaffold(spaceNav, spaceMove, e);

    //////////////////////////////
    // Activate Notes
    //////////////////////////////
    modifierScaffold(notes, notesOpen, e);

    return;
  });
}
