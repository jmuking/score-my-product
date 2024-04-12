// page.js
"use client";

import React, { useState } from "react";
import Modal, { defaultModalState, ModalContext } from "./components/modal";
import ProductMap from "./components/productMap";
import { UserState } from "./types";

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

  const startLogin = () => {
    setModalState({
      ...modalState,
      open: true,
      title: "Login",
      text: "Please enter your username",
      confirmText: "Sign in",
      askForInput: true,
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
        <ModalContext.Provider
          value={{ modalState, setModalState, startLogin }}
        >
          <ProductMap></ProductMap>
          <Modal></Modal>
        </ModalContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
