import { useNavigate } from "react-router-dom";
import URLS from "../URLs/url";
import AxiosInstance from "./AxiosInstance";
import RegistrationInstance from "./RegisterInstance";
import { useCallback } from "react";

export const useLogout = () => {
  const { sendRequest } = AxiosInstance();
  // const { sendRequest } = RegistrationInstance();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const logout = useCallback(() => {
    sendRequest(
      `${URLS?.BaseURL}/LoginAPIS/logout`,
      "POST",
      // token,
      null,
      (res) => {
        {
          role === null ? navigate("/login") : navigate("/admin_login");
        }
        sessionStorage.clear();
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return {
    logout,
  };
};
