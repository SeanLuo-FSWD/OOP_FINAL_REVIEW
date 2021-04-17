import { CustomizedMap } from "./CustomizedMap";
import { Geo } from "./Geo";

window["initMaps"] = async function () {
  const map = new CustomizedMap("map");
  const geoObj: Geo = await Geo.build();
  geoObj.geometry.forEach((geoCoord) => map.addPin(geoCoord));
};
