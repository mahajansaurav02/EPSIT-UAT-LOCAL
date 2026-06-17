import React, { useState, useEffect } from "react";
import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ulpinValidationSchema,
  firstNameEnglishValidationSchema,
  firstNameMarathiValidationSchema,
  lastNameEnglishValidationSchema,
  lastNameMarathiValidationSchema,
  middleNameEnglishValidationSchema,
  middleNameMarathiValidationSchema,
  simpletextfieldValidationSchema,
  suffixMarathiValidationSchema,
} from "../../../../../../Validations/yupValidations";
import LRInstance from "../../../../../../Instance/LRInstance";
import URLS from "../../../../../../URLs/url";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import { errorToast } from "../../../../../../ui/Toast";

const UserMHPropertTypeULPIN = ({
  isEdit,
  editFields,
  userMhPropULPIN,
  setUserMhPropULPIN,
  setIsValid,
}) => {
  const [propTypeULPIN, setPropTypeULPIN] = useState({
    ulpin: "",
    district: "पुणे",
    taluka: "हवेली",
    village: "बावधन",
  });

  const { sendRequestLR } = LRInstance();
  const { sendRequest } = AxiosInstance();
  const [suffixArr, setSuffixArr] = useState([]);
  const [propULPIN, setPropULPIN] = useState();

  const {
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        ulpin: ulpinValidationSchema,
        userName: yup.string().required("User Name is required"),
        suffixMar: suffixMarathiValidationSchema,
        firstName: firstNameMarathiValidationSchema,
        middleName: middleNameMarathiValidationSchema,
        lastName: lastNameMarathiValidationSchema,
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleULPINChange = (e) => {
    const { name, value } = e?.target;
    setPropTypeULPIN({ ...propTypeULPIN, [name]: value });
    setUserMhPropULPIN({ ...userMhPropULPIN, ...propTypeULPIN, [name]: value });

    const firstDigit = value.charAt(0);
    if (firstDigit >= 1 && firstDigit <= 4) {
      console.info("firstDigit-if->>", firstDigit);
    } else if (firstDigit >= "5" && firstDigit <= "9") {
      console.info("firstDigit-else->>", firstDigit);
    }
  };
  const handleUserName = (e) => {
    setUserMhPropULPIN({ ...userMhPropULPIN, userName: e?.target?.value });
  };

  const handleSuffix = (e) => {
    const value = e?.target?.value;
    const obj = suffixArr.find((o) => o.name_title == value);
    setUserMhPropULPIN({
      ...userMhPropULPIN,
      suffix: value,
      suffixEng: obj?.name_title_english,
      suffixcode: obj?.name_title_code,
      suffixCodeEng: obj?.name_title_code,
    });
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;

    setUserMhPropULPIN({
      ...userMhPropULPIN,
      [name]: value,
    });
  };

  console.info("userMhPropULPIN->>", userMhPropULPIN);

  // useEffect(() => {
  //   setValue("ulpin", userMhPropULPIN?.ulpin);
  //   setValue("userName", userMhPropULPIN?.userName);
  //   setValue("suffixMar", userMhPropULPIN?.suffix);
  //   setValue("firstName", userMhPropULPIN?.firstName);
  //   setValue("middleName", userMhPropULPIN?.middleName);
  //   setValue("lastName", userMhPropULPIN?.lastName);
  //   setValue("firstNameEng", userMhPropULPIN?.firstNameEng);
  //   setValue("middleNameEng", userMhPropULPIN?.middleNameEng);
  //   setValue("lastNameEng", userMhPropULPIN?.lastNameEng);
  // }, [isEdit]);

  const getSuffix = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/nameTitleList`,
      "POST",
      null,
      (res) => {
        setSuffixArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const searchULPIN = () => {
    sendRequestLR(
      `${URLS?.BaseUrlLR}/getULPINDetails`,
      "POST",
      {
        ulpin: propTypeULPIN?.ulpin,
      },
      (res) => {
        setPropULPIN(res);
        setPropTypeULPIN();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  useEffect(() => {
    getSuffix();
  }, []);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserPropULPIN: trigger,
    }));
  }, [trigger, setIsValid]);

  return (
    <>
      {editFields ? (
        <>
          <Grid item md={12} mt={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="ulpin"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>ULPIN </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfield"
                        type="number"
                        size="small"
                        name="ulpin"
                        error={errors.ulpin}
                        inputProps={{
                          maxLength: 11,
                          max: 99999999999,
                          min: 0,
                          onInput: (e) => {
                            if (e.target.value.startsWith("0")) {
                              e.target.value = e.target.value.slice(1);
                            }

                            if (e.target.value.length > 11) {
                              e.target.value = e.target.value.slice(0, 11);
                            }
                          },
                        }}
                        {...field}
                        value={propTypeULPIN?.ulpin}
                        onBlur={() => handleBlur("ulpin")}
                        placeholder="ULPIN टाका"
                        onChange={(e) => {
                          field.onChange(e);
                          handleULPINChange(e);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<SearchRoundedIcon />}
                                onClick={searchULPIN}
                              >
                                शोधा
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.ulpin && errors.ulpin.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>जिल्हा</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.district}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>
                    {propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? "तालुका"
                      : "तालुका / न. भू. कार्यालय"}
                  </b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.taluka}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.village}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>
                    {propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? "खाता क्रमांक"
                      : "न.भू.क्र. क्रमांक"}
                  </b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={
                    propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? propTypeULPIN?.khataNo
                      : propTypeULPIN?.naBhu
                  }
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} mb={2} mt={1}>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>अर्जदारचे नाव </b> <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    className="textfield"
                    size="small"
                    error={errors.userName}
                    {...field}
                    value={userMhPropULPIN?.userName}
                    onBlur={() => handleBlur("userName")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUserName(e);
                    }}
                  >
                    <MenuItem value="tushar">तुषार नानासाहेब शिंदे</MenuItem>
                    <MenuItem value="yogesh">योगेश नानासाहेब शिंदे</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.userName && errors.userName.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <Controller
                  name="suffixMar"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        className="textfield"
                        value={userMhPropULPIN?.suffix}
                        error={errors.suffixMar}
                        {...field}
                        onBlur={() => handleBlur("suffixMar")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleSuffix(e);
                        }}
                        fullWidth
                        size="small"
                      >
                        {Array.isArray(suffixArr) &&
                          suffixArr.slice(0, -1).map((val, i) => {
                            return (
                              <MenuItem
                                value={val?.name_title}
                                key={val?.name_title + i}
                              >
                                {val?.name_title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.suffixMar && errors.suffixMar.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TextField
                        fullWidth
                        className="textfield"
                        value={userMhPropULPIN?.firstName}
                        name="firstName"
                        placeholder="पहिले नाव"
                        error={errors.firstName}
                        {...field}
                        onBlur={() => handleBlur("firstName")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                        size="small"
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.firstName && errors.firstName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TextField
                        fullWidth
                        className="textfield"
                        value={userMhPropULPIN?.middleName}
                        name="middleName"
                        placeholder="मधले नाव"
                        error={errors.middleName}
                        {...field}
                        onBlur={() => handleBlur("middleName")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                        size="small"
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.middleName && errors.middleName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TextField
                        fullWidth
                        className="textfield"
                        value={userMhPropULPIN?.lastName}
                        name="lastName"
                        placeholder="आडनाव"
                        error={errors.lastName}
                        {...field}
                        onBlur={() => handleBlur("lastName")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                        size="small"
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.lastName && errors.lastName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid item md={12} mt={1}>
              <Grid container justifyContent="space-between">
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    value={userMhPropULPIN?.suffixEng}
                    className="textfieldDisabled"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="firstNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userMhPropULPIN?.firstNameEng}
                          name="firstNameEng"
                          placeholder="First name"
                          error={errors.firstNameEng}
                          {...field}
                          onBlur={() => handleBlur("firstNameEng")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUserDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.firstNameEng && errors.firstNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="middleNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userMhPropULPIN?.middleNameEng}
                          name="middleNameEng"
                          placeholder="Middle Name"
                          error={errors.middleNameEng}
                          {...field}
                          onBlur={() => handleBlur("middleNameEng")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUserDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.middleNameEng && errors.middleNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="lastNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userMhPropULPIN?.lastNameEng}
                          name="lastNameEng"
                          placeholder="Surname"
                          error={errors.lastNameEng}
                          {...field}
                          onBlur={() => handleBlur("lastNameEng")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUserDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.lastNameEng && errors.lastNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid item md={12} mt={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>ULPIN</b>
                </InputLabel>
                <TextField
                  fullWidth
                  value={userMhPropULPIN?.ulpin}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>जिल्हा </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.district}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>तालुका </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.taluka}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.village}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} mb={2} mt={1}>
            <InputLabel className="inputlabel">
              <b>अर्जदारचे नाव </b>
            </InputLabel>
            <TextField
              fullWidth
              className="textfieldDisabled"
              value={userMhPropULPIN?.userName}
              disabled
              size="small"
            />
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <TextField
                  fullWidth
                  value={userMhPropULPIN?.suffix}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.firstName}
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.middleName}
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  disabled
                  value={userMhPropULPIN?.lastName}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid item md={12} mt={1}>
              <Grid container justifyContent="space-between">
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    value={userMhPropULPIN?.suffixEng}
                    className="textfieldDisabled"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    value={userMhPropULPIN?.firstNameEng}
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    value={userMhPropULPIN?.middleNameEng}
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    value={userMhPropULPIN?.lastNameEng}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default UserMHPropertTypeULPIN;
