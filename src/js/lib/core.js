import Matrix from './matrix';
import init from './init';
import progress from './progress';
import nav from './navigation';

export default function () {
  const matrix = new Matrix();

  init();
  progress(matrix);
  nav(matrix);

  document.body.classList.add('stage-fright');
};
