import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { genderValidationSchema } from "../../../../../Validations/yupValidations";
import AxiosInstance from "../../../../../Instance/AxiosInstance";
import URLS from "../../../../../URLs/url";
import TransliterationTextField from "../../../../../ui/TranslationTextfield/EngToMarTextfield";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../../../../Validations/utils";

const UserDharak = ({
  userDharak,
  setUserDharak,
  setIsValid,
  isReset,
  isEdit,
}) => {
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];
  const [genderArr, setGenderArr] = useState([]);
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
        gender: genderValidationSchema,
        dob: yup.string().required("जन्म तारीख टाका"),
      })
    ),
    defaultValues: {
      dob: "",
      gender: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    reset();
    setEditFields(false);
    setUserDharak({
      aliceName: "",
      gender: {},
      dob: "",
      motherName: "NA",
      motherNameEng: "NA",
    });
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
  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("dob", userDharak?.dob);
      setValue("gender", userDharak?.gender?.gender_description);
    }
  }, [isEdit]);

  useEffect(() => {
    // if (isReset) {
    handleReset();
    // }
  }, [isReset]);

  useEffect(() => {
    setGenderType();
  }, []);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserDharak: trigger,
    }));
  }, [trigger, setIsValid]);

  return (
    <>
      {editFields && (
        <Grid item md={12} mt={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            बदल करा
          </Button>
        </Grid>
      )}

      {editFields ? (
        <Grid container spacing={2} mt={1}>
          <Grid item md={5}>
            <InputLabel className="inputlabel">
              <b>उर्फ नाव</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              disabled
              fullWidth
              value={userDharak?.aliceName}
              size="small"
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>लिंग निवडा</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              disabled
              fullWidth
              value={userDharak?.gender?.gender_description}
              size="small"
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>जन्म दिनांक</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              disabled
              fullWidth
              value={userDharak?.dob}
              size="small"
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={5}>
            <InputLabel className="inputlabel">
              <b>
                उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- mahesh
                &gt;&gt; महेश)
              </b>
            </InputLabel>
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
          <Grid item md={3}>
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
          <Grid item md={3}>
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
                    name="dob"
                    value={userDharak?.dob}
                    onFocus={(event) => {
                      event.target.showPicker();
                    }}
                    inputProps={{
                      max: today,
                      min: "1900-01-01",
                    }}
                    error={errors.dob}
                    {...field}
                    onBlur={() => handleBlur("dob")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUserDharak(e);
                    }}
                    size="small"
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.dob && errors.dob.message}
                  </FormHelperText>
                  {/* {userDharak?.dob && (
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: 3,
                    }}
                  >{`वय - ${age} वर्षे ${month} महीने`}</p>
                )} */}
                </>
              )}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default UserDharak;
