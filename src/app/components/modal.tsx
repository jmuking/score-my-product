import { BaseSyntheticEvent, useEffect } from "react";
import React from "react";
import { UserContext } from "../page";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { ModalState } from "../types";

export const defaultModalState: ModalState = {
  open: false,
  title: "Please confirm",
  text: "Are you sure?",
  cancelText: "Cancel",
  confirmText: "Confirm",
  showCancel: true,
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

  const [textInput, setTextInput] = React.useState("");

  useEffect(() => {
    if (!userContext.userState.loggedIn) {
      modalContext.startLogin();
    }
  }, []);

  const handleClose = () => {
    modalContext.setModalState({ ...modalContext.modalState, open: false });
  };

  return (
    <>
      <Dialog open={modalContext.modalState.open} handler={handleClose}>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            handleClose();
            if (modalContext.modalState.confirmAction)
              modalContext.modalState.confirmAction(textInput);
          }}
        >
          <DialogHeader>{modalContext.modalState.title}</DialogHeader>
          <DialogBody>
            {modalContext.modalState.askForInput ? (
              <Input
                label={modalContext.modalState.text}
                onChange={(event: BaseSyntheticEvent) => {
                  setTextInput(event.target.value);
                }}
              />
            ) : (
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
    </>
  );
}
