// class MinimapNode {
//   constructor(item, link, section, depth, fragments) {
//     this.elem = item;
//     this.section = section;
//     this.depth = depth;
//     this.fragments = fragments;
//     this.link = link;
//     this.next = null;
//     this.previous = null;
//   }
// }

// class MinimapList {
//   constructor() {
//     this._head = null;
//     this._tail = null;
//   }

//   add(item, section, depth, fragments) {
//     const node = new MinimapNode(item, section, depth, fragments);
//     let current = this._head;

//     if (!current) {
//       this._head = node;
//       this._tail = node;

//       return node;
//     }

//     node.previous = this._tail;
//     this._tail.next = node;
//     this._tail = node;

//     return node;
//   }

//   forEach(cb) {
//     let current = this._head;

//     while (current.next) {
//       cb(current);
//       current = current.next;
//     }

//     cb(current);
//   }

//   // find(section, depth) {
//   //   let current = this._head;

//   //   if (current.section === section && current.depth === )

//   //   let i = 0;
//   //   while (current.)
//   // }
// }

export default function(stage) {
  const minimap = document.createElement('nav');
  minimap.classList.add('minimap');
  const minimapList = {};

  let i = 0;

  stage.forEach(item => {
    // console.log()
    if (item.first) {
      minimap.appendChild(createSection());
    }

    if (item.type === 'slide') {
      let fragment = false;
      if (item.next && item.next.type === 'fragment') {
        fragment = true;
      }

      const link = createLink(i, item.section, item.depth, fragment);

      minimapList[i] = link;

      minimap.lastChild.appendChild(link);
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
  if (fragment === true) {
    link.style.opacity = .5;
  }

  return link;
}
