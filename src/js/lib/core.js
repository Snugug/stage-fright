import Matrix from './matrix';
import init from './init';
import progress from './progress';
import keys from './keys';
import overview from './overview';

export default function () {
  const matrix = new Matrix();

  init();
  progress(matrix);
  keys(matrix);
  overview(matrix);

  document.body.classList.add('stage-fright');
};
