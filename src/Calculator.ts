import { Person } from "./Person";

class Calculator {
  private static _person: Person;
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

  private static reducer(c, n) {
    const person_lng = Calculator._person.getMarker().getPosition().lng();
    const person_lat = Calculator._person.getMarker().getPosition().lat();

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

    console.log("///////");

    console.log(`c_lng ${c_lng} | c_lat ${c_lat}`);
    console.log(`c_distance ${c_distance}`);
    console.log("----");

    console.log(`n_lng ${n_lng} | n_lat ${n_lat}`);
    console.log(`n_distance ${n_distance}`);
    console.log("///////");

    return c_distance < n_distance ? c : n;
  }

  static findClosest(
    markerList: google.maps.Marker[],
    person: Person
  ): google.maps.Marker {
    Calculator._person = person;
    return markerList.reduce(Calculator.reducer);
  }
}

export { Calculator };
