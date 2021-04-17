import { GeoFeatures } from "./interfaces";
import { PinMarker } from "./PinMarker";
import { PinMarkerList } from "./index";

export class CustomizedMap {
  private googleMap: google.maps.Map;
  private markerList: google.maps.Marker[] = [];
  private patient: string;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(document.getElementById(divId), {
      zoom: 13,
      center: {
        lng: -122.9658755,
        lat: 49.2393853,
      },
    });
  }

  joinAction(lat, lng) {
    // remove the actual google marker, to be re-added with new content
    this.markerList.forEach((marker) => {
      if (
        marker.getPosition().lat() == lat &&
        marker.getPosition().lng() == lng
      ) {
        marker.setMap(null);
        marker = null;
      }
    });

    // Add the new patient to the PinMarker and add to map
    PinMarkerList.forEach((pin_marker) => {
      if (
        pin_marker.jsonData.geometry.y == lat &&
        pin_marker.jsonData.geometry.x == lng
      ) {
        pin_marker.queue.enqueue("derek");
        this.addPin(pin_marker);
      }
    });
  }

  newPatient(name: string): void {
    this.patient = name;

    // add the new patient in center of map
    const lng = -122.9658755;
    const lat = 49.2393853;

    let marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
      icon: "http://maps.google.com/mapfiles/kml/shapes/man.png",
    });
  }

  addPin(pin_marker: PinMarker): void {
    const { y: lat, x: lng } = pin_marker.jsonData.geometry;

    let marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
    });

    this.markerList.push(marker);

    let queue_list_str = "";

    pin_marker.queue.getStore().forEach((patient) => {
      queue_list_str += `<li>${patient}</li>`;
    });

    marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: `
        <ul>${queue_list_str}</ul>
        <button onclick="window.gmap.joinAction(${marker
          .getPosition()
          .lat()},${marker.getPosition().lng()})">Join here</button>
        `,
      });

      infoWindow.open(this.googleMap, marker);
    });
  }
}
