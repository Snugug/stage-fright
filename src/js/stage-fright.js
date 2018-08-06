import StageFright from './lib/init.js';

window.addEventListener('DOMContentLoaded', () => {
  const stage = new StageFright(document.querySelector('._stage'));
  window.stage = stage;
});
