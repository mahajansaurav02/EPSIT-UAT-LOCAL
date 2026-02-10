import {
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../../URLs/url";
import { errorToast, successToast } from "../../../../../../../ui/Toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";
import {
  firstNameEnglishValidationSchema,
  lastNameEnglishValidationSchema,
  middleNameEnglishValidationSchema,
  thresholdDateOfDOB,
} from "../../../../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import UserAddress from "../Address/UserAddress";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";

const AddAdditionalDenarDetails = ({ val, onClose }) => {
  // console.info("val-->", val);
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];
  const [suffixArr, setSuffixArr] = useState([]);
  const [suffixcode, setSuffixCode] = useState("");
  const [suffixCodeEng, setSuffixCodeEng] = useState("");
  const [suffix, setSuffix] = useState("");
  const [suffixEng, setSuffixEng] = useState("");
  const [userDetails, setUserDetails] = useState({
    firstName: val?.first_name,
    middleName: val?.middle_name,
    lastName: val?.last_name,
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    aliceName: "",
    dob: "",
    motherName: "",
    motherNameEng: "",
  });
  const [radio, setRadio] = useState("yes");
  const [availableArea, setAvailableArea] = useState("");
  const [mutationArea, setMutationArea] = useState("");
  const [isReset, setIsReset] = useState(false);

  //---------------------------state up data of Address---------------------
  const [isIndian, setIsIndian] = useState("india");
  const [indiaAddress, setIndiaAdress] = useState({
    plotNo: "",
    building: "",
    mainRoad: "",
    impSymbol: "",
    area: "",
    mobile: "",
    mobileOTP: "yes",
    pincode: "",
    postOfficeName: "",
    city: "",
    taluka: "",
    district: "",
    state: "",
    addressProofName: "",
    addressProofSrc: "",
    signatureName: "",
    signatureSrc: "",
  });
  const [foraighnAddress, setForaighnAddress] = useState({
    address: "",
    mobile: "",
    email: "",
    emailOTP: "yes",
    signatureName: "",
    signatureSrc: "",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
        dob: yup.date().nullable().typeError("अवैध जन्म तारीख"),
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
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      motherName: "",
      motherNameEng: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleSuffix = (e) => {
    const value = e?.target?.value;
    const obj = suffixArr.find((o) => o?.name_title == value);
    setSuffix(value);
    setSuffixEng(obj?.name_title_english);
    setSuffixCode(obj?.name_title_code);
    setSuffixCodeEng(obj?.name_title_code);
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, [name]: value });
    setValue(name, value, { shouldValidate: true });
  };
  const handleRadioChange = (e) => {
    const value = e?.target?.value;
    setRadio(value);
    if (value == "yes") {
      setMutationArea(val?.actualArea);
    } else {
      setMutationArea("");
    }
  };
  const handleMutationArea = (e) => {
    const value = e?.target?.value;
    setMutationArea(value);
  };
  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();

      if (result && isUserIndAdd) {
        // console.info("save-data-selected-user->>", {
        //   mutation_dtl_id: val?.mutation_dtl_id,
        //   applicationid: val?.applicationid,
        //   village_code: val?.village_code,
        //   ctsNo: val?.cts_number,
        //   mutationSroNo: val?.mutation_srno,
        //   ownerNo: val?.owner_number,
        //   userDetails: {
        //     ...userDetails,
        //     suffix: suffix,
        //     suffixEng: suffixEng,
        //     suffixcode: suffixcode,
        //     suffixCodeEng: suffixCodeEng,
        //     subPropNo: val?.subPropNo,
        //     nabhu: val?.cts_number,
        //     lrPropertyUID: val?.lrPropertyUID,
        //     milkat: val?.milkat,
        //     namud: val?.namud,
        //   },
        //   areaForMutation: {
        //     isFullAreaGiven: radio,
        //     actualArea: val?.actualArea,
        //     mutationArea: mutationArea,
        //     availableArea: availableArea,
        //   },
        //   address: {
        //     addressType: isIndian,
        //     indiaAddress: indiaAddress,
        //   },
        // });

        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/SaveGenericAdditionalDTLForGiver`,
          "POST",
          {
            mutation_dtl_id: val?.mutation_dtl_id,
            applicationid: val?.applicationid,
            village_code: val?.village_code,
            ctsNo: val?.cts_number,
            mutationSroNo: val?.mutation_srno,
            ownerNo: val?.owner_number,
            userDetails: {
              ...userDetails,
              suffix: suffix,
              suffixEng: suffixEng,
              suffixcode: suffixcode,
              suffixCodeEng: suffixCodeEng,
              subPropNo: val?.subPropNo,
              nabhu: val?.cts_number,
              lrPropertyUID: val?.lrPropertyUID,
              milkat: val?.milkat,
              namud: val?.namud,
            },
            areaForMutation: {
              isFullAreaGiven: radio,
              actualArea: val?.actualArea,
              mutationArea: mutationArea,
              availableArea: availableArea,
            },
            address: {
              addressType: isIndian,
              indiaAddress: indiaAddress,
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              onClose();
            } else {
              console.error(res?.Message);
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Check All Fields");
      }
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();

      if (result && isUserForeignAdd) {
        // console.info("save-data-selected-user->>", {
        //   mutation_dtl_id: val?.mutation_dtl_id,
        //   applicationid: val?.applicationid,
        //   village_code: val?.village_code,
        //   ctsNo: val?.cts_number,
        //   mutationSroNo: val?.mutation_srno,
        //   ownerNo: val?.owner_number,
        //   userDetails: {
        //     ...userDetails,
        //     suffix: suffix,
        //     suffixEng: suffixEng,
        //     suffixcode: suffixcode,
        //     suffixCodeEng: suffixCodeEng,
        //     subPropNo: val?.subPropNo,
        //     nabhu: val?.cts_number,
        //     lrPropertyUID: val?.lrPropertyUID,
        //     milkat: val?.milkat,
        //     namud: val?.namud,
        //   },
        //   areaForMutation: {
        //     isFullAreaGiven: radio,
        //     actualArea: val?.actualArea,
        //     mutationArea: mutationArea,
        //     availableArea: availableArea,
        //   },
        //   address: {
        //     addressType: isIndian,
        //     foreignAddress: foraighnAddress,
        //   },
        // });

        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/SaveGenericAdditionalDTLForGiver`,
          "POST",
          {
            mutation_dtl_id: val?.mutation_dtl_id,
            applicationid: val?.applicationid,
            village_code: val?.village_code,
            ctsNo: val?.cts_number,
            mutationSroNo: val?.mutation_srno,
            ownerNo: val?.owner_number,
            userDetails: {
              ...userDetails,
              suffix: suffix,
              suffixEng: suffixEng,
              suffixcode: suffixcode,
              suffixCodeEng: suffixCodeEng,
              subPropNo: val?.subPropNo,
              nabhu: val?.cts_number,
              lrPropertyUID: val?.lrPropertyUID,
              milkat: val?.milkat,
              namud: val?.namud,
            },
            areaForMutation: {
              isFullAreaGiven: radio,
              actualArea: val?.actualArea,
              mutationArea: mutationArea,
              availableArea: availableArea,
            },
            address: {
              addressType: isIndian,
              foreignAddress: foraighnAddress,
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              onClose();
            } else {
              console.error(res?.Message);
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Check All Fields");
      }
    }
  };
  const handleReset = () => {
    setSuffix("");
    setSuffixEng("");
    setRadio("yes");
    setAvailableArea("");
    setMutationArea("");
    setUserDetails({
      firstName: val?.first_name,
      middleName: val?.middle_name,
      lastName: val?.last_name,
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      aliceName: "",
      dob: "",
      motherName: "",
      motherNameEng: "",
    });
    setIndiaAdress({
      plotNo: "",
      building: "",
      mainRoad: "",
      impSymbol: "",
      area: "",
      mobile: "",
      mobileOTP: "",
      pincode: "",
      postOfficeName: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      addressProofName: "",
      addressProofSrc: "",
      signatureName: "",
      signatureSrc: "",
    });
    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "",
      signatureName: "",
      signatureSrc: "",
    });
    reset();
    setIsReset(!isReset);
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
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    getSuffix();
  }, []);

  return (
    <Paper elevation={5} sx={{ p: 2, pt: 1 }}>
      <Grid item md={12}>
        <h4 className="heading">Additional माहिती (Add)</h4>
        {/* <h4>Additional माहिती (Add)</h4> */}
      </Grid>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>अर्जमधील न. भू. क्र.</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              fullWidth
              value={val?.cts_number}
              size="small"
              disabled
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>फेरफारासाठी मिळकत</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              fullWidth
              value={
                val?.milkat == "land" ? "भूखंड / जमीन (प्लॉट)" : "अपार्टमेंट"
              }
              size="small"
              disabled
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>अर्जामध्ये नमूद मिळकत</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              fullWidth
              value={val?.namud}
              size="small"
              disabled
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>lrPropertyUID</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              fullWidth
              value={val?.lrPropertyUID}
              size="small"
              disabled
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} mt={2}>
        <Grid container justifyContent="space-between">
          <Grid item md={2}>
            <Select
              className="textfield"
              value={suffix}
              name="suffixMar"
              onChange={handleSuffix}
              fullWidth
              size="small"
            >
              {Array.isArray(suffixArr) &&
                suffixArr.map((val, i) => {
                  return (
                    <MenuItem value={val?.name_title} key={val?.name_title + i}>
                      {val?.name_title}
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              value={val?.first_name}
              className="textfieldDisabled"
              disabled
              size="small"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              value={val?.middle_name}
              className="textfieldDisabled"
              disabled
              size="small"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              value={val?.last_name}
              className="textfieldDisabled"
              disabled
              size="small"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <InputLabel className="inputlabel">
          <b>
            देणाराचे नाव <span> *</span> (इंग्रजी मध्ये)
          </b>
        </InputLabel>
        <Grid container justifyContent="space-between">
          <Grid item md={2}>
            <TextField
              fullWidth
              value={suffixEng}
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
                    value={userDetails?.firstNameEng}
                    name="firstNameEng"
                    placeholder="First name"
                    error={errors.firstNameEng}
                    {...field}
                    onBlur={() => handleBlur("firstNameEng")}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue = filterOnlyLettersAndSpaces(value);
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
                    value={userDetails?.middleNameEng}
                    name="middleNameEng"
                    placeholder="Middle Name"
                    error={errors.middleNameEng}
                    {...field}
                    onBlur={() => handleBlur("middleNameEng")}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue = filterOnlyLettersAndSpaces(value);
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
                    value={userDetails?.lastNameEng}
                    name="lastNameEng"
                    placeholder="Surname"
                    error={errors.lastNameEng}
                    {...field}
                    onBlur={() => handleBlur("lastNameEng")}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue = filterOnlyLettersAndSpaces(value);
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
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={5}>
            <InputLabel className="inputlabel">
              <b>
                उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- mahesh
                &gt;&gt; महेश)
              </b>
            </InputLabel>
            <TransliterationTextField
              value={userDetails?.aliceName}
              name="aliceName"
              placeholder="उर्फ नाव लिहा"
              // onChange={handleUserDetails}
              onChange={(e) => {
                const { name, value } = e.target;
                const filteredValue =
                  filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                handleUserDetails({
                  target: { name, value: filteredValue },
                });
              }}
            />
          </Grid>
          <Grid item md={4}>
            <InputLabel className="inputlabel">
              <b>जन्म दिनांक </b>
            </InputLabel>
            <TextField
              type="date"
              fullWidth
              className="textfield"
              name="dob"
              value={userDetails?.dob}
              onFocus={(event) => {
                event.target.showPicker();
              }}
              inputProps={{
                max: today,
                min: "1900-01-01",
              }}
              onChange={handleUserDetails}
              size="small"
            />
          </Grid>
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
                    value={userDetails?.motherName}
                    name="motherName"
                    placeholder="आईचे नाव"
                    error={errors.motherName}
                    {...field}
                    onBlur={() => handleBlur("motherName")}
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
                    value={userDetails?.motherNameEng}
                    error={errors.motherNameEng}
                    {...field}
                    onBlur={() => handleBlur("motherNameEng")}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   handleUserDetails(e);
                    // }}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue = filterOnlyLettersAndSpaces(value);
                      field.onChange(filteredValue);
                      handleUserDetails({
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
      </Grid>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>मिळकत पत्रिके प्रमाणे क्षेत्र (चौ.मी.)</b>
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              value={val?.actualArea}
              disabled
              className="textfieldDisabled"
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</b>
            </InputLabel>
            <TextField
              fullWidth
              type="text"
              inputProps={{
                maxLength: 10,
                inputMode: "decimal",
                onInput: (e) => {
                  const value = e.target.value;
                  const regex = /^\d*\.?\d{0,2}$/;
                  if (!regex.test(value)) {
                    e.target.value = value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                  }
                },
              }}
              size="small"
              className={
                val?.milkat != "land" ? "textfieldDisabled" : "textfield"
              }
              value={val?.milkat != "land" ? val?.actualArea : availableArea}
              disabled={val?.milkat != "land"}
              onChange={(e) => {
                setAvailableArea(e?.target?.value);
                setMutationArea(e?.target?.value);
              }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>पूर्ण क्षेत्र दिले आहे का ?</b>
            </InputLabel>
            <RadioGroup row onChange={handleRadioChange} value={radio}>
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="होय"
                disabled={val?.milkat != "land"}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="नाही"
                disabled={val?.milkat != "land"}
              />
            </RadioGroup>
          </Grid>
          <Grid item md={3}>
            {radio == "yes" ? (
              <>
                <InputLabel className="inputlabel">
                  <b>फेरफारसाठी दिलेले क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={
                    val?.milkat != "land" ? val?.actualArea : availableArea
                  }
                  disabled
                  className="textfieldDisabled"
                />
              </>
            ) : (
              <>
                <InputLabel className="inputlabel">
                  <b>फेरफारसाठी दिलेले क्षेत्र (चौ.मी.) </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "decimal",
                    onInput: (e) => {
                      const value = e.target.value;
                      const regex = /^\d*\.?\d{0,2}$/;
                      if (!regex.test(value)) {
                        e.target.value =
                          value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                      }
                    },
                  }}
                  className="textfield"
                  value={mutationArea}
                  onChange={handleMutationArea}
                  name="mutationArea"
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <UserAddress
          isReset={isReset}
          hasSignature={false}
          isIndian={isIndian}
          setIsIndian={setIsIndian}
          indiaAddress={indiaAddress}
          setIndiaAdress={setIndiaAdress}
          foraighnAddress={foraighnAddress}
          setForaighnAddress={setForaighnAddress}
          setIsValid={setIsValid}
          // responseData={responseData}
          isMobileCompulsary={false}
        />
      </Grid>

      <Grid container justifyContent="end" px={2} mt={2}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<RotateRightRoundedIcon />}
            sx={{ mr: 2 }}
            onClick={handleReset}
          >
            रीसेट करा
          </Button>
          <Button
            variant="contained"
            endIcon={<SaveRoundedIcon />}
            onClick={handleSave}
          >
            धारकाची माहिती जतन करा
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddAdditionalDenarDetails;
