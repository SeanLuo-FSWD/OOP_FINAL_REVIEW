import { PinMarker } from "./PinMarker";
import { PinMarkerList } from "./index";
import { Person } from "./Person";
import { Calculator } from "./Calculator";

export class CustomizedMap {
  private googleMap: google.maps.Map;
  private markerList: google.maps.Marker[] = [];
  private person: Person | null;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(document.getElementById(divId), {
      zoom: 13,
      center: {
        lng: -122.9658755,
        lat: 49.2393853,
      },
    });
  }

  private joinAction(lat, lng, callback) {
    if (this.person != null) {
      this.markerList.forEach((marker) => {
        if (
          marker.getPosition().lat() == lat &&
          marker.getPosition().lng() == lng
        ) {
          // remove the matched google marker, to be re-added with updated queue
          marker.setMap(null);
          marker = null;

          // Add the new patient to the PinMarker and add to map
          for (let i = 0; i < PinMarkerList.length; i++) {
            if (
              PinMarkerList[i].jsonData.geometry.y == lat &&
              PinMarkerList[i].jsonData.geometry.x == lng
            ) {
              let boundCallback = callback.bind(this);
              boundCallback(PinMarkerList[i]);
              break;
            }
          }
          // PinMarkerList.forEach((pin_marker) => {
          //   if (
          //     pin_marker.jsonData.geometry.y == lat &&
          //     pin_marker.jsonData.geometry.x == lng
          //   ) {
          //     pin_marker.queue.enqueue(this.person.getName());
          //     this.addPin(pin_marker, true);
          //     this.person.getMarker().setMap(null);
          //     // this.person = null;
          //   }
          // });
        }
      });
    } else {
      window.alert("add a person first");
    }
  }

  getPerson() {
    return this.person;
  }

  autojoin() {
    console.log("autojoin person");

    console.log(this.person);

    if (this.person != null) {
      // 1. Find list of places with least wait
      const least_wait_markers = Calculator.findLeastWait(this.markerList);

      // 2. Use the found list above, find the closest
      const closest_marker = Calculator.findClosest(least_wait_markers);

      console.log("autojoin");
      console.log(closest_marker.getPosition().lat());
      console.log(closest_marker.getPosition().lng());

      this.joinAction(
        closest_marker.getPosition().lat(),
        closest_marker.getPosition().lng(),
        this.enqueue
      );
    } else {
      window.alert("add a person first");
    }
  }

  newPatient(name: string): void {
    // add the new patient in center of map
    const lat = 49.2393853;
    const lng = -122.9658755;

    let marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
      icon: "http://maps.google.com/mapfiles/kml/shapes/man.png",
      draggable: true,
    });

    // assign to person
    this.person = new Person(name, marker);

    this.person.getMarker().addListener("click", () => {
      console.log("draggable clicked");

      const infoWindow = new google.maps.InfoWindow({
        content: `
            <p>I am ${this.person.getName()}</p>
        `,
      });

      infoWindow.open(this.googleMap, this.person.getMarker());
    });
  }

  enqueue(pin_marker: PinMarker) {
    const person_name = this.person.getName();
    pin_marker.queue.enqueue(person_name);
    this.addPin(pin_marker, true);
    this.person.getMarker().setMap(null);
  }

  addPin(pin_marker: PinMarker, selected = false): void {
    const { y: lat, x: lng } = pin_marker.jsonData.geometry;
    let marker: google.maps.Marker;

    if (selected) {
      console.log("are you selected?: lat");
      console.log(lat);
      console.log("longitude");
      console.log(lng);

      marker = new google.maps.Marker({
        map: this.googleMap,
        position: { lat, lng },
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });
    } else {
      marker = new google.maps.Marker({
        map: this.googleMap,
        position: { lat, lng },
      });
    }

    this.markerList.push(marker);

    let queue_list_str = "";

    pin_marker.queue.getStore().forEach((patient) => {
      queue_list_str += `<li>${patient}</li>`;
    });

    marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: `
        <ul>${queue_list_str}</ul>
        <div style="display:flex">
        <button onclick="window.gmap.joinAction(${marker
          .getPosition()
          .lat()},${marker.getPosition().lng()}, 
          window.gmap.enqueue
        )">Join here</button>
        <button onclick="window.gmap.joinAction(${marker
          .getPosition()
          .lat()},${marker.getPosition().lng()}, 
          window.gmap.dequeue
        )">Dequeue</button>
        </div>
          <p>Latitude: ${marker.getPosition().lat()}</p>
          <p>Longitude: ${marker.getPosition().lng()}</p>
        `,
      });

      infoWindow.open(this.googleMap, marker);
    });
  }

  dequeue(pin_marker: PinMarker): void {
    pin_marker.queue.dequeue();
    this.addPin(pin_marker);
  }
}
