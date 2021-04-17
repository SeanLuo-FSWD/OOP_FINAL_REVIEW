import { GeoFeatures } from "./interfaces";
// import { Queue } from "./Queue";

export class Geo {
  geometryList: GeoFeatures[] = [];

  public static readonly API_URL =
    "https://gis.burnaby.ca/arcgis/rest/services/OpenData/OpenData3/MapServer/2/query?where=1%3D1&outFields=SHAPE&outSR=4326&f=json";

  private constructor(jsonData) {
    this.geometryList["jsonData"] = jsonData;
    // this.geometryList["queue"] = new Queue();
  }

  static build(): any {
    return Geo.fetchGeometry().then((json) => {
      return new Geo(json);
    });
  }

  static fetchGeometry(): Promise<GeoFeatures[]> {
    return fetch(Geo.API_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => json.features)
      .catch((err) => console.log(err));
  }
}
