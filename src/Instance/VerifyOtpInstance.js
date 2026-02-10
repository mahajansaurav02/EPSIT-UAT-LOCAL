import axios from "axios";
import forge from "node-forge";
import { useCallback } from "react";

const VerifyOtpInstance = () => {
  const reqHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Security-Policy": "default-src 'self'; base-uri 'self'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

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
        const data = JSON.parse(decipher.output.toString()).Value;
        return data;
      } else {
        throw new Error("Decryption failed");
      }
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const sendRequestVerify = useCallback(
    async (url, type, reqData, callback, errorCallback) => {
      if (type === "POST") {
        await axios
          .post(
            url,
            encryptData(
              reqData,
              "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
              "t0tOwviXTieE5SZoh9/hzw=="
            ),
            {
              headers: reqHeaders,
            }
          )
          .then((response) => {
            callback(
              decryptData(
                response?.data,
                "6XhX8NxtWrlC/NbK3GXoh3TtH9UUt8KmgcuUG0RFEJM=",
                "t0tOwviXTieE5SZoh9/hzw=="
              )
            );
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
    sendRequestVerify,
  };
};

export default VerifyOtpInstance;
