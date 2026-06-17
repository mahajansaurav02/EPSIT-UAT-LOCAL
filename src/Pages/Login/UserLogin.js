import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLanguage } from "../../Redux/slices/LanguageSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  mobileValidationSchema,
  emailValidationSchema,
  otpValidationSchema,
} from "../../Validations/yupValidations";
import RegistrationInstance from "../../Instance/RegisterInstance";
import { errorToast, successToast, Toast } from "../../ui/Toast";
import axios from "axios";
import URLS from "../../URLs/url";

const UserLogin = ({ loginLangage }) => {
  const { sendRequest } = RegistrationInstance();
  const navigate = useNavigate();
  const reduxLang = useSelector(selectLanguage);
  const [lang, setLang] = useState("");
  const [radioVal, setRadioVal] = useState("mobile");
  const [isIndiaResidence, setIsIndiaResidence] = useState("yes");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [emailNri, setEmailnri] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [disableSendOtpBtn, setDisableSendOtpBtn] = useState(false);

  const [timer, setTimer] = useState(0);

  const handleChangeMobile = (e) => {
    let input = e?.target?.value;
    input = input.replace(/[^0-9]/g, "");
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    setMobile(input);
  };
  const handleChangeEmail = (e) => {
    setEmail(e?.target?.value);
  };
  const handleChangeEmailNri = (e) => {
    setEmailnri(e?.target?.value);
  };
  const handleChangeOtp = (e) => {
    setOtp(e?.target?.value);
  };
  const handleIsIndiaResidence = (e) => {
    setIsIndiaResidence(e.target.value);
    setOtp("");
  };
  const handleRadioVal = (e) => {
    setRadioVal(e.target.value);
    setOtp("");
  };

  const getMobileOtp = async () => {
    const result = await trigger("mobile");
    if (result) {
      setDisableSendOtpBtn(true);
      sendRequest(
        `${URLS?.BaseURL}/LoginAPIS/RequestForOTP`,
        "POST",
        {
          DESCRIPTION: mobile,
          VERIFICATIONTYPE: "MOBILENO",
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            setDisableSendOtpBtn(false);
            setShowOtpField(true);
            setTimer(30);
          } else {
            errorToast(res?.Message);
            setDisableSendOtpBtn(false);
          }
        },
        (err) => {
          setDisableSendOtpBtn(false);
          errorToast(err?.Message);
        }
      );
    } else {
      setDisableSendOtpBtn(false);
      errorToast("Please Add Mobile No");
    }
  };

  const getEmailOtp = (type) => {
    let result;
    if (type == "emailNri") {
      result = trigger("emailNri");
    } else {
      result = trigger("email");
    }

    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/LoginAPIS/RequestForOTP`,
        "POST",
        {
          DESCRIPTION: type == "emailNri" ? emailNri : email,
          VERIFICATIONTYPE: "EMAILID",
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            setShowOtpField(true);
          } else {
            errorToast(res?.Message);
          }
        },
        (err) => {
          errorToast(err?.Message);
        }
      );
    } else {
      errorToast("Please Add Email ID");
    }
  };

  const verifyUser = async () => {
    if (isIndiaResidence === "no") {
      const result = await trigger(["emailNri", "otp"]);

      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/VerifyOTP`,
          "POST",
          {
            DESCRIPTION: emailNri,
            VERIFICATIONTYPE: "EMAILID",
            otp: otp,
          },
          (res) => {
            if (res?.Code == "1") {
              sessionStorage.setItem("token", res?.ResponseData?.AccessToken);
              sessionStorage.setItem(
                "userNameMar",
                res?.ResponseData?.userNameMarathi
              );
              sessionStorage.setItem(
                "userNameEng",
                res?.ResponseData?.userNameEnglish
              );
              // successToast(res?.Message);
              navigate("/home");
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Check Email or OTP");
      }
    } else if (radioVal === "email" && isIndiaResidence === "yes") {
      const result = await trigger(["email", "otp"]);

      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/VerifyOTP`,
          "POST",
          {
            DESCRIPTION: email,
            VERIFICATIONTYPE: "EMAILID",
            otp: otp,
          },
          (res) => {
            if (res?.Code == "1") {
              sessionStorage.setItem("token", res?.ResponseData?.AccessToken);
              sessionStorage.setItem(
                "userNameMar",
                res?.ResponseData?.userNameMarathi
              );
              sessionStorage.setItem(
                "userNameEng",
                res?.ResponseData?.userNameEnglish
              );
              // successToast(res?.Message);
              navigate("/home");
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Check Email or OTP");
      }
    } else {
      const result = await trigger(["mobile", "otp"]);

      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/VerifyOTP`,
          "POST",
          {
            DESCRIPTION: mobile,
            VERIFICATIONTYPE: "MOBILENO",
            otp: otp,
          },
          (res) => {
            if (res?.Code == "1") {
              sessionStorage.setItem("token", res?.ResponseData?.AccessToken);
              sessionStorage.setItem(
                "userNameMar",
                res?.ResponseData?.userNameMarathi
              );
              sessionStorage.setItem(
                "userNameEng",
                res?.ResponseData?.userNameEnglish
              );
              // successToast(res?.Message);
              navigate("/home");
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Check Mobile or OTP");
      }
    }
  };

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const {
    control,
    trigger,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        mobile: mobileValidationSchema,
        email: emailValidationSchema,
        emailNri: emailValidationSchema,
        otp: otpValidationSchema,
      })
    ),
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setLang(reduxLang?.lng);
  }, [reduxLang]);
  return (
    <>
      <Toast />
      <Grid item mt={1}>
        <h3>
          {lang === "mar" ? loginLangage?.marathi[0] : loginLangage?.english[0]}
        </h3>
      </Grid>
      {/* <Grid item>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h6" fontSize="14px" fontWeight={600}>
              {lang === "mar"
                ? loginLangage?.marathi[15]
                : loginLangage?.english[15]}
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup
              row
              value={isIndiaResidence}
              onChange={(e) => handleIsIndiaResidence(e)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label={
                  lang === "mar"
                    ? loginLangage?.marathi[16]
                    : loginLangage?.english[16]
                }
              />
              <FormControlLabel
                value="no"
                control={<Radio size="small" />}
                label={
                  lang === "mar"
                    ? loginLangage?.marathi[17]
                    : loginLangage?.english[17]
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        {isIndiaResidence === "yes" && (
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="h6" fontSize="14px" fontWeight={600}>
                {lang === "mar"
                  ? loginLangage?.marathi[1]
                  : loginLangage?.english[1]}
              </Typography>
            </Grid>
            <Grid item>
              <RadioGroup
                row
                value={radioVal}
                onChange={(e) => handleRadioVal(e)}
              >
                <FormControlLabel
                  value="mobile"
                  control={<Radio size="small" />}
                  label={
                    lang === "mar"
                      ? loginLangage?.marathi[2]
                      : loginLangage?.english[2]
                  }
                />
                <FormControlLabel
                  value="email"
                  control={<Radio size="small" />}
                  label={
                    lang === "mar"
                      ? loginLangage?.marathi[3]
                      : loginLangage?.english[3]
                  }
                />
              </RadioGroup>
            </Grid>
          </Grid>
        )}
      </Grid> */}
      <Grid item mb={2}>
        <span>
          {lang === "mar" ? loginLangage?.marathi[4] : loginLangage?.english[4]}
        </span>
      </Grid>
      <Grid item>
        <Grid container flexDirection="column" spacing={2}>
          {isIndiaResidence === "yes" ? (
            <Grid item>
              {radioVal === "mobile" ? (
                <>
                  <InputLabel>
                    <b>
                      {lang === "mar"
                        ? loginLangage?.marathi[5]
                        : loginLangage?.english[5]}
                    </b>
                  </InputLabel>
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        size="small"
                        className="textfield"
                        type="number"
                        {...field}
                        inputProps={{
                          maxLength: 10,
                          max: 9999999999,
                          onInput: (e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          },
                          // sx: {
                          //   "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                          //     {
                          //       display: "none",
                          //     },
                          // },
                        }}
                        value={mobile}
                        onBlur={() => handleBlur("mobile")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeMobile(e);
                        }}
                        placeholder={
                          lang === "mar"
                            ? loginLangage?.marathi[6]
                            : loginLangage?.english[6]
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={getMobileOtp}
                                disabled={disableSendOtpBtn}
                                startIcon={
                                  disableSendOtpBtn ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : null
                                }
                              >
                                {/* {lang === "mar"
                                  ? loginLangage?.marathi[11]
                                  : loginLangage?.english[11]} */}

                                {/* {disableSendOtpBtn ? "Sending..." : "Send OTP"} */}
                                {disableSendOtpBtn
                                  ? lang === "mar"
                                    ? loginLangage?.marathi[18]
                                    : loginLangage?.english[18]
                                  : lang === "mar"
                                  ? loginLangage?.marathi[11]
                                  : loginLangage?.english[11]}
                              </Button>
                            </InputAdornment>
                            // <InputAdornment position="end">
                            //   {timer > 0 ? (
                            //     <Button
                            //       size="small"
                            //       variant="contained"
                            //       disabled
                            //       sx={{ minWidth: 95, display: "flex", gap: 1 }}
                            //     >
                            //       <CircularProgress
                            //         size={18}
                            //         thickness={9}
                            //         value={(timer / 30) * 100}
                            //         variant="determinate"
                            //       />
                            //       {timer} s
                            //     </Button>
                            //   ) : (
                            //     <Button
                            //       size="small"
                            //       variant="contained"
                            //       onClick={getMobileOtp}
                            //     >
                            //       {lang === "mar"
                            //         ? loginLangage?.marathi[11]
                            //         : loginLangage?.english[11]}
                            //     </Button>
                            //   )}
                            // </InputAdornment>
                          ),
                        }}
                        error={errors.mobile}
                        helperText={errors.mobile && errors.mobile.message}
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  <InputLabel>
                    <b>
                      {lang === "mar"
                        ? loginLangage?.marathi[7]
                        : loginLangage?.english[7]}
                    </b>
                  </InputLabel>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        size="small"
                        {...field}
                        value={email}
                        onBlur={() => handleBlur("email")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeEmail(e);
                        }}
                        placeholder={
                          lang === "mar"
                            ? loginLangage?.marathi[8]
                            : loginLangage?.english[8]
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => getEmailOtp("email")}
                              >
                                {lang === "mar"
                                  ? loginLangage?.marathi[11]
                                  : loginLangage?.english[11]}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        error={errors.email}
                        helperText={errors.email && errors.email.message}
                      />
                    )}
                  />
                </>
              )}
            </Grid>
          ) : (
            <Grid item>
              <>
                <InputLabel>
                  <b>
                    {lang === "mar"
                      ? loginLangage?.marathi[7]
                      : loginLangage?.english[7]}
                  </b>
                </InputLabel>
                <Controller
                  name="emailNri"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...field}
                      value={emailNri}
                      onBlur={() => handleBlur("emailNri")}
                      onChange={(e) => {
                        field.onChange(e);
                        handleChangeEmailNri(e);
                      }}
                      placeholder={
                        lang === "mar"
                          ? loginLangage?.marathi[8]
                          : loginLangage?.english[8]
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => getEmailOtp("emailNri")}
                            >
                              {lang === "mar"
                                ? loginLangage?.marathi[11]
                                : loginLangage?.english[11]}
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      error={errors.emailNri}
                      helperText={errors.emailNri && errors.emailNri.message}
                    />
                  )}
                />
              </>
            </Grid>
          )}
          {showOtpField && (
            <Grid item>
              <InputLabel>
                <b>
                  {lang === "mar"
                    ? loginLangage?.marathi[9]
                    : loginLangage?.english[9]}
                </b>
              </InputLabel>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    className="textfield"
                    size="small"
                    type="number"
                    {...field}
                    value={otp}
                    inputProps={{
                      maxLength: 6,
                      max: 999999,
                      onInput: (e) => {
                        if (e.target.value.length > 6) {
                          e.target.value = e.target.value.slice(0, 6);
                        }
                      },
                    }}
                    onBlur={() => handleBlur("otp")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChangeOtp(e);
                    }}
                    placeholder={
                      lang === "mar"
                        ? loginLangage?.marathi[10]
                        : loginLangage?.english[10]
                    }
                    error={errors.otp}
                    helperText={errors.otp && errors.otp.message}
                  />
                )}
              />
            </Grid>
          )}

          {showOtpField && (
            <Grid item width="100%">
              <Button
                variant="contained"
                fullWidth
                onClick={verifyUser}
                disabled={otp?.length < 6}
              >
                {lang === "mar"
                  ? loginLangage?.marathi[12]
                  : loginLangage?.english[12]}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default UserLogin;
