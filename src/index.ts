import { CustomizedMap } from "./CustomizedMap";
import { Geo } from "./Geo";
import { PinMarker } from "./PinMarker";
import faker from "faker";

let PinMarkerList: PinMarker[] = [];
let gmap: CustomizedMap;
window["initMaps"] = async function () {
  gmap = new CustomizedMap("map");
  window["gmap"] = gmap;
  const geoObj: Geo = await Geo.build();
  // geoObj.geometryList.forEach((geoCoord) => gmap.addPin(geoCoord));

  geoObj.geometryList.forEach((geoCoord) => {
    const store_size = Math.floor(Math.random() * 5);
    let store_array: string[] = [];
    for (let i = 0; i < store_size; i++) {
      store_array.push(faker.name.firstName());
    }

    const pin_marker = new PinMarker(geoCoord, 5, store_array);

    PinMarkerList.push(pin_marker);
  });

  PinMarkerList.forEach((pm) => {
    gmap.addPin(pm);
  });
};

export { PinMarkerList, gmap };
