import React, { Suspense, lazy, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter,
  HashRouter,
} from "react-router-dom";
import "./App.css";
import Loader from "./ui/Loader";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OfflineAlert from "./ui/OfflineAlert";

const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const GrievanceCompliance = lazy(
  () => import("./Pages/Admin/GrievanceCompliance"),
);
const SLRDySLRLogin = lazy(() => import("./Pages/Admin/SLRDySLRLogin"));
const SearchByApplicationId = lazy(
  () => import("./Pages/Admin/SupportPages/SearchByApplicationId"),
);
const InwardNoError = lazy(
  () => import("./Pages/Admin/SupportPages/InwardNoError"),
);
const Dashboard = lazy(
  () => import("./Pages/Admin/SupportPages/Dashboard/Dashboard"),
);

const Login = lazy(() => import("./Pages/Login/Login"));
const OpenDashboard = lazy(() => import("./Pages/OpenDashboard/OpenDashboard"));
const UserManualAndFAQ = lazy(() => import("./Pages/FAQ/UserManualAndFAQ"));
const UnderMaintain = lazy(() => import("./Pages/Login/UnderMaintain"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Grievance = lazy(() => import("./ui/Grievances/Grievance"));
const GrievanceForm = lazy(() => import("./ui/Grievances/GrievanceForm"));
const PageNotFound = lazy(() => import("./ui/404/PageNotFound"));

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#EFB036",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#D8A030",
          },
        },
        outlined: {
          backgroundColor: "transparent",
          border: "1px solid #EFB036",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#FBE8B6",
          },
        },
      },
    },
  },
});

function App() {
  const ProtectedRoute = ({ children }) => {
    const loggedUser = sessionStorage.getItem("token");
    return loggedUser ? children : <Navigate to="/login" />;
  };
  const ProtectedRouteAdmin = ({ children }) => {
    const loggedUser = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    return loggedUser && role ? children : <Navigate to="/admin_login" />;
  };

  useEffect(() => {
    const allowedDomains = [
      "localhost",
      "115.124.105.111",
      // "epsit.mahabhumi.gov.in",
    ];
    const currentDomain = window.location.hostname;
    if (!allowedDomains.includes(currentDomain)) {
      window.location.replace("https://115.124.105.111");
      // window.location.replace("https://epsit.mahabhumi.gov.in/");
    } else {
      // console.log("Authorized domain:", currentDomain);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <OfflineAlert />
        <Suspense fallback={<Loader />}>
          <HashRouter>
            <Routes>
              {/*-------------------------------Under-Maintance & Production Testing ---------------*/}
              {/* <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<UnderMaintain />} />
              <Route path="/login2" element={<Login />} /> */}

              {/*----------------------------------Actual Route------------------------------------*/}

              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<OpenDashboard />} />
              <Route path="/faq" element={<UserManualAndFAQ />} />

              <Route path="/register" element={<Register />} />
              <Route path="/admin_login" element={<AdminLogin />} />
              <Route
                path="/admin_login/grievance-compliance"
                element={
                  <ProtectedRouteAdmin>
                    <GrievanceCompliance />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/admin_login/slr_dyslr_login"
                element={
                  // <ProtectedRouteAdmin>
                  <SLRDySLRLogin />
                  // </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/admin_login/grievance-compliance/search-by-app-id"
                element={
                  <ProtectedRouteAdmin>
                    <SearchByApplicationId />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/admin_login/grievance-compliance/inward-no-error"
                element={
                  <ProtectedRouteAdmin>
                    <InwardNoError />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/admin_login/grievance-compliance/dashboard"
                element={
                  <ProtectedRouteAdmin>
                    <Dashboard />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/home/*"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grievances"
                element={
                  <ProtectedRoute>
                    <Grievance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grievances/grievances_form"
                element={
                  <ProtectedRoute>
                    <GrievanceForm />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </HashRouter>
        </Suspense>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
