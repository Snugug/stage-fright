import Matrix from './matrix';
import init from './init';
import progress from './progress';
import keys from './keys';
import overview from './overview';

import {body, timing, notesMessage, slideMessage} from './notes';

export default function () {
  const matrix = new Matrix();

  if (!matrix.options.notes) {
    init();
    progress(matrix);
    keys(matrix);
    overview(matrix);
  }
  else {
    body();
    timing();
    notesMessage();
  }

  if (matrix.options.listen) {
    slideMessage(matrix);
  }

  document.body.classList.add('stage-fright');
  if (matrix.options.responsive) {
    document.body.style.fontSize = '1.5vw';
  }
};
