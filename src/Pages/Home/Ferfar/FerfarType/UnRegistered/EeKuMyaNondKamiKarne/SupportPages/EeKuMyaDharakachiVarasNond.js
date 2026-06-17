import React, { useEffect, useState } from "react";
import {
  Button,
  FormHelperText,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import UserNoMHProperty from "../../SupportPages/User/NoMHProperty/UserNoMHProperty";
import UserMHPropertyType712 from "../../SupportPages/User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "../../SupportPages/User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "../../SupportPages/User/MHProperty/UserMHPropertyTypeULPIN";
import CompanyNoMHProperty from "../../SupportPages/Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "../../Suppo./../SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypeULPIN";
import CompanyMHPropertyTypePropertyCard from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import UserAddress from "../../SupportPages/UserAddress";
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import {
  aapakDropdownValidationSchema,
  aapakValidationSchema,
  genderValidationSchema,
  holderTypeValidationSchema,
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
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { eeKuMyaVarasNotesArr } from "../../../../../../../NotesArray/NotesArray";
import { useNavigate } from "react-router-dom";
import ShowAddress from "../../SupportPages/ShowAddress";
import CloseIcon from "@mui/icons-material/Close";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const EeKuMyaDharakachiVarasNond = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [isMoreUsers, setIsMoreUsers] = useState("no");
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
  const [age, setAge] = useState("0");
  const [month, setMonth] = useState("0");
  const [genderArr, setGenderArr] = useState([]);
  const [dharakArr, setDharakArr] = useState([]);
  const [aapakArr, setAapakArr] = useState([]);
  const [deathRelationArr, setDeathRelationArr] = useState([]);
  const [relationArr, setRelationArr] = useState([]);
  const [dharak, setDharak] = useState({
    aliceName: "",
    gender: {},
    holderType: {},
    aapakDropdown: {},
    deadRelation: {},
    aapak: "",
    dob: "",
    motherName: "",
    motherNameEng: "",
    landBuyArea: "NA",
    aapakRelation: {},
  });

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
  const [isReset, setIsReset] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [giver, setGiverData] = useState([]);

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

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        gender: genderValidationSchema,
        holderType: holderTypeValidationSchema,
        deathRelation: yup.string().required("धारकाशी नाते निवडा"),
        // landBuyArea: yup.string().required("खरेदी क्षेत्र टाका"),
        dob: yup.string().required("जन्म तारीख टाका"),
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
      dob: "",
      gender: "",
      deathRelation: "",
      holderType: "",
      // landBuyArea: "",
      motherName: "",
      motherNameEng: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  // const handleChangeUserType = (e) => {
  //   setUserType(e?.target?.value);
  // };
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
  const handleDharak = (e) => {
    const { name, value } = e?.target;
    setDharak({ ...dharak, [name]: value });
  };
  const handleGender = (e) => {
    const code = e?.target?.value;
    const obj = genderArr.find((o) => o?.gender_code == code);
    setDharak({ ...dharak, gender: obj });
  };
  const handleDOB = (e) => {
    const date = e?.target?.value;
    const birthDate = new Date(date);
    const today = new Date();
    let ageDiff = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      ageDiff--;
      monthDiff += 12;
    }
    if (dayDiff < 0) {
      monthDiff--;
    }
    setAge(ageDiff);
    setMonth(monthDiff);
    if (ageDiff < 18) {
      setDharak({
        ...dharak,
        aapakDropdown: { apk_code: "2", apk_description: "अ.पा.क." },
        dob: date,
      });
    } else {
      setDharak({
        ...dharak,
        dob: date,
        aapak: "-",
        aapakRelation: { relation_code: "0", relation_name: "NA" },
      });
    }
  };
  const handleDeadRelation = (e) => {
    const code = e?.target?.value;
    const obj = deathRelationArr.find((o) => o?.relation_code == code);
    setDharak({ ...dharak, deadRelation: obj });
  };
  const handleRelation = (e) => {
    const code = e?.target?.value;
    const obj = relationArr.find((o) => o?.relation_code == code);
    setDharak({ ...dharak, aapakRelation: obj });
  };
  const handleUserDharak = (e) => {
    const { name, value } = e?.target;
    setDharak({ ...dharak, [name]: value });
  };
  const handleAapakDropdown = (e) => {
    const obj = aapakArr.find((o) => o.apk_code === e?.target?.value);
    setDharak({
      ...dharak,
      aapakDropdown: obj,
    });
  };
  const handleHolderType = (e) => {
    const code = e?.target?.value;
    const obj = dharakArr.find((o) => o?.account_type_code == code);
    setDharak({ ...dharak, holderType: obj });
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
      const commonValidation = await trigger();

      if (isUserNoMhProperty && isUserIndAdd && commonValidation) {
        if (isMobileNoVerified) {
          // console.info("payload-save->>", {
          //   usertype: userTypeLabel,
          //   usertype_code: userType,
          //   applicationid: applicationId,
          //   photo: {
          //     ...photo,
          //   },
          //   isMHProperty: {
          //     hasProperty: isMHProperty,
          //     propType: "0",
          //     userDetails: { ...userNoMhProp },
          //   },
          //   dharak: {
          //     ...dharak,
          //   },
          //   address: {
          //     addressType: isIndian,
          //     indiaAddress: {
          //       ...indiaAddress,
          //     },
          //   },
          // });

          sendRequest(
            `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
                ...dharak,
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
                getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserNoMhProperty && isUserForeignAdd && commonValidation) {
        // console.info("payload-save->>", {
        //   usertype: userTypeLabel,
        //   usertype_code: userType,
        //   applicationid: applicationId,
        //   photo: {
        //     ...photo,
        //   },
        //   isMHProperty: {
        //     hasProperty: isMHProperty,
        //     propType: "0",
        //     userDetails: { ...userNoMhProp },
        //   },
        //   dharak: {
        //     ...dharak,
        //   },
        //   address: {
        //     addressType: isIndian,

        //     foreignAddress: {
        //       ...foraighnAddress,
        //     },
        //   },
        // });

        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      isIndian == "india"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const commonValidation = await trigger();

      if (isUserProp712 && isUserIndAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserProp712 && isUserForeignAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserPropertyCard && isUserIndAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserPropertyCard && isUserForeignAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserPropULPIN && isUserIndAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
      const commonValidation = await trigger();

      if (isUserPropULPIN && isUserForeignAdd && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/CreateAkumaiNondForTaker`,
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
              ...dharak,
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
              getEeKuMyaVarasTableData();
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
    }
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
    setDharak({
      aliceName: "",
      gender: {},
      holderType: {},
      aapakDropdown: {},
      deadRelation: {},
      aapak: "",
      dob: "",
      motherName: "",
      motherNameEng: "",
      landBuyArea: "",
      aapakRelation: {},
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
    reset();
    setAge("0");
    setMonth("0");
    setIsReset(!isReset);
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteAkumaiNondForTaker`,
      "POST",
      {
        mutationId: id,
        applicationId: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getEeKuMyaVarasTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getEkKuMyaTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetAkumaiNondGiverInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
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
  const getEeKuMyaVarasTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetAkumaiNondTakerInfo`,
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
      }
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
      }
    );
  };
  const setGenderType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/genderList`,
      "POST",
      null,
      (res) => {
        setGenderArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setAapakType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/apkMasterList`,
      "POST",
      null,
      (res) => {
        setAapakArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setRelation = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/holderRelationList`,
      "POST",
      null,
      (res) => {
        setRelationArr(JSON.parse(res?.ResponseData));
        setDeathRelationArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    getEkKuMyaTableData();
    getEeKuMyaVarasTableData();
    setDharakType();
    setGenderType();
    setAapakType();
    setRelation();
  }, []);

  useEffect(() => {
    if (responseData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    } else {
      sessionStorage.setItem("allowPoa", "no");
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
          heading="ए.कू.मॅ. सहधारकासाठी आवश्यक सूचना"
          arr={eeKuMyaVarasNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 className="heading">ए.कू.मॅ. सहधारकाची नोंद</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container spacing={2}>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>सहधारक प्रकार </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          value="व्यक्ती"
                          className="textfieldDisabled"
                          disabled
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12}>
                    {isMHProperty == "no" ? (
                      <UserNoMHProperty
                        heading="सहधारक माहिती"
                        inputlabel="सहधारक नाव"
                        userNoMhProp={userNoMhProp}
                        setUserNoMhProp={setUserNoMhProp}
                        setIsValid={setIsValid}
                        isReset={isReset}
                      />
                    ) : (
                      <>
                        {property == "712" && isULPIN == "no" && (
                          <UserMHPropertyType712
                            heading="सहधारक माहिती"
                            inputlabel="सहधारक नाव"
                            userMhPropType712={userMhPropType712}
                            setUserMhPropType712={setUserMhPropType712}
                            setIsValid={setIsValid}
                            isReset={isReset}
                          />
                        )}
                        {property == "propertyCard" && isULPIN == "no" && (
                          <UserMHPropertyTypePropertyCard
                            heading="सहधारक माहिती"
                            inputlabel="सहधारक नाव"
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
                            heading="सहधारक माहिती"
                            inputlabel="सहधारक नाव"
                            userMhPropULPIN={userMhPropULPIN}
                            setUserMhPropULPIN={setUserMhPropULPIN}
                            setIsValid={setIsValid}
                            isReset={isReset}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} mt={2}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                <InputLabel className="inputlabel">
                  <b>
                    उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- mahesh
                    &gt;&gt; महेश)
                  </b>
                </InputLabel>
                {/* <TextField
                  fullWidth
                  className="textfield"
                  name="aliceName"
                  placeholder="उर्फ नाव लिहा"
                  size="small"
                  value={dharak?.aliceName}
                  onChange={handleDharak}
                /> */}
                <TransliterationTextField
                  value={dharak?.aliceName}
                  name="aliceName"
                  placeholder="उर्फ नाव लिहा"
                  // onChange={handleDharak}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                    handleDharak({
                      target: { name, value: filteredValue },
                    });
                  }}
                />
              </Grid>
              <Grid item md={2.3}>
                <Controller
                  name="holderType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>धारक प्रकार </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        name="holderType"
                        fullWidth
                        className="textfield"
                        size="small"
                        value={dharak?.holderType}
                        error={errors.holderType}
                        {...field}
                        onBlur={() => handleBlur("holderType")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleHolderType(e);
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
                        {errors.holderType && errors.holderType.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.3}>
                <Controller
                  name="deathRelation"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>ए.कू.मॅ. धारकाशी नाते </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        value={dharak?.deadRelation}
                        className="textfield"
                        fullWidth
                        size="small"
                        name="deathRelation"
                        error={errors.deathRelation}
                        {...field}
                        onBlur={() => handleBlur("deathRelation")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDeadRelation(e);
                        }}
                      >
                        {Array.isArray(deathRelationArr) &&
                          deathRelationArr.map((val, i) => {
                            return (
                              <MenuItem
                                value={val?.relation_code}
                                key={val?.relation_code + i}
                              >
                                {val?.relation_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.deathRelation && errors.deathRelation.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.3}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>लिंग निवडा </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        className="textfield"
                        fullWidth
                        size="small"
                        name="gender"
                        value={dharak?.gender}
                        error={errors.gender}
                        {...field}
                        onBlur={() => handleBlur("gender")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleGender(e);
                        }}
                      >
                        {Array.isArray(genderArr) &&
                          genderArr.map((val, i) => {
                            return (
                              <MenuItem key={i} value={val?.gender_code}>
                                {val?.gender_description}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.gender && errors.gender.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              {/* <Grid item md={2.5}>
                <Controller
                  name="landBuyArea"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>नावे क्षेत्र (चौ.मी.) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfield"
                        name="landBuyArea"
                        size="small"
                        value={dharak?.landBuyArea}
                        error={errors.landBuyArea}
                        {...field}
                        onBlur={() => handleBlur("landBuyArea")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDharak(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.landBuyArea && errors.landBuyArea.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid> */}
              <Grid item md={2}>
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
                        onClick={(event) => {
                          if (event.target.showPicker) {
                            event.target.showPicker();
                          }
                        }}
                        inputProps={{
                          max: today,
                          min: "1900-01-01",
                        }}
                        value={dharak?.dob}
                        error={errors.dob}
                        {...field}
                        onBlur={() => handleBlur("dob")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDOB(e);
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
              <Grid item md={2.5}>
                <InputLabel className="inputlabel">
                  <b>वय</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  disabled
                  size="small"
                  value={`${age} वर्षे ${month} महीने`}
                />
              </Grid>
              <Grid item md={2.5}>
                <InputLabel className="inputlabel">
                  <b>धारक</b>
                </InputLabel>
                {age < 18 ? (
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    size="small"
                    value={dharak?.aapakDropdown?.apk_description}
                  />
                ) : (
                  <Select
                    className="textfield"
                    name="aapakDropdown"
                    fullWidth
                    size="small"
                    value={dharak?.aapak?.apk_code}
                    onChange={handleAapakDropdown}
                  >
                    {Array.isArray(aapakArr) &&
                      aapakArr.map((val, i) => {
                        return (
                          <MenuItem
                            value={val?.apk_code}
                            key={val?.apk_code + i}
                          >
                            {val?.apk_description}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
              </Grid>
              {age >= 0 && age < 18 && (
                <Grid item md={2.5}>
                  <InputLabel className="inputlabel">
                    <b>अ.पा.क. चे नाव</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfield"
                    name="aapak"
                    size="small"
                    value={dharak?.aapak}
                    // onChange={handleUserDharak}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue = filterOnlyLettersAndSpaces(value);
                      handleUserDharak({
                        target: { name, value: filteredValue },
                      });
                    }}
                  />
                </Grid>
              )}
              {age >= 0 && age < 18 && (
                <Grid item md={2.5}>
                  <InputLabel className="inputlabel">
                    <b>अ.पा.क. चे धारकाशी नाते</b>
                  </InputLabel>
                  <Select
                    className="textfield"
                    fullWidth
                    size="small"
                    name="deathRelation"
                    value={dharak?.aapakRelation?.relation_name}
                    onChange={handleRelation}
                  >
                    {Array.isArray(relationArr) &&
                      relationArr.map((val, i) => {
                        return (
                          <MenuItem
                            value={val?.relation_code}
                            key={val?.relation_code + i}
                          >
                            {val?.relation_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item md={12}>
            <Grid container>
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
                        value={dharak?.motherName}
                        name="motherName"
                        placeholder="आईचे नाव"
                        error={errors.motherName}
                        {...field}
                        onBlur={() => handleBlur("motherName")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleDharak(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                          field.onChange(filteredValue);
                          handleDharak({
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
                        value={dharak?.motherNameEng}
                        error={errors.motherNameEng}
                        {...field}
                        onBlur={() => handleBlur("motherNameEng")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleDharak(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyLettersAndSpaces(value);
                          field.onChange(filteredValue);
                          handleDharak({
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
            <UserAddress
              type="eKuMyaDharakachivarasNond"
              hasSignature={false}
              isReset={isReset}
              setIsIndian={setIsIndian}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
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
                    आणखी ए.कू.मॅ. सहधारकाच्या नोंद आहे का?
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
          <h3 style={{ marginLeft: 20 }}>ए.कू.मॅ. सहधारकाच्या नोंद</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>सहधारकाचा प्रकार</TableCell>
                <TableCell>सहधारकाचे नाव</TableCell>
                <TableCell>सहधारकाचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>धारक प्रकार</TableCell>
                <TableCell>धारकाशी नाते</TableCell>
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
                      <TableCell>
                        {val?.dharak?.aliceName ? val?.dharak?.aliceName : "-"}
                      </TableCell>
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

export default EeKuMyaDharakachiVarasNond;
