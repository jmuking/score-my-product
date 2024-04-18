import Map, {
  NavigationControl,
  GeolocateControl,
  Layer,
  Source,
  MapRef,
  MapboxGeoJSONFeature,
} from "react-map-gl";
import type { FillLayer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Profile from "./profile";
import { useContext, useRef, useState } from "react";
import { ApiContext, createPost } from "../api";
import { ModalContext } from "./modal";
import { ModalType } from "../types";
import { UserContext } from "../page";

const layerStyle: FillLayer = {
  id: "countries",
  source: "country-boundaries",
  "source-layer": "country_boundaries",
  type: "fill",
  filter: ["==", ["get", "disputed"], "false"],
  paint: {
    "fill-color": "rgba(66,100,251, 0.3)",
    "fill-outline-color": "#0000ff",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
  },
};

export default function ProductMap() {
  const mapRef = useRef<MapRef>(null);

  const apiContext = useContext(ApiContext);
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);

  const [hovered, setHovered] = useState<string | number | undefined>();

  const canEdit = (features: MapboxGeoJSONFeature[] | undefined) => {
    return features && features.length > 0 && apiContext.apiData.product;
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.MAPBOX_API_KEY}
      initialViewState={{
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 2,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      interactiveLayerIds={["countries"]}
      onClick={(evt) => {
        const features = evt?.features;
        if (features && canEdit(features)) {
          const properties = features[0].properties;

          const country = properties;
          const user = userContext.userState.userName;
          const product = apiContext.apiData.product;

          modalContext.setModalState({
            ...modalContext.modalState,
            open: true,
            title: "Create post",
            modalType: ModalType.CREATE_POST,
            inputData: { country, product },
            confirmAction: (data) => {
              const score = data.score;
              const comment = data.comment;

              if (user && product) {
                createPost({
                  country: country?.wikidata_id,
                  product,
                  user,
                  score,
                  comment,
                });
              }
            },
          });
        }
      }}
      onMouseMove={(evt) => {
        const features = evt?.features;
        if (features && mapRef?.current) {
          mapRef.current.getCanvas().style.cursor = canEdit(features)
            ? "pointer"
            : "default";

          if (hovered) {
            mapRef.current.setFeatureState(
              {
                source: "countries",
                sourceLayer: "country_boundaries",
                id: hovered,
              },
              { hover: false }
            );
          }

          if (features.length > 0) {
            mapRef.current.setFeatureState(
              {
                source: "countries",
                sourceLayer: "country_boundaries",
                id: features[0].id,
              },
              { hover: true }
            );

            setHovered(features[0].id);
          }
        }
      }}
    >
      <Source
        id="countries"
        url="mapbox://mapbox.country-boundaries-v1"
        type="vector"
      >
        <Layer {...layerStyle}></Layer>
      </Source>
      <GeolocateControl position="top-left" />
      <NavigationControl position="top-left" />
      <Profile />
    </Map>
  );
}
