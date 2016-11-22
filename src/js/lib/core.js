import Matrix from './matrix';
import init from './init';
import progress from './progress';
import nav from './navigation';
import overview from './overview';

export default function () {
  const matrix = new Matrix();

  init();
  progress(matrix);
  nav(matrix);
  overview(matrix);

  document.body.classList.add('stage-fright');
};
