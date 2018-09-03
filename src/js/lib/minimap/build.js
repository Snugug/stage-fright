export default function(stage) {
  const minimap = document.createElement('nav');
  minimap.classList.add('minimap');
  const minimapList = [];

  let i = 0;

  stage.forEach(item => {
    if (item.first) {
      minimap.appendChild(createSection());
    }

    if (item.type === 'slide') {
      const fragment = item.hasOwnProperty('fragment');

      const link = createLink(i, item.section, item.depth, fragment);

      minimapList[i] = link;

      minimap.lastChild.appendChild(link);
    } else {
      minimapList[i] = minimapList[i - 1];
    }

    i++;
  });

  return { map: minimap, list: minimapList };
}

function createSection() {
  const section = document.createElement('div');
  section.classList.add('minimap--section');

  return section;
}

function createLink(to, section, depth, fragment = false) {
  const link = document.createElement('a');
  link.classList.add('minimap--slide');
  link.href = `#/${to}`;
  link.setAttribute('tabindex', -1);
  link.innerText = `Section ${section}, Slide ${depth}`;
  link.dataset.fragments = fragment;

  return link;
}
