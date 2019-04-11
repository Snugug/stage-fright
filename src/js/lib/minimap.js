export function buildMinimap(stage) {
  const minimap = document.createElement('nav');
  minimap.classList.add('minimap');

  stage.forEach(item => {
    if (item.first) {
      const section = document.createElement('div');
      section.classList.add('minimap--section');
      minimap.appendChild(section);
    }

    minimap.lastChild.appendChild(item.progress);
  });

  return minimap;
}

export function createMinimapLink(to, section, depth, fragment = false) {
  const link = document.createElement('a');
  link.classList.add('minimap--slide');
  link.href = `#/${to}`;
  link.innerText = `Section ${section}, Slide ${depth}`;
  link.dataset.fragments = fragment;

  return link;
}
