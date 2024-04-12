import React from "react";
import { UserContext } from "../page";
import ProfileActions from "./profileActions";

import { Button } from "@material-tailwind/react";
import { ModalContext } from "./modal";

export default function Profile() {
  const modalContext = React.useContext(ModalContext);
  const userContext = React.useContext(UserContext);

  return (
    <div className="absolute top-3 right-3 bg-white rounded p-4 text-xl">
      <div className="flex justify-end">
        {userContext.userState.userName ? (
          <p className="font-sans text-base">
            Logged in as: <b>{userContext.userState.userName}</b>
          </p>
        ) : (
          <Button
            color="green"
            onClick={() => {
              modalContext.startLogin();
            }}
          >
            Login
          </Button>
        )}
      </div>
      {userContext.userState.loggedIn ? (
        <ProfileActions />
      ) : (
        <p className="font-sans text-sm mt-3">
          log in to begin scoring products!
        </p>
      )}
    </div>
  );
}
