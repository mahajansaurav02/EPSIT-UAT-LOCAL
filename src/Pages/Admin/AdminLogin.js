import { useEffect, useState } from "react";
import Header from "../../ui/Header";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import RegistrationInstance from "../../Instance/RegisterInstance";
import URLS from "../../URLs/url";
import { errorToast, Toast } from "../../ui/Toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { sendRequest } = RegistrationInstance();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: "",
    password: "",
  });
  const [disableBtn, setDisableBtn] = useState(false);
  const [loginUserType, setLoginUserType] = useState("dept");
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);

  const [officerLogin, setOfficerLogin] = useState({
    division: {},
    district: {},
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setUser({ ...user, [name]: value });
  };

  const handleAdminLogin = () => {
    setDisableBtn(true);
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/LoginGrievanceUser`,
      "POST",
      // {
      //   username: user?.userId,
      //   password: user?.password,
      // },
      {
        username: user?.userId,
        password: user?.password,
        loginType: "1",
        district_code: "",
        region_code: "",
      },
      (res) => {
        if (res?.Code == "1") {
          sessionStorage.setItem("token", res?.ResponseData?.AccessToken);
          sessionStorage.setItem("role", res?.ResponseData?.usertype);
          sessionStorage.setItem("userNameMar", res?.ResponseData?.division);
          sessionStorage.setItem("userNameEng", res?.ResponseData?.division);
          setDisableBtn(false);
          navigate("/admin_login/grievance-compliance");
        } else {
          errorToast(res?.Message);
          setDisableBtn(false);
        }
      },
      (err) => {
        errorToast(err?.Message);
        setDisableBtn(false);
      }
    );
  };

  //------------------------------------SLR / Deputy Login--------------------------------
  const handleUserLoginType = (e) => {
    setLoginUserType(e?.target?.value);
  };
  const handleDivision = async (e) => {
    const { name, value } = e?.target;
    const obj = division.find((v) => v?.region_code == value);
    setOfficerLogin({ ...officerLogin, division: obj });

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/GetDistrictByRegion`,
      "POST",
      e?.target?.value.toString(),
      (res) => {
        setDistrict(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleDistrict = async (e) => {
    const value = e?.target?.value;
    const obj = district.find((v) => v?.district_code == value);
    setOfficerLogin({
      ...officerLogin,
      district:
        value === 0
          ? {
              district_code: 0,
              district_name: "all",
              district_english_name: "all",
            }
          : obj,
    });
  };
  const handleOfficerLogin = async (e) => {
    // console.info("SLR/Deputy Login Payload->>", {
    //   username: "",
    //   password: officerLogin?.password,
    //   loginType: "2",
    //   district_code: officerLogin?.district?.district_code,
    //   region_code: officerLogin?.division?.region_code,
    // });

    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/LoginGrievanceUser`,
      "POST",
      {
        username: "",
        password: officerLogin?.password,
        loginType: "2",
        district_code: officerLogin?.district?.district_code,
        region_code: officerLogin?.division?.region_code,
      },
      (res) => {
        if (res?.Code == "1") {
          sessionStorage.setItem("token", res?.ResponseData?.AccessToken);
          sessionStorage.setItem("role", res?.ResponseData?.usertype);
          sessionStorage.setItem("userNameMar", res?.ResponseData?.division);
          sessionStorage.setItem("userNameEng", res?.ResponseData?.division);
          sessionStorage.setItem(
            "districtCode",
            res?.ResponseData?.district_code
          );
          sessionStorage.setItem(
            "divisionCode",
            res?.ResponseData?.region_code
          );

          // setDisableBtn(false);
          navigate("/admin_login/slr_dyslr_login");
        } else {
          errorToast(res?.Message);
          // setDisableBtn(false);
        }
      },
      (err) => {
        errorToast(err?.Message);
        // setDisableBtn(false);
      }
    );
  };
  const getRegion = async () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/GetRegion`,
      "POST",
      null,
      (res) => {
        setDivision(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    if (loginUserType === "officer") {
      getRegion();
    }
  }, [loginUserType]);
  return (
    <>
      <Toast />
      <Header showSignInBtn={true} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: "url('/images/Dji_drone.jpg')",
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <Grid item md={4} zIndex={2}>
          <Paper elevation={2} sx={{ borderRadius: 5, pt: 2, mb: 2, pb: 2 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item md={12}>
                <img
                  src="/images/epsit.png"
                  alt="GovtMaha_logo"
                  width={160}
                  height={70}
                />
              </Grid>

              <Grid item md={12}>
                {/* <InputLabel className="inputlabel">
                  <b>फेरफारासाठी मिळकत </b>
                </InputLabel> */}
                <RadioGroup
                  row
                  onChange={handleUserLoginType}
                  value={loginUserType}
                >
                  <FormControlLabel
                    value="dept"
                    control={<Radio size="small" />}
                    label="Admin Login"
                  />
                  <FormControlLabel
                    value="officer"
                    control={<Radio size="small" />}
                    label="Officer's Login"
                  />
                </RadioGroup>
              </Grid>
              {loginUserType == "dept" ? (
                <Grid item md={12}>
                  <Grid container spacing={1} flexDirection="column">
                    <Grid item md={12}>
                      <InputLabel>
                        <b>user id</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        className="textfield"
                        name="userId"
                        value={user?.userId}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={12}>
                      <InputLabel>
                        <b>password</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        type="password"
                        className="textfield"
                        name="password"
                        value={user?.password}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={12}>
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={handleAdminLogin}
                        disabled={disableBtn}
                        startIcon={
                          disableBtn ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : null
                        }
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item md={12}>
                  <Grid container spacing={1} flexDirection="column">
                    <Grid item md={12}>
                      <InputLabel className="inputlabel">
                        <b>विभाग </b>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={officerLogin?.division?.region_code}
                        className="textfield"
                        displayEmpty
                        onChange={handleDivision}
                      >
                        {Array.isArray(division) &&
                          division
                            .filter((v) => v.region_code !== 7)
                            .map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.region_code + i}
                                  value={val?.region_code}
                                >
                                  {val?.region_name}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </Grid>
                    <Grid item md={12}>
                      <InputLabel className="inputlabel">
                        <b>जिल्हा </b>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={officerLogin?.district?.district_code}
                        className="textfield"
                        displayEmpty
                        onChange={handleDistrict}
                      >
                        <MenuItem value={0}>संपूर्ण जिल्हे</MenuItem>
                        {Array.isArray(district) &&
                          district.map((val, i) => {
                            return (
                              <MenuItem
                                key={val?.district_code + i}
                                value={val?.district_code}
                              >
                                {val?.district_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </Grid>
                    <Grid item md={12}>
                      <InputLabel>
                        <b>password</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        size="small"
                        type="password"
                        className="textfield"
                        name="password"
                        value={officerLogin?.password}
                        onChange={(e) =>
                          setOfficerLogin({
                            ...officerLogin,
                            password: e?.target?.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item md={12}>
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={handleOfficerLogin}
                        // disabled={disableBtn}
                        startIcon={
                          disableBtn ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : null
                        }
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper
            elevation={2}
            sx={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
          >
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            ></Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminLogin;
