import {
  Grid,
  InputLabel,
  TextField,
  Button,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addressValidationSchema,
  emailValidationSchema,
} from "../../../../../../Validations/yupValidations";
import {
  filterOnlyLettersNumbersAndSpaces,
  filterOnlyLettersNumbersCommaDotAndSpaces,
} from "../../../../../../Validations/utils";

const UserAddressForeign = ({
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
  isReset,
  isEdit,
}) => {
  const [editFields, setEditFields] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const {
    control,
    trigger,
    reset,
    setValue,
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
    setEditFields(false);
    setEmailOTP("");

    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "",
      signatureName: "",
      signatureSrc: "",
    });
  };
  const handleForeignAdd = (e) => {
    const { name, value } = e?.target;
    setForaighnAddress({ ...foraighnAddress, [name]: value });
  };

  const handleEmailOTP = (e) => {
    setEmailOTP(e?.target?.value);
  };

  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("address", foraighnAddress?.address);
      setValue("email", foraighnAddress?.email);
    }
  }, [isEdit]);

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
      {editFields && (
        <Grid item md={12} mt={1} mb={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            पत्त्यात बदल करा
          </Button>
        </Grid>
      )}

      <Grid item md={12}>
        <Grid container spacing={2}>
          {editFields ? (
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>पत्ता</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={foraighnAddress?.address}
                disabled
              />
            </Grid>
          ) : (
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
          )}
        </Grid>
      </Grid>

      <Grid item md={12} mt={1}>
        <Grid container spacing={2}>
          {editFields ? (
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>मोबाईल</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={foraighnAddress?.mobile}
                name="mobile"
                disabled
                size="small"
              />
            </Grid>
          ) : (
            <Grid item md={6}>
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
                onChange={handleForeignAdd}
                placeholder="+1 "
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item md={12} mt={2}>
        {editFields ? (
          <Grid container spacing={2}>
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>ई मेल </b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                name="email"
                value={foraighnAddress?.email}
                disabled
                size="small"
              />
            </Grid>
            {/* <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>ओ. टी. पी</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                name="emailOTP"
                value={foraighnAddress?.emailOTP}
                disabled
                size="small"
              />
            </Grid> */}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={6}>
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
            {/* <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>ओ. टी. पी</b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                name="emailOTP"
                value={emailOTP}
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
        )}
      </Grid>
    </>
  );
};

export default UserAddressForeign;
