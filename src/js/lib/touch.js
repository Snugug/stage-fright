import nav from './navigation';

export default function(matrix) {
  const touch = {
    x: {
      start: 0,
      end: 0,
    },
    y: {
      start: 0,
      end: 0,
    },
  };

  const stage = matrix.stage;

  stage.addEventListener('touchstart', e => {
    touch.x.start = e.changedTouches[0].screenX;
    touch.y.start = e.changedTouches[0].screenY;
  }, false);

  stage.addEventListener('touchend', e => {
    touch.x.end = e.changedTouches[0].screenX;
    touch.y.end = e.changedTouches[0].screenY;
    handleGesture();
  }, false);

  function handleGesture() {
    if (touch.x.end < touch.x.start) {
      nav.next(matrix);
    }
    if (touch.x.end > touch.x.start) {
      nav.previous(matrix);
    }

    touch.x.start = 0;
    touch.x.end = 0;
    touch.y.start = 0;
    touch.y.end = 0;
  }
}