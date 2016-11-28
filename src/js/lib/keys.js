import nav from './navigation';

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
    else if (e.keyCode === 39) {
      return nav.right(matrix);
    }
    // Up Arrow, Page Up
    else if (e.keyCode === 38 || e.keyCode === 33) {
      return nav.previous(matrix);
    }
    // Down Arrow, Page Down, Spacebar
    else if (e.keyCode === 40 || e.keyCode === 34 || e.keyCode === 32) {
      return nav.next(matrix);
    }
    else {
      return;
    }
  });
}
