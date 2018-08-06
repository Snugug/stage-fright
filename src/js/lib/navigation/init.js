export default function(max) {
  const starter = new URL(window.location);
  let pos = 0;

  if (starter.hash) {
    pos = parseInt(starter.hash.split('/')[1]);
  }

  if (pos < 0) {
    pos = 0;
  } else if (pos > max) {
    pos = max;
  }

  return pos;
}
