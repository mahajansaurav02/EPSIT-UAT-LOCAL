import {
  Grid,
  InputLabel,
  TextField,
  Button,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addressValidationSchema,
  emailValidationSchema,
} from "../../../../Validations/yupValidations";
import {
  filterOnlyLettersNumbersAndSpaces,
  filterOnlyLettersNumbersCommaDotAndSpaces,
} from "../../../../Validations/utils";

const UserAddressForeign = ({
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
  isReset,
}) => {
  const [signatureError, setSignatureError] = useState("");
  const [emailOTP, setEmailOTP] = useState("");

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        address: addressValidationSchema,
        email: emailValidationSchema,
      })
    ),
    defaultValues: {
      address: "",
      email: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReset = () => {
    reset();
    setEmailOTP("");
  };

  const handleForeignAdd = (e) => {
    const { name, value } = e?.target;
    setForaighnAddress({ ...foraighnAddress, [name]: value });
  };

  const handleSignatureFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setSignatureError("File should be less than 256 KB");
        setForaighnAddress({
          ...foraighnAddress,
          signatureName: "",
          signatureSrc: "",
        });
      } else {
        setSignatureError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setForaighnAddress({
            ...foraighnAddress,
            signatureSrc: reader.result,
            signatureName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSignatureError("");
      setForaighnAddress({
        ...foraighnAddress,
        signatureName: "",
        signatureSrc: "",
      });
    }
  };

  const handleEmailOTP = (e) => {
    setEmailOTP(e?.target?.value);
  };

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserForeignAdd: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>पत्ता </b>
                    <span>*</span>
                  </InputLabel>
                  <TextField
                    className="textfield"
                    fullWidth
                    multiline
                    rows={3}
                    name="address"
                    placeholder="282 Elm Drive, New York, NY"
                    size="small"
                    value={foraighnAddress?.address}
                    error={errors.address}
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   handleForeignAdd(e);
                    // }}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue =
                        filterOnlyLettersNumbersCommaDotAndSpaces(value);
                      field.onChange(filteredValue);
                      handleForeignAdd({
                        target: { name, value: filteredValue },
                      });
                    }}
                    onBlur={() => handleBlur("address")}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.address && errors.address.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} mt={1}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item md={6}>
            <Grid item md={12}>
              <InputLabel className="inputlabel">
                <b>मोबाईल</b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                value={foraighnAddress?.mobile}
                name="mobile"
                type="number"
                size="small"
                inputProps={{
                  maxLength: 13,
                  max: 9999999999999,
                  onInput: (e) => {
                    if (e.target.value.length > 13) {
                      e.target.value = e.target.value.slice(0, 13);
                    }
                  },
                }}
                onChange={(e) => handleForeignAdd(e)}
                placeholder="+1 "
              />
            </Grid>
            <Grid item md={12} mt={1}>
              <Grid container spacing={2}>
                <Grid item md={12}>
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
                          name="email"
                          value={foraighnAddress?.email}
                          error={errors.email}
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleForeignAdd(e);
                          // }}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersNumbersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleForeignAdd({
                              target: { name, value: filteredValue },
                            });
                          }}
                          onBlur={() => handleBlur("email")}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {/* <Button size="small" variant="contained">
                                  ओ. टी. पी पाठवा
                                </Button> */}
                              </InputAdornment>
                            ),
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.email && errors.email.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                {/* <Grid item md={6}>
                  <InputLabel className="inputlabel">
                    <b>ओ. टी. पी</b>
                  </InputLabel>
                  <TextField
                    className="textfield"
                    fullWidth
                    name="emailOTP"
                    value={emailOTP}
                    // onChange={(e) => handleForeignAdd(e)}
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
                    size="small"
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
          {/* <Grid
            item
            md={3}
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
                foraighnAddress?.signatureSrc
                  ? foraighnAddress?.signatureSrc
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
              sx={{ mt: 1 }}
            >
              स्वाक्षरी
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleSignatureFileChange}
              />
            </Button>

            <FormHelperText sx={{ color: "red" }}>
              {signatureError && signatureError}
            </FormHelperText>
          </Grid> */}
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddressForeign;
