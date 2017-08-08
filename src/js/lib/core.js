import Matrix from './matrix';
import init from './init';
import progress from './progress';
import keys from './keys';
import touch from './touch';
import overview from './overview';

import {body, timing, notesMessage, slideMessage} from './notes';

export default function () {
  const matrix = new Matrix();

  if (!matrix.options.notes) {
    init();
    progress(matrix);
    keys(matrix);
    touch(matrix);
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

  if (matrix.options.responsive) {
    document.documentElement.style.fontSize = '1.5vw';
  }
};
