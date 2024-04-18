import { BaseSyntheticEvent, useEffect } from "react";
import React from "react";
import { UserContext } from "../page";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ModalState, ModalType } from "../types";
import EditPost from "./editPost";
import Login from "./login";

export const defaultModalState: ModalState = {
  open: false,
  title: "Please confirm",
  text: "Are you sure?",
  cancelText: "Cancel",
  confirmText: "Confirm",
  showCancel: true,
  modalType: ModalType.BASIC,
};
const defaultModalContext = {
  modalState: defaultModalState,
  setModalState: (modalState: ModalState) => {},
  startLogin: () => {},
};
export const ModalContext = React.createContext(defaultModalContext);

export default function Modal() {
  const modalContext = React.useContext(ModalContext);
  const userContext = React.useContext(UserContext);

  const [data, setData] = React.useState<any>(
    modalContext.modalState.inputData
  );

  useEffect(() => {
    if (!userContext.userState.loggedIn) {
      modalContext.startLogin();
    }
  }, []);

  const handleClose = () => {
    setData(undefined);

    modalContext.setModalState({
      ...modalContext.modalState,
      ...defaultModalState,
    });
  };

  return (
    <Dialog open={modalContext.modalState.open} handler={handleClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          handleClose();
          if (modalContext.modalState.confirmAction)
            modalContext.modalState.confirmAction(data);
        }}
      >
        <DialogHeader>{modalContext.modalState.title}</DialogHeader>
        <DialogBody>
          {modalContext.modalState.modalType === ModalType.CREATE_POST && (
            <EditPost data={data} setData={setData} />
          )}

          {modalContext.modalState.modalType === ModalType.LOGIN && (
            <Login setData={setData} />
          )}

          {modalContext.modalState.modalType === ModalType.BASIC && (
            <p>{modalContext.modalState.text}</p>
          )}
        </DialogBody>
        <DialogFooter>
          {modalContext.modalState.showCancel && (
            <Button
              variant="text"
              color="red"
              onClick={handleClose}
              className="mr-1"
            >
              <span>{modalContext.modalState.cancelText}</span>
            </Button>
          )}
          <Button variant="gradient" color="green" type="submit">
            <span>{modalContext.modalState.confirmText}</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
