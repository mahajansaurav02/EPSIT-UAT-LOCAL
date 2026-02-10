import React, { useEffect, useState } from "react";
import Header from "../../ui/Header";
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TopHead from "./CommonComponent/TopHead";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SendIcon from "@mui/icons-material/Send";
import UserAddress from "./UserAddress";
import UserNoMHProperty from "./User/NoMHProperty/UserNoMHProperty";
import CompanyNoMHProperty from "./Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "./Company/MHProperty/CompanyMHPropertyType712";
import CompanyMHPropertyTypePropertyCard from "./Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "./Company/MHProperty/CompanyMHPropertyTypeULPIN";
import UserMHPropertyType712 from "./User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "./User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "./User/MHProperty/UserMHPropertyTypeULPIN";
import styles from "./registration.module.css";
import RegistrationInstance from "../../Instance/RegisterInstance";
import { errorToast, successToast, Toast, warningToast } from "../../ui/Toast";
import { useNavigate } from "react-router-dom";
import URLS from "../../URLs/url";
import { registerNotes } from "../../NotesArray/NotesArray";

const Register = () => {
  const navigate = useNavigate();
  const { sendRequest } = RegistrationInstance();
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
  const [tableData, setTableData] = useState([]);
  const [passportError, setPassportError] = useState("");
  const [checked, setChecked] = useState(false);
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);

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
    district: {},
    taluka: {},
    village: {},
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

  //------------------------------Validation Check Trigger----------------------
  const [isValid, setIsValid] = useState({});

  const handleChangeCheckbox = (event) => {
    setChecked(event.target.checked);
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

  const handlCreateAcc = async () => {
    // if (isMobileNoVerified) {
    if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserNoMhProperty && isUserIndContact) {
        if (isMobileNoVerified) {
          sendRequest(
            `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
            "POST",
            {
              usertype: userTypeLabel,
              usertype_code: userType,
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
                setTimeout(() => navigate("/login"), 2500);
              } else {
                errorToast(res?.Message);
                setIsMobileNoVerified(false);
              }
            },
            (err) => {
              errorToast(
                err?.data?.message
                  ? err?.data?.message
                  : "Something Went Wrong !!"
              );
            }
          );
        } else {
          warningToast("Please Verify Mobile No !!");
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isUserNoMhProperty && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.data?.message);
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
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();

      if (isUserProp712 && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.data?.message);
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
      if (isUserProp712 && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isUserPropertyCard && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.data?.message);
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

      if (isUserPropertyCard && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isUserPropULPIN && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.data?.message);
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

      if (isUserPropULPIN && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "india") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAddress();
      const isUserIndContact = await isValid.triggerUserIndContact();
      if (isCompNoMhProperty && isUserIndContact) {
        if (isMobileNoVerified) {
          sendRequest(
            `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
            "POST",
            {
              usertype: userTypeLabel,
              usertype_code: userType,
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
                setTimeout(() => navigate("/login"), 2500);
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(
                err?.data?.message
                  ? err?.data?.message
                  : "Something Went Wrong !!"
              );
            }
          );
        } else {
          warningToast("Please Verify Mobile No !!");
        }
      } else {
        warningToast("Please Check All Fields !!");
      }
    } else if (userType != 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isCompNoMhProperty = await isValid.triggerCompNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserForeignContact = await isValid.triggerUserForeignContact();

      if (isCompNoMhProperty && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isCompProp712 && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isCompProp712 && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isCompPropertryCard && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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
      if (isCompPropertryCard && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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

      if (isCompPropULPIN && isUserIndContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
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
      if (isCompPropULPIN && isUserForeignContact) {
        sendRequest(
          `${URLS?.BaseURL}/LoginAPIS/RegisterUser`,
          "POST",
          {
            usertype: userTypeLabel,
            usertype_code: userType,
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
              setTimeout(() => navigate("/login"), 2500);
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(
              err?.data?.message
                ? err?.data?.message
                : "Something Went Wrong !!"
            );
          }
        );
      } else {
        warningToast("Please Check All Fields !!");
        window.scrollTo({ top: 50, behavior: "smooth" });
      }
    }
    // } else {
    //   warningToast("Please Verify your Mobile No.");
    // }
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
    setIntialUserType();
  }, []);
  return (
    <>
      <Toast />
      <Header showSignInBtn={true} />
      <Container sx={{ mt: 3 }}>
        <Paper
          elevation={5}
          sx={{ backgroundColor: "#EFEFEF", p: 1, borderRadius: 3 }}
        >
          <div style={{ paddingRight: 2, marginTop: 0 }}>
            <ol>
              {Array.isArray(registerNotes) &&
                registerNotes.map((v, i) => {
                  return <li key={i}>{v}</li>;
                })}
            </ol>
          </div>
        </Paper>
      </Container>
      <Container sx={{ mt: 2 }}>
        <Paper
          elevation={5}
          sx={{
            mt: 5,
            pb: 5,
            borderRadius: "8px",
          }}
          className="papermain"
        >
          <Grid
            container
            sx={{
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
            bgcolor="#865534"
            px={4}
            py={2}
            mb={2}
          >
            <TopHead />
          </Grid>

          <Grid container spacing={3} paddingX={4}>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={10}>
                  <Grid container>
                    <Grid item md={12}>
                      <Grid container spacing={2}>
                        <Grid item md={2}>
                          <InputLabel className="inputlabel">
                            <b>वापरकर्ता प्रकार </b> <span>*</span>
                          </InputLabel>
                          <Select
                            value={userType}
                            className="textfield"
                            onChange={handleChangeUserType}
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
                  </Grid>

                  {userType == 1 ? (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <UserNoMHProperty
                          userNoMhProp={userNoMhProp}
                          setUserNoMhProp={setUserNoMhProp}
                          setIsValid={setIsValid}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <UserMHPropertyType712
                              userMhPropType712={userMhPropType712}
                              setUserMhPropType712={setUserMhPropType712}
                              setIsValid={setIsValid}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <UserMHPropertyTypePropertyCard
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
                          companyNoMhProp={companyNoMhProp}
                          setCompanyNoMhProp={setCompanyNoMhProp}
                          setIsValid={setIsValid}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <CompanyMHPropertType712
                              companyMhPropType712={companyMhPropType712}
                              setCompanyMhPropType712={setCompanyMhPropType712}
                              setIsValid={setIsValid}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <CompanyMHPropertyTypePropertyCard
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
                    <b>फोटोग्राफ </b>
                  </InputLabel>
                  <img
                    src={
                      photo?.passportSrc
                        ? photo?.passportSrc
                        : "/images/user-placeholder.png"
                    }
                    width="170px"
                    height="170px"
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
                  {/* <FormHelperText sx={{ color: "red" }}>
                    {passportError && passportError}
                  </FormHelperText> */}
                  {passportError ? (
                    <p style={{ color: "red", fontSize: "13px", marginTop: 3 }}>
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
                setIsIndian={setIsIndian}
                indiaAddress={indiaAddress}
                setIndiaAdress={setIndiaAdress}
                setForaighnAddress={setForaighnAddress}
                indiaContactDetails={indiaContactDetails}
                setIndiaContactDetails={setIndiaContactDetails}
                foreignContactDetails={foreignContactDetails}
                setForeignContactDetails={setForeignContactDetails}
                setIsValid={setIsValid}
                setIsMobileNoVerified={setIsMobileNoVerified}
                isMobileNoVerified={isMobileNoVerified}
              />
            </Grid>
          </Grid>
          <Grid item md={12} paddingX={7} mt={2}>
            <FormControlLabel
              control={
                <Checkbox checked={checked} onChange={handleChangeCheckbox} />
              }
              label="वरील भरलेली माहिती योग्य आहे *"
            />
          </Grid>
        </Paper>
        <Grid container textAlign="right" mt={2} mb={2}>
          <Grid item md={12}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handlCreateAcc}
              disabled={!checked}
              // sx={{ backgroundColor: "#0078B5" }}
            >
              खाते तयार करा
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Register;
