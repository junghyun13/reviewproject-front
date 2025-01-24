import React, { useEffect } from "react";

const { kakao } = window;

function MapComponent({ lat, lng }) {
  useEffect(() => {
    if (lat && lng) {
      const mapContainer = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, options);
      new kakao.maps.Marker({ position: map.getCenter(), map: map });
    }
  }, [lat, lng]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
}

export default MapComponent;
