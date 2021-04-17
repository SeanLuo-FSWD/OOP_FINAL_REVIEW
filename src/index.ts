import { CustomizedMap } from "./CustomizedMap";
import { Geo } from "./Geo";
import { PinMarker } from "./PinMarker";

window["initMaps"] = async function () {
  const gmap = new CustomizedMap("map");
  window["gmap"] = gmap;
  const geoObj: Geo = await Geo.build();
  geoObj.geometryList.forEach((geoCoord) => gmap.addPin(geoCoord));

  let PinMarkerList: google.maps.Marker;

  geoObj.geometryList.forEach((geoCoord) => {
    const pin_marker = new PinMarker(geoCoord);
    gmap.addPin(geoCoord);
  });
};
