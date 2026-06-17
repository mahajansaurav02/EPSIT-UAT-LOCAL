import React, { useState, useEffect } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
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
import { emailValidationSchema } from "../../../../Validations/yupValidations";
import { filterOnlyLettersNumbersAndSpaces } from "../../../../Validations/utils";

const UserContactForeign = ({
  foreignContactDetails,
  setForeignContactDetails,
  setIsValid,
  isEdit,
  isReset,
}) => {
  const [signatureError, setSignatureError] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [editFields, setEditFields] = useState(false);

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: emailValidationSchema,
      })
    ),
    defaultValues: { email: "" },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReset = () => {
    setEditFields(false);
    reset();
    setForeignContactDetails({
      ...foreignContactDetails,
      mobile: "",
      email: "",
      emailOTP: "yes",
      signatureName: "",
      signatureSrc: "",
    });
  };

  const handleForrignContactDetails = (e) => {
    const { name, value } = e?.target;
    setForeignContactDetails({ ...foreignContactDetails, [name]: value });
  };

  const handleSignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setSignatureError("अपलोड स्वाक्षरी साइज 256kb च्या वर आहे");
        setForeignContactDetails({
          ...foreignContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
      } else {
        setSignatureError("");
        const reader = new FileReader();
        reader.onloadend = () => {
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
    if (isEdit) {
      setEditFields(true);
      setValue("email", foreignContactDetails?.email);
    }
  }, [isEdit]);

  useEffect(() => {
    // if (isReset) {
    handleReset();
    // }
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserForeignContact: trigger,
    }));
  }, [trigger, setIsValid]);

  return (
    <>
      <Grid item md={12} mt={3} mb={2}>
        <h4 className="heading">वापरकर्त्याचा संपर्क</h4>
      </Grid>

      {editFields && (
        <Grid item md={12} mt={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            अर्जदाराच्या संपर्कात बदल करा
          </Button>
        </Grid>
      )}

      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={10}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>मोबाईल </b>
                </InputLabel>
                {editFields ? (
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    value={foreignContactDetails?.mobile}
                    size="small"
                  />
                ) : (
                  <TextField
                    className="textfield"
                    fullWidth
                    value={foreignContactDetails?.mobile}
                    name="mobile"
                    type="number"
                    size="small"
                    inputProps={{
                      maxLength: 13,
                    }}
                    error={errors.mobile}
                    onChange={handleForrignContactDetails}
                  />
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {editFields ? (
                <>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>ई मेल </b>
                    </InputLabel>
                    <TextField
                      className="textfieldDisabled"
                      disabled
                      fullWidth
                      value={foreignContactDetails?.email}
                      size="small"
                    />
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>ओ. टी. पी </b>
                    </InputLabel>
                    <TextField
                      className="textfieldDisabled"
                      disabled
                      fullWidth
                      value={
                        foreignContactDetails?.emailOTP == "yes"
                          ? "Verified"
                          : "Not Verified"
                      }
                      size="small"
                    />
                  </Grid>
                </>
              ) : (
                <>
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
                            className="textfield"
                            fullWidth
                            value={foreignContactDetails?.email}
                            name="email"
                            size="small"
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
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {foreignContactDetails?.email.length > 3 && (
                                    <Button size="small" variant="contained">
                                      ओ. टी. पी पाठवा
                                    </Button>
                                  )}
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
                  {foreignContactDetails?.email.length > 3 && (
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>ओ. टी. पी</b>
                      </InputLabel>
                      <TextField
                        className="textfield"
                        fullWidth
                        value={emailOTP}
                        name="emailOTP"
                        size="small"
                        // onChange={(e) => handleForrignContactDetails(e)}
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
                    </Grid>
                  )}
                </>
              )}
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
              <span>*</span>
            </InputLabel>
            <img
              src={
                foreignContactDetails?.signatureSrc
                  ? foreignContactDetails?.signatureSrc
                  : "/images/signature-placeholder.png"
              }
              alt="signature-img"
              width="195px"
              height="100px"
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadRoundedIcon />}
              fullWidth
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
                अपलोड स्वाक्षरी साइज जास्तीत जास्त 256kb असावी व ती JPG,JPEG,PNG
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
