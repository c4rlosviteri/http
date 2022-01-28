interface ILRUCacheNode {
  key: string;
  value: any;
  prev: null | ILRUCacheNode;
  next: null | ILRUCacheNode;
}

interface ILRUCache {
  size: number;
  limit: number;
  head: null | ILRUCacheNode;
  tail: null | ILRUCacheNode;
  map: Map<string, any>
  set(key: string, value: any): void;
  get(key: string): null | ILRUCacheNode;
  delete(node: ILRUCacheNode): void;
  forEach(callback: (node: ILRUCacheNode, index: number) => void): void;
}

class LRUCacheNode implements ILRUCacheNode {
  key: string;
  value: any;
  prev: null | ILRUCacheNode;
  next: null | ILRUCacheNode;

  constructor(key: string, value: any, prev: null | ILRUCacheNode = null, next: null | ILRUCacheNode = null) {
    this.key = key;
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class LRUCache implements ILRUCache {
  size: number;
  limit: number;
  head: null | ILRUCacheNode;
  tail: null | ILRUCacheNode;
  map: Map<string, any>

  constructor(limit = 5) {
    this.size = 0;
    this.limit = limit;
    this.head = null;
    this.tail = null;
    this.map = new Map();
  }

  set(key: string, value: any) {
    let existingNode = this.map.get(key);

    if (existingNode) {
      this.delete(existingNode);
      this.size--;
    } else if (this.size === this.limit) {
      this.map.delete(this.tail!.key);
      this.delete(this.tail!)
      this.size--;
    }

    if (!this.head) {
      this.head = this.tail = new LRUCacheNode(key, value);;
    } else {
      let newNode = new LRUCacheNode(key, value, this.tail);
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  get(key: string) {
    let existingNode = this.map.get(key);
    return existingNode ?? null;
  }

  delete(node: ILRUCacheNode) {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }
  
  clear() {
    this.size = 0;
    this.head = null;
    this.tail = null;
    this.map = new Map();
  }

  forEach(callback: (node: ILRUCacheNode, index: number) => void) {
    let node = this.head;
    let counter = 0;
    while (node) {
      callback(node, counter);
      node = node.next;
      counter++;
    }
  }
}
