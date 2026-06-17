// import React, { useEffect, useState } from "react";
// import { Alert, Snackbar } from "@mui/material";

// const OfflineAlert = () => {
//   const [isOffline, setIsOffline] = useState(!navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOffline(false);
//     const handleOffline = () => setIsOffline(true);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     // Cleanup
//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   return (
//     <Snackbar
//       open={isOffline}
//       anchorOrigin={{ vertical: "top", horizontal: "center" }}
//     >
//       <Alert severity="warning" variant="filled">
//         User is offline. Check your connection.
//       </Alert>
//     </Snackbar>
//   );
// };

// export default OfflineAlert;

// -----------online offline event------------------------------

import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const OfflineAlert = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineAlert(true);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={isOffline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" variant="filled">
          User is offline. Check your connection.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showOnlineAlert}
        autoHideDuration={2500}
        onClose={() => setShowOnlineAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setShowOnlineAlert(false)}
        >
          User is back online!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineAlert;
