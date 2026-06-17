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
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import UserAddress from "../../SupportPages/UserAddress";
import {
  firstNameEnglishValidationSchema,
  lastNameEnglishValidationSchema,
  middleNameEnglishValidationSchema,
  nabhuValidationSchema,
  suffixMarathiValidationSchema,
} from "../../../../../../../Validations/yupValidations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast } from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { mayatDharakNotesArr } from "../../../../../../../NotesArray/NotesArray";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import { useNavigate } from "react-router-dom";
import ShowAddress from "../../SupportPages/ShowAddress";
import Swal from "sweetalert2";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const MayatDharak = ({ setActiveStep, applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const navigate = useNavigate();
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
  });

  const [actualArea, setActualArea] = useState("");
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

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);
  const [varasData, setVarasData] = useState([]);

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
        userName: yup.string().required("मयत धारकाचे नाव निवडा"),
        // suffixMar: suffixMarathiValidationSchema,
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
      }),
    ),
    defaultValues: {
      nabhu: "",
      userName: "",
      // suffixMar: "",
      firstNameEng: "",
      lastNameEng: "",
      middleNameEng: "",
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
    setActualArea(obj?.cityServeyAreaInSqm);
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
  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      if (result && isUserIndAdd) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateMayatDharak`,
          "POST",
          {
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
            areaForMutation: {
              actualArea: actualArea,
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
              getMayatDharakTableData();
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
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      if (result && isUserForeignAdd) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateMayatDharak`,
          "POST",
          {
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
            areaForMutation: {
              actualArea: actualArea,
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
              getMayatDharakTableData();
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
  const handleReset = () => {
    setSuffix("");
    setSuffixEng("");
    setUserName("");
    setNamud("");
    setMilkat("land");
    setLrPropertyUID("");
    setNaBhu("");
    setActualArea("");
    setUserDetails({
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      aliceName: "",
    });
    setIsIndian("india");
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
  const handleDelete = (id) => {
    if (responseData.length == 1) {
      Swal.fire({
        title: `<p style="font-size: 0.8em;">मृत्यू दाखला व वारस सुद्धा डिलीट होतील !</p>`,
        html: '<span style="color: red;">डिलीट झाल्यानंतर पुन्हा नवीन मृत्यू दाखला व वारसांची माहिती भरावी लागतील</span>',
        position: "center",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "हो मी सहमत आहे",
        cancelButtonText: "नाही",
      }).then((result) => {
        if (result.isConfirmed) {
          sendRequest(
            `${URLS?.BaseURL}/MutationAPIS/DeleteMayatDharak`,
            "POST",
            {
              MayatId: id,
              applicationId: applicationId,
            },

            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                Swal.fire(
                  "Deleted!",
                  "मयत धारक तसेच वारस डिलीट झालेले आहे",
                  "success",
                );
                getMayatDharakTableData();
                getVarasTableData();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            },
          );
        }
      });
    }

    // sendRequest(
    //   `${URLS?.BaseURL}/MutationAPIS/DeleteMayatDharak`,
    //   "POST",
    //   {
    //     MayatId: id,
    //     applicationId: applicationId,
    //   },
    //   (res) => {
    //     if (res?.Code == "1") {
    //       successToast(res?.Message);
    //       getMayatDharakTableData();
    //     } else {
    //       errorToast(res?.Message);
    //     }
    //   },
    //   (err) => {
    //     errorToast(err?.Message);
    //   }
    // );
  };
  const getVarasTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetVarasNondInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setVarasData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setVarasData([]);
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
  const getMayatDharakTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetMayatDharakInfo`,
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
    getVarasTableData();
    getMayatDharakTableData();
    getSuffix();
  }, []);

  useEffect(() => {
    if (varasData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    } else {
      sessionStorage.setItem("allowPoa", "no");
    }
  }, [varasData]);

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
          heading="मयत धारक माहिती भरण्यासाठी आवश्यक सूचना"
          arr={mayatDharakNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">मयत धारक</h4>
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
          <Grid item md={4} mb={1}>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>मयत धारकाचे नाव </b>
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
                मयत धारकाचे नाव <span> *</span> (इंग्रजी मध्ये)
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
                <InputLabel className="inputlabel">
                  <b>मिळकत क्षेत्र (चौ.मी.) </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={actualArea}
                  disabled
                  className="textfieldDisabled"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type="mayatDharak"
              hasSignature={false}
              isReset={isReset}
              setIsIndian={setIsIndian}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
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
                sx={{ mr: 2 }}
                disabled={isMutationUndergoing || responseData.length >= 1}
              >
                जतन करा
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setActiveStep(1)}
                disabled={responseData.length == 0}
              >
                मृत्यू दाखल्याची माहिती भरा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>मयत धारक माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>अर्जामध्ये न.भू.क्र.</TableCell>
                <TableCell>Sub Property No.</TableCell>
                <TableCell>फेरफरसाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>मयत धारकाचे नाव</TableCell>
                <TableCell>मयत धारकाचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>मिळकत क्षेत्र (चौ.मी.)</TableCell>
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
                      <TableCell>{val?.userDetails?.lrPropertyUID}</TableCell>
                      <TableCell>{val?.userDetails?.nabhu}</TableCell>
                      <TableCell>{val?.userDetails?.subPropNo}</TableCell>
                      <TableCell>
                        {milkat == "land"
                          ? "भूखंड / जमीन (प्लॉट)"
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
                      <TableCell>
                        {val?.userDetails?.aliceName
                          ? val?.userDetails?.aliceName
                          : "-"}
                      </TableCell>
                      <TableCell>{val?.areaForMutation?.actualArea}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(val?.mayat_id)}
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

      {varasData.length > 0 && (
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
              <h3 style={{ marginLeft: 20 }}>वारस माहिती तक्ता</h3>
              <Button
                onClick={() => setActiveStep(2)}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                आणखी वारसाची माहिती भरा
              </Button>
            </div>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell>वारस प्रकार</TableCell>
                  <TableCell>वारसाचे नाव</TableCell>
                  <TableCell>वारसाचा पत्ता</TableCell>
                  <TableCell>उर्फ नाव</TableCell>
                  <TableCell>धारक प्रकार</TableCell>
                  <TableCell>धारकाशी नाते</TableCell>
                  <TableCell>स्त्री /पुरुष</TableCell>
                  <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                  <TableCell>जन्म दिनांक</TableCell>
                  <TableCell>अ.पा.क</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(varasData) &&
                  varasData.map((val, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {applicationData?.district_name_in_marathi} /{" "}
                          {applicationData?.taluka_name} /{" "}
                          {applicationData?.village_name}
                        </TableCell>
                        <TableCell>{val?.usertype}</TableCell>
                        <TableCell>{val?.fullNameInMarathi}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showAddress(val)}
                          >
                            पत्ता पहा
                          </Button>
                        </TableCell>
                        <TableCell>{val?.dharak?.aliceName}</TableCell>
                        <TableCell>
                          {val?.dharak?.holderType?.account_type_description}
                        </TableCell>
                        <TableCell>
                          {val?.dharak?.deadRelation?.relation_name}
                        </TableCell>
                        <TableCell>
                          {val?.dharak?.gender?.gender_description}
                        </TableCell>
                        <TableCell>
                          {val?.dharak?.aapakDropdown?.apk_description}
                        </TableCell>
                        <TableCell>{val?.dharak?.dob}</TableCell>
                        <TableCell>{val?.dharak?.aapak}</TableCell>
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

export default MayatDharak;
