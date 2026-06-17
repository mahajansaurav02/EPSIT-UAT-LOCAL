import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { hakkaSodGhenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import { useNavigate } from "react-router-dom";
import ShowAddress from "../../SupportPages/ShowAddress";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const HakkaSodGhenar = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [giver, setGiverData] = useState([]);
  const [isMoreUsers, setIsMoreUsers] = useState("no");
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
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
    holderType: {},
    dob: "",
    motherName: "",
    motherNameEng: "",
    mutationArea: "",
    benefitAmount: "",
  });
  const [dharakArr, setDharakArr] = useState([]);
  const [userDataArr, setUserDataArr] = useState([]);
  const [selectedUserArr, setSelectedUserArr] = useState([]);

  //---------------------------state up data of Address---------------------
  const [isIndian, setIsIndian] = useState("india");
  const [indiaAddress, setIndiaAdress] = useState({
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
  const [foraighnAddress, setForaighnAddress] = useState({
    address: "",
    mobile: "",
    email: "",
    emailOTP: "",
    signatureName: "",
    signatureSrc: "",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);
  const [isReset, setIsReset] = useState(false);

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
        userName: yup.string().required("हक्कसोड देणारा निवडा"),
        // suffixMar: suffixMarathiValidationSchema,
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
        dob: yup.string().required("जन्म तारीख टाका"),
        motherName: yup.string().when("dob", (date, schema) => {
          const selectedDate = new Date(date);
          return selectedDate > thresholdDateOfDOB
            ? schema.required(
                "जन्म तारीख १ मे २०२४ नंतरची असेल तर आईचे नाव टाकणे गरजेचे आहे",
              )
            : schema.notRequired();
        }),
        motherNameEng: yup.string().when("dob", (date, schema) => {
          const selectedDate = new Date(date);
          return selectedDate > thresholdDateOfDOB
            ? schema.required(
                "जन्म तारीख १ मे २०२४ नंतरची असेल तर आईचे नाव इंग्रजीत टाकणे गरजेचे आहे",
              )
            : schema.notRequired();
        }),
        dharakType: yup.string().required("धारक प्रकार निवडा"),
        // mutationArea: yup.string().required("हक्कसोड क्षेत्र टाका"),
      }),
    ),
    defaultValues: {
      dharakType: "",
      dob: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      motherName: "",
      motherNameEng: "",
      // mutationArea: "",
      nabhu: "",
      // suffixMar: "",
      userName: "",
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
    setSubPropNo(obj?.sub_property_no);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
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

  // const handleUserName = (e) => {
  //   setUserDetails({
  //     ...userDetails,
  //     firstName: "",
  //     middleName: "",
  //     lastName: "",
  //   });
  //   const code = e?.target?.value;
  //   const obj = userDataArr.find((o) => o?.owner_name == code);
  //   setUserName(code);
  //   setUserNameObj(obj);
  //   setIsMutationUndergoing(false);
  //   sendRequest(
  //     `${URLS?.BaseURL}/EPCISAPIS/validateMultipleMutationApplications`,
  //     "POST",
  //     {
  //       district_code: applicationData?.district_code,
  //       office_code: applicationData?.taluka_code,
  //       village_code: applicationData?.village_code,
  //       cts_no: obj?.cts_number,
  //       mutation_srno: obj?.mutation_srno,
  //       owner_no: obj?.owner_number,
  //       subprop_no: subPropNo,
  //     },
  //     (res) => {
  //       if (res?.Code == "1") {
  //         setIsMutationUndergoing(true);
  //         errorToast(res?.Message);
  //       } else {
  //         setIsMutationUndergoing(false);
  //         sendRequest(
  //           `${URLS?.BaseURL}/EPCISAPIS/getOwnerDetails`,
  //           "POST",
  //           {
  //             village_code: applicationData?.village_code,
  //             cts_no: obj?.cts_number,
  //             mut_sr_no: obj?.mutation_srno,
  //             owner_no: obj?.owner_number,
  //           },
  //           (res) => {
  //             const arr = JSON.parse(res?.ResponseData);
  //             setSelectedUserArr(arr);
  //             setUserDetails({
  //               ...userDetails,
  //               firstName: arr[0]?.first_name,
  //               middleName: arr[0]?.middle_name,
  //               lastName: arr[0]?.last_name,
  //             });
  //           },
  //           (err) => {
  //             console.error(err);
  //           }
  //         );
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // };

  const handleUserName = (e) => {
    setUserDetails({
      ...userDetails,
      firstName: "",
      middleName: "",
      lastName: "",
    });

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
        // subprop_no: subPropNo,
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
      },
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
  };
  const handleDharakType = (e) => {
    const code = e?.target?.value;
    const obj = dharakArr.find((o) => o?.account_type_code == code);
    setUserDetails({
      ...userDetails,
      holderType: {
        owner_status_code: obj?.account_type_code.toString(),
        owner_status_description: obj?.account_type_description,
      },
    });
  };
  const handleIsMoreUser = (e) => {
    setIsMoreUsers(e?.target?.value);
    if (e?.target?.value == "yes") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setIsMoreUsers("no");
      }, 1000);
    }
  };
  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      if (result && isUserIndAdd) {
        if (isMobileNoVerified) {
          sendRequest(
            `${URLS?.BaseURL}/MutationAPIS/CreateHakkaSodForTaker`,
            "POST",
            {
              giver: giver,
              applicationid: applicationId,
              village_code: applicationData?.village_code,
              ctsNo: selectedUserArr[0]?.cts_number,
              mutationSroNo: selectedUserArr[0]?.mutation_srno,
              ownerNo: selectedUserArr[0]?.owner_number,
              userDetails: {
                ...userDetails,
                userName: userName,
                suffix: suffix,
                suffixEng: suffixEng,
                suffixcode: suffixcode,
                suffixCodeEng: suffixCodeEng,
                subPropNo: subPropNo,
                nabhu: naBhu,
                lrPropertyUID: lrPropertyUID,
                milkat: milkat,
                namud: namud,
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
                getHakkSodGhenarTableData();
              } else {
                console.error(res?.Message);
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            },
          );
        } else {
          warningToast("Please Verify Mobile No.");
        }
      } else {
        errorToast("Please Check All Fields");
      }
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      if (result && isUserForeignAdd) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateHakkaSodForTaker`,
          "POST",
          {
            giver: giver,
            applicationid: applicationId,
            village_code: applicationData?.village_code,
            ctsNo: selectedUserArr[0]?.cts_number,
            mutationSroNo: selectedUserArr[0]?.mutation_srno,
            ownerNo: selectedUserArr[0]?.owner_number,
            userDetails: {
              ...userDetails,
              userName: userName,
              suffix: suffix,
              suffixEng: suffixEng,
              suffixcode: suffixcode,
              suffixCodeEng: suffixCodeEng,
              subPropNo: subPropNo,
              nabhu: naBhu,
              lrPropertyUID: lrPropertyUID,
              milkat: milkat,
              namud: namud,
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
              getHakkSodGhenarTableData();
            } else {
              console.error(res?.Message);
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          },
        );
      } else {
        errorToast("Please Check All Fields");
      }
    }
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteHakkaSodForTaker`,
      "POST",
      {
        mutationId: id,
        applicationId: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getHakkSodGhenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const handleReset = () => {
    setSuffix("");
    setSuffixEng("");
    setUserName("");
    setNamud("");
    setMilkat("land");
    setLrPropertyUID("");
    setNaBhu("");
    setUserDetails({
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      aliceName: "",
      holderType: {},
      dob: "",
      motherName: "",
      motherNameEng: "",
      mutationArea: "",
      benefitAmount: "",
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
    setIsMoreUsers("no");
    reset();
    setIsReset(!isReset);
  };

  const getHakkaSodDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetHakkasodInfoForGiver`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          // setGiverData(res?.ResponseData);
          const data = res?.ResponseData;
          // const result = data.map(
          //   ({ mutation_givertaker_id, userDetails, ActualctsNo }) => ({
          //     mutation_dtl_id: mutation_givertaker_id,
          //     nabhu: ActualctsNo,
          //     subPropNo: userDetails?.subPropNo,
          //   })}
          const result = [
            {
              mutation_dtl_id: data[0]?.mutation_givertaker_id,
              nabhu: data[0]?.ActualctsNo,
              subPropNo: data[0]?.userDetails?.subPropNo,
            },
          ];

          setGiverData(result);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const getHakkSodGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetHakkaSodTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setResponseData([]);
          } else {
            errorToast(res?.Message);
          }
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
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
      },
    );
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
      },
    );
  };

  useEffect(() => {
    getHakkaSodDenarTableData();
    getHakkSodGhenarTableData();
    setDharakType();
    getSuffix();
  }, []);

  useEffect(() => {
    if (responseData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    }
  }, [responseData]);

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
          heading="हक्कसोड घेणाराची माहिती भरण्यासाठी आवश्यक सूचना"
          arr={hakkaSodGhenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 className="heading">हक्कसोड घेणार</h4>
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
                    <b>हक्कसोड घेणाराचे नाव </b>
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
                हक्कसोड घेणाराचे नाव <span> *</span> (इंग्रजी मध्ये)
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
              <Grid item md={3.5}>
                <Controller
                  name="dharakType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>धारक प्रकार </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        name="dharakType"
                        fullWidth
                        className="textfield"
                        size="small"
                        value={userDetails?.dharakType}
                        error={errors.dharakType}
                        {...field}
                        onBlur={() => handleBlur("dharakType")}
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
                        {errors.dharakType && errors.dharakType.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3.5}>
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
                        value={userDetails?.dob}
                        onClick={(event) => {
                          if (event.target.showPicker) {
                            event.target.showPicker();
                          }
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
                          handleUserDetails(e);
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
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>हक्कसोड क्षेत्र (चौ.मी.) </b>
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
                  value={userDetails?.mutationArea}
                  name="mutationArea"
                  onChange={handleUserDetails}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>मोबदला रक्कम (रु.)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  className="textfield"
                  value={userDetails?.benefitAmount}
                  name="benefitAmount"
                  onChange={handleUserDetails}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type="hakksodGhenar"
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
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          </Grid>

          {responseData.length > 0 && (
            <Grid item md={12}>
              <Grid
                container
                alignItems="center"
                spacing={4}
                justifyContent="flex-end"
              >
                <Grid
                  item
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <Typography variant="h5" fontSize="14px" fontWeight={600}>
                    आणखी हक्कसोड घेणार आहे का?
                  </Typography>
                </Grid>

                <Grid item>
                  <RadioGroup
                    row
                    onChange={handleIsMoreUser}
                    value={isMoreUsers}
                    defaultValue="no"
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="होय"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="नाही"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Grid>
          )}

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
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>हक्कसोड घेणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>अर्जमाधील न. भू. क्र.</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>फेरफरसाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>हक्कसोड देणाराचे नाव</TableCell>
                <TableCell>हक्कसोड घेणाऱ्याचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>धारक प्रकार</TableCell>
                <TableCell>हक्कसोड क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>मोबदला रक्कम (रु.)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(responseData) &&
                responseData.map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {applicationData?.district_name_in_marathi} /{" "}
                        {applicationData?.taluka_name} /{" "}
                        {applicationData?.village_name}
                      </TableCell>
                      <TableCell>{val?.ctsNo}</TableCell>
                      <TableCell>{val?.userDetails?.lrPropertyUID}</TableCell>
                      <TableCell>
                        {val?.userDetails?.milkat == "land"
                          ? " भूखंड / जमीन (प्लॉट)"
                          : "अपार्टमेंट"}
                      </TableCell>
                      <TableCell>{val?.userDetails?.namud}</TableCell>
                      <TableCell>{val?.fullNameInMarathi}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => showAddress(val)}
                        >
                          पत्ता पहा
                        </Button>
                      </TableCell>
                      <TableCell>{val?.userDetails?.aliceName}</TableCell>
                      <TableCell>
                        {val?.userDetails?.holderType?.owner_status_description}
                      </TableCell>
                      <TableCell>
                        {val?.userDetails?.mutationArea
                          ? val?.userDetails?.mutationArea
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.userDetails?.benefitAmount
                          ? val?.userDetails?.benefitAmount
                          : "-"}
                      </TableCell>
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
    </>
  );
};

export default HakkaSodGhenar;
