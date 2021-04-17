export interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(): T;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private _store: T[] = [];

  constructor(private capacity: number = 5) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw new Error("Queue has reached limit of " + this.capacity);
    }
    this.store.push(item);
  }

  dequeue(): T {
    return this.store.shift();
  }

  size(): number {
    return this.store.length;
  }

  get store() {
    return this._store;
  }
}
