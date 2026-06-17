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
import { mobileValidationSchema } from "../../../../Validations/yupValidations";
import { filterOnlyLettersNumbersAndSpaces } from "../../../../Validations/utils";

const UserContactIndia = ({
  isEdit,
  indiaContactDetails,
  setIndiaContactDetails,
  setIsValid,
  isReset,
  isFirstUser,
}) => {
  const [signatureError, setSignatureError] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [editFields, setEditFields] = useState(false);

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        mobile: mobileValidationSchema,
      })
    ),
    defaultValues: { mobile: "" },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReset = () => {
    setEditFields(false);
    reset();
    if (isFirstUser) {
      setValue("mobile", indiaContactDetails?.mobile);
      setIndiaContactDetails({
        ...indiaContactDetails,
        email: "",
        emailOTP: "yes",
        signatureName: "",
        signatureSrc: "",
      });
    } else {
      setIndiaContactDetails({
        ...indiaContactDetails,
        mobile: "",
        email: "",
        emailOTP: "yes",
        signatureName: "",
        signatureSrc: "",
      });
    }
  };
  const handleIndiaContactDetails = (e) => {
    const { name, value } = e?.target;
    setIndiaContactDetails({ ...indiaContactDetails, [name]: value });
  };
  const handleSignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setSignatureError("अपलोड स्वाक्षरी साइज 256kb च्या वर आहे");
        setIndiaContactDetails({
          ...indiaContactDetails,
          signatureName: "",
          signatureSrc: "",
        });
      } else {
        setSignatureError("");
        const reader = new FileReader();
        reader.onloadend = () => {
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
      setIndiaContactDetails({
        ...indiaContactDetails,
        signatureName: "",
        signatureSrc: "",
      });
    }
  };
  const handleMobileOTP = (e) => {
    setMobileOTP(e?.target?.value);
  };
  const handleEmailOTP = (e) => {
    setEmailOTP(e?.target?.value);
  };

  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("mobile", indiaContactDetails?.mobile);
    }
  }, [isEdit]);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserIndContact: trigger,
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
        <Grid container spacing={1}>
          <Grid item md={10}>
            <Grid container spacing={2}>
              {editFields ? (
                <>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>मोबाईल </b>
                    </InputLabel>
                    <TextField
                      className="textfieldDisabled"
                      disabled
                      fullWidth
                      value={indiaContactDetails?.mobile}
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
                        indiaContactDetails?.mobileOTP == "yes"
                          ? "Verified"
                          : "Not Verified"
                      }
                      size="small"
                    />
                  </Grid>
                </>
              ) : (
                <>
                  {isFirstUser ? (
                    <>
                      <Grid item md={4}>
                        <InputLabel className="inputlabel">
                          <b>मोबाईल </b>
                        </InputLabel>
                        <TextField
                          className="textfieldDisabled"
                          disabled
                          fullWidth
                          value={indiaContactDetails?.mobile}
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
                            indiaContactDetails?.mobileOTP == "yes"
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
                          name="mobile"
                          control={control}
                          render={({ field }) => (
                            <>
                              <InputLabel className="inputlabel">
                                <b>मोबाईल </b>
                                <span>*</span>
                              </InputLabel>
                              <TextField
                                className="textfield"
                                fullWidth
                                value={indiaContactDetails?.mobile}
                                name="mobile"
                                type="number"
                                size="small"
                                error={errors.mobile}
                                disabled={isFirstUser}
                                {...field}
                                inputProps={{
                                  maxLength: 10,
                                  max: 9999999999,
                                  onInput: (e) => {
                                    if (e.target.value.length > 10) {
                                      e.target.value = e.target.value.slice(
                                        0,
                                        10
                                      );
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
                                      {indiaContactDetails?.mobile.length >
                                        9 && (
                                        <Button
                                          size="small"
                                          variant="contained"
                                          disabled={isFirstUser}
                                        >
                                          ओ. टी. पी पाठवा
                                        </Button>
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <FormHelperText sx={{ color: "red" }}>
                                {errors.mobile && errors.mobile.message}
                              </FormHelperText>
                            </>
                          )}
                        />
                      </Grid>
                      {indiaContactDetails?.mobile.length > 9 && (
                        <Grid item md={4}>
                          <InputLabel className="inputlabel">
                            <b>ओ. टी. पी</b>
                          </InputLabel>
                          <TextField
                            className="textfield"
                            fullWidth
                            value={mobileOTP}
                            name="mobileOTP"
                            size="small"
                            onChange={(e) => handleMobileOTP(e)}
                            disabled={isFirstUser}
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
                                    disabled={isFirstUser}
                                  >
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
                </>
              )}
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
                      value={indiaContactDetails?.email}
                      size="small"
                    />
                  </Grid>
                  {/* <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>ओ. टी. पी </b>
                    </InputLabel>
                    <TextField
                      className="textfieldDisabled"
                      disabled
                      fullWidth
                      value={
                        indiaContactDetails?.emailOTP == "yes"
                          ? "Verified"
                          : "Not Verified"
                      }
                      size="small"
                    />
                  </Grid> */}
                </>
              ) : (
                <>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>ई मेल</b>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      fullWidth
                      value={indiaContactDetails?.email}
                      name="email"
                      size="small"
                      // onChange={handleIndiaContactDetails}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue =
                          filterOnlyLettersNumbersAndSpaces(value);
                        handleIndiaContactDetails({
                          target: { name, value: filteredValue },
                        });
                      }}
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       {indiaContactDetails?.email.length > 3 && (
                      //         <Button size="small" variant="contained">
                      //           ओ. टी. पी पाठवा
                      //         </Button>
                      //       )}
                      //     </InputAdornment>
                      //   ),
                      // }}
                    />
                  </Grid>
                  {/* {indiaContactDetails?.email.length > 3 && (
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
                  )} */}
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
                indiaContactDetails?.signatureSrc
                  ? indiaContactDetails?.signatureSrc
                  : "/images/signature-placeholder.png"
              }
              alt="वापरकर्त्याची स्वाक्षरी आपलोड करा"
              width="195px"
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

export default UserContactIndia;
