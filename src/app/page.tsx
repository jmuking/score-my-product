// page.js
"use client";

import React, { useContext, useState } from "react";
import { GeoJSONSource } from "react-map-gl";
import { ApiContext, defaultApiData, getScores } from "./api";
import Modal, { defaultModalState, ModalContext } from "./components/modal";
import ProductMap, {
  defaultMapState,
  MapContext,
} from "./components/productMap";
import { defaultUserState, UserContext } from "./components/profile";
import { ModalType, Product } from "./types";

export default function Home() {
  const [modalState, setModalState] = useState(defaultModalState);
  const [userState, setUserState] = useState(defaultUserState);
  const [apiData, setApiData] = useState(defaultApiData);
  const [mapState, setMapState] = useState(defaultMapState);
  const [apiLoading, setApiLoading] = useState(false);

  const startLogin = () => {
    setModalState({
      ...modalState,
      open: true,
      title: "Login",
      confirmText: "Sign in",
      modalType: ModalType.LOGIN,
      showCancel: false,
      confirmAction: (userName) => {
        setUserState({
          ...userState,
          loggedIn: true,
          userName,
        });
      },
    });
  };

  const reloadScores = (product: Product) => {
    getScores(product).then((value) => {
      const countries = { ...apiData.countries };
      countries.features.forEach((feature: any) => {
        feature.properties.score =
          feature.properties.ISO3 in value.scores
            ? value.scores[feature.properties.ISO3]
            : -1;
      });

      setApiData({
        ...apiData,
        ...{ countries, product, scores: value.scores },
      });
      (
        mapState.mapRef?.current?.getSource("countries") as GeoJSONSource
      ).setData(countries);

      setApiLoading(false);
    });
  };

  return (
    <div className="size-full">
      <UserContext.Provider value={{ userState, setUserState }}>
        <ApiContext.Provider
          value={{ apiData, setApiData, apiLoading, setApiLoading }}
        >
          <MapContext.Provider value={{ mapState, setMapState, reloadScores }}>
            <ModalContext.Provider
              value={{ modalState, setModalState, startLogin }}
            >
              <ProductMap></ProductMap>
              <Modal></Modal>
            </ModalContext.Provider>
          </MapContext.Provider>
        </ApiContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
