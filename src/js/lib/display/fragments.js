export default function(current) {
  let active = false;

  // Make the current fragment active (only will happen on _next_)
  if (current.type === 'fragment') {
    const dataset = current.elem.dataset;
    if (!dataset.hasOwnProperty('active') || dataset.active === 'false') {
      dataset.active = true;

      let previous = current.previous;

      while (previous && previous.type === 'fragment') {
        previous.elem.dataset.active = true;
        previous = previous.previous;
      }
      
      active = true;
    }  
  }

  // Make the next fragment inactive if we didn't make the current one active
  if (active === false && current.next && current.next.type === 'fragment') {
    delete current.next.elem.dataset.active;
  }
}
