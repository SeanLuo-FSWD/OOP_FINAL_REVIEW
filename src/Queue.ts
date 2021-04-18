export interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T;
  size(): number;
  getStore(): T[];
  getCapacity(): number;
}

export class Queue<T> implements IQueue<T> {
  private _store: T[] = [];

  constructor(private capacity: number = 5, store: T[]) {
    this._store = store;
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw new Error("Queue has reached limit of " + this.capacity);
    }
    this._store.push(item);
  }

  dequeue(): T {
    console.log("dequeue in pin_marker obj");
    return this._store.shift();
  }

  size(): number {
    return this._store.length;
  }

  getStore(): T[] {
    return this._store;
  }

  getCapacity() {
    return this.capacity;
  }
}
