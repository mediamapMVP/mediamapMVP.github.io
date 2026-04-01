// Module for creating map

var MAP;
var CLUSTER_GROUP;
var FEATURED_CLUSTER_GROUP;

export function getOrCreateMap() {
  if (MAP === undefined) {
    let latCoord = 40.76;
    let lonCoord = -73.98;
    let zoomLevel = 12;

    let map = L.map("map", {
      zoomControl: false,
      maxZoom: 18
    }).setView([latCoord, lonCoord], zoomLevel);

    // Remove map text attribution overlay
    map.attributionControl.setPrefix(false);

    MAP = map;
  }

  return MAP;
}

export function getOrCreateClusterGroup() {
  if (CLUSTER_GROUP === undefined) {
    CLUSTER_GROUP = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
    });
    getOrCreateMap().addLayer(CLUSTER_GROUP);
  }

  return CLUSTER_GROUP;
}

export function getOrCreateFeaturedClusterGroup() {
  if (FEATURED_CLUSTER_GROUP === undefined) {
    FEATURED_CLUSTER_GROUP = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: function(cluster) {
        return L.divIcon({
          html: '<div><span>' + cluster.getChildCount() + '</span></div>',
          className: 'marker-cluster marker-cluster-featured',
          iconSize: L.point(40, 40)
        });
      }
    });
    getOrCreateMap().addLayer(FEATURED_CLUSTER_GROUP);
  }

  return FEATURED_CLUSTER_GROUP;
}
