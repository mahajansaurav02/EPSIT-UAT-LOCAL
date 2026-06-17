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
  InputAdornment,
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
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import UserAddress from "../SupportPages/UserAddress";
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
import { errorToast, successToast, Toast } from "../../../../../../ui/Toast";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../URLs/url";
import NotesPaper from "../../../../../../ui/NotesPaper/NotesPaper";
import CloseIcon from "@mui/icons-material/Close";
import { mryutupatraDenarNotesArrUnRegistered } from "../../../../../../NotesArray/NotesArray";
import Swal from "sweetalert2";
import ShowAddress from "../SupportPages/ShowAddress";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyLettersNumbersAndSpacesForMryutuDakhlaNo,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../Validations/utils";

const MayatacheNavKamiKarne = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [issueOfficeArr, setIssurOfficeArr] = useState([]);
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
    dateOfDeath: "",
    deathCertificateIssueOfficeDropdown: {},
    deathCertificateNo: "",
    dateOfDeathCertificate: "",
  });

  const [userDataArr, setUserDataArr] = useState([]);
  const [selectedUserArr, setSelectedUserArr] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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

  const [uploadDoc, setUploadDoc] = useState({ docName: "", docSrc: "" });
  const [uploadDocError, setUploadDocError] = useState("");

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
        userName: yup.string().required("मृत्यूपत्र / इच्छापत्र देणारा निवडा"),
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
        dateOfDeath: yup.string().required("मयताची दिनांक निवडा"),
        deathCertificateIssueOfficeDropdown: yup
          .string()
          .required("मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव निवडा"),
        deathCertificateNo: yup.string().required("मयत दाखला क्रमांक टाका"),
        dateOfDeathCertificate: yup.string().required("मयत दाखला दिनांक निवडा"),
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
      dateOfDeath: "",
      dateOfDeathCertificate: "",
      deathCertificateIssueOfficeDropdown: "",
      deathCertificateNo: "",
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
  };
  const handleDobDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, dob: value, dateOfDeath: "" });
    setValue("dateOfDeath", "");
    setValue(name, value, { shouldValidate: true });
  };
  const handleOfficeNameDetails = (e) => {
    const code = e?.target?.value;
    const obj = issueOfficeArr.find(
      (o) => o?.certificate_authority_code == code
    );
    setUserDetails({
      ...userDetails,
      deathCertificateIssueOfficeDropdown: {
        certificate_authority_code: obj?.certificate_authority_code.toString(),
        certificate_authority_name: obj?.certificate_authority_name,
      },
    });
  };
  const handleUploadDocument = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        // 2 MB = 2048 * 1024 bytes
        setUploadDocError("अपलोड कागदपत्र साइज 2 MB च्या वर आहे");
        setUploadDoc({
          ...uploadDoc,
          docName: "",
          docSrc: "",
        });
      } else {
        setUploadDocError("");
        const reader = new FileReader();
        setValue("file", file.name);
        reader.onloadend = () => {
          if (reader.result) {
            // Safely process the result
            const base64Data = reader.result.replace(
              /^data:application\/pdf;base64,/,
              ""
            );
            setUploadDoc({
              ...uploadDoc,
              docSrc: base64Data,
              docName: file.name,
            });
          } else {
            setUploadDocError("File could not be read. Please try again.");
            setUploadDoc({
              ...uploadDoc,
              docName: "",
              docSrc: "",
            });
          }
        };
        reader.onerror = () => {
          // Handle FileReader errors
          setUploadDocError("An error occurred while reading the file.");
          setUploadDoc({
            ...uploadDoc,
            docName: "",
            docSrc: "",
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUploadDocError("");
      setUploadDoc({
        ...uploadDoc,
        docName: "",
        docSrc: "",
      });
    }
  };

  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();

      if (!result || !isUserIndAdd) {
        errorToast("Please Check All Fields");
        return;
      }

      if (!uploadDoc?.docName) {
        errorToast("कृपया मृत्यू दाखला अपलोड करा !");
        return;
      }

      console.info("payload->>", {
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
        docUpload: uploadDoc,
      });

      // sendRequest(
      //   `${URLS?.BaseURL}/MutationAPIS/CreateMrutyuPatraInfoForGiver`,
      //   "POST",
      //   {
      //     applicationid: applicationId,
      //     village_code: applicationData?.village_code,
      //     ctsNo: selectedUserArr[0]?.cts_number,
      //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
      //     ownerNo: selectedUserArr[0]?.owner_number,
      //     userDetails: {
      //       ...userDetails,
      //       userName: userName,
      //       suffix: suffix,
      //       suffixEng: suffixEng,
      //       suffixcode: suffixcode,
      //       suffixCodeEng: suffixCodeEng,
      //       subPropNo: subPropNo,
      //       nabhu: naBhu,
      //       lrPropertyUID: lrPropertyUID,
      //       milkat: milkat,
      //       namud: namud,
      //     },
      //     address: {
      //       addressType: isIndian,
      //       indiaAddress: indiaAddress,
      //     },
      //     docUpload: uploadDoc,
      //   },
      //   (res) => {
      //     if (res?.Code == "1") {
      //       successToast(res?.Message);
      //       getMryutuPatraDenarTableData();
      //       handleReset();
      //     } else {
      //       errorToast(res?.Message);
      //     }
      //   },
      //   (err) => {
      //     errorToast(err?.Message);
      //   }
      // );
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();

      if (!result || !isUserForeignAdd) {
        errorToast("Please Check All Fields");
        return;
      }

      if (!uploadDoc?.docName) {
        errorToast("कृपया मृत्यू दाखला अपलोड करा !");
        return;
      }

      console.info("payload->>", {
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
        address: {
          addressType: isIndian,
          foreignAddress: foraighnAddress,
        },
        docUpload: uploadDoc,
      });

      // sendRequest(
      //   `${URLS?.BaseURL}/MutationAPIS/CreateMrutyuPatraInfoForGiver`,
      //   "POST",
      //   {
      //     applicationid: applicationId,
      //     village_code: applicationData?.village_code,
      //     ctsNo: selectedUserArr[0]?.cts_number,
      //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
      //     ownerNo: selectedUserArr[0]?.owner_number,
      //     userDetails: {
      //       ...userDetails,
      //       userName: userName,
      //       suffix: suffix,
      //       suffixEng: suffixEng,
      //       suffixcode: suffixcode,
      //       suffixCodeEng: suffixCodeEng,
      //       nabhu: naBhu,
      //       lrPropertyUID: lrPropertyUID,
      //       milkat: milkat,
      //       namud: namud,
      //       subPropNo: subPropNo,
      //     },
      //     address: {
      //       addressType: isIndian,
      //       foreignAddress: foraighnAddress,
      //     },
      //     docUpload: uploadDoc,
      //   },
      //   (res) => {
      //     if (res?.Code == "1") {
      //       successToast(res?.Message);
      //       handleReset();
      //     } else {
      //       errorToast(res?.Message);
      //     }
      //   },
      //   (err) => {
      //     errorToast(err?.Message);
      //   }
      // );
    }
  };
  const handleReset = () => {
    setIsEdit(false);
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
    setUploadDoc({ docName: "", docSrc: "" });

    reset();
    setIsReset(!isReset);
  };
  // const handleDelete = (id) => {
  //   if (responseData.length == 1) {
  //     Swal.fire({
  //       title: `<p style="font-size: 0.8em;">मृत्यूपत्र / इच्छापत्र लाभार्थी सुद्धा डिलीट होतील !</p>`,
  //       html: '<span style="color: red;">डिलीट झाल्यानंतर पुन्हा नवीन मृत्यूपत्र / इच्छापत्र देणारे-लाभार्थी भरावे लागतील</span>',
  //       position: "center",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "हो मी सहमत आहे",
  //       cancelButtonText: "नाही",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/MutationAPIS/DeleteMrutyuPatraInfoForGiver`,
  //           "POST",
  //           {
  //             mutationId: id,
  //             applicationId: applicationId,
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               Swal.fire(
  //                 "Deleted!",
  //                 " मृत्यूपत्र / इच्छापत्र देणारा घेणारा डिलीट झालेला आहे",
  //                 "success"
  //               );
  //               getMryutuPatraDenarTableData();
  //               getMrututPatraGhenarTableData();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       }
  //     });
  //   }
  // };

  const setDeathCertificateIssueOfficeArr = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/deathCertificateList`,
      "POST",
      null,
      (res) => {
        setIssurOfficeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
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
      }
    );
  };
  useEffect(() => {
    setDeathCertificateIssueOfficeArr();
    getSuffix();
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
          heading="मयताचे नाव कमी करणेसाठी माहिती भरण्यासाठी आवश्यक सूचना"
          arr={mryutupatraDenarNotesArrUnRegistered}
        />
      </Grid>
      <Grid item md={12}>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">मयताचे नाव कमी करणे</h4>
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
                      <b>मयताचे नाव </b>
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
                  मयताचे नाव <span> *</span> (इंग्रजी मध्ये)
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

                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>जन्म दिनांक </b>
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: today,
                      min: "1900-01-01",
                    }}
                    // onChange={handleUserDetails}
                    onChange={handleDobDetails}
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
                                value
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
                  <Controller
                    name="dateOfDeath"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>मृत्यू दिनांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          className="textfield"
                          name="dateOfDeath"
                          value={userDetails?.dateOfDeath}
                          onFocus={(event) => {
                            event.target.showPicker();
                          }}
                          inputProps={{
                            max: today,
                            min: userDetails?.dob
                              ? userDetails?.dob
                              : "1900-01-01",
                          }}
                          error={errors.dateOfDeath}
                          {...field}
                          onBlur={() => handleBlur("dateOfDeath")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUserDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.dateOfDeath && errors.dateOfDeath.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="deathCertificateIssueOfficeDropdown"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>
                            मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव{" "}
                          </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          name="deathCertificateIssueOfficeDropdown"
                          fullWidth
                          className="textfield"
                          size="small"
                          value={
                            userDetails?.deathCertificateIssueOfficeDropdown
                          }
                          error={errors.deathCertificateIssueOfficeDropdown}
                          {...field}
                          onBlur={() =>
                            handleBlur("deathCertificateIssueOfficeDropdown")
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            handleOfficeNameDetails(e);
                          }}
                        >
                          {Array.isArray(issueOfficeArr) &&
                            issueOfficeArr.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.certificate_authority_code}
                                  key={val?.certificate_authority_code + i}
                                >
                                  {val?.certificate_authority_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.deathCertificateIssueOfficeDropdown &&
                            errors.deathCertificateIssueOfficeDropdown.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="deathCertificateNo"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>मृत्यू दाखला क्रमांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfield"
                          size="small"
                          name="deathCertificateNo"
                          value={userDetails?.deathCertificateNo}
                          error={errors.deathCertificateNo}
                          {...field}
                          onBlur={() => handleBlur("deathCertificateNo")}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersNumbersAndSpacesForMryutuDakhlaNo(
                                value
                              );
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.deathCertificateNo &&
                            errors.deathCertificateNo.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="dateOfDeathCertificate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>मृत्यू दाखला दिनांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          className="textfield"
                          name="dateOfDeathCertificate"
                          value={userDetails?.dateOfDeathCertificate}
                          onFocus={(event) => {
                            event.target.showPicker();
                          }}
                          inputProps={{
                            max: today,
                            min: userDetails?.dateOfDeath,
                          }}
                          error={errors.dateOfDeathCertificate}
                          {...field}
                          onBlur={() => handleBlur("dateOfDeathCertificate")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleUserDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.dateOfDeathCertificate &&
                            errors.dateOfDeathCertificate.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>मृत्यू दाखला </b>
                    <span>*</span>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    fullWidth
                    disabled
                    value={uploadDoc?.docName ? uploadDoc?.docName : ""}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            variant="contained"
                            component="label"
                            startIcon={<img src="/images/pdflogo.svg" />}
                          >
                            अपलोड करा
                            <input
                              type="file"
                              accept="application/pdf"
                              hidden
                              onChange={handleUploadDocument}
                            />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {uploadDocError ? (
                    <p style={{ color: "red", fontSize: "13px", marginTop: 3 }}>
                      {uploadDocError}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: "13px",
                        marginTop: 3,
                      }}
                    >
                      अपलोड मृत्यू दाखल्याची साइज जास्तीत जास्त 2 MB असावी व ती
                      PDF स्वरूपात असावी.
                    </p>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <UserAddress
                type="mayatDharak"
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
            <Grid container justifyContent="end" mt={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  onClick={() => {
                    handleReset();
                  }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  onClick={handleSave}
                  //   disabled={isMutationUndergoing || responseData.length >= 1}
                  sx={{ mr: 2 }}
                >
                  जतन करा
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>मयत धारक माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>अर्जामधील न.भू.क्र.</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>फेरफरसाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>मयत धारकाचे नाव</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>मृत्यू दिनांक</TableCell>
                <TableCell>मृत्यू दाखला क्रमांक</TableCell>
                <TableCell>मृत्यू दाखला दिनांक</TableCell>
                <TableCell>मृत्यू दाखला</TableCell>
                <TableCell>मयत धारकाचा पत्ता</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
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
                      <TableCell>{val?.userDetails?.nabhu}</TableCell>
                      <TableCell>{val?.userDetails?.lrPropertyUID}</TableCell>
                      <TableCell>
                        {val?.userDetails?.milkat == "land"
                          ? " भूखंड / जमीन (प्लॉट)"
                          : "अपार्टमेंट"}
                      </TableCell>
                      <TableCell>{val?.userDetails?.namud}</TableCell>
                      <TableCell>{val?.userDetails?.userName}</TableCell>
                      <TableCell>
                        {val?.userDetails?.aliceName
                          ? val?.userDetails?.aliceName
                          : "-"}
                      </TableCell>
                      <TableCell>{val?.areaForMutation?.actualArea}</TableCell>
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
                      <TableCell>{val?.userDetails?.dateOfDeath}</TableCell>
                      <TableCell>
                        {val?.userDetails?.deathCertificateNo}
                      </TableCell>
                      <TableCell>
                        {val?.userDetails?.dateOfDeathCertificate}
                      </TableCell>
                      <TableCell>
                        <a
                          href={val?.docUpload?.docSrc}
                          target="_blank"
                          download={val?.docUpload?.docName}
                        >
                          {val?.docUpload?.docName}
                        </a>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          // onClick={() => showAddress(val)}
                        >
                          पत्ता पहा
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(val?.mutation_givertaker_id)
                          }
                        >
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody> */}
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default MayatacheNavKamiKarne;
