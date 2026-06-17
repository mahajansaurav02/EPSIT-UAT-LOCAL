import axios from "axios";
import CryptoJS from "crypto-js";
import { useCallback } from "react";

const LRInstance = () => {
  // local
  const reqHeaders = {
    Authorization: `Bearer URqyR0fRlC3B9dxaAlTR1Ra31QKZ9HHnVaTPMihixMlbvKnhCJPAtQ3qYPnCKbIB`,
    "API-KEY": `f3c040ae-4264-f1d1-ac58-486e2453`,
    "SECRET-KEY": `9z3g7YaHCzwj4diHacM2Cdt8Cg1FOYVLjh2nOtRjGBz67Ygh3UiYzwcOe5By`,
  };

  // local-sandbox
  //   const reqHeaders = {
  //     Authorization: `Bearer FCk6WvUiq70RKTpnwf0ASuMWl2ki6rXdhCFaaYFOfOhIXNoeC3dL6YnHWwRPS1Jy`,
  //     "API-KEY": `f3c040ae-4264-f1d1-ac58-486e2453`,
  //     "SECRET-KEY": `9z3g7YaHCzwj4diHacM2Cdt8Cg1FOYVLjh2nOtRjGBz67Ygh3UiYzwcOe5By`,
  //   };

  // production
  // const reqHeaders = {
  //   Authorization: `Bearer 0uXCpuv3E1ZDnJRDO7xJiQhHuaM8PjYC71r9BBcnRHWvfMG1JQinb8E4rzCR5Mpa`,
  //   "API-KEY": `e06ae416-d3db-4b7e-8cbd-edc73f6c706a`,
  //   "SECRET-KEY": `ObvLNRgvtbIYe2IC9t3IpzEmclzKEjkqHdjM6iP7ggN76zSoWP9M1pekkdYDEb7c`,
  // };

  const decryptData = (encryptedData, key, iv) => {
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);

    const base64String = atob(encryptedData);

    const decrypted = CryptoJS.AES.decrypt(base64String, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  };

  const sendRequestLR = useCallback(
    async (url, type = "GET", reqData, callback, errorCallback) => {
      if (type === "POST") {
        await axios
          .post(url, reqData, {
            headers: reqHeaders,
          })
          .then((response) => {
            callback(
              // (key,iv)
              // production
              // Local
              // Local sandbox
              decryptData(
                response?.data?.data,
                // "71r9BBcnRHWvfMG1JQinb8E4rzCR5Mpa",
                // "JQinb8E4rzCR5Mpa"
                "VaTPMihixMlbvKnhCJPAtQ3qYPnCKbIB",
                "CJPAtQ3qYPnCKbIB"
                // "hCFaaYFOfOhIXNoeC3dL6YnHWwRPS1Jy",
                // "C3dL6YnHWwRPS1Jy"
              )
            );
          })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
          });
      } else if (type === "PUT") {
        await axios
          .put(url, reqData, { headers: reqHeaders })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
          });
      } else if (type === "GET") {
        await axios
          .get(url, { headers: reqHeaders })
          .then((response) => {
            if (response.data.status === "FAILURE") {
              console.log(response);
            }
            callback(response);
          })
          .catch((error) => {
            console.log("error", error);
            if (errorCallback) {
              errorCallback(error?.response);
            }
          });
      } else if (type === "DELETE") {
        await axios
          .delete(url, { headers: reqHeaders })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
          });
      }
    }
    // [token]
  );

  return {
    sendRequestLR,
  };
};

export default LRInstance;

// sendRequestLR(
//   `${URLS.BaseURL}/form1a/getForm1AReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
//   "GET",
//   null,
//   (res) => {
//     setTableData();
//     successToast("Data Successfully fetched");
//   }
// );
