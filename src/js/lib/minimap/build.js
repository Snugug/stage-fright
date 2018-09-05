export default function(stage) {
  const minimap = document.createElement('nav');
  minimap.classList.add('minimap');

  stage.forEach(item => {
    if (item.first) {
      minimap.appendChild(createSection());
    }

    minimap.lastChild.appendChild(item.progress);
  });

  return minimap;
}

function createSection() {
  const section = document.createElement('div');
  section.classList.add('minimap--section');

  return section;
}

export function createLink(to, section, depth, fragment = false) {
  const link = document.createElement('a');
  link.classList.add('minimap--slide');
  link.href = `#/${to}`;
  link.innerText = `Section ${section}, Slide ${depth}`;
  link.dataset.fragments = fragment;

  return link;
}
