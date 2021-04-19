import { IQueue, Queue } from "./Queue";
import { GeoFeatures } from "./interfaces";

export class Pin {
  marker: google.maps.Marker;
  queue: IQueue<any>;
  constructor(marker: google.maps.Marker, capacity: number, store: any[]) {
    this.marker = marker;
    this.queue = new Queue(capacity, store);
  }
}
