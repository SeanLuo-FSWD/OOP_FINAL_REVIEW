import { Person } from "./Person";
import { Calculator } from "./Calculator";
import { GeoFeatures } from "./interfaces";
import { Pin } from "./Pin";
import faker from "faker";

export class CustomizedMap {
  private googleMap: google.maps.Map;
  private person: Person | null;
  private pinList: Pin[] = [];

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
      for (let i = 0; i < this.pinList.length; i++) {
        const p = this.pinList[i];
        if (
          this.pinList[i].marker.getPosition().lat() == lat &&
          this.pinList[i].marker.getPosition().lng() == lng
        ) {
          let boundCallback = callback.bind(this);
          boundCallback(this.pinList[i]);
          break;
        }
      }
    } else {
      window.alert("add a person first");
    }
  }

  addInfoWindow(pin: Pin, marker: google.maps.Marker) {
    let queue_list_str = "";

    pin.queue.getStore().forEach((person) => {
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

    marker.addListener("click", () => {
      infoWindow.open(this.googleMap, marker);
    });
    marker["info_window"] = infoWindow;
  }

  addPin(geoCoord: GeoFeatures, capacity = 5) {
    const { y: lat, x: lng } = geoCoord.geometry;
    const store_size = Math.floor(Math.random() * capacity);
    let store_array: string[] = [];
    for (let i = 0; i < store_size; i++) {
      store_array.push(faker.name.firstName());
    }

    const marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
    });

    const pin = new Pin(marker, 5, store_array);
    this.addInfoWindow(pin, marker);
    this.pinList.push(pin);
  }

  autojoin() {
    if (this.person != null) {
      // 1. Find list of places with least wait
      const least_wait_pins = Calculator.findLeastWait(this.pinList);

      // 2. Use the found list above, find the closest
      const closest_pin = Calculator.findClosest(least_wait_pins);

      this.joinAction(
        closest_pin.marker.getPosition().lat(),
        closest_pin.marker.getPosition().lng(),
        this.enqueue
      );
    } else {
      window.alert("add a person first");
    }
  }

  dequeue(pin: Pin): void {
    console.log("dequeue called");
    pin.queue.dequeue();
    this.editInfoWindow(pin);
  }

  editInfoWindow(pin: Pin): void {
    let queue_list_str = "";

    pin.queue.getStore().forEach((person) => {
      queue_list_str += `<li>${person}</li>`;
    });
    pin.marker["info_window"].setContent(`
        <h4>Queue List</h4>
        <ul>${queue_list_str}</ul>
        <div style="display:flex">
        <button onclick="window.gmap.joinAction(${pin.marker
          .getPosition()
          .lat()},${pin.marker.getPosition().lng()}, 
          window.gmap.enqueue
        )">Join here</button>
        <button onclick="window.gmap.joinAction(${pin.marker
          .getPosition()
          .lat()},${pin.marker.getPosition().lng()}, 
          window.gmap.dequeue
        )">Dequeue</button>
        </div>
          <p>Latitude: ${pin.marker.getPosition().lat()}</p>
          <p>Longitude: ${pin.marker.getPosition().lng()}</p>
        `);
  }

  enqueue(pin: Pin): void {
    const person_name = this.person.getName();
    pin.queue.enqueue(person_name);
    pin.marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    this.editInfoWindow(pin);
    this.person.getMarker().setMap(null);
  }

  getPerson() {
    return this.person;
  }

  newPerson(name: string): void {
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
