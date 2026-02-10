import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
  Typography,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CloseIcon from "@mui/icons-material/Close";
import UserNoMHProperty from "../../SupportPages/User/NoMHProperty/UserNoMHProperty";
import UserMHPropertyType712 from "../../SupportPages//User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "../../SupportPages/User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "../../SupportPages/User/MHProperty/UserMHPropertyTypeULPIN";
import CompanyNoMHProperty from "../../SupportPages/Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "../../SupportPages/Company/MHProperty/CompanyMHPropertyType712";
import CompanyMHPropertyTypePropertyCard from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypeULPIN";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import UserAddress from "../../SupportPages/UserAddress";
import UserDharak from "./UserDharak";
import CompanyDharak from "./CompanyDharak";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../../../../../ui/Toast";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { kherediGhenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import ShowAddress from "../../SupportPages/ShowAddress";

const KharediGhenar = ({ applicationData }) => {
  const applicationId = sessionStorage.getItem("applicationId");
  const { sendRequest } = AxiosInstance();
  const [giver, setGiverData] = useState([]);
  const [isMoreUsers, setIsMoreUsers] = useState("no");
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
  //---------------------------state up data of Address---------------------
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
  const [userDharak, setUserDharak] = useState({
    aliceName: "",
    aapakDropdown: {},
    aapak: "",
    aapakRelation: {},
    gender: {},
    holderType: {},
    dob: "",
    motherName: "",
    motherNameEng: "",
    landBuyArea: "NA",
  });
  const [companyDharak, setCompanyDharak] = useState({
    holderType: {},
    landBuyArea: "NA",
  });
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
  //-------------------------------check validations------------------------
  const [isValid, setIsValid] = useState({});
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [isReset, setIsReset] = useState(false);

  //--------------------------------Show Address-----------------------------
  const [open, setOpen] = useState(false);
  const [addVal, setAddVal] = useState({});

  const handleDialogClose = () => {
    setOpen(false);
  };
  const showAddress = (val) => {
    setOpen(true);
    setAddVal(val?.address);
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
  const handlePassportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setPassportError("File should be less than 256 KB");
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
    if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserNoMhProperty && isUserIndAdd && isUserDharak) {
        if (isMobileNoVerified) {
          sendRequest(
            `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
            "POST",
            {
              giver: giver,
              usertype: userTypeLabel,
              usertype_code: userType,
              applicationid: applicationId,
              photo: {
                ...photo,
              },
              isMHProperty: {
                hasProperty: isMHProperty,
                propType: "0",
                userDetails: { ...userNoMhProp },
              },
              dharak: {
                userdharak: {
                  ...userDharak,
                },
              },
              address: {
                addressType: isIndian,
                indiaAddress: {
                  ...indiaAddress,
                },
              },
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                handleReset();
                getKherediGhenarTableData();
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
          warningToast("Please Verify Mobile No.");
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserNoMhProperty && isUserForeignAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "0",
              userDetails: { ...userNoMhProp },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,

              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields in else !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "no" &&
      property == "712" &&
      isIndian == "india"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserProp712 && isUserIndAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...userMhPropType712 },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserProp712 && isUserForeignAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...userMhPropType712 },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserPropertyCard && isUserIndAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...userMhPropTypePropertyCard },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserPropertyCard && isUserForeignAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...userMhPropTypePropertyCard },
            },

            dharak: {
              userdharak: {
                ...userDharak,
              },
            },

            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType == 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      isIndian == "india"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserPropULPIN && isUserIndAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...userMhPropULPIN },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserDharak = await isValid.triggerUserDharak();

      if (isUserPropULPIN && isUserForeignAdd && isUserDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...userMhPropULPIN },
            },
            dharak: {
              userdharak: {
                ...userDharak,
              },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "india") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();
      if (isCompNoMhProperty && isUserIndAdd && isCompanyDharak) {
        if (isMobileNoVerified) {
          sendRequest(
            `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
            "POST",
            {
              giver: giver,
              usertype: userTypeLabel,
              usertype_code: userType,
              applicationid: applicationId,
              photo: {
                ...photo,
              },
              isMHProperty: {
                hasProperty: isMHProperty,
                propType: "0",
                userDetails: { ...companyNoMhProp },
              },
              dharak: {
                companydharak: {
                  ...companyDharak,
                },
              },
              address: {
                addressType: isIndian,
                indiaAddress: {
                  ...indiaAddress,
                },
              },
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                handleReset();
                getKherediGhenarTableData();
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
          warningToast("Please Verify Mobile No.");
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompNoMhProperty && isUserForeignAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "0",
              userDetails: { ...companyNoMhProp },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompProp712 && isUserIndAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...companyMhPropType712 },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompProp712 && isUserForeignAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "1",
              userDetails: { ...companyMhPropType712 },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompPropertryCard && isUserIndAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...companyMhPropTypePropertyCard },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompPropertryCard && isUserForeignAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "2",
              userDetails: { ...companyMhPropTypePropertyCard },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,

              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      property == "ulpin" &&
      isIndian == "india"
    ) {
      const isCompPropULPIN = await isValid.triggerCompPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompPropULPIN && isUserIndAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...companyMhPropULPIN },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              indiaAddress: {
                ...indiaAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields !!");
      }
    } else if (
      userType != 1 &&
      isMHProperty == "yes" &&
      isULPIN == "yes" &&
      property == "ulpin" &&
      isIndian == "foreign"
    ) {
      const isCompPropULPIN = await isValid.triggerCompPropULPIN();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isCompanyDharak = await isValid.triggerCompanyDharak();

      if (isCompPropULPIN && isUserForeignAdd && isCompanyDharak) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateKharediNondForTaker`,
          "POST",
          {
            giver: giver,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            photo: {
              ...photo,
            },
            isMHProperty: {
              hasProperty: isMHProperty,
              propType: "3",
              userDetails: { ...companyMhPropULPIN },
            },
            dharak: {
              companydharak: {
                ...companyDharak,
              },
            },
            address: {
              addressType: isIndian,
              foreignAddress: {
                ...foraighnAddress,
              },
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getKherediGhenarTableData();
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
        warningToast("Please Check All Fields !!");
        window.scrollTo({ top: 50, behavior: "smooth" });
      }
    }
  };

  const handleEdit = (id) => {
    const obj = responseData.find((o) => o?.mutation_dtl_id === id);
    setEditId(obj?.mutation_dtl_id);
    setIsEdit(true);
    setIsHardEdit(true);
    setUserTypeLabel(obj?.userType);
    setUserType(obj?.usertype_code);
    setIsIndian(obj?.address == "INDIA" ? "india" : "foreign");
  };

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteKharediNondForTaker`,
      "POST",
      {
        mutationId: id,
        applicationId: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getKherediGhenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleReset = () => {
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
    setUserMhPropType712({
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
    setUserMhPropTypePropertyCard({
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
    setUserMhPropULPIN({
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
    setCompanyNoMhProp({
      companyName: "",
      companyNameEng: "",
    });
    setCompanyMhPropType712({
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
    setCompanyMhPropTypePropertyCard({
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
    setCompanyMhPropULPIN({
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
    setUserDharak({
      aliceName: "",
      aapakDropdown: {},
      aapak: "",
      aapakRelation: {},
      gender: {},
      holderType: {},
      dob: "",
      motherName: "",
      motherNameEng: "",
      landBuyArea: "NA",
    });
    setCompanyDharak({
      holderType: {},
      landBuyArea: "NA",
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
    setIsMoreUsers("no");
    setIsReset(!isReset);
    setIsMobileNoVerified(false);
  };

  const getKherediDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetKharediNondGiverInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          // setGiverData(res?.ResponseData);
          const data = res?.ResponseData;
          const result = data.map(
            ({ mutation_dtl_id, userDetails, ActualctsNo }) => ({
              mutation_dtl_id,
              nabhu: ActualctsNo,
              subPropNo: userDetails?.subPropNo,
            })
          );
          setGiverData(result);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getKherediGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetKharediNondTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setResponseData([]);
          } else if (res?.ResponseData != "") {
            errorToast(res?.Message);
          }
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
    getKherediDenarTableData();
    getKherediGhenarTableData();
    setIntialUserType();
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
          heading="खरेदी घेणारा आवश्यक सूचना"
          arr={kherediGhenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          {/* ------------------------Newly added--------------------------- */}
          {/* <Grid item md={12}>
            <h4 className="heading">खरेदी देणारे</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>खरेदी देणारे</b>
                </InputLabel>
                <Select
                  value={userType}
                  onChange={handleChangeUserType}
                  fullWidth
                  className="textfield"
                  size="small"
                >
                  {Array.isArray(giver) && 
                    giver.map((val, i) => {
                      return (
                        <MenuItem value={val?.mutation_dtl_id + i}>
                          <b>{val?.fullNameInMarathi}, </b> न.भू.क्र.-{" "}
                          <b>{val?.userDetails?.nabhu}, </b> मिळकत -{" "}
                          <b>
                            {val?.userDetails?.milkat == "land"
                              ? "भूखंड / जमीन (प्लॉट)"
                              : "अपार्टमेंट"}
                            ,
                          </b>
                          उप मालमत्ता - <b>{val?.userDetails?.subPropNo}</b>
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            </Grid>
          </Grid> */}

          {/* ------------------------Newly added--------------------------- */}
          <Grid item md={12}>
            <h4 className="heading">खरेदी घेणार</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container spacing={2}>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>खरेदी घेणाराचा प्रकार </b>
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
                          heading="खरेदी घेणाऱ्याची माहिती"
                          inputlabel="खरेदी घेणाऱ्याचे नाव"
                          isEdit={isEdit}
                          userNoMhProp={userNoMhProp}
                          setUserNoMhProp={setUserNoMhProp}
                          setIsValid={setIsValid}
                          isReset={isReset}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <UserMHPropertyType712
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              userMhPropType712={userMhPropType712}
                              setUserMhPropType712={setUserMhPropType712}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <UserMHPropertyTypePropertyCard
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              userMhPropTypePropertyCard={
                                userMhPropTypePropertyCard
                              }
                              setUserMhPropTypePropertyCard={
                                setUserMhPropTypePropertyCard
                              }
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {isULPIN == "yes" && (
                            <UserMHPropertTypeULPIN
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              userMhPropULPIN={userMhPropULPIN}
                              setUserMhPropULPIN={setUserMhPropULPIN}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <CompanyNoMHProperty
                          heading="खरेदी घेणाऱ्याची माहिती"
                          inputlabel="खरेदी घेणाऱ्याचे नाव"
                          isEdit={isEdit}
                          companyNoMhProp={companyNoMhProp}
                          setCompanyNoMhProp={setCompanyNoMhProp}
                          setIsValid={setIsValid}
                          isReset={isReset}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <CompanyMHPropertType712
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              companyMhPropType712={companyMhPropType712}
                              setCompanyMhPropType712={setCompanyMhPropType712}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <CompanyMHPropertyTypePropertyCard
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              companyMhPropTypePropertyCard={
                                companyMhPropTypePropertyCard
                              }
                              setCompanyMhPropTypePropertyCard={
                                setCompanyMhPropTypePropertyCard
                              }
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {isULPIN == "yes" && (
                            <CompanyMHPropertyTypeULPIN
                              heading="खरेदी घेणाऱ्याची माहिती"
                              inputlabel="खरेदी घेणाऱ्याचे नाव"
                              isEdit={isEdit}
                              companyMhPropULPIN={companyMhPropULPIN}
                              setCompanyMhPropULPIN={setCompanyMhPropULPIN}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {/* <Grid
                item
                md={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <InputLabel className="inputlabel">
                  <b>फोटोग्राफ </b>
                  <span>*</span>
                </InputLabel>
                <img
                  src={
                    photo?.passportSrc
                      ? photo?.passportSrc
                      : "/images/user-placeholder.png"
                  }
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
                    accept="image/*"
                    hidden
                    onChange={handlePassportFileChange}
                  />
                </Button>
                {passportError && (
                  <div style={{ color: "red" }}>{passportError}</div>
                )}
                <a
                  href="https://www.ilovepdf.com/"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    fontSize: "13px",
                    marginTop: 3,
                  }}
                >
                  To resize photo click here
                </a>
              </Grid> */}
            </Grid>
          </Grid>

          <Grid item md={12}>
            {userType == 1 ? (
              <UserDharak
                isEdit={isEdit}
                userDharak={userDharak}
                setUserDharak={setUserDharak}
                setIsValid={setIsValid}
                isReset={isReset}
              />
            ) : (
              <CompanyDharak
                isEdit={isEdit}
                companyDharak={companyDharak}
                setCompanyDharak={setCompanyDharak}
                setIsValid={setIsValid}
                isReset={isReset}
              />
            )}
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type="kherediGhenar"
              isEdit={isEdit}
              hasSignature={false}
              isReset={isReset}
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
                    आणखी खरेदी घेणार आहे का?
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
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>खरेदी घेणारा माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>खरेदी घेणाराचा प्रकार</TableCell>
                <TableCell>खरेदी घेणाऱ्याचे नाव</TableCell>
                <TableCell>खरेदी घेणाऱ्याचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>धारक प्रकार</TableCell>
                <TableCell>स्त्री /पुरुष</TableCell>
                <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                <TableCell>जन्म दिनांक</TableCell>
                <TableCell>अ.पा.क</TableCell>
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
                        {/* <IconButton
                          color="success"
                          onClick={() => handleEdit(val?.mutation_dtl_id)}
                        >
                          <EditNoteOutlinedIcon />
                        </IconButton> */}
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

export default KharediGhenar;
