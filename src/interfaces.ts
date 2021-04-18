export interface GeoFeatures {
  attributes: Object;
  geometry: {
    x: number;
    y: number;
  };
}

export interface iPerson {
  name: string;
  marker: google.maps.Marker;
}
