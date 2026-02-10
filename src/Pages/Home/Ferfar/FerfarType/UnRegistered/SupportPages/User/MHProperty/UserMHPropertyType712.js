import React, { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  firstNameEnglishValidationSchema,
  firstNameMarathiValidationSchema,
  khataNoValidationSchema,
  lastNameEnglishValidationSchema,
  lastNameMarathiValidationSchema,
  middleNameEnglishValidationSchema,
  middleNameMarathiValidationSchema,
  suffixMarathiValidationSchema,
} from "../../../../../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import SelectVillageEferfar from "../../../../../../../../ui/SelectVillage/SelectVillageEferfar";
import URLS from "../../../../../../../../URLs/url";
import AxiosInstance from "../../../../../../../../Instance/AxiosInstance";

const UserMHPropertyType712 = ({
  heading,
  inputlabel,
  userMhPropType712,
  setUserMhPropType712,
  setIsValid,
  isReset,
}) => {
  const { sendRequest } = AxiosInstance();
  const [suffixArr, setSuffixArr] = useState([]);
  const [villageData, setVillageData] = useState({
    district: {},
    taluka: {},
    village: {},
  });

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        khataNo: khataNoValidationSchema,
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
    defaultValues: {
      khataNo: "",
      userName: "",
      suffixMar: "",
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
    reset();
  };

  const handleKhataChange = (e) => {
    setUserMhPropType712({
      ...userMhPropType712,
      khataNo: e?.target?.value,
      ...villageData,
    });
  };
  const handleUserName = (e) => {
    setUserMhPropType712({ ...userMhPropType712, userName: e?.target?.value });
  };

  const handleSuffix = (e) => {
    const value = e?.target?.value;
    const obj = suffixArr.find((o) => o.name_title == value);
    setUserMhPropType712({
      ...userMhPropType712,
      suffix: value,
      suffixEng: obj?.name_title_english,
      suffixcode: obj?.name_title_code,
      suffixCodeEng: obj?.name_title_code,
    });
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserMhPropType712({ ...userMhPropType712, [name]: value });
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
    getSuffix();
  }, []);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserProp712: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={9}>
            <SelectVillageEferfar setVillageData={setVillageData} />
          </Grid>
          <Grid item md={3}>
            <Controller
              name="khataNo"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>खाता क्रमांक </b>
                    <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    className="textfield"
                    size="small"
                    error={errors.khataNo}
                    {...field}
                    value={userMhPropType712?.khataNo}
                    onBlur={() => handleBlur("khataNo")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleKhataChange(e);
                    }}
                  >
                    <MenuItem value="1">480/20/121/52</MenuItem>
                    <MenuItem value="2">480/20/121/53</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.khataNo && errors.khataNo.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} mt={3} mb={2}>
        <h4 className="heading">{heading}</h4>
      </Grid>
      <Grid item md={4} mb={2}>
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <>
              <InputLabel className="inputlabel">
                <b>{inputlabel} </b> <span>*</span>
              </InputLabel>
              <Select
                fullWidth
                className="textfield"
                size="small"
                error={errors.userName}
                {...field}
                value={userMhPropType712?.userName}
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
                    value={userMhPropType712?.suffix}
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
                    <MenuItem value="shree">श्री</MenuItem>
                    <MenuItem value="smt">श्रीमती</MenuItem>
                    <MenuItem value="ku">कु</MenuItem>
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
                  {/* <TextField
                  fullWidth
                  className="textfield"
                  value={userMhPropType712?.firstName}
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
                /> */}
                  <TransliterationTextField
                    value={userMhPropType712?.firstName}
                    name="firstName"
                    placeholder="पहिले नाव"
                    error={errors.firstName}
                    {...field}
                    onBlur={() => handleBlur("firstName")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUserDetails(e);
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
                  {/* <TextField
                  fullWidth
                  className="textfield"
                  value={userMhPropType712?.middleName}
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
                /> */}

                  <TransliterationTextField
                    value={userMhPropType712?.middleName}
                    name="middleName"
                    placeholder="मधले नाव"
                    error={errors.middleName}
                    {...field}
                    onBlur={() => handleBlur("middleName")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUserDetails(e);
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
                  {/* <TextField
                  fullWidth
                  className="textfield"
                  value={userMhPropType712?.lastName}
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
                /> */}

                  <TransliterationTextField
                    value={userMhPropType712?.lastName}
                    name="lastName"
                    placeholder="आडनाव"
                    error={errors.lastName}
                    {...field}
                    onBlur={() => handleBlur("lastName")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUserDetails(e);
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
          <Grid container justifyContent="space-between">
            <Grid item md={2}>
              <TextField
                fullWidth
                value={userMhPropType712?.suffixEng}
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
                      value={userMhPropType712?.firstNameEng}
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
                      value={userMhPropType712?.middleNameEng}
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
                      value={userMhPropType712?.lastNameEng}
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
  );
};

export default UserMHPropertyType712;
