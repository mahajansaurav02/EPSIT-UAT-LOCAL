import React, { useState, lazy, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SecuredHeader from "../../ui/SecuredHeader";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Help from "../../ui/Help";
import { Button, Grid, styled } from "@mui/material";

const ApplicationType = lazy(() =>
  import("../Home/ApplicationType/ApplicationType")
);
const ApplicationDetails = lazy(() =>
  import("./ApplicationDetails/ApplicationDetails")
);
const NaBhu = lazy(() => import("./NaBhu/NaBhu"));
const Dast = lazy(() => import("./Dast/Dast"));
const FerFar = lazy(() => import("./Ferfar/Ferfar"));
const MainPatra = lazy(() => import("./MainPatra/MainPatra"));
const CourtDawa = lazy(() => import("./CourtDawa/CourtDawa"));
const Documents = lazy(() => import("./Documents/Documents"));
const SelfDecleration = lazy(() => import("./SelfDecleration/SelfDecleration"));
const Grievance = lazy(() => import("../../ui/Grievances/Grievance"));
const PageNotFound = lazy(() => import("../../ui/404/PageNotFound"));

const drawerWidth = 210;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: 40,
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const SideBar = () => {
  const location = useLocation();
  const isDast = sessionStorage.getItem("isDast");
  const isCourtDawa = sessionStorage.getItem("isCourtDawa");
  const isMainPatra = sessionStorage.getItem("isMainPatra");
  const isAllowPoa = sessionStorage.getItem("allowPoa");
  const [open, setOpen] = useState(true);
  const [showPoa, setShowPoa] = useState(true);

  const ProtectedRoute = ({ children }) => {
    const isApplicationId = sessionStorage.getItem("applicationId");
    return isApplicationId ? (
      children
    ) : (
      <Navigate to="/home/application-type" />
    );
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const clearAppliId = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
  };

  useEffect(() => {
    const checkSessionStorage = () => {
      const allowPoa = sessionStorage.getItem("allowPoa");
      setShowPoa(allowPoa !== "yes");
    };
    checkSessionStorage();
    window.addEventListener("storage", checkSessionStorage);
    return () => {
      window.removeEventListener("storage", checkSessionStorage);
    };
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          color="default"
        >
          <SecuredHeader />
        </AppBar>

        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          PaperProps={{
            style: {
              // backgroundColor: "#157f80",
              backgroundColor: "#c48c55",
              // background: "linear-gradient(to top, #00C5A1, #0078B5)",
              marginTop: 102,
              borderTopRightRadius: 20,
            },
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {/* <Toolbar /> */}

          <Box sx={{ overflow: "auto", mt: 2 }}>
            {location?.pathname != "/home" && (
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={clearAppliId}
                    component={NavLink}
                    to="application-type"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                      };
                    }}
                  >
                    <ListItemText primary="कार्यालय व अर्ज प्रकार" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="application-details"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                        // pointerEvents: "none",
                      };
                    }}
                  >
                    <ListItemText primary="अर्ज/अर्जदाराची माहिती" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="nabhu"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                        pointerEvents: "none",
                      };
                    }}
                  >
                    <ListItemText primary="माहितीफेरफार नोंदी मध्ये परिणाम झालेले न.भू.क्र." />
                  </ListItemButton>
                </ListItem>

                {isDast == "yes" && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to="dast"
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#FFFFFF52" : null,
                          textDecoration: "none",
                          color: "#ffffff",
                          borderRadius: "10px",
                          margin: "4px 8px",
                          // pointerEvents: "none",
                        };
                      }}
                    >
                      <ListItemText primary="दस्त माहिती" />
                    </ListItemButton>
                  </ListItem>
                )}
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="ferfar"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                        // pointerEvents: "none",
                      };
                    }}
                  >
                    <ListItemText primary="फेरफार तपशील" />
                  </ListItemButton>
                </ListItem>

                {isMainPatra == "yes" && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NavLink}
                      // disabled={isAllowPoa === "no"}
                      to="main-patra"
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#FFFFFF52" : null,
                          textDecoration: "none",
                          color: "#ffffff",
                          borderRadius: "10px",
                          margin: "4px 8px",
                          // pointerEvents: "none",
                        };
                      }}
                    >
                      <ListItemText primary="मुखत्यारपत्र माहिती" />
                    </ListItemButton>
                  </ListItem>
                )}

                {isCourtDawa == "yes" && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to="court-dawa"
                      style={({ isActive }) => {
                        return {
                          backgroundColor: isActive ? "#FFFFFF52" : null,
                          textDecoration: "none",
                          color: "#ffffff",
                          borderRadius: "10px",
                          margin: "4px 8px",
                          // pointerEvents: "none",
                        };
                      }}
                    >
                      <ListItemText primary="कोर्ट दावा माहिती" />
                    </ListItemButton>
                  </ListItem>
                )}
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="documents"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                        // pointerEvents: "none",
                      };
                    }}
                  >
                    <ListItemText primary="कागदपत्रे" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="self-decleration"
                    style={({ isActive }) => {
                      return {
                        backgroundColor: isActive ? "#FFFFFF52" : null,
                        textDecoration: "none",
                        color: "#ffffff",
                        borderRadius: "10px",
                        margin: "4px 8px",
                        pointerEvents: "none",
                      };
                    }}
                  >
                    <ListItemText primary="फेरफार अर्ज" />
                  </ListItemButton>
                </ListItem>
              </List>
            )}
          </Box>
        </Drawer>

        <Main open={open}>
          {/* <Toolbar /> */}
          {/* <Help handleDrawerToggle={handleDrawerToggle} open={open} /> */}
          {/* <Grid
            container
            justifyContent="space-between"
            position="sticky"
            top={130}
            // sx={{ backgroundColor: "gray" }}
          >
            <Grid item> */}
          <Button
            variant="contained"
            sx={{
              // bgcolor: "#157f80",
              bgcolor: "#c48c55",
              transform: "translateX(-28px)",
              position: "sticky",
              top: 130,
              width: 27,
              height: 30,
              minWidth: 27,
              minHeight: 30,
            }}
            size="small"
            onClick={handleDrawerToggle}
          >
            {open ? (
              <ArrowBackIosRoundedIcon sx={{ color: "white" }} />
            ) : (
              <MenuRoundedIcon sx={{ color: "white" }} />
            )}
          </Button>
          {/* </Grid>
          </Grid> */}
          <Routes>
            <Route path="application-type" element={<ApplicationType />} />
            {/* <Route path="grievances" element={<Grievance />} /> */}
            <Route
              path="application-details"
              element={
                <ProtectedRoute>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="nabhu"
              element={
                <ProtectedRoute>
                  <NaBhu />
                </ProtectedRoute>
              }
            />
            <Route
              path="dast"
              element={
                <ProtectedRoute>
                  <Dast />
                </ProtectedRoute>
              }
            />
            <Route
              path="ferfar"
              element={
                <ProtectedRoute>
                  <FerFar />
                </ProtectedRoute>
              }
            />
            <Route
              path="main-patra"
              element={
                <ProtectedRoute>
                  <MainPatra />
                </ProtectedRoute>
              }
            />
            <Route
              path="court-dawa"
              element={
                <ProtectedRoute>
                  <CourtDawa />
                </ProtectedRoute>
              }
            />
            <Route
              path="documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="self-decleration"
              element={
                <ProtectedRoute>
                  <SelfDecleration />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="settings/change-user"
              element={
                <ProtectedRoute>    
                  <ChangeUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            /> */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Main>
      </Box>
    </>
  );
};

export default SideBar;
