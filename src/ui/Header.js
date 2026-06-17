import { Button, Grid } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Header = ({ showSignInBtn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      boxShadow="0px 4px 40px 0px #0000001A"
      paddingLeft={3}
      spacing={1}
      bgcolor="#865534"
    >
      <Grid item md={4} textAlign="left" alignSelf="baseline">
        <img
          src="/images/epsit.png"
          alt="GovtMaha_logo"
          width={160}
          height={70}
          style={{
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        />
      </Grid>

      <Grid item md={4} textAlign="center">
        <img
          src="/images/Emblem_new_white.png"
          alt="govt_emblem"
          width={70}
          height={90}
        />
      </Grid>

      <Grid item md={3} textAlign="right">
        <Grid container justifyContent="end" alignItems="center" spacing={1}>
          <Grid item>
            <LanguageSelector />
          </Grid>
          {/* {location?.pathname !== "/admin_login" && (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/admin_login")}
              >
                Admin Login
              </Button>
            </Grid>
          )}
          {!showSignInBtn && (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </Grid>
          )}
          {showSignInBtn && (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/")}
              >
                साइन इन
              </Button>
            </Grid>
          )} */}
          <Grid item>
            <Grid container spacing={1} direction="column" alignItems="center">
              {location?.pathname !== "/admin_login" && (
                <Grid item>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/admin_login")}
                  >
                    Admin Login
                  </Button>
                </Grid>
              )}
              {!showSignInBtn && (
                <Grid item>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                </Grid>
              )}
              {showSignInBtn && (
                <Grid item>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/")}
                  >
                    साइन इन
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={1} textAlign="left" alignSelf="baseline">
        <img
          src="/images/bhumiabhilekh_2.png"
          alt="GovtMaha_logo"
          width={110}
          height={70}
          style={{
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Header;
