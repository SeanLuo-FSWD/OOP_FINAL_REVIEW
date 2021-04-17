import { GeoFeatures } from "./interfaces";

declare global {
  interface Window {
    MyNamespace: any;
  }
}

window.MyNamespace = window.MyNamespace || {};

export class CustomizedMap {
  private googleMap: google.maps.Map;
  constructor(divId: string) {
    this.googleMap = new google.maps.Map(document.getElementById(divId), {
      zoom: 13,
      center: {
        lng: -122.9658755,
        lat: 49.2393853,
      },
    });
  }

  clickAction(lat, lng) {
    console.log("position");
    console.log(lat);
    console.log(lng);
  }

  addPin(geoCoord: GeoFeatures): void {
    const { y: lat, x: lng } = geoCoord.geometry;
    const marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
    });

    marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: `<button onclick="window.gmap.clickAction(${marker
          .getPosition()
          .lat()},${marker.getPosition().lng()})">Click me</button>
        `,
      });

      infoWindow.open(this.googleMap, marker);
    });
  }
}
