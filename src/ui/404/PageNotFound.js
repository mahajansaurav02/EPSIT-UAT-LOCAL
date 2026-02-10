import { Button, Paper } from "@mui/material";
import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          mt: 20,
        }}
      >
        <h2>Something went wrong !!</h2>

        <Button
          variant="contained"
          startIcon={<HomeRoundedIcon />}
          onClick={goToHomePage}
        >
          होम पेज ला जा
        </Button>
      </Paper>
    </>
  );
};

export default PageNotFound;
