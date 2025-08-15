// Module for creating map

var MAP;

export function getOrCreateMap() {
  if (MAP === undefined) {
    let latCoord = 40.76;
    let lonCoord = -73.98;
    let zoomLevel = 12;

    let map = L.map("map", {
      zoomControl: false
    }).setView([latCoord, lonCoord], zoomLevel);

    // Remove map text attribution overlay
    map.attributionControl.setPrefix(false);

    MAP = map;
  }

  return MAP;
}
