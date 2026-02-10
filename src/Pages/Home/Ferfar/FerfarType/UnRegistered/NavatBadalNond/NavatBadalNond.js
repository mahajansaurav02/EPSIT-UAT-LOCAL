import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import NotesPaper from "../../../../../../ui/NotesPaper/NotesPaper";
import { errorToast, successToast, Toast } from "../../../../../../ui/Toast";
import ShowAddress from "../SupportPages/ShowAddress";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../URLs/url";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../Validations/utils";
import {
  firstNameEnglishValidationSchema,
  lastNameEnglishValidationSchema,
  middleNameEnglishValidationSchema,
  nabhuValidationSchema,
  thresholdDateOfDOB,
} from "../../../../../../Validations/yupValidations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import UserAddress from "../SupportPages/UserAddress";
import UserNoMHProperty from "../SupportPages/User/NoMHProperty/UserNoMHProperty";
import CompanyNoMHProperty from "../../Registered/SupportPages/Company/NoMHProperty/CompanyNoMHProperty";

const NavatBadalNond = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameObj, setUserNameObj] = useState({});
  const [nameChange, setNameChange] = useState({
    reason: {},
    no: "",
    date: "",
  });

  const [userDataArr, setUserDataArr] = useState([]);
  const [selectedUserArr, setSelectedUserArr] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reasonArr, setReasonArr] = useState([]);

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
  //---------------------------state up data of Address---------------------
  const [userTypeArr, setUserTypeArr] = useState([]);
  const [userType, setUserType] = useState(1);
  const [userTypeLabel, setUserTypeLabel] = useState("व्यक्ती");
  const [userNoMhProp, setUserNoMhProp] = useState({
    suffix: "",
    suffixEng: "",
    suffixcode: "",
    suffixCodeEng: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
  });
  const [companyNoMhProp, setCompanyNoMhProp] = useState({
    companyName: "",
    companyNameEng: "",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);

  //--------------------------------Show Address-----------------------------
  const [open, setOpen] = useState(false);
  const [addVal, setAddVal] = useState({});

  //------------------------------Is Mutation Undergoing-----------------------
  const [isMutationUndergoing, setIsMutationUndergoing] = useState(false);

  const handleDialogClose = () => {
    setOpen(false);
  };
  const showAddress = (val) => {
    setOpen(true);
    setAddVal(val?.address);
  };

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
        userName: yup.string().required("नावात बदल निवडा"),
        reason: yup.string().required("नावात बदल कारण निवडा"),
        no: yup.string().required("क्रमांक निवडा"),
        date: yup.string().required("दिनांक निवडा"),
      }),
    ),
    defaultValues: {
      nabhu: "",
      userName: "",
      reason: "",
      no: "",
      date: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
    const obj = userTypeArr.find(
      (o) => o.applicant_category_code == e?.target?.value,
    );
    setUserTypeLabel(obj?.applicant_category_type);
  };
  const handleNaBhuNo = (e) => {
    const code = e?.target?.value;
    setNaBhu(e?.target?.value);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    getUserDetails(obj?.actual_cts_no, obj?.sub_property_no);
  };
  const getUserDetails = (nabhuNo, subPropNo) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOwnerNameInfo`,
      "POST",
      {
        village_code: applicationData?.village_code,
        cts_no: nabhuNo,
        subprop_no: subPropNo,
      },
      (res) => {
        if (res?.Code == "1") {
          setUserDataArr(JSON.parse(res?.ResponseData));
        } else {
          errorToast(res?.Message);
          setUserDataArr([]);
        }
      },
      (err) => {
        console.error(err);
      },
    );
  };
  const handleUserName = (e) => {
    const code = e?.target?.value;
    const obj = userDataArr.find((o) => o?.owner_name == code);
    setUserName(code);
    setUserNameObj(obj);
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOwnerDetails`,
      "POST",
      {
        village_code: applicationData?.village_code,
        cts_no: obj?.cts_number,
        mut_sr_no: obj?.mutation_srno,
        owner_no: obj?.owner_number,
      },
      (res) => {
        const arr = JSON.parse(res?.ResponseData);
        setSelectedUserArr(arr);
      },
      (err) => {
        console.error(err);
      },
    );
  };
  // const handleReset = () => {
  //   setNamud("");
  //   setMilkat("land");
  //   setLrPropertyUID("");
  //   setNaBhu("");
  //   setUserDataArr([]);
  //   setIsIndian("india");
  //   setIndiaAdress({
  //     plotNo: "",
  //     building: "",
  //     mainRoad: "",
  //     impSymbol: "",
  //     area: "",
  //     mobile: "",
  //     mobileOTP: "",
  //     pincode: "",
  //     postOfficeName: "",
  //     city: "",
  //     taluka: "",
  //     district: "",
  //     state: "",
  //     addressProofName: "",
  //     addressProofSrc: "",
  //     signatureName: "",
  //     signatureSrc: "",
  //   });
  //   setForaighnAddress({
  //     address: "",
  //     mobile: "",
  //     email: "",
  //     emailOTP: "",
  //     signatureName: "",
  //     signatureSrc: "",
  //   });

  //   reset();
  //   setIsReset(!isReset);
  // };
  const handleSave = async () => {
    console.info("payload->>", {
      applicationid: applicationId,
      village_code: applicationData?.village_code,
      userDetails: {
        subPropNo: subPropNo,
        nabhu: naBhu,
        lrPropertyUID: lrPropertyUID,
        milkat: milkat,
        namud: namud,
      },
      nameChange: nameChange,
      selectedUserDetails: selectedUserArr,
      updatedUserDetails: {
        userType: userType,
        userTypeLabel: userTypeLabel,
        details: userNoMhProp,
      },
      address: {
        addressType: isIndian,
        indiaAddress: indiaAddress,
      },
    });

    // if (isIndian == "india") {
    //   const result = await trigger();
    //   const isUserIndAdd = await isValid.triggerUserIndAdd();
    //   const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();

    //   if (result && isUserIndAdd && isUserNoMhProperty) {
    //     successToast("Data is in console !");
    //     console.info("payload->>", {
    //       applicationid: applicationId,
    //       village_code: applicationData?.village_code,
    //       userDetails: {
    //         subPropNo: subPropNo,
    //         nabhu: naBhu,
    //         lrPropertyUID: lrPropertyUID,
    //         milkat: milkat,
    //         namud: namud,
    //       },
    //       address: {
    //         addressType: isIndian,
    //         indiaAddress: indiaAddress,
    //       },
    //     });

    //     // sendRequest(
    //     //   `${URLS?.BaseURL}/MutationAPIS/CreateBhadepattaNondGiver`,
    //     //   "POST",
    //     //   {
    //     //     applicationid: applicationId,
    //     //     village_code: applicationData?.village_code,
    //     //     ctsNo: selectedUserArr[0]?.cts_number,
    //     //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
    //     //     ownerNo: selectedUserArr[0]?.owner_number,
    //     //     userDetails: {
    //     //       ...userDetails,
    //     //       userName: userName,
    //     //       suffix: suffix,
    //     //       suffixEng: suffixEng,
    //     //       suffixcode: suffixcode,
    //     //       suffixCodeEng: suffixCodeEng,
    //     //       subPropNo: subPropNo,
    //     //       nabhu: naBhu,
    //     //       lrPropertyUID: lrPropertyUID,
    //     //       milkat: milkat,
    //     //       namud: namud,
    //     //     },
    //     //     areaOfMutation: {
    //     //       isFullAreaGiven: radio,
    //     //       actualArea: actualArea,
    //     //       mutationArea: mutationArea,
    //     //       availableArea: availableArea,
    //     //     },
    //     //     address: {
    //     //       addressType: isIndian,
    //     //       indiaAddress: indiaAddress,
    //     //     },
    //     //   },
    //     //   (res) => {
    //     //     if (res?.Code == "1") {
    //     //       successToast(res?.Message);
    //     //       handleReset();
    //     //       getBhadepattaDenarTableData();
    //     //     } else {
    //     //       console.error(res?.Message);
    //     //       errorToast(res?.Message);
    //     //     }
    //     //   },
    //     //   (err) => {
    //     //     errorToast(err?.Message);
    //     //   },
    //     // );
    //   } else {
    //     errorToast("Please Check All Fields");
    //   }
    // } else {
    //   const result = await trigger();
    //   const isUserForeignAdd = await isValid.triggerUserForeignAdd();
    //   if (result && isUserForeignAdd) {
    //     successToast("Data is in console !");
    //     console.info("payload->>", {
    //       applicationid: applicationId,
    //       village_code: applicationData?.village_code,
    //       userDetails: {
    //         nabhu: naBhu,
    //         lrPropertyUID: lrPropertyUID,
    //         milkat: milkat,
    //         namud: namud,
    //         subPropNo: subPropNo,
    //       },
    //       address: {
    //         addressType: isIndian,
    //         foreignAddress: foraighnAddress,
    //       },
    //     });

    //     // sendRequest(
    //     //   `${URLS?.BaseURL}/MutationAPIS/CreateBhadepattaNondGiver`,
    //     //   "POST",
    //     //   {
    //     //     applicationid: applicationId,
    //     //     village_code: applicationData?.village_code,
    //     //     ctsNo: selectedUserArr[0]?.cts_number,
    //     //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
    //     //     ownerNo: selectedUserArr[0]?.owner_number,
    //     //     userDetails: {
    //     //       ...userDetails,
    //     //       userName: userName,
    //     //       suffix: suffix,
    //     //       suffixEng: suffixEng,
    //     //       suffixcode: suffixcode,
    //     //       suffixCodeEng: suffixCodeEng,
    //     //       nabhu: naBhu,
    //     //       lrPropertyUID: lrPropertyUID,
    //     //       milkat: milkat,
    //     //       namud: namud,
    //     //       subPropNo: subPropNo,
    //     //     },
    //     //     areaOfMutation: {
    //     //       isFullAreaGiven: radio,
    //     //       actualArea: actualArea,
    //     //       mutationArea: mutationArea,
    //     //       availableArea: availableArea,
    //     //     },
    //     //     address: {
    //     //       addressType: isIndian,
    //     //       foreignAddress: foraighnAddress,
    //     //     },
    //     //   },
    //     //   (res) => {
    //     //     if (res?.Code == "1") {
    //     //       successToast(res?.Message);
    //     //       handleReset();
    //     //       getBhadepattaDenarTableData();
    //     //     } else {
    //     //       errorToast(res?.Message);
    //     //     }
    //     //   },
    //     //   (err) => {
    //     //     errorToast(err?.Message);
    //     //   },
    //     // );
    //   } else {
    //     errorToast("Please Check All Fields");
    //   }
    // }
  };

  const handleNameChange = (e) => {
    const { name, value } = e?.target;
    if (name == "reason") {
      const obj = reasonArr.find((o) => o?.name_change_by_code == value);
      setNameChange({ ...nameChange, reason: obj });
    } else {
      setNameChange({ ...nameChange, [name]: value });
    }
  };

  const setIntialUserType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/applicationTypeList`,
      "POST",
      null,
      (res) => {
        setUserTypeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const getReason = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/reasonForOwnerNameChange`,
      "POST",
      null,
      (res) => {
        if (res?.Code == "1") {
          setReasonArr(JSON.parse(res?.ResponseData));
        } else {
          errorToast(res?.Message);
          setReasonArr([]);
        }
      },
      (err) => {
        console.error(err);
      },
    );
  };
  useEffect(() => {
    getReason();
    setIntialUserType();
  }, []);
  return (
    <>
      <Toast />
      {/*------------------------------------address preview dialog--------------------- */}
      <Dialog onClose={handleDialogClose} open={open} maxWidth="md">
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 4,
              top: 4,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ShowAddress address={addVal} />
        </DialogContent>
      </Dialog>

      <Grid item md={12}>
        <NotesPaper
          heading="नावात बदल माहिती भरण्यासाठी आवश्यक सूचना"
          // arr={mryutupatraDenarNotesArrUnRegistered}
        />
      </Grid>
      <Grid item md={12}>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">नावात बदल माहिती</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Controller
                    name="nabhu"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>अर्जामधील न.भू.क्र. निवडा </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          className="textfield"
                          size="small"
                          value={naBhu}
                          error={errors.nabhu}
                          {...field}
                          onBlur={() => handleBlur("nabhu")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNaBhuNo(e);
                          }}
                        >
                          {Array.isArray(applicationData?.nabhDTL) &&
                            applicationData?.nabhDTL.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.naBhu}
                                  key={val?.naBhu + i}
                                >
                                  {val?.naBhu}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.nabhu && errors.nabhu.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>LR-Property UID</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={lrPropertyUID}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>फेरफारासाठी मिळकत </b>
                  </InputLabel>
                  <RadioGroup
                    row
                    // onChange={handleMilkat}
                    value={milkat}
                  >
                    <FormControlLabel
                      value="land"
                      control={<Radio />}
                      label="जमीन ( NA प्लॉट )"
                      disabled
                    />
                    <FormControlLabel
                      value="flat"
                      control={<Radio />}
                      label="अपार्टमेंट"
                      disabled
                    />
                  </RadioGroup>
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>अर्जामध्ये नमूद मिळकत</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={namud}
                    size="small"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} mb={2}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>नावात बदल होणारा धारक </b>
                      <span>*</span>
                    </InputLabel>
                    <Select
                      fullWidth
                      className="textfield"
                      size="small"
                      value={userName}
                      error={errors.userName}
                      {...field}
                      onBlur={() => handleBlur("userName")}
                      onChange={(e) => {
                        field.onChange(e);
                        handleUserName(e);
                      }}
                    >
                      {Array.isArray(userDataArr) &&
                        userDataArr.map((val, i) => {
                          return (
                            <MenuItem
                              key={val?.owner_number + i}
                              value={val?.owner_name}
                            >
                              {val?.owner_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.userName && errors.userName.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item md={12}>
              <h4 className="heading">नावात बदल माहिती</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>नावात बदल कारण </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          name="reason"
                          fullWidth
                          className="textfield"
                          size="small"
                          value={nameChange?.reason}
                          error={errors.reason}
                          {...field}
                          onBlur={() => handleBlur("reason")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e);
                          }}
                        >
                          {Array.isArray(reasonArr) &&
                            reasonArr.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.name_change_by_code}
                                  key={val?.name_change_by_code + i}
                                >
                                  {val?.name_change_by_description}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.reason && errors.reason.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="no"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>क्रमांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfield"
                          size="small"
                          name="no"
                          value={nameChange?.no}
                          error={errors.no}
                          {...field}
                          onBlur={() => handleBlur("no")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e);
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.no && errors.no.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>दिनांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          className="textfield"
                          name="date"
                          value={nameChange?.date}
                          onFocus={(event) => {
                            event.target.showPicker();
                          }}
                          inputProps={{
                            max: today,
                          }}
                          error={errors.date}
                          {...field}
                          onBlur={() => handleBlur("date")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.date && errors.date.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <h4 className="heading">नावात बदल प्रकार</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  <InputLabel className="inputlabel">
                    <b>नावात बदलाचा प्रकार </b>
                    <span>*</span>
                  </InputLabel>
                  <Select
                    value={userType}
                    onChange={handleChangeUserType}
                    fullWidth
                    className="textfield"
                    size="small"
                  >
                    {Array.isArray(userTypeArr) &&
                      userTypeArr.map((val, i) => {
                        return (
                          <MenuItem
                            value={val?.applicant_category_code}
                            key={i}
                          >
                            {val?.applicant_category_type}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              {userType == 1 ? (
                <UserNoMHProperty
                  heading="नावात बदलाची माहिती"
                  inputlabel="नावातील बदल"
                  userNoMhProp={userNoMhProp}
                  setUserNoMhProp={setUserNoMhProp}
                  setIsValid={setIsValid}
                  isReset={isReset}
                />
              ) : (
                <CompanyNoMHProperty
                  heading="नावात बदलाची माहिती"
                  inputlabel="नावातील बदल"
                  companyNoMhProp={companyNoMhProp}
                  setCompanyNoMhProp={setCompanyNoMhProp}
                  setIsValid={setIsValid}
                  isReset={isReset}
                />
              )}
            </Grid>

            <Grid item md={12}>
              <UserAddress
                type="navatBadal"
                isReset={isReset}
                isEdit={isEdit}
                hasSignature={false}
                isIndian={isIndian}
                setIsIndian={setIsIndian}
                indiaAddress={indiaAddress}
                setIndiaAdress={setIndiaAdress}
                foraighnAddress={foraighnAddress}
                setForaighnAddress={setForaighnAddress}
                setIsValid={setIsValid}
                responseData={responseData}
                isMobileCompulsary={true}
              />
            </Grid>
            <Grid container justifyContent="end" mt={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  // onClick={() => {
                  //   handleReset();
                  // }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  onClick={handleSave}
                  // disabled={responseData.length >= 1}
                  sx={{ mr: 2 }}
                >
                  जतन करा
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default NavatBadalNond;
