import Map, {
  NavigationControl,
  GeolocateControl,
  Layer,
  Source,
  MapRef,
  MapboxGeoJSONFeature,
  MapLayerMouseEvent,
  GeoJSONSource,
} from "react-map-gl";
import type { FillLayer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Profile from "./profile";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ApiContext,
  createPost,
  editPost,
  getCountries,
  getPosts,
  getScores,
} from "../api";
import { ModalContext } from "./modal";
import { MapState, ModalType, Product } from "../types";
import { UserContext } from "./profile";
import React from "react";
import { features } from "process";

const layerStyle: FillLayer = {
  id: "countries",
  type: "fill",
  paint: {
    "fill-color": {
      property: "score",
      stops: [
        [-1, "rgba(66,100,251, 0.3)"],
        [0, "rgba(224,42,29, 0.7)"],
        [25, "rgba(224,84,29, 0.7)"],
        [50, "rgba(224,156,29, 0.7)"],
        [75, "rgba(224,214,29, 0.7)"],
        [100, "rgba(166,224,29, 0.7)"],
      ],
    },
    "fill-outline-color": "#0000ff",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
  },
};

export const defaultMapState: MapState = {
  mapRef: null,
};
export const defaultMapContext = {
  mapState: defaultMapState,
  setMapState: (mapState: MapState) => {},
  reloadScores: (product: Product) => {},
};
export const MapContext = React.createContext(defaultMapContext);

export default function ProductMap() {
  const mapRef = useRef<MapRef>(null);

  const apiContext = useContext(ApiContext);
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const mapContext = useContext(MapContext);

  const [hovered, setHovered] = useState<string | number | undefined>();

  useEffect(() => {
    getCountries().then((countries) => {
      countries.features = countries.features.map((feature: any) => {
        feature.properties = {
          ...feature.properties,
          ...{ ISO3: `0${feature.properties.ISO}`, score: -1 },
        };

        return feature;
      });

      apiContext.setApiData({ ...apiContext.apiData, ...{ countries } });
    });
  }, []);

  const mapRender = () => {
    mapContext.setMapState({ ...mapContext.mapState, ...{ mapRef } });
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
        getPosts(product, country?.ISO3).then((result) => {
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
                  country: country?.ISO3,
                  product: product?.code,
                  user,
                  score,
                  comment,
                };

                let promise;
                if (!id) {
                  promise = createPost(payload);
                } else {
                  promise = editPost({ ...payload, ...{ id } });
                }

                promise.then(() => {
                  mapContext.reloadScores(product);
                });
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
            id: hovered,
          },
          { hover: false }
        );
      }

      if (features.length > 0) {
        mapRef.current.setFeatureState(
          {
            source: "countries",
            id: features[0].id,
          },
          { hover: true }
        );

        setHovered(features[0].id);
      }
    }
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
      onClick={featureClick}
      onMouseMove={mouseMove}
      onRender={mapRender}
    >
      <Source id="countries" data={apiContext.apiData.countries} type="geojson">
        <Layer {...layerStyle}></Layer>
      </Source>
      <GeolocateControl position="top-left" />
      <NavigationControl position="top-left" />
      <Profile />
    </Map>
  );
}
