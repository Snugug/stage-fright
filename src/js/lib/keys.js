import nav from './navigation';
import {openNotes, sendMessage} from './notes';

export default function(matrix) {
  document.addEventListener('keydown', (e) => {
    if (matrix.stage.hasAttribute('data-overlay')) {
      return;
    }

    // Left Arrow
    if (e.keyCode === 37) {
      return nav.left(matrix);
    }

    // Right Arrow
    if (e.keyCode === 39) {
      return nav.right(matrix);
    }

    // Up Arrow, Page Up
    if (e.keyCode === 38 || e.keyCode === 33) {
      return nav.previous(matrix);
    }

    // Down Arrow, Page Down, Spacebar
    if (e.keyCode === 40 || e.keyCode === 34 || e.keyCode === 32) {
      return nav.next(matrix);
    }

    // S
    if (e.keyCode === 83) {
      matrix.notes = openNotes(matrix);
      return matrix;
    }

    return;
  });
}
