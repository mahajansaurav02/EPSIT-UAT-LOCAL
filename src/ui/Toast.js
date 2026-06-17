import React from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// export const Toast = ({ autoClose = 2000, position = "top-right" }) => {
export const Toast = ({ autoClose = 2000, position = "top-center" }) => {
  return (
    <ToastContainer
      transition={Bounce}
      position={position}
      autoClose={autoClose}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export const successToast = (message) => {
  toast.success(message);
};
export const errorToast = (message) => {
  toast.error(message);
};
export const warningToast = (message) => {
  toast.warning(message);
};
export const infoToast = (message) => {
  toast.info(message);
};
