import React, { useEffect, useState } from "react";
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
import URLS from "../../../../../../../URLs/url";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import {
  genderValidationSchema,
  holderTypeValidationSchema,
  thresholdDateOfDOB,
} from "../../../../../../../Validations/yupValidations";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const UserDharak = ({ userDharak, setUserDharak, setIsValid, isReset }) => {
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];
  const [age, setAge] = useState("0");
  const [month, setMonth] = useState("0");
  const [genderArr, setGenderArr] = useState([]);
  const [dharakArr, setDharakArr] = useState([]);
  const [aapakArr, setAapakArr] = useState([]);
  const [relationArr, setRelationArr] = useState([]);

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        gender: genderValidationSchema,
        holderType: holderTypeValidationSchema,
        dob: yup.string().required("जन्म तारीख टाका"),
        // giftArea: yup.string().required("बक्षीस क्षेत्र टाका"),
        motherName: yup.string().when("dob", (date, schema) => {
          const selectedDate = new Date(date);
          return selectedDate > thresholdDateOfDOB
            ? schema.required(
                "जन्म तारीख १ मे २०२४ नंतरची असेल तर आईचे नाव टाकणे गरजेचे आहे"
              )
            : schema.notRequired();
        }),
        motherNameEng: yup.string().when("dob", (date, schema) => {
          const selectedDate = new Date(date);
          return selectedDate > thresholdDateOfDOB
            ? schema.required(
                "जन्म तारीख १ मे २०२४ नंतरची असेल तर आईचे नाव इंग्रजीत टाकणे गरजेचे आहे"
              )
            : schema.notRequired();
        }),
      })
    ),
    defaultValues: {
      dob: "",
      gender: "",
      // giftArea: "",
      holderType: "",
      motherName: "",
      motherNameEng: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    reset();
    setAge("0");
    setMonth("0");
  };
  const handleUserDharak = (e) => {
    const { name, value } = e?.target;
    setUserDharak({ ...userDharak, [name]: value });
  };
  const handleGender = (e) => {
    const code = e?.target?.value;
    const obj = genderArr.find((o) => o?.gender_code == code);
    setUserDharak({ ...userDharak, gender: obj });
  };
  const handleDOB = (e) => {
    const date = e?.target?.value;
    const birthDate = new Date(date);
    const today = new Date();
    let ageDiff = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      ageDiff--;
      monthDiff += 12;
    }
    if (dayDiff < 0) {
      monthDiff--;
    }
    setAge(ageDiff);
    setMonth(monthDiff);
    if (ageDiff < 18) {
      setUserDharak({
        ...userDharak,
        aapakDropdown: { apk_code: "2", apk_description: "अ.पा.क." },
        dob: date,
      });
    } else {
      setUserDharak({
        ...userDharak,
        dob: date,
        aapak: "-",
        aapakRelation: { relation_code: "0", relation_name: "NA" },
      });
    }
  };
  const handleAapakDropdown = (e) => {
    const obj = aapakArr.find((o) => o.apk_code === e?.target?.value);
    setUserDharak({
      ...userDharak,
      aapakDropdown: obj,
    });
  };
  const handleRelation = (e) => {
    const code = e?.target?.value;
    const obj = relationArr.find((o) => o?.relation_code == code);
    setUserDharak({ ...userDharak, aapakRelation: obj });
  };
  const handleDharakType = (e) => {
    const code = e?.target?.value;
    const obj = dharakArr.find((o) => o?.account_type_code == code);
    setUserDharak({
      ...userDharak,
      holderType: {
        owner_status_code: obj?.account_type_code.toString(),
        owner_status_description: obj?.account_type_description,
      },
    });
  };

  const setDharakType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/ownerAccountType`,
      "POST",
      null,
      (res) => {
        setDharakArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setGenderType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/genderList`,
      "POST",
      null,
      (res) => {
        setGenderArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setAapakType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/apkMasterList`,
      "POST",
      null,
      (res) => {
        setAapakArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setRelation = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/holderRelationList`,
      "POST",
      null,
      (res) => {
        setRelationArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    setDharakType();
    setGenderType();
    setAapakType();
    setRelation();
  }, []);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserDharak: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={5}>
          <InputLabel className="inputlabel">
            <b>
              उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- mahesh
              &gt;&gt; महेश)
            </b>
          </InputLabel>
          {/* <TextField    
            fullWidth
            className="textfield"
            name="aliceName"
            placeholder="उर्फ नाव लिहा"
            size="small"
            value={userDharak?.aliceName}
            onChange={handleUserDharak}
          /> */}

          <TransliterationTextField
            value={userDharak?.aliceName}
            name="aliceName"
            placeholder="उर्फ नाव लिहा"
            // onChange={handleUserDharak}
            onChange={(e) => {
              const { name, value } = e.target;
              const filteredValue =
                filterOnlyMarathiAndEnglishLettersWithSpaces(value);
              handleUserDharak({
                target: { name, value: filteredValue },
              });
            }}
          />
        </Grid>
        <Grid item md={3.5}>
          <Controller
            name="holderType"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>धारक प्रकार </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  name="holderType"
                  fullWidth
                  className="textfield"
                  size="small"
                  value={userDharak?.holderType}
                  error={errors.holderType}
                  {...field}
                  onBlur={() => handleBlur("holderType")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDharakType(e);
                  }}
                >
                  {Array.isArray(dharakArr) &&
                    dharakArr.map((val, i) => {
                      return (
                        <MenuItem
                          value={val?.account_type_code}
                          key={val?.account_type_code + i}
                        >
                          {val?.account_type_description}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.holderType && errors.holderType.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        <Grid item md={3.5}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>लिंग निवडा </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  className="textfield"
                  name="gender"
                  value={userDharak?.gender}
                  error={errors.gender}
                  {...field}
                  onBlur={() => handleBlur("gender")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleGender(e);
                  }}
                >
                  {Array.isArray(genderArr) &&
                    genderArr.map((val, i) => {
                      return (
                        <MenuItem key={i} value={val?.gender_code}>
                          {val?.gender_description}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.gender && errors.gender.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        {/* <Grid item md={3}>
          <Controller
            name="giftArea"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>बक्षीस क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  name="giftArea"
                  size="small"
                  value={userDharak?.giftArea}
                  error={errors.giftArea}
                  {...field}
                  onBlur={() => handleBlur("giftArea")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleUserDharak(e);
                  }}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.giftArea && errors.giftArea.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid> */}
        <Grid item md={2}>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>जन्म दिनांक </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  type="date"
                  fullWidth
                  className="textfield"
                  onClick={(event) => {
                    if (event.target.showPicker) {
                      event.target.showPicker();
                    }
                  }}
                  inputProps={{
                    max: today,
                    min: "1900-01-01",
                  }}
                  value={userDharak?.dob}
                  error={errors.dob}
                  {...field}
                  onBlur={() => handleBlur("dob")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDOB(e);
                  }}
                  size="small"
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.dob && errors.dob.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        <Grid item md={2.5}>
          <InputLabel className="inputlabel">
            <b>वय</b>
          </InputLabel>
          <TextField
            fullWidth
            className="textfieldDisabled"
            disabled
            size="small"
            value={`${age} वर्षे ${month} महीने`}
          />
        </Grid>
        <Grid item md={2.5}>
          <InputLabel className="inputlabel">
            <b>धारक</b>
          </InputLabel>
          {age < 18 ? (
            <TextField
              fullWidth
              className="textfieldDisabled"
              disabled
              size="small"
              value={userDharak?.aapakDropdown?.apk_description}
            />
          ) : (
            <Select
              className="textfield"
              name="aapakDropdown"
              fullWidthx
              size="small"
              value={userDharak?.aapak?.apk_code}
              onChange={handleAapakDropdown}
            >
              {Array.isArray(aapakArr) &&
                aapakArr.map((val, i) => {
                  return (
                    <MenuItem value={val?.apk_code} key={val?.apk_code + i}>
                      {val?.apk_description}
                    </MenuItem>
                  );
                })}
            </Select>
          )}
        </Grid>
        {age >= 0 && age < 18 && (
          <Grid item md={2.5}>
            <InputLabel className="inputlabel">
              <b>अ.पा.क.</b>
            </InputLabel>
            <TextField
              fullWidth
              className="textfield"
              name="aapak"
              size="small"
              value={userDharak?.aapak}
              // onChange={handleUserDharak}
              onChange={(e) => {
                const { name, value } = e.target;
                const filteredValue = filterOnlyLettersAndSpaces(value);
                handleUserDharak({
                  target: { name, value: filteredValue },
                });
              }}
            />
          </Grid>
        )}
        {age >= 0 && age < 18 && (
          <Grid item md={2.5}>
            <InputLabel className="inputlabel">
              <b>अ.पा.क. धारकाशी नाते</b>
            </InputLabel>
            <Select
              className="textfield"
              fullWidth
              size="small"
              name="deathRelation"
              value={userDharak?.aapakRelation?.relation_name}
              onChange={handleRelation}
            >
              {Array.isArray(relationArr) &&
                relationArr.map((val, i) => {
                  return (
                    <MenuItem
                      value={val?.relation_code}
                      key={val?.relation_code + i}
                    >
                      {val?.relation_name}
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>
        )}
      </Grid>

      <Grid container mt={1}>
        <Grid item md={5}>
          <Controller
            name="motherName"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>
                    आईचे नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- kaashi
                    &gt;&gt; काशी)
                  </b>
                </InputLabel>
                <TransliterationTextField
                  value={userDharak?.motherName}
                  name="motherName"
                  placeholder="आईचे नाव"
                  error={errors.motherName}
                  {...field}
                  onBlur={() => handleBlur("motherName")}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  //   handleUserDharak(e);
                  // }}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                    field.onChange(filteredValue);
                    handleUserDharak({
                      target: { name, value: filteredValue },
                    });
                  }}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.motherName && errors.motherName.message}
                </FormHelperText>
              </>
            )}
          />
          <Controller
            name="motherNameEng"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>आईचे नाव (इंग्रजी मध्ये)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  placeholder="Mother Name"
                  className="textfield"
                  name="motherNameEng"
                  value={userDharak?.motherNameEng}
                  error={errors.motherNameEng}
                  {...field}
                  onBlur={() => handleBlur("motherNameEng")}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  //   handleUserDharak(e);
                  // }}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue = filterOnlyLettersAndSpaces(value);
                    field.onChange(filteredValue);
                    handleUserDharak({
                      target: { name, value: filteredValue },
                    });
                  }}
                  size="small"
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.motherNameEng && errors.motherNameEng.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserDharak;
