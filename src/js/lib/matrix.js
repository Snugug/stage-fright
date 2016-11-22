import {nodeMap} from './helpers';

export default class {
  constructor(options) {

    this._raw = {
      stage: document.querySelector('._stage'),
      groups: document.querySelectorAll('._stage--group'),
      slides: document.querySelectorAll('._stage--slide'),
    };

    this._slides = nodeMap(this._raw.groups, group => {
      const slides = group.querySelectorAll('._stage--slide');

      return nodeMap(slides, slide => {
        const fragments = slide.querySelectorAll('.fragment');

        if (fragments.length === 0) {
          return slide;
        }

        return [slide].concat(nodeMap(fragments, f => f));
      });
    });
  }

  get slides() {
    return this._slides;
  }

  get stage() {
    return this._raw.stage;
  }
}
