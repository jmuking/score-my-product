import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Profile from "./profile";

export default function ProductMap() {
  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoiam11a2luZyIsImEiOiJjbHV1YXczcW8wN3ByMmtvOWdyOG9oeWZ3In0.0n8Ismd2ansbYVSz-UBlqw"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      className="size-full flex flex-col"
    >
      <GeolocateControl position="top-left" />
      <NavigationControl position="top-left" />
      <Profile />
    </Map>
  );
}
