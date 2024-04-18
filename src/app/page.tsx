// page.js
"use client";

import React, { useState } from "react";
import { ApiContext, defaultApiData } from "./api";
import Modal, { defaultModalState, ModalContext } from "./components/modal";
import ProductMap from "./components/productMap";
import { ModalType, UserState } from "./types";

const defaultUserState: UserState = {
  loggedIn: false,
};
export const defaultUserContext = {
  userState: defaultUserState,
  setUserState: (userState: UserState) => {},
};
export const UserContext = React.createContext(defaultUserContext);

export default function Home() {
  const [modalState, setModalState] = useState(defaultModalState);
  const [userState, setUserState] = useState(defaultUserState);
  const [apiData, setApiData] = useState(defaultApiData);
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

  return (
    <div className="size-full">
      <UserContext.Provider value={{ userState, setUserState }}>
        <ApiContext.Provider
          value={{ apiData, setApiData, apiLoading, setApiLoading }}
        >
          <ModalContext.Provider
            value={{ modalState, setModalState, startLogin }}
          >
            <ProductMap></ProductMap>
            <Modal></Modal>
          </ModalContext.Provider>
        </ApiContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
