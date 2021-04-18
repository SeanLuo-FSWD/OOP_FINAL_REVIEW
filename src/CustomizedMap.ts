import { PinMarker } from "./PinMarker";
import { PinMarkerList } from "./index";
import { Person } from "./Person";
import { Calculator } from "./Calculator";

export class CustomizedMap {
  private googleMap: google.maps.Map;
  private markerList: google.maps.Marker[] = [];
  private person: Person | null;
  private infoWindowList: google.maps.InfoWindow[] = [];

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
    console.log(
      "join Action called, call back is either enqueue() or dequeue()"
    );

    if (this.person != null) {
      this.markerList.forEach((marker) => {
        if (
          marker.getPosition().lat() == lat &&
          marker.getPosition().lng() == lng
        ) {
          for (let i = 0; i < PinMarkerList.length; i++) {
            if (
              PinMarkerList[i].jsonData.geometry.y == lat &&
              PinMarkerList[i].jsonData.geometry.x == lng
            ) {
              let boundCallback = callback.bind(this);
              boundCallback(PinMarkerList[i], marker);
              break;
            }
          }
        }
      });
    } else {
      window.alert("add a person first");
    }
  }

  addInfoWindow(pin_marker: PinMarker, marker: google.maps.Marker) {
    let queue_list_str = "";

    pin_marker.queue.getStore().forEach((person) => {
      queue_list_str += `<li>${person}</li>`;
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <h4>Queue List</h4>
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

    this.infoWindowList.push(infoWindow);

    marker.addListener("click", () => {
      infoWindow.open(this.googleMap, marker);
    });
    marker["info_window"] = infoWindow;
  }

  addPin(pin_marker: PinMarker, selected = false): void {
    const { y: lat, x: lng } = pin_marker.jsonData.geometry;
    let marker: google.maps.Marker;

    marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
    });

    this.addInfoWindow(pin_marker, marker);

    this.markerList.push(marker);
  }

  autojoin() {
    if (this.person != null) {
      // 1. Find list of places with least wait
      const least_wait_markers = Calculator.findLeastWait(this.markerList);

      // 2. Use the found list above, find the closest
      const closest_marker = Calculator.findClosest(least_wait_markers);

      this.joinAction(
        closest_marker.getPosition().lat(),
        closest_marker.getPosition().lng(),
        this.enqueue
      );
    } else {
      window.alert("add a person first");
    }
  }

  dequeue(pin_marker: PinMarker, marker: google.maps.Marker): void {
    console.log("dequeue called");
    pin_marker.queue.dequeue();

    this.editInfoWindow(pin_marker, marker);
  }

  editInfoWindow(pin_marker: PinMarker, marker: google.maps.Marker): void {
    let queue_list_str = "";

    pin_marker.queue.getStore().forEach((person) => {
      queue_list_str += `<li>${person}</li>`;
    });
    marker["info_window"].setContent(`
        <h4>Queue List</h4>
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
        `);
  }

  enqueue(pin_marker: PinMarker, marker: google.maps.Marker): void {
    const person_name = this.person.getName();
    pin_marker.queue.enqueue(person_name);
    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    // this.addPin(pin_marker, true);
    // this.addInfoWindow(pin_marker, marker);
    this.editInfoWindow(pin_marker, marker);
    this.person.getMarker().setMap(null);
  }

  getPerson() {
    return this.person;
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
      const infoWindow = new google.maps.InfoWindow({
        content: `
            <p>I am ${this.person.getName()}</p>
        `,
      });

      infoWindow.open(this.googleMap, this.person.getMarker());
    });
  }
}
