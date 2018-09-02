class StageFrightNode {
  constructor(item) {
    this.elem = item;
    this.previous = null;
    this.next = null;
    this.first = false;
    this.notes = null;

    if (item.classList.contains('_stage--slide')) {
      this.type = 'slide';

      if (item.parentNode.firstElementChild === item) {
        this.first = true;
      }
    } else if (item.classList.contains('fragment')) {
      this.type = 'fragment';

    }

    const notes = item.querySelector('._stage--notes');
    if (notes) {
      this.notes = notes.innerHTML;
    }
  }
}

export class StageFrightList {
  constructor() {
    this._head = null;
    this._tail = null;
    this._length = 0;

    this._sectionHolder = -1;
    this._depthHolder = 0;
  }

  add(item) {
    const node = new StageFrightNode(item);
    let current = this._head;

    if (node.first) {
      this._sectionHolder++;
      this._depthHolder = 0;
    } else if (node.type !== 'fragment') {
      this._depthHolder++;
    }

    node.section = this._sectionHolder;
    node.depth = this._depthHolder;

    // If there isn't a head, make head, tail, and current our node! then increase the length;
    if (!current) {
      this._head = node;
      this._tail = node;
      this._length++;

      return node;
    }

    // If there is a current, update the tail
    node.previous = this._tail;
    this._tail.next = node;
    this._tail = node;
    this._length++;

    return node;
  }

  find(index) {
    if (index > this._length - 1 || index < 0) {
      return false;
    }

    // First
    if (index === 0) {
      return this._head;
    }

    // Last
    if (index === this._length - 1) {
      return this._tail;
    }

    // Start from the end or the beginning?
    const headToTail = index <= Math.floor(this._length / 2);
    let current = this._head;
    let i = 1;

    if (headToTail) {      
      do {
        current = current.next;
        i++;
      } while (i <= index);
    }
    else {
      current = this._tail;
      i = this._length - 2;

      do {
        current = current.previous;
        i--;
      } while (i >= index);
    }

    return current;
  }

  forEach(cb) {
    let current = this._head;

    while (current.next) {
      cb(current);
      current = current.next;
    }

    cb(current);
  }
}
