import React, { useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { indigo } from "@mui/material/colors";
import LanguageSelector from "./LanguageSelector";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguage } from "../Redux/slices/LanguageSlice";
import RegistrationInstance from "../Instance/RegisterInstance";
import URLS from "../URLs/url";
import AxiosInstance from "../Instance/AxiosInstance";
import { useLogout } from "../Instance/Logout";

const SecuredHeader = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const reduxLang = useSelector(selectLanguage);
  const { logout } = useLogout();
  const [lang, setLang] = useState("");
  const navigate = useNavigate();
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  let hour = date.getHours();
  hour = hour % 12 || 12;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = hour >= 12 ? "AM" : "PM";

  const userNameMar = sessionStorage.getItem("userNameMar");
  const userNameEng = sessionStorage.getItem("userNameEng");
  const role = sessionStorage.getItem("role");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentSeconds = new Date().getSeconds();
      const formattedSeconds =
        currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;
      setSeconds(formattedSeconds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setLang(reduxLang?.lng);
  }, [reduxLang]);
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      boxShadow="0px 4px 40px 0px #0000001A"
      paddingLeft={3}
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
          onClick={() => navigate("/home")}
          width={70}
          height={90}
        />
      </Grid>

      <Grid item md={3} textAlign="right">
        <Grid container justifyContent="end" alignItems="center">
          {/* <Grid container justifyContent="space-between" alignItems="center"> */}
          {/* <Grid item>
            <LanguageSelector />
          </Grid> */}

          <Grid item textAlign="left">
            <div
              style={{ fontSize: "0.9em", color: "white" }}
            >{`${hour}.${minutes}.${seconds} ${ampm}`}</div>
            <div
              style={{ fontSize: "0.9em", color: "white" }}
            >{`${day}/${month}/${year}`}</div>
          </Grid>

          <Grid item ml={1}>
            <Grid
              container
              alignItems="center"
              onClick={handleOpenUserMenu}
              sx={{ cursor: "pointer" }}
            >
              <Grid item>
                <IconButton>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      // bgcolor: "#157e7f",
                      bgcolor: "white",

                      // backgroundColor: "transparent",
                      // border: "2px solid white", // White border
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ color: "#865534" }} />
                  </Avatar>
                </IconButton>
              </Grid>

              <Grid item textAlign="left">
                <div
                  style={{ fontSize: "13px", fontWeight: 600, color: "white" }}
                >
                  {lang === "mar" ? userNameMar : userNameEng}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    paddingTop: 5,
                    color: "white",
                  }}
                >
                  {lang === "mar" ? " खाता धारक" : "Account Holder"}
                </div>
              </Grid>

              <Grid item>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ color: "white" }}
                >
                  {/* <ArrowDropDownIcon /> */}
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Menu
              sx={{ mt: "60px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {role === null && (
                <MenuItem onClick={() => navigate("/grievances")}>
                  <Typography textAlign="center">तक्रार</Typography>
                </MenuItem>
              )}
              <MenuItem onClick={() => logout()}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Grid>

          {/* <Grid item>
            <img
              src="/images/bhumiabhilekh_2.png"
              alt="GovtMaha_logo"
              width={70}
              height={70}
              style={{
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
              }}
            />
          </Grid> */}
        </Grid>
      </Grid>

      <Grid item md={1} textAlign="left" alignSelf="baseline">
        <img
          src="/images/bhumiabhilekh_2.png"
          alt="GovtMaha_logo"
          width={115}
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

export default SecuredHeader;
