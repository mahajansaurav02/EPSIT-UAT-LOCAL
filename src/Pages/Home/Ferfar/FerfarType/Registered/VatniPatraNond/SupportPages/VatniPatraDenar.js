import { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import UserAddress from "../../SupportPages/UserAddress";
import {
  firstNameEnglishValidationSchema,
  lastNameEnglishValidationSchema,
  middleNameEnglishValidationSchema,
  nabhuValidationSchema,
  thresholdDateOfDOB,
} from "../../../../../../../Validations/yupValidations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast, warningToast } from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { vatanipatraDenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import ShowAddress from "../../SupportPages/ShowAddress";
import CloseIcon from "@mui/icons-material/Close";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const VatniPatraDenar = ({ setActiveStep, applicationData, setDisableShowNextBtn }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [isMoreUsers, setIsMoreUsers] = useState("no");
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameObj, setUserNameObj] = useState({});
  const [suffixArr, setSuffixArr] = useState([]);
  const [suffixcode, setSuffixCode] = useState("");
  const [suffixCodeEng, setSuffixCodeEng] = useState("");
  const [suffix, setSuffix] = useState("");
  const [suffixEng, setSuffixEng] = useState("");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    aliceName: "",
    dob: "",
    motherName: "",
    motherNameEng: "",
  });

  const [radio, setRadio] = useState("yes");
  const [actualArea, setActualArea] = useState("");
  const [availableArea, setAvailableArea] = useState("");
  const [mutationArea, setMutationArea] = useState("");
  const [userDataArr, setUserDataArr] = useState([]);
  const [selectedUserArr, setSelectedUserArr] = useState([]);
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
  });
  const [foraighnAddress, setForaighnAddress] = useState({
    address: "",
    mobile: "",
    email: "",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);
  const [ghenarData, setGhenarData] = useState([]);

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
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
        userName: yup.string().required("वाटणीपत्र देणारा निवडा"),
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
      nabhu: "",
      userName: "",
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
  const handleNaBhuNo = (e) => {
    const code = e?.target?.value;
    setNaBhu(e?.target?.value);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    setActualArea(obj?.cityServeyAreaInSqm);
    if (obj?.milkat != "land") {
      setAvailableArea(obj?.cityServeyAreaInSqm);
      setMutationArea(obj?.cityServeyAreaInSqm);
    } else {
      setAvailableArea("");
      setMutationArea("");
    }
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
      }
    );
  };

  const handleUserName = (e) => {
    setUserDetails({
      ...userDetails,
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      motherName: "",
      motherNameEng: "",
    });
    const code = e?.target?.value;
    const obj = userDataArr.find((o) => o?.owner_name == code);
    setUserName(code);
    setUserNameObj(obj);
    setIsMutationUndergoing(false);
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/validateMultipleMutationApplications`,
      "POST",
      {
        district_code: applicationData?.district_code,
        office_code: applicationData?.taluka_code,
        village_code: applicationData?.village_code,
        cts_no: obj?.cts_number,
        mutation_srno: obj?.mutation_srno,
        owner_no: obj?.owner_number,
        subprop_no: subPropNo,
      },
      (res) => {
        if (res?.Code == "1") {
          setIsMutationUndergoing(true);
          errorToast(res?.Message);
        } else {
          setIsMutationUndergoing(false);
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
              setUserDetails({
                ...userDetails,
                firstName: arr[0]?.first_name,
                middleName: arr[0]?.middle_name,
                lastName: arr[0]?.last_name,
              });
            },
            (err) => {
              console.error(err);
            }
          );
        }
      },
      (err) => {
        console.error(err);
      }
    );
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
      setMutationArea(actualArea);
    } else {
      setMutationArea("");
    }
  };
  const handleMutationArea = (e) => {
    const value = e?.target?.value;
    setMutationArea(value);
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

  const handleSave = async () => {
    const isFormValid = await trigger();

    let isAddressValid = false;

    if (isIndian === "india") {
      isAddressValid = await isValid.triggerUserIndAdd();
    } else {
      isAddressValid = await isValid.triggerUserForeignAdd();
    }

    if (!isFormValid || !isAddressValid) {
      warningToast("Please Check All Fields !!");
      return;
    }
    const payload = {
      applicationid: applicationId,
      village_code: applicationData?.village_code,
      ctsNo: naBhu,
      mutationSrNo: applicationData?.mutation_type_code,
      ownerNo: "",
      userDetails: {
        suffix,
        suffixcode,
        suffixEng,
        suffixCodeEng,
        firstName: userDetails?.firstName,
        middleName: userDetails?.middleName,
        lastName: userDetails?.lastName,
        firstNameEng: userDetails?.firstNameEng,
        middleNameEng: userDetails?.middleNameEng,
        lastNameEng: userDetails?.lastNameEng,
        aliceName: userDetails?.aliceName,
        dob: userDetails?.dob,
        motherName: userDetails?.motherName,
        motherNameEng: userDetails?.motherNameEng,
        nabhu: naBhu,
        lrPropertyUID,
        milkat,
        namud,
        subPropNo,
      },
      areaForMutation: {
        actualArea,
        availableArea,
        mutationArea,
        isFullAreaGiven: radio === "yes",
      },
      address: {
        addressType: isIndian,
        ...(isIndian === "india"
          ? {
            indiaAddress,
          }
          : {
            foreignAddress: foraighnAddress,
          }),
      },
    };

    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/CreateVataniPatraForGiver`,
      "POST",
      payload,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          handleReset();
          getDenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetVataniPatraGiverInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          setResponseData([])
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  }

  const getGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetVataniPatraNondTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setGhenarData(res?.ResponseData);
        } else {
          setGhenarData([])
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  }

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteVataniPatraNondForGiver`,
      "POST",
      {
        applicationId,
        MutationId: id
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getDenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  }

  const handleDeleteGhenar = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteVataniPatraNondForTaker`,
      "POST",
      {
        applicationId,
        mutationId: id
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getGhenarTableData()
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  }

  const handleReset = () => {
    reset()
    setNaBhu("");
    setLrPropertyUID("");
    setMilkat("land");
    setNamud("");
    setSubPropNo("");
    setActualArea("");
    setIsIndian("india");
    setAvailableArea("");
    setSuffix("");
    setSuffixEng("");
    setMutationArea("");
    setUserDetails({
      firstName: "",
      middleName: "",
      lastName: "",
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
    });
    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "",
    });
    setIsMoreUsers("no");
    setIsReset(!isReset);
  }

  useEffect(() => {
    getSuffix();
    getDenarTableData();
    getGhenarTableData()
  }, []);

  useEffect(() => {
    const completed = responseData.length > 0 && ghenarData.length > 0;

    sessionStorage.setItem(
      "allowPoa",
      completed ? "yes" : "no"
    );

    setDisableShowNextBtn(!completed);
  }, [responseData, ghenarData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          heading="वाटणीपत्र देणाराची माहिती भरण्यासाठी आवश्यक सूचना"
          arr={vatanipatraDenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">वाटणीपत्र देणार</h4>
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
                              <MenuItem value={val?.naBhu} key={val?.naBhu + i}>
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
                <RadioGroup row value={milkat}>
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
                    <b>वाटणीपत्र देणाराचे नाव </b>
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
                <TextField
                  fullWidth
                  value={userDetails?.firstName}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  value={userDetails?.middleName}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  value={userDetails?.lastName}
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
                वाटणीपत्र देणाराचे नाव <span> *</span> (इंग्रजी मध्ये)
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
                        value={userDetails?.middleNameEng}
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
                        value={userDetails?.lastNameEng}
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
                {/* <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <> */}
                <InputLabel className="inputlabel">
                  <b>जन्म दिनांक </b>
                  {/* <span>*</span> */}
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
                  // error={errors.dob}
                  // {...field}
                  // onBlur={() => handleBlur("dob")}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  //   handleUserDetails(e);
                  // }}
                  onChange={handleUserDetails}
                  size="small"
                />
                {/* <FormHelperText sx={{ color: "red" }}>
                        {errors.dob && errors.dob.message}
                      </FormHelperText>
                    </>
                  )}
                /> */}
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
                          आईचे नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:-
                          kaashi &gt;&gt; काशी)
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
                  value={actualArea}
                  disabled
                  className="textfieldDisabled"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>वाटणीपत्र देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</b>
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
                        e.target.value =
                          value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                      }
                    },
                  }}
                  size="small"
                  className={
                    milkat != "land" ? "textfieldDisabled" : "textfield"
                  }
                  value={milkat != "land" ? actualArea : availableArea}
                  disabled={milkat != "land"}
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
                    disabled={milkat != "land"}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={milkat != "land"}
                  />
                </RadioGroup>
              </Grid>
              <Grid item md={3}>
                {radio == "yes" ? (
                  <>
                    <InputLabel className="inputlabel">
                      <b>वाटणीपत्र दिलेले क्षेत्र (चौ.मी.)</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      value={milkat != "land" ? actualArea : availableArea}
                      disabled
                      className="textfieldDisabled"
                    />
                  </>
                ) : (
                  <>
                    <InputLabel className="inputlabel">
                      <b>वाटणीपत्र दिलेले क्षेत्र (चौ.मी.) </b>
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
              type="vatniPatraDenar"
              isReset={isReset}
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
                disabled={isMutationUndergoing}
                sx={{ mr: 2 }}
              >
                जतन करा
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setActiveStep(1)}
                disabled={responseData.length == 0}
              >
                वाटणीपत्र घेणाऱ्याची माहिती भरा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>वाटणीपत्र देणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>अर्जमधील न. भू. क्र.</TableCell>
                <TableCell>Sub Property No.</TableCell>
                <TableCell>फेरफारासाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>वाटणीपत्र देणाराचे नाव</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>वाटणीपत्र देणाऱ्याचा पत्ता</TableCell>
                <TableCell>मिळकत पत्रिके प्रमाणे क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>
                  वाटणीपत्र देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)
                </TableCell>
                <TableCell>वाटणीपत्र दिलेले क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(responseData) &&
                responseData.map((val, i) => {
                  return (
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{applicationData?.district_name_in_marathi} /{" "}
                        {applicationData?.taluka_name} /{" "}
                        {applicationData?.village_name}</TableCell>
                      <TableCell>{val?.userDetails?.lrPropertyUID}</TableCell>
                      <TableCell>{val?.userDetails?.nabhu}</TableCell>
                      <TableCell>{val?.userDetails?.subPropNo}</TableCell>
                      <TableCell> {val?.userDetails?.milkat == "land"
                        ? "भूखंड / जमीन (प्लॉट)"
                        : "अपार्टमेंट"}</TableCell>
                      <TableCell>{val?.userDetails?.namud}</TableCell>
                      <TableCell>{val?.fullNameInMarathi}</TableCell>
                      <TableCell>{val?.userDetails?.aliceName}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => showAddress(val)}
                        >
                          पत्ता पहा
                        </Button>
                      </TableCell>
                      <TableCell>{val?.areaForMutation?.actualArea}</TableCell>
                      <TableCell>{val?.areaForMutation?.availableArea}</TableCell>
                      <TableCell>{val?.areaForMutation?.mutationArea}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(val?.mutation_dtl_id)}
                        >
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {ghenarData?.length > 0 && (
        <Grid item md={12} mt={3}>
          <TableContainer component={Paper} elevation={5}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 20,
              }}
            >
              <h3 style={{ marginLeft: 20 }}>वाटणीपत्र घेणार माहिती तक्ता</h3>
              <Button
                onClick={() => setActiveStep(1)}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                आणखी वाटणीपत्र घेणाऱ्याची माहिती भरा
              </Button>
            </div>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                  <TableCell>वाटणीपत्र घेणाराचा प्रकार</TableCell>
                  <TableCell>वाटणीपत्र घेणाराचे नाव</TableCell>
                  <TableCell>उर्फ नाव</TableCell>
                  <TableCell>धारक प्रकार</TableCell>
                  <TableCell>स्त्री /पुरुष</TableCell>
                  <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                  <TableCell>जन्म दिनांक</TableCell>
                  <TableCell>अ.पा.क</TableCell>
                  <TableCell>वाटणीपत्र घेणाराचा पत्ता</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(ghenarData) &&
                  ghenarData.map((val, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {applicationData?.district_name_in_marathi} /{" "}
                          {applicationData?.taluka_name} /{" "}
                          {applicationData?.village_name}
                        </TableCell>
                        <TableCell>{val?.userType}</TableCell>
                        <TableCell>{val?.fullNameInMarathi}</TableCell>
                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.aliceName
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.holderType
                              ?.owner_status_description
                            : val?.dharak?.companydharak?.holderType
                              ?.owner_status_description}
                        </TableCell>

                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.gender?.gender_description
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.aapakDropdown
                              ?.apk_description
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.dob
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {val?.userType == "व्यक्ती"
                            ? val?.dharak?.userdharak?.aapak
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showAddress(val)}
                          >
                            पत्ता पहा
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteGhenar(val?.mutation_dtl_id)}
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </>
  );
};

export default VatniPatraDenar;
