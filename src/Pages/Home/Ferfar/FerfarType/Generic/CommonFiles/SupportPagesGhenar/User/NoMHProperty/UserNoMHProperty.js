import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  firstNameEnglishValidationSchema,
  firstNameMarathiValidationSchema,
  lastNameEnglishValidationSchema,
  lastNameMarathiValidationSchema,
  middleNameEnglishValidationSchema,
  middleNameMarathiValidationSchema,
} from "../../../../../../../../../Validations/yupValidations";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import TransliterationTextField from "../../../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../../../../URLs/url";
import AxiosInstance from "../../../../../../../../../Instance/AxiosInstance";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../../../Validations/utils";

const UserNoMHProperty = ({
  heading,
  inputlabel,
  userNoMhProp,
  setUserNoMhProp,
  setIsValid,
  isReset,
  isEdit,
}) => {
  const { sendRequest } = AxiosInstance();
  const [editFields, setEditFields] = useState(false);
  const [suffixArr, setSuffixArr] = useState([]);
  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: firstNameMarathiValidationSchema,
        middleName: middleNameMarathiValidationSchema,
        lastName: lastNameMarathiValidationSchema,
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
      })
    ),
    defaultValues: {
      firstName: "",
      firstNameEng: "",
      middleName: "",
      middleNameEng: "",
      lastName: "",
      lastNameEng: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    setEditFields(false);
    reset();
  };
  const handleSuffix = (e) => {
    const value = e?.target?.value;
    const obj = suffixArr.find((o) => o.name_title == value);
    setUserNoMhProp({
      ...userNoMhProp,
      suffix: value,
      suffixEng: obj?.name_title_english,
      suffixcode: obj?.name_title_code,
      suffixCodeEng: obj?.name_title_code,
    });
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserNoMhProp({ ...userNoMhProp, [name]: value });
  };
  const getSuffix = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/nameTitleList`,
      "POST",
      null,
      (res) => {
        setSuffixArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err?.Message);
      }
    );
  };

  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("firstName", userNoMhProp?.firstName);
      setValue("middleName", userNoMhProp?.middleName);
      setValue("lastName", userNoMhProp?.lastName);
      setValue("firstNameEng", userNoMhProp?.firstNameEng);
      setValue("middleNameEng", userNoMhProp?.middleNameEng);
      setValue("lastNameEng", userNoMhProp?.lastNameEng);
    }
  }, [isEdit]);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    getSuffix();
  }, []);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserNoMhProperty: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12} mt={3} mb={2}>
        <h4 className="heading">{heading}</h4>
      </Grid>

      {editFields && (
        <Grid item md={12} mt={1} mb={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            खरेदी घेणाऱ्याच्या माहितीत बदल करा
          </Button>
        </Grid>
      )}

      {editFields ? (
        <>
          <Grid item md={12}>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <TextField
                  fullWidth
                  value={userNoMhProp?.suffix}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  value={userNoMhProp?.firstName}
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  value={userNoMhProp?.middleName}
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  value={userNoMhProp?.lastName}
                  disabled
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
                    value={userNoMhProp?.suffixEng}
                    className="textfieldDisabled"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={userNoMhProp?.firstNameEng}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={userNoMhProp?.middleNameEng}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={userNoMhProp?.lastNameEng}
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid item md={12}>
            <InputLabel className="inputlabel">
              <b>
                {inputlabel} <span> *</span> (नाव टाइप केल्यावर स्पेस बार दाबा.
                उ.दा.:- mahesh &gt;&gt; महेश)
              </b>
            </InputLabel>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <Select
                  className="textfield"
                  value={userNoMhProp?.suffix}
                  fullWidth
                  size="small"
                  onChange={handleSuffix}
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
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TransliterationTextField
                        value={userNoMhProp?.firstName}
                        name="firstName"
                        placeholder="पहिले नाव"
                        error={errors.firstName}
                        {...field}
                        onBlur={() => handleBlur("firstName")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                          field.onChange(filteredValue);
                          handleUserDetails({
                            target: { name, value: filteredValue },
                          });
                        }}
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
                      <TransliterationTextField
                        value={userNoMhProp?.middleName}
                        name="middleName"
                        placeholder="मधले नाव"
                        error={errors.middleName}
                        {...field}
                        onBlur={() => handleBlur("middleName")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                          field.onChange(filteredValue);
                          handleUserDetails({
                            target: { name, value: filteredValue },
                          });
                        }}
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
                      <TransliterationTextField
                        value={userNoMhProp?.lastName}
                        name="lastName"
                        placeholder="आडनाव"
                        error={errors.lastName}
                        {...field}
                        onBlur={() => handleBlur("lastName")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                          field.onChange(filteredValue);
                          handleUserDetails({
                            target: { name, value: filteredValue },
                          });
                        }}
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
              <InputLabel className="inputlabel">
                <b>
                  {inputlabel} <span> *</span> (इंग्रजी मध्ये)
                </b>
              </InputLabel>
              <Grid container justifyContent="space-between">
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    value={userNoMhProp?.suffixEng}
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
                          value={userNoMhProp?.firstNameEng}
                          name="firstNameEng"
                          placeholder="First name"
                          error={errors.firstNameEng}
                          {...field}
                          onBlur={() => handleBlur("firstNameEng")}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleUserDetails(e);
                          // }}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
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
                          value={userNoMhProp?.middleNameEng}
                          name="middleNameEng"
                          placeholder="Middle Name"
                          error={errors.middleNameEng}
                          {...field}
                          onBlur={() => handleBlur("middleNameEng")}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleUserDetails(e);
                          // }}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
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
                          value={userNoMhProp?.lastNameEng}
                          name="lastNameEng"
                          placeholder="Surname"
                          error={errors.lastNameEng}
                          {...field}
                          onBlur={() => handleBlur("lastNameEng")}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleUserDetails(e);
                          // }}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
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
      )}
    </>
  );
};

export default UserNoMHProperty;
