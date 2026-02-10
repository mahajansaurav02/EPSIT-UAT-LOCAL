import React, { useEffect, useState } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { mobileValidationSchema } from "../../../Validations/yupValidations";
import VerifyOtpInstance from "../../../Instance/VerifyOtpInstance";
import URLS from "../../../URLs/url";
import { errorToast, successToast } from "../../../ui/Toast";
import { filterOnlyLettersNumbersAndSpaces } from "../../../Validations/utils";

const UserContactIndia = ({
  indiaContactDetails,
  setIndiaContactDetails,
  setIsValid,
  setIsMobileNoVerified,
  isMobileNoVerified,
}) => {
  const { sendRequestVerify } = VerifyOtpInstance();
  const [indContactDetails, setIndContactDetails] = useState({
    mobile: "",
    mobileOTP: "yes",
    email: "",
    emailOTP: "yes",
    securityKey: "",
    signatureName: "",
    signatureSrc: "",
  });
  const [signatureError, setSignatureError] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        mobile: mobileValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleIndiaContactDetails = (e) => {
    const { name, value } = e?.target;
    if (name == "mobile") {
      let input = value;
      input = input.replace(/[^0-9]/g, "");
      if (input.length > 10) {
        input = input.slice(0, 10);
      }
      setIndContactDetails({ ...indContactDetails, [name]: input });
      setIndiaContactDetails({ ...indiaContactDetails, [name]: input });
    } else {
      setIndContactDetails({ ...indContactDetails, [name]: value });
      setIndiaContactDetails({ ...indiaContactDetails, [name]: value });
    }
  };
  const handleSignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setSignatureError("File should be less than 256 KB");
        setIndContactDetails({
          ...indContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
        setIndiaContactDetails({
          ...indiaContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
      } else {
        setSignatureError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setIndContactDetails({
            ...indContactDetails,
            signatureSrc: reader.result,
            signatureName: file.name,
          });
          setIndiaContactDetails({
            ...indiaContactDetails,
            signatureSrc: reader.result,
            signatureName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSignatureError("");
      setIndContactDetails({
        ...indContactDetails,
        signatureName: "",
        signatureSrc: "",
      });
      setIndiaContactDetails({
        ...indiaContactDetails,
        signatureName: "",
        signatureSrc: "",
      });
    }
  };

  const sendMobileOtp = () => {
    sendRequestVerify(
      `${URLS?.BaseURL}/ApplicationAPIS/RequestOTPForApp`,
      "POST",
      indContactDetails?.mobile,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
        } else {
          console.error(res?.Message);
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleMobileOTP = (e) => {
    setMobileOTP(e?.target?.value);
  };
  const verifyMobileOtp = () => {
    sendRequestVerify(
      `${URLS?.BaseURL}/ApplicationAPIS/VerifyOTPForApp`,
      "POST",
      {
        mobileno: indContactDetails?.mobile,
        otp: parseInt(mobileOTP),
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setIsMobileVerified(true);
          setIsMobileNoVerified(true);
        } else {
          console.error(res?.Message);
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleEmailOTP = (e) => {
    setEmailOTP(e?.target?.value);
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserIndContact: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={10}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>मोबाईल </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfield"
                        type="number"
                        value={indContactDetails?.mobile}
                        disabled={isMobileNoVerified}
                        name="mobile"
                        size="small"
                        error={errors.mobile}
                        {...field}
                        inputProps={{
                          maxLength: 10,
                          max: 9999999999,
                          onInput: (e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          },
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          handleIndiaContactDetails(e);
                        }}
                        onBlur={() => handleBlur("mobile")}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={sendMobileOtp}
                                disabled={isMobileNoVerified}
                              >
                                ओ. टी. पी पाठवा
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.mobile && errors.mobile.message}
                      </FormHelperText>
                      <FormHelperText>
                        अंक मराठी मध्ये नसावे. Please use english numbers.
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>ओ. टी. पी</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  value={mobileOTP}
                  name="mobileOTP"
                  size="small"
                  disabled={isMobileNoVerified}
                  onChange={(e) => handleMobileOTP(e)}
                  type="number"
                  inputProps={{
                    maxLength: 6,
                    max: 999999,
                    onInput: (e) => {
                      if (e.target.value.length > 6) {
                        e.target.value = e.target.value.slice(0, 6);
                      }
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={verifyMobileOtp}
                          disabled={isMobileNoVerified}
                        >
                          पडताळणी करा
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>खाते सुरक्षा कोड (६ अंकी) </b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  value={indContactDetails?.securityKey}
                  type="number"
                  name="securityKey"
                  inputProps={{
                    maxLength: 6,
                    max: 999999,
                    onInput: (e) => {
                      if (e.target.value.length > 6) {
                        e.target.value = e.target.value.slice(0, 6);
                      }
                    },
                  }}
                  onChange={handleIndiaContactDetails}
                  size="small"
                />
                <FormHelperText>
                  अंक मराठी मध्ये नसावे. Please use english numbers.
                </FormHelperText>
              </Grid>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>ई मेल </b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  value={indContactDetails?.email}
                  name="email"
                  // onChange={handleIndiaContactDetails}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyLettersNumbersAndSpaces(value);
                    handleIndiaContactDetails({
                      target: { name, value: filteredValue },
                    });
                  }}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {/* <Button size="small" variant="contained">
                          ओ. टी. पी पाठवा
                        </Button> */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>ओ. टी. पी</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  value={emailOTP}
                  name="emailOTP"
                  size="small"
                  // onChange={(e) => handleIndiaContactDetails(e)}
                  type="number"
                  onChange={(e) => handleEmailOTP(e)}
                  inputProps={{
                    maxLength: 6,
                    max: 999999,
                    onInput: (e) => {
                      if (e.target.value.length > 6) {
                        e.target.value = e.target.value.slice(0, 6);
                      }
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button size="small" variant="contained">
                          पडताळणी करा
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid
            item
            md={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InputLabel className="inputlabel">
              <b>वापरकर्त्याची स्वाक्षरी </b>
            </InputLabel>
            <img
              src={
                indContactDetails?.signatureSrc
                  ? indContactDetails?.signatureSrc
                  : "/images/signature-placeholder.png"
              }
              alt="signature-img"
              width="160px"
              height="100px"
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadRoundedIcon />}
              fullWidth
              sx={{ mt: 1 }}
            >
              स्वाक्षरी
              <input
                type="file"
                // accept="image/*"
                accept=".jpg,.jpeg,.png"
                hidden
                onChange={handleSignatureFileChange}
              />
            </Button>
            {signatureError ? (
              <p style={{ color: "red", fontSize: "13px", marginTop: 3 }}>
                {signatureError}
              </p>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  marginTop: 3,
                }}
              >
                अपलोड फोटो साइज जास्तीत जास्त 256kb असावी व ती JPG,JPEG,PNG
                स्वरूपात असावी.
              </p>
            )}
            <a
              href="https://www.ilovepdf.com/"
              target="_blank"
              style={{
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              To resize photo click here
            </a>

            {/* <FormHelperText sx={{ color: "red" }}>
              {signatureError && signatureError}
            </FormHelperText> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UserContactIndia;
