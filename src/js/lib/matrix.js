import {nodeMap} from './helpers';

export default class {
  constructor() {
    const script = document.currentScript.src.split('?');
    const path = script[0];
    let options = {};

    // Script Options
    if (script.length > 1) {
      options = buildOptions(script[1]);
    }

    // Window Options
    if (document.location.search) {
      options = buildOptions(document.location.search.substr(1));
    }

    // console.log(options);

    this._script = path;
    this._options = options;
    this._notes = false;

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

    // Rewrap stage
    const wrapper = document.createElement('div');
    const stage = this._raw.stage;
    wrapper.classList.add('stage-fright');
    stage.parentNode.replaceChild(wrapper, stage);
    wrapper.appendChild(stage);
  }

  get slides() {
    return this._slides;
  }

  get stage() {
    return this._raw.stage;
  }

  get script() {
    return this._script;
  }

  get options() {
    return this._options;
  }

  get notes() {
    return this._notes;
  }

  set notes(note) {
    this._notes = note;
    return note;
  }
}

function buildOptions(opt, existing) {
  let options = existing || {};
  if (opt) {
    const obj = `{"${decodeURI(opt).replace(/&/g, '","').replace(/=/g, '":"')}"}`;
    const opts = JSON.parse(obj, (key, value) => {
      if (parseFloat(value).toString() === value) {
        return parseFloat(value);
      }

      try {
        return JSON.parse(value);
      }
      catch(e) {
        return value;
      }

      return value;
    });

    options = Object.assign(opts, options);
  }


  return options;
}
