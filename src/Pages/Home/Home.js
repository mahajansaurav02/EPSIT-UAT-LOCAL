import React, { lazy } from "react";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
const HomeApplication = lazy(() => import("../Home/HomeApplication"));
const Home = () => {
  const location = useLocation();
  return (
    <>
      {location?.pathname == "/home" && <HomeApplication />}
      {location?.pathname != "/home" && <SideBar />}
    </>
  );
};

export default Home;
