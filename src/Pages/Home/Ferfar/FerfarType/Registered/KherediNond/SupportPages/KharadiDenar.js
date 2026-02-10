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
  Typography,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
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
import { errorToast, successToast, Toast } from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { kherediDenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import Swal from "sweetalert2";
import ShowAddress from "../../SupportPages/ShowAddress";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const KharediDenar = ({ setActiveStep, nabhuDataArr, applicationData }) => {
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
  const [isMoreUsers, setIsMoreUsers] = useState("no");

  const [radio, setRadio] = useState("yes");
  const [actualArea, setActualArea] = useState("");
  const [actualDharakArea, setActualDharakArea] = useState("");
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
  const [ghenarData, setGhenarData] = useState([]);

  //------------------------------Edit State---------------------------------
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [editObj, setEditObj] = useState({});

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
        userName: yup.string().required("खरेदी देणारा निवडा"),
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
        dob: yup.date().nullable().typeError("अवैध जन्म तारीख"),
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
      }),
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
    const obj = nabhuDataArr.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    setActualArea(obj?.cityServeyAreaInSqm);
    if (obj?.milkat != "land") {
      setActualDharakArea(obj?.cityServeyAreaInSqm);
      setMutationArea(obj?.cityServeyAreaInSqm);
    } else {
      setActualDharakArea("");
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
    // const obj = userDataArr.find(
    //   (o) => `${o?.mutation_srno}${o?.owner_number}` == code
    // );
    setUserName(code);
    // setUserName(obj?.owner_name);
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
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForGiver`,
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
              isFullAreaGiven: radio,
              actualArea: actualArea,
              mutationArea: mutationArea,
              actualDharakArea: actualDharakArea,
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
              getKherediDenarTableData();
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
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForGiver`,
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
              nabhu: naBhu,
              lrPropertyUID: lrPropertyUID,
              milkat: milkat,
              namud: namud,
              subPropNo: subPropNo,
            },
            areaForMutation: {
              isFullAreaGiven: radio,
              actualArea: actualArea,
              mutationArea: mutationArea,
              actualDharakArea: actualDharakArea,
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
              getKherediDenarTableData();
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
    setIsHardEdit(false);
    setIsEdit(false);
    setSuffix("");
    setSuffixEng("");
    setUserName("");
    setNamud("");
    setMilkat("land");
    setLrPropertyUID("");
    setNaBhu("");
    setRadio("yes");
    setActualArea("");
    setMutationArea("");
    setActualDharakArea("");
    setIsMoreUsers("no");
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
  const handleEditDetails = () => {
    setIsEdit(false);
    setNaBhu("");
    setLrPropertyUID("");
    reset();
  };

  const handleEdit = async (id) => {
    setIsHardEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const obj = responseData.find((o) => o?.mutation_dtl_id == id);
    setEditId(obj?.mutation_cts_no_id);
    setEditObj(obj);
    setIsEdit(true);
    setLrPropertyUID(obj?.userDetails?.lrPropertyUID);
    setMilkat(obj?.userDetails?.milkat);
    setNamud(obj?.userDetails?.namud);
    setSuffixCode(obj?.userDetails?.suffixcode);
    setSuffixCodeEng(obj?.userDetails?.suffixCodeEng);
    setSuffix(obj?.userDetails?.suffix);
    setSuffixEng(obj?.userDetails?.suffixEng);
    setUserDetails({
      firstName: obj?.userDetails?.firstName,
      middleName: obj?.userDetails?.firstName,
      lastName: obj?.userDetails?.lastName,
      firstNameEng: obj?.userDetails?.firstNameEng,
      middleNameEng: obj?.userDetails?.middleNameEng,
      lastNameEng: obj?.userDetails?.lastNameEng,
      aliceName: obj?.userDetails?.aliceName,
      dob: obj?.userDetails?.dob,
      motherName: obj?.userDetails?.motherName,
      motherNameEng: obj?.userDetails?.motherNameEng,
    });
    setRadio(obj?.areaForMutation?.isFullAreaGiven);
    setActualArea(obj?.areaForMutation?.actualArea);
    setActualDharakArea(obj?.areaForMutation?.actualDharakArea);
    setMutationArea(obj?.areaForMutation?.mutationArea);
    setIsIndian(obj?.address?.addressType == "INDIA" ? "india" : "foreign");
    if (obj?.address?.addressType == "INDIA") {
      setIndiaAdress({
        plotNo: obj?.address?.indiaAddress?.plotNo,
        building: obj?.address?.indiaAddress?.building,
        mainRoad: obj?.address?.indiaAddress?.mainRoad,
        impSymbol: obj?.address?.indiaAddress?.impSymbol,
        area: obj?.address?.indiaAddress?.area,
        mobile: obj?.address?.indiaAddress?.mobile,
        mobileOTP:
          obj?.address?.indiaAddress?.mobileOTP == "yes"
            ? "Verified"
            : "Not Verified",
        pincode: obj?.address?.indiaAddress?.pincode,
        postOfficeName: obj?.address?.indiaAddress?.postOfficeName,
        city: obj?.address?.indiaAddress?.city,
        taluka: obj?.address?.indiaAddress?.taluka,
        district: obj?.address?.indiaAddress?.district,
        state: obj?.address?.indiaAddress?.state,
        addressProofName: obj?.address?.indiaAddress?.addressProofName,
        addressProofSrc: obj?.address?.indiaAddress?.addressProofSrc,
        signatureName: "",
        signatureSrc: "",
      });
    } else {
      setForaighnAddress({
        address: obj?.address?.foreignAddress?.address,
        mobile: obj?.address?.foreignAddress?.mobile,
        email: obj?.address?.foreignAddress?.email,
        emailOTP:
          obj?.address?.foreignAddress?.emailOTP == "yes"
            ? "Verified"
            : "Not Verified",
        signatureName: "",
        signatureSrc: "",
      });
    }

    setValue("nabhu", obj?.userDetails?.nabhu);
    setValue("userName", obj?.userDetails?.userName);
    setValue("firstNameEng", obj?.userDetails?.firstNameEng);
    setValue("middleNameEng", obj?.userDetails?.middleNameEng);
    setValue("lastNameEng", obj?.userDetails?.lastNameEng);
    setValue("motherName", obj?.userDetails?.motherName);
    setValue("motherNameEng", obj?.userDetails?.motherNameEng);
  };
  const handleDelete = (id) => {
    if (responseData.length == 1) {
      Swal.fire({
        title: `<p style="font-size: 0.8em;">खरेदी घेणारे सुद्धा डिलीट होतील !</p>`,
        html: '<span style="color: red;">डिलीट झाल्यानंतर पुन्हा नवीन खरेदी देणारे-घेणारे भरावे लागतील</span>',
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
            `${URLS?.BaseURL}/MutationAPIS/DeleteKharediNondForGiver`,
            "POST",
            {
              mutationId: id,
              applicationId: applicationId,
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                Swal.fire(
                  "Deleted!",
                  "खरेदी देणारा घेणारा डिलीट झालेला आहे",
                  "success",
                );
                getKherediDenarTableData();
                getKherediGhenarTableData();
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
    } else {
      sendRequest(
        `${URLS?.BaseURL}/MutationAPIS/DeleteKharediNondForGiver`,
        "POST",
        {
          mutationId: id,
          applicationId: applicationId,
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            getKherediDenarTableData();
          } else {
            errorToast(res?.Message);
          }
        },
        (err) => {
          errorToast(err?.Message);
        },
      );
    }
  };
  const getKherediGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetKharediNondTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setGhenarData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setGhenarData([]);
          } else if (res?.ResponseData != "") {
            errorToast(res?.Message);
          }
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const getKherediDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetKharediNondGiverInfo`,
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
    getKherediGhenarTableData();
    getKherediDenarTableData();
    getSuffix();
  }, []);

  useEffect(() => {
    if (ghenarData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    } else {
      sessionStorage.setItem("allowPoa", "no");
    }
  }, [ghenarData]);

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
          heading="खरेदी देणाराची माहिती भरण्यासाठी आवश्यक सूचना"
          arr={kherediDenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">खरेदी देणार</h4>
          </Grid>
          {isEdit && (
            <Grid item md={12}>
              <Button
                onClick={handleEditDetails}
                variant="outlined"
                startIcon={<EditNoteOutlinedIcon />}
              >
                खरेदी देणाराच्या माहितीत बदल करा
              </Button>
            </Grid>
          )}
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                {isEdit ? (
                  <>
                    <InputLabel className="inputlabel">
                      <b>अर्जामधील न.भू.क्र.</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfieldDisabled"
                      size="small"
                      disabled
                      value={editObj?.userDetails?.nabhu}
                    />
                  </>
                ) : (
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
                          {Array.isArray(nabhuDataArr) &&
                            nabhuDataArr.map((val, i) => {
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
                )}
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
            {isEdit ? (
              <>
                <InputLabel className="inputlabel">
                  <b>खरेदी देणाराचे नाव</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  size="small"
                  disabled
                  value={editObj?.userDetails?.userName}
                />
              </>
            ) : (
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>खरेदी देणाराचे नाव </b>
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
                              // value={`${val?.mutation_srno}${val?.owner_number}`}
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
            )}
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between">
              <Grid item md={2}>
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={suffix}
                  />
                ) : (
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
                )}
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
            {!isEdit && (
              <InputLabel className="inputlabel">
                <b>
                  खरेदी देणाराचे नाव <span> *</span> (इंग्रजी मध्ये)
                </b>
              </InputLabel>
            )}
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
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={userDetails?.firstNameEng}
                  />
                ) : (
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
                )}
              </Grid>
              <Grid item md={3}>
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={userDetails?.middleNameEng}
                  />
                ) : (
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
                )}
              </Grid>
              <Grid item md={3}>
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={userDetails?.lastNameEng}
                  />
                ) : (
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
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                {isEdit ? (
                  <>
                    <InputLabel className="inputlabel">
                      <b>उर्फ नाव</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfieldDisabled"
                      size="small"
                      disabled
                      value={userDetails?.aliceName}
                    />
                  </>
                ) : (
                  <>
                    <InputLabel className="inputlabel">
                      <b>
                        उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:-
                        mahesh &gt;&gt; महेश)
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
                  </>
                )}
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>जन्म दिनांक </b>
                </InputLabel>
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={userDetails?.dob}
                  />
                ) : (
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: today,
                      min: "1900-01-01",
                    }}
                    onChange={handleUserDetails}
                    size="small"
                  />
                )}
              </Grid>
            </Grid>
            <Grid container mt={1}>
              <Grid item md={5}>
                {isEdit ? (
                  <>
                    <InputLabel className="inputlabel">
                      <b>आईचे नाव</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfieldDisabled"
                      size="small"
                      disabled
                      value={userDetails?.motherName}
                    />
                  </>
                ) : (
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
                              filterOnlyMarathiAndEnglishLettersWithSpaces(
                                value,
                              );
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
                )}
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={userDetails?.motherNameEng}
                    sx={{ mt: 1 }}
                  />
                ) : (
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
                )}
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
                  <b>खरेदी देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                {isEdit ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={actualDharakArea}
                  />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    className={
                      milkat != "land" ? "textfieldDisabled" : "textfield"
                    }
                    value={milkat != "land" ? actualArea : actualDharakArea}
                    disabled={milkat != "land"}
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
                    onChange={(e) => {
                      setActualDharakArea(e?.target?.value);
                      setMutationArea(e?.target?.value);
                    }}
                  />
                )}
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
                    disabled={milkat != "land" || isEdit}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={milkat != "land" || isEdit}
                  />
                </RadioGroup>
              </Grid>
              {isEdit ? (
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>खरेदी दिलेले क्षेत्र (चौ.मी.)</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={mutationArea}
                  />
                </Grid>
              ) : (
                <Grid item md={3}>
                  {radio == "yes" ? (
                    <>
                      <InputLabel className="inputlabel">
                        <b>खरेदी दिलेले क्षेत्र (चौ.मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        size="small"
                        value={milkat != "land" ? actualArea : actualDharakArea}
                        disabled
                      />
                    </>
                  ) : (
                    <>
                      <InputLabel className="inputlabel">
                        <b>खरेदी दिलेले क्षेत्र (चौ.मी.)</b>
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
                        className="textfield"
                        size="small"
                        value={mutationArea}
                        onChange={handleMutationArea}
                      />
                    </>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type="kherediDenar"
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
              isMobileCompulsary={false}
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
                    आणखी खरेदी देणार आहे का?
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

          <Grid container justifyContent="end" px={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<RotateRightRoundedIcon />}
                sx={{ mr: 2 }}
                onClick={() => {
                  handleReset();
                  // setIsHardEdit(false);
                }}
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
                {isHardEdit ? "बदल जतन करा" : "जतन करा"}
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setActiveStep(1)}
                disabled={responseData.length == 0}
              >
                खरेदी घेणाऱ्याची माहिती भरा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {/*---------------------------------kheredi Denar Table------*/}
      <Grid item md={12} mt={2}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>खरेदी देणारा माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>अर्जमधील न.भू.क्र.</TableCell>
                <TableCell>Sub Property No.</TableCell>
                <TableCell>फेरफरसाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>खरेदी देणाऱ्याचे नाव</TableCell>
                <TableCell>खरेदी देणाऱ्याचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>मिळकत पत्रिके प्रमाणे क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>खरेदी देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>खरेदी दिलेले क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(responseData) &&
                responseData.map((val, i) => {
                  return (
                    <TableRow key={val?.mutation_dtl_id + i}>
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
                        {val?.userDetails?.milkat == "land"
                          ? "भूखंड / जमीन (प्लॉट)"
                          : "अपार्टमेंट"}
                      </TableCell>
                      <TableCell>{val?.userDetails?.namud}</TableCell>
                      <TableCell>
                        {val?.userDetails?.firstName}{" "}
                        {val?.userDetails?.middleName}{" "}
                        {val?.userDetails?.lastName}
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
                        {val?.userDetails?.aliceName
                          ? val?.userDetails?.aliceName
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.areaForMutation?.actualArea
                          ? val?.areaForMutation?.actualArea
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.areaForMutation?.actualDharakArea
                          ? val?.areaForMutation?.actualDharakArea
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.areaForMutation?.mutationArea
                          ? val?.areaForMutation?.mutationArea
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

      {/*---------------------------------kheredi Ghenar Table------*/}
      {ghenarData.length > 0 && (
        <Grid item md={12} mt={2}>
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
              <h3 style={{ marginLeft: 20 }}>खरेदी घेणारा माहिती तक्ता</h3>
              <Button
                onClick={() => setActiveStep(1)}
                endIcon={<ArrowForwardRoundedIcon />}
              >
                आणखी खरेदी घेणाऱ्याची माहिती भरा
              </Button>
            </div>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell>खरेदी घेणाराचा प्रकार</TableCell>
                  <TableCell>खरेदी घेणाऱ्याचे नाव</TableCell>
                  <TableCell>खरेदी घेणाऱ्याचा पत्ता</TableCell>
                  <TableCell>उर्फ नाव</TableCell>
                  <TableCell>धारक प्रकार</TableCell>
                  <TableCell>स्त्री /पुरुष</TableCell>
                  <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                  <TableCell>जन्म दिनांक</TableCell>
                  <TableCell>अ.पा.क</TableCell>
                  {/* <TableCell>कृती करा</TableCell> */}
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
                          <Button
                            variant="outlined"
                            onClick={() => showAddress(val)}
                          >
                            पत्ता पहा
                          </Button>
                        </TableCell>
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
                            ? val?.dharak?.userdharak?.gender
                                ?.gender_description
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
                        {/* <TableCell>
                          <IconButton
                            color="success"
                            onClick={() => handleEdit(val?.mutation_dtl_id)}
                          >
                            <EditNoteOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(val?.mutation_dtl_id)}
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </TableCell> */}
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

export default KharediDenar;
