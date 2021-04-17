import { IQueue, Queue } from "./Queue";
import { GeoFeatures } from "./interfaces";

export class PinMarker {
  jsonData: GeoFeatures;
  queue: IQueue<any>;
  constructor(geoCoord: GeoFeatures) {
    this.jsonData = geoCoord;
    this.queue = new Queue();
  }
}
