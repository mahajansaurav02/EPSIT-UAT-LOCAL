import axios from "axios";
import forge from "node-forge";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../ui/Toast";
import URLS from "../URLs/url";

const AxiosInstance = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // // Full URL
  // console.log("Full URL->", window.location.href);

  // // Hostname (e.g., "example.com")
  // console.log("Hostname->", window.location.hostname);

  // // Protocol (e.g., "https:")
  // console.log("Protocol->", window.location.protocol);

  // // Port (e.g., "3000")
  // console.log("Port->", window.location.port);

  // // Host (hostname + port, e.g., "example.com:3000")
  // console.log("Host->", window.location.host);

  // const reqHeaders = {
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  //   Authorization: `Bearer ${token}`,
  //   CallAPIFor: "web",
  // };
  const reqHeaders = {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": `${window.location.hostname}`,
    "Access-Control-Allow-Origin": "*",
    "Content-Security-Policy": "default-src 'self'; base-uri 'self'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    Authorization: `Bearer ${token}`,
    CallAPIFor: "web",
  };
  // "Content-Security-Policy": "default-src",

  const encryptData = (reqData, key, iv) => {
    const stringData = JSON.stringify(reqData);
    const keyBytes = forge.util.decode64(key);
    const ivBytes = forge.util.decode64(iv);

    const cipher = forge.cipher.createCipher("AES-CBC", keyBytes);
    cipher.start({ iv: ivBytes });

    cipher.update(forge.util.createBuffer(stringData, "utf8"));
    cipher.finish();
    const encryptedData = forge.util.encode64(cipher.output.getBytes());
    return encryptedData;
  };

  const decryptData = (encryptedData, base64Key, base64IV) => {
    try {
      const key = forge.util.decode64(base64Key);
      const iv = forge.util.decode64(base64IV);

      if (iv.length !== 16) {
        throw new Error(
          "Invalid IV length. AES-CBC requires an IV of 16 bytes."
        );
      }
      const encryptedBytes = forge.util.decode64(encryptedData);
      const decipher = forge.cipher.createDecipher("AES-CBC", key);
      decipher.start({ iv });
      decipher.update(forge.util.createBuffer(encryptedBytes));
      const isSuccess = decipher.finish();
      if (isSuccess) {
        // console.info(
        //   "decryptDATA->>",
        //   JSON.parse(decipher.output.toString()).Value
        // );
        const data = JSON.parse(decipher.output.toString()).Value;

        // console.info("Decrypted value ->>", data);
        if (data?.Code == "4") {
          sendRequest(
            `${URLS?.BaseURL}/LoginAPIS/logout`,
            "POST",
            null,
            (res) => {
              // setTimeout(() =>  navigate("/login"), 500);
              setTimeout(() => {
                role === null ? navigate("/login") : navigate("/admin_login");
              }, 500);
              sessionStorage.clear();
            },
            (err) => {
              console.error(err);
            }
          );
        }
        return data;
      } else {
        throw new Error("Decryption failed");
      }
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const sendRequest = useCallback(
    async (url, type = "GET", reqData, callback, errorCallback) => {
      if (type === "POST") {
        await axios
          .post(
            url,
            encryptData(
              reqData,
              "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
              "t0tOwviXTieE5SZoh9/hzw=="
            ),
            // reqData,
            {
              headers: reqHeaders,
            }
          )
          .then((response) => {
            // console.info("response->>", response?.data);
            callback(
              decryptData(
                response?.data,
                "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
                "t0tOwviXTieE5SZoh9/hzw=="
              )
            );
          })
          // .then((response) => {
          //   callback(response);
          // })
          .catch((error) => {
            // console.info("error in post->", error);
            // console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
            if (error?.response?.status == 401) {
              errorToast(error?.response?.message);
              setTimeout(() => navigate("/login"), 2500);
              sessionStorage.clear();
            }
          });
      } else if (type === "PUT") {
        await axios
          .put(
            url,
            encryptData(
              reqData,
              "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
              "t0tOwviXTieE5SZoh9/hzw=="
            ),
            // reqData,

            {
              headers: reqHeaders,
            }
          )
          .then((response) => {
            // console.info("response->>", response?.data);
            callback(
              decryptData(
                response?.data,
                "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
                "t0tOwviXTieE5SZoh9/hzw=="
              )
            );
          })
          // .then((response) => {
          //   callback(response);
          // })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
            if (error?.response?.status == 401) {
              navigate("/");
            }
          });
      } else if (type === "GET") {
        await axios
          .get(url, {
            headers: reqHeaders,
          })
          .then((response) => {
            // console.info("response->>", response?.data);
            callback(
              decryptData(
                response?.data,
                "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
                "t0tOwviXTieE5SZoh9/hzw=="
              )
            );
          })
          // .then((response) => {
          //   if (response.data.status === "FAILURE") {
          //     console.log(response);
          //   }
          //   callback(response);
          // })
          .catch((error) => {
            console.log("error", error);
            if (errorCallback) {
              errorCallback(error.response?.data);
            }
            if (error?.response?.status == 401) {
              navigate("/");
            }
          });
      } else if (type === "DELETE") {
        await axios
          .delete(url, {
            headers: reqHeaders,
          })
          .then((response) => {
            // console.info("response->>", response?.data);
            callback(
              decryptData(
                response?.data,
                "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
                "t0tOwviXTieE5SZoh9/hzw=="
              )
            );
          })
          // .then((response) => {
          //   callback(response);
          // })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
            if (error?.response?.status == 401) {
              navigate("/");
            }
          });
      }
    }
    // [token]
  );

  return {
    sendRequest,
  };
};

export default AxiosInstance;
