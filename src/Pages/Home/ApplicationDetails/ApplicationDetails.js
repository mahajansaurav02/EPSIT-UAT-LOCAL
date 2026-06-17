import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAddress from "./SupportPages/UserAddress";
import UserMHPropertyType712 from "./SupportPages/User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "./SupportPages/User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "./SupportPages/User/MHProperty/UserMHPropertyTypeULPIN";
import UserNoMHProperty from "./SupportPages/User/NoMHProperty/UserNoMHProperty";
import CompanyNoMHProperty from "./SupportPages/Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "./SupportPages/Company/MHProperty/CompanyMHPropertyType712";
import CompanyMHPropertyTypePropertyCard from "./SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "./SupportPages/Company/MHProperty/CompanyMHPropertyTypeULPIN";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseIcon from "@mui/icons-material/Close";
import AxiosInstance from "../../../Instance/AxiosInstance";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../ui/Toast";
import URLS from "../../../URLs/url";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { applicantNotesArr } from "../../../NotesArray/NotesArray";
import ShowAddress from "./SupportPages/ShowAddress";

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const applicationId = sessionStorage.getItem("applicationId");
  const isPOA = sessionStorage.getItem("isMainPatra");
  const { sendRequest } = AxiosInstance();
  const [userTypeArr, setUserTypeArr] = useState([]);
  const [userType, setUserType] = useState(1);
  const [userTypeLabel, setUserTypeLabel] = useState("व्यक्ती");
  const [isMHProperty, setIsMHProperty] = useState("no");
  const [isULPIN, setIsULPIN] = useState("yes");
  const [property, setProperty] = useState("712");
  const [photo, setPhoto] = useState({
    passportName: "",
    passportSrc: "",
  });
  const [passportError, setPassportError] = useState("");
  const [applicationData, setApplicationData] = useState({});
  const [responseData, setResponseData] = useState([]);

  //------------------------------State Up Data/States----------------------------
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

  const [userMhPropType712, setUserMhPropType712] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [userMhPropTypePropertyCard, setUserMhPropTypePropertyCard] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [userMhPropULPIN, setUserMhPropULPIN] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [companyMhPropType712, setCompanyMhPropType712] = useState({
    district: "",
    taluka: "",
    village: "",
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    companyName: "",
    companyNameEng: "",
  });
  const [companyMhPropTypePropertyCard, setCompanyMhPropTypePropertyCard] =
    useState({
      district: "",
      taluka: "",
      village: "",
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      companyName: "",
      companyNameEng: "",
    });
  const [companyMhPropULPIN, setCompanyMhPropULPIN] = useState({
    district: "",
    taluka: "",
    village: "",
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    companyName: "",
    companyNameEng: "",
  });

  const [isIndian, setIsIndian] = useState("india");
  const [indiaAddress, setIndiaAdress] = useState({
    plotNo: "",
    building: "",
    mainRoad: "",
    impSymbol: "",
    area: "",
    pincode: "",
    postOfficeName: "",
    city: "",
    taluka: "",
    district: "",
    state: "",
    addressProofName: "",
    addressProofSrc: "",
  });
  const [foraighnAddress, setForaighnAddress] = useState("");
  const [indiaContactDetails, setIndiaContactDetails] = useState({
    mobile: "",
    mobileOTP: "yes",
    email: "",
    emailOTP: "yes",
    securityKey: "",
    signatureName: "",
    signatureSrc: "",
  });
  const [foreignContactDetails, setForeignContactDetails] = useState({
    mobile: "",
    email: "",
    emailOTP: "yes",
    signatureName: "",
    signatureSrc: "",
  });
  const [isMutationGiver, setIsMutationGiver] = useState("no");
  const [isUserPOA, setIsUserPOA] = useState("no");
  const [userPOAType, setUserPOAType] = useState("");

  //------------------------------Edit State---------------------------------
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);
  //------------------------------Validation Check Trigger----------------------
  const [isValid, setIsValid] = useState({});
  const [isFirstUser, setIsFirstUser] = useState(false);

  //--------------------------------Show Address-----------------------------
  const [open, setOpen] = useState(false);
  const [addVal, setAddVal] = useState({});

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
    const obj = userTypeArr.find(
      (o) => o.applicant_category_code == e?.target?.value
    );
    setUserTypeLabel(obj?.applicant_category_type);
  };
  const handleMHProperty = (e) => {
    setIsMHProperty(e?.target?.value);
  };
  const handleIsULPIN = (e) => {
    setIsULPIN(e?.target?.value);
  };
  const handlePropertyType = (e) => {
    setProperty(e?.target?.value);
  };
  const handleIsUserMutGiver = (e) => {
    setIsMutationGiver(e?.target?.value);
  };
  const handleIsUserPOA = (e) => {
    const val = e?.target?.value;
    setIsUserPOA(val);
    if (val == "no") {
      setUserPOAType("");
    }
  };
  const handleUserPoaType = (e) => {
    setUserPOAType(e?.target?.value);
  };
  const handlePassportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setPassportError("अपलोड फोटो साइज 256kb च्या वर आहे");
        setPhoto({
          ...photo,
          passportName: "",
          passportSrc: "",
        });
      } else {
        setPassportError("");

        const reader = new FileReader();

        reader.onloadend = () => {
          setPhoto({
            ...photo,
            passportSrc: reader.result,
            passportName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPassportError("");
      setPhoto({
        ...photo,
        passportName: "",
        passportSrc: "",
      });
    }
  };
  // const handleAddAcc = async () => {
  //   if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
  //     const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isUserNoMhProperty && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "0",
  //             userDetails: { ...userNoMhProp },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
  //     const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();
  //     if (isUserNoMhProperty && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "0",
  //             userDetails: { ...userNoMhProp },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "712" &&
  //     isIndian == "india"
  //   ) {
  //     const isUserProp712 = await isValid.triggerUserProp712();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isUserProp712 && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "1",
  //             userDetails: { ...userMhPropType712 },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "712" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isUserProp712 = await isValid.triggerUserProp712();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();
  //     if (isUserProp712 && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "1",
  //             userDetails: { ...userMhPropType712 },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "propertyCard" &&
  //     isIndian == "india"
  //   ) {
  //     const isUserPropertyCard = await isValid.triggerUserPropertyCard();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isUserPropertyCard && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "2",
  //             userDetails: { ...userMhPropTypePropertyCard },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "propertyCard" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isUserPropertyCard = await isValid.triggerUserPropertyCard();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();

  //     if (isUserPropertyCard && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "2",
  //             userDetails: { ...userMhPropTypePropertyCard },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "yes" &&
  //     isIndian == "india"
  //   ) {
  //     const isUserPropULPIN = await isValid.triggerUserPropULPIN();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isUserPropULPIN && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "3",
  //             userDetails: { ...userMhPropULPIN },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType == 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "yes" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isUserPropULPIN = await isValid.triggerUserPropULPIN();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();

  //     if (isUserPropULPIN && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "3",
  //             userDetails: { ...userMhPropULPIN },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (userType != 1 && isMHProperty == "no" && isIndian == "india") {
  //     const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isCompNoMhProperty && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "0",
  //             userDetails: { ...companyNoMhProp },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (userType != 1 && isMHProperty == "no" && isIndian == "foreign") {
  //     const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();

  //     if (isCompNoMhProperty && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "0",
  //             userDetails: { ...companyNoMhProp },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "712" &&
  //     isIndian == "india"
  //   ) {
  //     const isCompProp712 = await isValid.triggerCompProp712();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isCompProp712 && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "1",
  //             userDetails: { ...companyMhPropType712 },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "712" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isCompProp712 = await isValid.triggerCompProp712();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();

  //     if (isCompProp712 && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "1",
  //             userDetails: { ...companyMhPropType712 },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "propertyCard" &&
  //     isIndian == "india"
  //   ) {
  //     const isCompPropertryCard = await isValid.triggerCompPropertyCard();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isCompPropertryCard && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "2",
  //             userDetails: { ...companyMhPropTypePropertyCard },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "no" &&
  //     property == "propertyCard" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isCompPropertryCard = await isValid.triggerCompPropertyCard();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();
  //     if (isCompPropertryCard && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "2",
  //             userDetails: { ...companyMhPropTypePropertyCard },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "yes" &&
  //     isIndian == "india"
  //   ) {
  //     const isCompPropULPIN = await isValid.triggerCompPropULPIN();
  //     const isUserIndAdd = await isValid.triggerUserIndAddress();
  //     const isUserIndContact = await isValid.triggerUserIndContact();

  //     if (isCompPropULPIN && isUserIndAdd && isUserIndContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "3",
  //             userDetails: { ...companyMhPropULPIN },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             indiaAddress: {
  //               ...indiaAddress,
  //               ...indiaContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   } else if (
  //     userType != 1 &&
  //     isMHProperty == "yes" &&
  //     isULPIN == "yes" &&
  //     isIndian == "foreign"
  //   ) {
  //     const isCompPropULPIN = await isValid.triggerCompPropULPIN();
  //     const isUserForeignAdd = await isValid.triggerUserForeignAdd();
  //     const isUserForeignContact = await isValid.triggerUserForeignContact();
  //     if (isCompPropULPIN && isUserForeignAdd && isUserForeignContact) {
  //       sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/CreateApplicant`,
  //         "POST",
  //         {
  //           usertype: userTypeLabel,
  //           usertype_code: userType,
  //           applicationId: applicationId,
  //           isMutationGiver: isMutationGiver,
  //           isUserPOA: isUserPOA,
  //           userPOAType: userPOAType,
  //           photo: {
  //             ...photo,
  //           },
  //           isMHProperty: {
  //             hasProperty: isMHProperty,
  //             propType: "3",
  //             userDetails: { ...companyMhPropULPIN },
  //           },
  //           address: {
  //             addressType: isIndian,
  //             foreignAddress: {
  //               address: foraighnAddress,
  //               ...foreignContactDetails,
  //             },
  //           },
  //         },
  //         (res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             getApplicantTableData();
  //             handleReset();
  //           } else {
  //             errorToast(res?.Message);
  //           }
  //         },
  //         (err) => {
  //           errorToast(err?.Message);
  //         }
  //       );
  //     } else {
  //       warningToast("Please Check All Fields !!");
  //     }
  //   }
  // };
  const handleEditSave = async () => {
    if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserNoMhProperty && isUserIndAdd && isUserIndContact) {
        if (
          photo?.passportName &&
          photo.passportName !== "NA" &&
          indiaContactDetails?.signatureName &&
          indiaContactDetails.signatureName !== "NA" &&
          indiaAddress?.addressProofName &&
          indiaAddress.addressProofName !== "NA"
        ) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
            "POST",
            {
              applicantid: editId,
              usertype: userTypeLabel,
              usertype_code: userType,
              applicationId: applicationId,
              isMutationGiver: isMutationGiver,
              isUserPOA: isUserPOA,
              userPOAType: userPOAType,
              photo: {
                ...photo,
              },
              isMHProperty: {
                hasProperty: isMHProperty,
                propType: "0",
                userDetails: { ...userNoMhProp },
              },
              address: {
                addressType: isIndian,
                indiaAddress: {
                  ...indiaAddress,
                  ...indiaContactDetails,
                },
              },
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getApplicantTableData();
                // handleReset();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          warningToast(
            "Please Check Passport Photo / Signature / Address Proof !!"
          );
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();
      if (isUserNoMhProperty && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "0",
              userDetails: { ...userNoMhProp },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "712" &&
      isIndian == "india"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserProp712 && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...userMhPropType712 },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "712" &&
      isIndian == "foreign"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();
      if (isUserProp712 && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...userMhPropType712 },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "propertyCard" &&
      isIndian == "india"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserPropertyCard && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...userMhPropTypePropertyCard },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "propertyCard" &&
      isIndian == "foreign"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isUserPropertyCard && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...userMhPropTypePropertyCard },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      isIndian == "india"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserPropULPIN && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...userMhPropULPIN },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      isIndian == "foreign"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isUserPropULPIN && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...userMhPropULPIN },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "india") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isCompNoMhProperty && isUserIndAdd && isUserIndContact) {
        if (
          photo?.passportName &&
          photo.passportName !== "NA" &&
          indiaContactDetails?.signatureName &&
          indiaContactDetails.signatureName !== "NA" &&
          indiaAddress?.addressProofName &&
          indiaAddress.addressProofName !== "NA"
        ) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
            "POST",
            {
              applicantid: editId,
              usertype: userTypeLabel,
              usertype_code: userType,
              applicationId: applicationId,
              isMutationGiver: isMutationGiver,
              isUserPOA: isUserPOA,
              userPOAType: userPOAType,
              photo: {
                ...photo,
              },
              isMHProperty: {
                hasProperty: isMHProperty,
                propType: "0",
                userDetails: { ...companyNoMhProp },
              },
              address: {
                addressType: isIndian,
                indiaAddress: {
                  ...indiaAddress,
                  ...indiaContactDetails,
                },
              },
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getApplicantTableData();
                // handleReset();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          warningToast(
            "Please Check Passport Photo / Signature / Address Proof !!"
          );
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isCompNoMhProperty && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "0",
              userDetails: { ...companyNoMhProp },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "712" &&
      isIndian == "india"
    ) {
      const isCompProp712 = await isValid.triggerCompProp712();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isCompProp712 && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...companyMhPropType712 },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "712" &&
      isIndian == "foreign"
    ) {
      const isCompProp712 = await isValid.triggerCompProp712();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isCompProp712 && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...companyMhPropType712 },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "propertyCard" &&
      isIndian == "india"
    ) {
      const isCompPropertryCard = await isValid.triggerCompPropertyCard();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isCompPropertryCard && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...companyMhPropTypePropertyCard },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "propertyCard" &&
      isIndian == "foreign"
    ) {
      const isCompPropertryCard = await isValid.triggerCompPropertyCard();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();
      if (isCompPropertryCard && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...companyMhPropTypePropertyCard },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      isIndian == "india"
    ) {
      const isCompPropULPIN = await isValid.triggerCompPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isCompPropULPIN && isUserIndAdd && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...companyMhPropULPIN },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
                ...indiaContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      isIndian == "foreign"
    ) {
      const isCompPropULPIN = await isValid.triggerCompPropULPIN();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();
      if (isCompPropULPIN && isUserForeignAdd && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditApplicant`,
          "POST",
          {
            applicantid: editId,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationId: applicationId,
            isMutationGiver: isMutationGiver,
            isUserPOA: isUserPOA,
            userPOAType: userPOAType,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...companyMhPropULPIN },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                address: foraighnAddress,
                ...foreignContactDetails,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getApplicantTableData();
              handleReset();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    }
  };
  const handleReset = () => {
    setIsHardEdit(false);
    setIsEdit(false);
    setIsReset(!isReset);
    setIsFirstUser(false);

    setUserType(1);
    setUserTypeLabel("व्यक्ती");
    setIsMHProperty("no");
    setIsULPIN("yes");
    setProperty("712");
    setPhoto({
      passportName: "",
      passportSrc: "",
    });
    setUserNoMhProp({
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
    setCompanyNoMhProp({
      companyName: "",
      companyNameEng: "",
    });
    setIsIndian("india");
    setIndiaAdress({
      plotNo: "",
      building: "",
      mainRoad: "",
      impSymbol: "",
      area: "",
      pincode: "",
      postOfficeName: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      addressProofName: "",
      addressProofSrc: "",
    });
    setForaighnAddress("");
    setIndiaContactDetails({
      mobile: "",
      mobileOTP: "yes",
      email: "",
      emailOTP: "yes",
      securityKey: "",
      signatureName: "",
      signatureSrc: "",
    });
    setForeignContactDetails({
      mobile: "",
      email: "",
      emailOTP: "yes",
      signatureName: "",
      signatureSrc: "",
    });
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteApplicant`,
      "POST",
      {
        applicantid: id,
        applicationid: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getApplicantTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleEdit = (id) => {
    const obj = responseData.find((o) => o?.applicantid === id);
    setEditId(obj?.applicantid);
    setUserData(obj);
  };
  const setUserData = (data) => {
    // console.info("data->>", data);
    setIsEdit(true);
    setIsHardEdit(true);
    setUserTypeLabel(data?.usertype);
    setUserType(data?.usertype_code);
    setPhoto({
      passportName: data?.profile_pic_file_name,
      passportSrc: data?.profile_pic_file_path,
    });
    setIsMHProperty(data?.owner_of_property_in_maharashtra ? "yes" : "no");
    setIsIndian(data?.address_type == "INDIA" ? "india" : "foreign");
    setUserNoMhProp({
      suffix: data?.prefix_in_marathi,
      suffixEng: data?.prefix_in_eng,
      firstName: data?.fname_in_marathi,
      middleName: data?.mname_in_marathi,
      lastName: data?.lname_in_marathi,
      firstNameEng: data?.fname_in_eng,
      middleNameEng: data?.mname_in_eng,
      lastNameEng: data?.lname_in_eng,
    });
    setCompanyNoMhProp({
      companyName: data?.company_name_in_marathi,
      companyNameEng: data?.company_name_in_eng,
    });
    setIndiaAdress({
      plotNo: data?.flatno_plotno,
      building: data?.societyname,
      mainRoad: data?.mainstreet,
      impSymbol: data?.landmark,
      area: data?.locality,
      pincode: data?.pincode,
      postOfficeName: data?.postofficename,
      city: data?.postofficename,
      taluka: data?.taluka,
      district: data?.district,
      state: data?.state,
      addressProofName: data?.address_proof_document_name,
      addressProofSrc: data?.address_proof_document_path,
    });
    setForaighnAddress(data?.address);
    setIndiaContactDetails({
      mobile: data?.mobileno,
      mobileOTP: data?.mobilenoverified == "YES" ? "yes" : "no",
      email: data?.emailid,
      emailOTP: data?.emailidverified == "YES" ? "yes" : "no",
      securityKey: data?.securitypin,
      signatureName: data?.signed_file_name,
      signatureSrc: data?.signed_file_path,
    });
    setForeignContactDetails({
      mobile: data?.mobileno,
      email: data?.emailid,
      emailOTP: data?.emailidverified == "YES" ? "yes" : "no",
      signatureName: data?.signed_file_name,
      signatureSrc: data?.signed_file_path,
    });
  };
  const showAddress = (val) => {
    setOpen(true);
    setAddVal(val);
  };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };

  const handleNext = () => {
    const data = responseData[0];

    const isProfilePicValid =
      data?.profile_pic_file_name && data.profile_pic_file_name !== "NA";
    const isSignedFileValid =
      data?.signed_file_name && data.signed_file_name !== "NA";
    const isAddressProofValid =
      data?.address_proof_document_name &&
      data.address_proof_document_name !== "NA";

    if (isProfilePicValid && isSignedFileValid && isAddressProofValid) {
      navigate("/home/nabhu");
    } else {
      warningToast(
        "कृपया पत्ता, पत्त्याचा पुरावा / फोटोग्राफ / वापरकर्त्याची स्वाक्षरी अपलोड झालेले आहे का त्याची खात्री करा."
      );
    }
  };
  const handlePrevious = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.removeItem("isCourtDawa");
    sessionStorage.removeItem("isDast");
    sessionStorage.removeItem("isMainPatra");
    navigate("/home/application-type");
  };
  const getApplicantTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicantData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          if (res?.ResponseData.length == 1) {
            setUserData(res?.ResponseData[0]);
            setEditId(res?.ResponseData[0]?.applicantid);
            setResponseData(res?.ResponseData);
            setIsFirstUser(true);
          } else {
            // handleReset();
            setIsReset(false);
            setResponseData(res?.ResponseData);
            setIsFirstUser(false);
          }
        } else {
          console.error(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const setAppDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData);
        } else {
          console.error(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
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
      }
    );
  };
  useEffect(() => {
    getApplicantTableData();
    setAppDataApi();
    setIntialUserType();
  }, []);

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
            onClick={handleDialogClose}
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

      <Grid container spacing={2}>
        <Grid item md={12} mt={2}>
          <Paper elevation={5} sx={{ px: 2, p: 3 }} className="paper-back">
            <Grid container>
              <Grid item md={2}>
                <span className="paper-span">
                  जिल्हा : <b>{applicationData?.district_name_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  तालुका/न.भु. कार्यालय : <b>{applicationData?.taluka_name}</b>
                </span>
              </Grid>
              <Grid item md={2}>
                <span className="paper-span">
                  अर्ज प्रकार :{" "}
                  <b>{applicationData?.application_type_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  फेरफार प्रकार : <b>{applicationData?.mutation_type}</b>
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item md={12}>
          <NotesPaper
            heading="अर्जदारासाठी आवश्यक सूचना"
            arr={applicantNotesArr}
          />
        </Grid>

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={10}>
                    <Grid container>
                      <Grid item md={12}>
                        <h4 className="heading">अर्जदारची माहिती</h4>
                      </Grid>
                      <Grid item md={12}>
                        <Grid container spacing={2}>
                          {isFirstUser ? (
                            <Grid item md={2}>
                              <InputLabel className="inputlabel">
                                <b>अर्जदार प्रकार </b>
                              </InputLabel>
                              <TextField
                                fullWidth
                                className="textfieldDisabled"
                                value={userTypeLabel}
                                disabled
                                size="small"
                              />
                            </Grid>
                          ) : (
                            <Grid item md={2}>
                              <InputLabel className="inputlabel">
                                <b>अर्जदार प्रकार </b>
                                <span>*</span>
                              </InputLabel>
                              <Select
                                value={userType}
                                onChange={handleChangeUserType}
                                className="textfield"
                                fullWidth
                                size="small"
                              >
                                {Array.isArray(userTypeArr) &&
                                  userTypeArr.map((val, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        value={val?.applicant_category_code}
                                      >
                                        {val?.applicant_category_type}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </Grid>
                          )}
                          {/* <Grid item md={4}>
                            <InputLabel className="inputlabel">
                              <b>आपल्या नावे महाराष्ट्रात मिळकत आहे का ? </b>
                              <span>*</span>
                            </InputLabel>
                            <RadioGroup
                              row
                              value={isMHProperty}
                              onChange={handleMHProperty}
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
                          {isMHProperty == "yes" && (
                            <Grid item md={3}>
                              <InputLabel className="inputlabel">
                                <b>आपणास ULPIN माहीत आहे का ? </b>
                                <span>*</span>
                              </InputLabel>
                              <RadioGroup
                                row
                                value={isULPIN}
                                onChange={handleIsULPIN}
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
                          )}
                          {isMHProperty == "yes" && isULPIN == "no" && (
                            <Grid item md={3}>
                              <InputLabel className="inputlabel">
                                <b>मालमत्ता प्रकार निवडा </b>
                                <span>*</span>
                              </InputLabel>
                              <RadioGroup
                                row
                                sx={{ flexWrap: "nowrap" }}
                                value={property}
                                onChange={handlePropertyType}
                              >
                                <FormControlLabel
                                  value="712"
                                  control={<Radio />}
                                  label="7/12"
                                />
                                <FormControlLabel
                                  value="propertyCard"
                                  control={<Radio />}
                                  label="Property Card"
                                />
                              </RadioGroup>
                            </Grid>
                          )} */}
                        </Grid>
                      </Grid>

                      {userType == 1 ? (
                        <Grid item md={12}>
                          {isMHProperty == "no" ? (
                            <UserNoMHProperty
                              isEdit={isEdit}
                              userNoMhProp={userNoMhProp}
                              setUserNoMhProp={setUserNoMhProp}
                              setIsValid={setIsValid}
                              isReset={isReset}
                              isFirstUser={isFirstUser}
                            />
                          ) : (
                            <>
                              {property == "712" && isULPIN == "no" && (
                                <UserMHPropertyType712
                                  isEdit={isEdit}
                                  userMhPropType712={userMhPropType712}
                                  setUserMhPropType712={setUserMhPropType712}
                                  setIsValid={setIsValid}
                                />
                              )}
                              {property == "propertyCard" &&
                                isULPIN == "no" && (
                                  <UserMHPropertyTypePropertyCard
                                    isEdit={isEdit}
                                    userMhPropTypePropertyCard={
                                      userMhPropTypePropertyCard
                                    }
                                    setUserMhPropTypePropertyCard={
                                      setUserMhPropTypePropertyCard
                                    }
                                    setIsValid={setIsValid}
                                  />
                                )}
                              {isULPIN == "yes" && (
                                <UserMHPropertTypeULPIN
                                  isEdit={isEdit}
                                  userMhPropULPIN={userMhPropULPIN}
                                  setUserMhPropULPIN={setUserMhPropULPIN}
                                  setIsValid={setIsValid}
                                />
                              )}
                            </>
                          )}
                        </Grid>
                      ) : (
                        <Grid item md={12}>
                          {isMHProperty == "no" ? (
                            <CompanyNoMHProperty
                              isEdit={isEdit}
                              companyNoMhProp={companyNoMhProp}
                              setCompanyNoMhProp={setCompanyNoMhProp}
                              setIsValid={setIsValid}
                              isReset={isReset}
                              isFirstUser={isFirstUser}
                            />
                          ) : (
                            <>
                              {property == "712" && isULPIN == "no" && (
                                <CompanyMHPropertType712
                                  isEdit={isEdit}
                                  companyMhPropType712={companyMhPropType712}
                                  setCompanyMhPropType712={
                                    setCompanyMhPropType712
                                  }
                                  setIsValid={setIsValid}
                                />
                              )}
                              {property == "propertyCard" &&
                                isULPIN == "no" && (
                                  <CompanyMHPropertyTypePropertyCard
                                    isEdit={isEdit}
                                    companyMhPropTypePropertyCard={
                                      companyMhPropTypePropertyCard
                                    }
                                    setCompanyMhPropTypePropertyCard={
                                      setCompanyMhPropTypePropertyCard
                                    }
                                    setIsValid={setIsValid}
                                  />
                                )}
                              {isULPIN == "yes" && (
                                <CompanyMHPropertyTypeULPIN
                                  isEdit={isEdit}
                                  companyMhPropULPIN={companyMhPropULPIN}
                                  setCompanyMhPropULPIN={setCompanyMhPropULPIN}
                                  setIsValid={setIsValid}
                                />
                              )}
                            </>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    md={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <InputLabel className="inputlabel">
                      <b>फोटोग्राफ </b> <span>*</span>
                    </InputLabel>
                    <img
                      src={
                        photo?.passportSrc
                          ? photo?.passportSrc
                          : "/images/user-placeholder.png"
                      }
                      alt="वापरकर्त्याचा फोटोग्राफ आपलोड करा"
                      width="160px"
                      height="160px"
                    />
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadRoundedIcon />}
                      fullWidth
                    >
                      पासपोर्ट फोटो
                      <input
                        type="file"
                        // accept="image/*"
                        accept=".jpg,.jpeg,.png"
                        hidden
                        onChange={handlePassportFileChange}
                      />
                    </Button>
                    {/* {passportError && (
                      <div style={{ color: "red" }}>{passportError}</div>
                    )} */}
                    {passportError ? (
                      <p
                        style={{ color: "red", fontSize: "13px", marginTop: 3 }}
                      >
                        {passportError}
                      </p>
                    ) : (
                      <p
                        style={{
                          fontSize: "13px",
                          marginTop: 3,
                        }}
                      >
                        अपलोड फोटो साइज जास्तीत जास्त 256kb असावी व ती
                        JPG,JPEG,PNG स्वरूपात असावी.
                      </p>
                    )}
                    <a
                      href="https://www.ilovepdf.com/"
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        fontSize: "13px",
                      }}
                    >
                      To resize photo click here
                    </a>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12}>
                <UserAddress
                  isEdit={isEdit}
                  isIndian={isIndian}
                  setIsIndian={setIsIndian}
                  indiaAddress={indiaAddress}
                  setIndiaAdress={setIndiaAdress}
                  foraighnAddress={foraighnAddress}
                  setForaighnAddress={setForaighnAddress}
                  indiaContactDetails={indiaContactDetails}
                  setIndiaContactDetails={setIndiaContactDetails}
                  foreignContactDetails={foreignContactDetails}
                  setForeignContactDetails={setForeignContactDetails}
                  setIsValid={setIsValid}
                  isReset={isReset}
                  isFirstUser={isFirstUser}
                />
              </Grid>

              {/* <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>
                        खरेदी घेणार स्वतः {applicationData?.mutation_type} साठी
                        अर्जदार आहे का?
                      </b>
                    </InputLabel>
                    <RadioGroup
                      row
                      value={isMutationGiver}
                      onChange={handleIsUserMutGiver}
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
                  {isPOA == "yes" && (
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>अर्जदार मुखत्यारपत्र धारक आहे का?</b>
                      </InputLabel>
                      <RadioGroup
                        row
                        value={isUserPOA}
                        onChange={handleIsUserPOA}
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
                  )}
                  {isUserPOA == "yes" && (
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>आपल्याकडे कोणते मुखत्यार आहे?</b>
                      </InputLabel>
                      <RadioGroup
                        row
                        value={userPOAType}
                        onChange={handleUserPoaType}
                      >
                        <FormControlLabel
                          value="giver"
                          control={<Radio />}
                          label="देणारा"
                        />
                        <FormControlLabel
                          value="taker"
                          control={<Radio />}
                          label="घेणारा"
                        />
                      </RadioGroup>
                    </Grid>
                  )}
                </Grid>
              </Grid> */}
            </Grid>

            <Grid container justifyContent="end" px={2} mt={2}>
              <Grid item>
                {/* <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  onClick={(e) => {
                    handleReset();
                    // setIsHardEdit(false);
                  }}
                >
                  रीसेट करा
                </Button>   */}
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  // onClick={handleAddAcc}
                  // onClick={isHardEdit ? handleEditSave : handleAddAcc}
                  onClick={handleEditSave}
                >
                  {/* जतन करा */}
                  {/* {isHardEdit ? "बदल जतन करा" : "जतन करा"} */}
                  जतन करा
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item md={12}>
          <TableContainer component={Paper} elevation={5}>
            <h3 style={{ marginLeft: 20 }}>माहिती तक्ता</h3>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>अर्ज क्रमांक</TableCell>
                  <TableCell>अर्ज दिनांक</TableCell>
                  <TableCell>अर्जदाराचे नाव</TableCell>
                  <TableCell>अर्जदार पत्ता</TableCell>
                  <TableCell>तालुका / न.भू.कार्यालय</TableCell>
                  <TableCell>मोबाईल</TableCell>
                  <TableCell>ई मेल</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(responseData) &&
                  responseData.map((val, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{val?.applicationid}</TableCell>
                        <TableCell>{val?.createddatetime}</TableCell>
                        <TableCell>
                          {val?.usertype == "संस्था"
                            ? val?.company_name_in_marathi
                            : val?.applicantNameInMarathi}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showAddress(val)}
                          >
                            पत्ता पहा
                          </Button>
                        </TableCell>
                        <TableCell>{applicationData?.taluka_name}</TableCell>
                        <TableCell>{val?.mobileno}</TableCell>
                        <TableCell>{val?.emailid}</TableCell>
                        <TableCell>
                          <IconButton
                            color="success"
                            onClick={() => handleEdit(val?.applicantid)}
                          >
                            <EditNoteOutlinedIcon />
                          </IconButton>
                          {i > 0 && (
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(val?.applicantid)}
                            >
                              <DeleteForeverOutlinedIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid container justifyContent="space-between" px={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={goToHomePage}
            >
              होम पेज ला जा
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handlePrevious}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={handleNext}
            >
              पुढे जा
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApplicationDetails;
