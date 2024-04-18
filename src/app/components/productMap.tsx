import Map, {
  NavigationControl,
  GeolocateControl,
  Layer,
  Source,
  MapRef,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
} from "react-map-gl";
import type { FillLayer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Profile from "./profile";
import { useContext, useRef, useState } from "react";
import { ApiContext, createPost, editPost, getPosts } from "../api";
import { ModalContext } from "./modal";
import { MapState, ModalType } from "../types";
import { UserContext } from "./profile";
import React from "react";

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

const defaultMapState: MapState = {
  mapRef: null,
};
export const defaultMapContext = {
  mapState: defaultMapState,
  setMapState: (mapState: MapState) => {},
};
export const MapContext = React.createContext(defaultMapContext);

export default function ProductMap() {
  const mapRef = useRef<MapRef>(null);

  const apiContext = useContext(ApiContext);
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);

  const [mapState, setMapState] = useState(defaultMapState);
  const [hovered, setHovered] = useState<string | number | undefined>();

  const mapRender = () => {
    setMapState({ ...mapState, ...{ mapRef } });
  };

  const canEdit = (features: MapboxGeoJSONFeature[] | undefined) => {
    return features && features.length > 0 && apiContext.apiData.product;
  };

  const featureClick = (evt: MapLayerMouseEvent) => {
    const features = evt?.features;
    if (features && canEdit(features)) {
      const properties = features[0].properties;

      const country = properties;
      const user = userContext.userState.userName;
      const product = apiContext.apiData.product;

      if (product) {
        apiContext.setApiLoading(true);
        getPosts(product, country?.iso_3166_1_alpha_3).then((result) => {
          apiContext.setApiData({
            ...apiContext.apiData,
            ...{ posts: result.posts },
          });

          apiContext.setApiLoading(false);

          modalContext.setModalState({
            ...modalContext.modalState,
            open: true,
            title: `${result.posts.length > 0 ? "Edit" : "Create"} post`,
            modalType: ModalType.EDIT_POST,
            showConfirm: result.posts.length === 0,
            inputData: { country, product },
            confirmAction: (data) => {
              const score = data.score;
              const comment = data.comment;
              const id = data.id;

              if (user && product) {
                const payload = {
                  country: country?.iso_3166_1_alpha_3,
                  product: product?.code,
                  user,
                  score,
                  comment,
                };

                if (!id) {
                  createPost(payload);
                } else {
                  editPost({ ...payload, ...{ id } });
                }
              }
            },
          });
        });
      }
    }
  };

  const mouseMove = (evt: MapLayerMouseEvent) => {
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
  };

  return (
    <MapContext.Provider value={{ mapState, setMapState }}>
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
        onClick={featureClick}
        onMouseMove={mouseMove}
        onRender={mapRender}
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
    </MapContext.Provider>
  );
}
