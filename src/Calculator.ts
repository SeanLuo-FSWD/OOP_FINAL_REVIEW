import { gmap, PinMarkerList } from "./index";
import { PinMarker } from "./PinMarker";

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

  private static distanceReducer(c, n) {
    //   const person_lng = Calculator._person.getMarker().getPosition().lng();
    //   const person_lat = Calculator._person.getMarker().getPosition().lat();

    const person_lng = gmap.getPerson().getMarker().getPosition().lng();
    const person_lat = gmap.getPerson().getMarker().getPosition().lat();

    const c_lng = c.getPosition().lng();
    const c_lat = c.getPosition().lat();

    const n_lng = n.getPosition().lng();
    const n_lat = n.getPosition().lat();

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

  static findClosest(markerList: google.maps.Marker[]): google.maps.Marker {
    return markerList.reduce(Calculator.distanceReducer);
  }

  // Find the smallest possible queue
  private static waitingReducer(c, n) {
    return c.queue.size() <= n.queue.size() ? c : n;
  }

  static findLeastWait(markerList: google.maps.Marker[]) {
    const marker = PinMarkerList.reduce(Calculator.waitingReducer);
    if (marker.queue.size() == marker.queue.getCapacity()) {
      window.alert("all queues maxed out, please dequeue first");
    } else {
      const smallest_queue = marker.queue.size();

      let smallest_queue_PinMarkerList: PinMarker[] = [];

      // Get all PinMarker that have the smallest queue
      PinMarkerList.forEach((m) => {
        if (m.queue.size() == smallest_queue) {
          smallest_queue_PinMarkerList.push(m);
        }
      });

      let smallest_queue_markerList: google.maps.Marker[] = [];
      // Get the corresponding google marker as a list
      smallest_queue_PinMarkerList.forEach((pm) => {
        markerList.forEach((m) => {
          if (
            pm.jsonData.geometry.x == m.getPosition().lng() &&
            pm.jsonData.geometry.y == m.getPosition().lat()
          ) {
            smallest_queue_markerList.push(m);
          }
        });
      });

      return smallest_queue_markerList;
    }

    return;
  }
}

export { Calculator };
