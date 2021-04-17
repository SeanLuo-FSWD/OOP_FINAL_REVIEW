import { GeoFeatures } from "./interfaces";

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

  addPin(geoCord: GeoFeatures): void {
    const { y: lat, x: lng } = geoCord.geometry;
    const marker = new google.maps.Marker({
      map: this.googleMap,
      position: { lat, lng },
    });

    marker.addListener("click", () => {
      const infoWindow = new google.maps.InfoWindow({
        content: "some trashcan info for you",
      });

      infoWindow.open(this.googleMap, marker);
    });
  }
}
