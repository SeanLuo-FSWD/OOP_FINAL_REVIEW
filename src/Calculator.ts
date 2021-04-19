import { gmap } from "./index";
import { Pin } from "./Pin";

class Calculator {
  private static squareRoot(num) {
    return Math.sqrt(num);
  }

  private static square(num) {
    return num * num;
  }

  private static distance(x1, y1, x2, y2) {
    return Calculator.squareRoot(
      Calculator.square(x2 - x1) + Calculator.square(y2 - y1)
    );
  }

  private static distanceReducer(c: Pin, n: Pin) {
    const person_lng = gmap.getPerson().getMarker().getPosition().lng();
    const person_lat = gmap.getPerson().getMarker().getPosition().lat();

    const c_lng = c.marker.getPosition().lng();
    const c_lat = c.marker.getPosition().lat();

    const n_lng = n.marker.getPosition().lng();
    const n_lat = n.marker.getPosition().lat();

    // distance for current marker
    const c_distance = Calculator.distance(
      person_lng,
      person_lat,
      c_lng,
      c_lat
    );

    // distance for next marker
    const n_distance = Calculator.distance(
      person_lng,
      person_lat,
      n_lng,
      n_lat
    );

    return c_distance < n_distance ? c : n;
  }

  static findClosest(pinList: Pin[]): Pin {
    return pinList.reduce(Calculator.distanceReducer);
  }

  // Find the smallest possible queue
  private static waitingReducer(c, n) {
    return c.queue.size() <= n.queue.size() ? c : n;
  }

  // markerList: google.maps.Marker[];
  static findLeastWait(pinList: Pin[]) {
    const marker = pinList.reduce(Calculator.waitingReducer);
    if (marker.queue.size() == marker.queue.getCapacity()) {
      window.alert("all queues maxed out, please dequeue first");
    } else {
      const smallest_queue = marker.queue.size();

      let smallest_queue_pinList: Pin[] = [];

      // Get all Pin that have the smallest queue
      pinList.forEach((m) => {
        if (m.queue.size() == smallest_queue) {
          smallest_queue_pinList.push(m);
        }
      });

      return smallest_queue_pinList;
    }

    return;
  }
}

export { Calculator };
