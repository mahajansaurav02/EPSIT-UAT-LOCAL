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
import { emailValidationSchema } from "../../../Validations/yupValidations";
import { filterOnlyLettersNumbersAndSpaces } from "../../../Validations/utils";

const UserContactForeign = ({
  foreignContactDetails,
  setForeignContactDetails,
  setIsValid,
}) => {
  const [nriContactDetails, setNriContactDetails] = useState({
    mobile: "",
    email: "",
    emailOTP: "yes",
    signatureName: "",
    signatureSrc: "",
  });
  const [signatureError, setSignatureError] = useState("");
  const [emailOTP, setEmailOTP] = useState("");

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: emailValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleForrignContactDetails = (e) => {
    const { name, value } = e?.target;
    setNriContactDetails({ ...nriContactDetails, [name]: value });
    setForeignContactDetails({ ...foreignContactDetails, [name]: value });
  };

  const handleSignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setSignatureError("अपलोड फोटो साइज 256kb च्या वर आहे");
        setNriContactDetails({
          ...nriContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
        setForeignContactDetails({
          ...foreignContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
      } else {
        setSignatureError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setNriContactDetails({
            ...nriContactDetails,
            signatureSrc: reader.result,
            signatureName: file.name,
          });
          setForeignContactDetails({
            ...foreignContactDetails,
            signatureSrc: reader.result,
            signatureName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSignatureError("");
      setNriContactDetails({
        ...nriContactDetails,
        signatureName: "",
        signatureSrc: "",
      });
      setForeignContactDetails({
        ...foreignContactDetails,
        signatureName: "",
        signatureSrc: "",
      });
    }
  };

  const handleEmailOTP = (e) => {
    setEmailOTP(e?.target?.value);
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserForeignContact: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={10}>
            <Grid container>
              <Grid item md={12}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>मोबाईल</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfield"
                    value={nriContactDetails?.mobile}
                    inputProps={{ maxLength: 10 }}
                    name="mobile"
                    placeholder="+1 "
                    onChange={(e) => handleForrignContactDetails(e)}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid item md={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel className="inputlabel">
                            <b>ई मेल </b>
                            <span>*</span>
                          </InputLabel>
                          <TextField
                            fullWidth
                            className="textfield"
                            value={nriContactDetails?.email}
                            name="email"
                            error={errors.email}
                            {...field}
                            // onChange={(e) => {
                            //   field.onChange(e);
                            //   handleForrignContactDetails(e);
                            // }}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              const filteredValue =
                                filterOnlyLettersNumbersAndSpaces(value);
                              field.onChange(filteredValue);
                              handleForrignContactDetails({
                                target: { name, value: filteredValue },
                              });
                            }}
                            onBlur={() => handleBlur("email")}
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
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.email && errors.email.message}
                          </FormHelperText>
                        </>
                      )}
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
                      type="number"
                      size="small"
                      // onChange={(e) => handleForrignContactDetails(e)}
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
                nriContactDetails?.signatureSrc
                  ? nriContactDetails?.signatureSrc
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

export default UserContactForeign;
