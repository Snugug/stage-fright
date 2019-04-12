import buttons from './buttons';
import { buildMinimap, createMinimapLink } from './minimap';
import keys from './navigation/keys';
import autoplay from './autoplay';
import { receivePresentationControls } from './presentation';

export function upgrade(stage, rootNode, start, options) {
  // Add Buttons
  stage._head.elem.prepend(buttons(this.store));

  stage.buildProgress(this.store, createMinimapLink);
  rootNode.parentNode.appendChild(buildMinimap(stage));
  this.goto(start);

  // Set up keyboard navigation
  keys(this.store, options);

  // Set up Autoplay
  autoplay();

  // Make sure Presentation Controls work
  receivePresentationControls(this.store);
}
