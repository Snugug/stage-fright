import buttons from './buttons';
import { buildMinimap, createMinimapLink } from './minimap';
import keys from './navigation/keys';
import autoplay from './autoplay';

export function upgrade(stage, rootNode, start, options) {
  // Add Buttons
  // console.log(options._display);
  if (!options._display) {
    stage._head.elem.prepend(buttons(this.store));
  }

  stage.buildProgress(this.store, createMinimapLink);
  rootNode.parentNode.appendChild(buildMinimap(stage));
  this.goto(start);

  // Set up keyboard navigation
  keys(this.store, options);

  // Set up Autoplay
  autoplay();
}
