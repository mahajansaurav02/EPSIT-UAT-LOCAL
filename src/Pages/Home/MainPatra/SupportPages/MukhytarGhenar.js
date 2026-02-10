import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormHelperText,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UserNoMHProperty from "./User/NoMHProperty/UserNoMHProperty";
import UserMHPropertyType712 from "./User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "./User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "./User/MHProperty/UserMHPropertyTypeULPIN";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import UserAddress from "./UserAddress";
import UserDharak from "./User/UserDharak";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../../ui/Toast";
import AxiosInstance from "../../../../Instance/AxiosInstance";
import URLS from "../../../../URLs/url";
import { districtValidationSchema } from "../../../../Validations/yupValidations";
import NotesPaper from "../../../../ui/NotesPaper/NotesPaper";
import { poaGhenarNotesArr } from "../../../../NotesArray/NotesArray";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ShowAddress from "./ShowAddress";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const StyledTd = styled.td({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});
const StyledTh = styled.th({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});

const MukhytarGhenar = ({ mutCode, setDisableShowNextBtn }) => {
  //-----------------------------Common data---------------------------
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [applicationData, setApplicationData] = useState({});
  const [data, setData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
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
  const [attornyType, setAttornyType] = useState({
    poa_type_code: 1,
    poa_type_description: "NA",
  });
  const [divisionArr, setDivisionArr] = useState([]);
  const [division, setDivision] = useState({});
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [SRO, setSRO] = useState([]);
  const [registrar, setRegistrar] = useState({});
  const [dastNo, setDastNo] = useState("");
  const [dastNoYear, setDastNoYear] = useState("");
  const [dastNoDate, setDastNoDate] = useState("");
  const [isDastVarified, setIsDastVarified] = useState(false);
  const [verifiedDastData, setVerifiedDastData] = useState([]);
  const [showField, setShowField] = useState(false);
  const [isPOAisPartofDast, setIsPOAisPartofDast] = useState("yes");
  const [isDeclerationInvolvedInPOA, setIsDeclerationInvolvedInPOA] =
    useState("yes");
  const [isPOAPermanant, setIsPOAPermanant] = useState("yes");
  const [isTransferRights, setIsTransferRights] = useState("yes");

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
  const [userMhPropTypePropertyCard, setUserMhPropTypePropertyCard] = useState({
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
  const [userDharak, setUserDharak] = useState({
    aliceName: "",
    gender: {},
    dob: "",
    motherName: "NA",
    motherNameEng: "NA",
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
  });

  //-------------------------------check validations------------------
  const [isEdit, setIsEdit] = useState(false);
  const [isDastEdit, setIsDastEdit] = useState(false);
  const [isSelectedOptnEdit, setIsSelectedOptnEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [editObj, setEditObj] = useState({});

  //------------------------------Combined States----------------------------
  const [isReset, setIsReset] = useState(false);
  const [isValid, setIsValid] = useState({});
  const [responseData, setResponseData] = useState([]);
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
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        selectedOptions: yup
          .array()
          .min(1, "किमान एकतरी मुखत्यारपत्र देणारे निवडा")
          .required("मुखत्यारपत्र देणारे निवडा"),
        division: yup.string().required("विभाग निवडा"),
        district: districtValidationSchema,
        registrar: yup.string().required("दुय्यम निबंधक कार्यालय निवडा"),
        dastNo: yup.string().required("रजीस्टर्ड दस्त क्रमांक टाका"),
        dastNoYear: yup
          .string()
          .trim()
          .required("रजीस्टर्ड दस्त वर्ष टाका")
          .matches(/^\d{4}$/, "4 अंक असणे गरजचे आहे")
          .test(
            "year-range",
            `अमान्य दस्त वर्ष. 1908 ते  ${currentYear} पर्यन्त मर्यादित`,
            (value) => {
              const year = parseInt(value, 10);
              return year >= 1908 && year <= currentYear;
            }
          ),
        dastNoDate: yup.string().required("Date is required"),
      })
    ),
    defaultValues: {
      selectedOptions: [],
      dastNo: "",
      dastNoDate: "",
      dastNoYear: "",
      district: "",
      division: "",
      registrar: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
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

  const handleisPOAisPartofDast = (e) => {
    setIsPOAisPartofDast(e?.target?.value);
  };
  const handleisDeclerationInvolvedInPOA = (e) => {
    setIsDeclerationInvolvedInPOA(e?.target?.value);
  };
  const handleisPOAPermanant = (e) => {
    setIsPOAPermanant(e?.target?.value);
  };
  const handleisTransferRights = (e) => {
    setIsTransferRights(e?.target?.value);
  };

  // -----------------IGR-------------------------
  const handleDivision = (e) => {
    const divisionCode = e?.target?.value;
    const obj = divisionArr.find((o) => o?.digcode == divisionCode);
    setDivision(obj);
    setSRO([]);
    setDastNo("");
    setDastNoYear("");
    setDastNoDate("");
    setVerifiedDastData([]);

    sendRequest(
      `${URLS?.BaseURL}/IGRAPI/JDRList`,
      "POST",
      divisionCode,
      (res) => {
        setDistrictArr(JSON.parse(res?.ResponseData).Table);
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleDistrict = (e) => {
    const distCode = e?.target?.value;
    const obj = districtArr.find((o) => o?.jdrcode == distCode);
    setDistrict(obj);
    setVerifiedDastData([]);

    sendRequest(
      `${URLS?.BaseURL}/IGRAPI/SROList`,
      "POST",
      { digcode: division?.digcode, jDRCode: distCode },
      (res) => {
        setSRO(JSON.parse(res?.ResponseData).Table);
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleRegistrar = (e) => {
    const regiCode = e?.target?.value;
    const obj = SRO.find((o) => o?.srocode == regiCode);
    setRegistrar(obj);
    setVerifiedDastData([]);
  };
  const handleDastNo = (value) => {
    setDastNo(value);
    setVerifiedDastData([]);
  };
  const handleDastNoYear = (e) => {
    // const value = e?.target?.value;
    let input = e?.target?.value;
    input = input.replace(/[^0-9]/g, "");
    if (input.length > 4) {
      input = input.slice(0, 4);
    }
    // setDastNoYear(value);
    setDastNoYear(input);
    if (input <= 2012) {
      setShowField(false);
    } else {
      setShowField(true);
      setVerifiedDastData([]);
    }
  };
  const handleVerifyIGRApi = async () => {
    const result = await trigger([
      "division",
      "district",
      "registrar",
      "dastNo",
      "dastNoYear",
    ]);
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/IGRAPI/DocumentStatus`,
        "POST",
        {
          srocode: registrar?.srocode,
          docnumber: dastNo,
          regyear: dastNoYear,
        },
        (res) => {
          if (res?.Code == "1") {
            if (JSON.parse(res?.ResponseData).Table[0].status) {
              successToast(res?.Message);
              setVerifiedDastData(JSON.parse(res.ResponseData).Table);
              formatDate(
                JSON.parse(res?.ResponseData).Table[0].registration_date
              );
              setIsDastVarified(true);
            } else {
              setIsDastVarified(false);
              errorToast(
                "कृपया रजीस्टर्ड दस्त क्रमांक / वर्ष तपासा, अन्यथा दस्त दिनांक टाका"
              );
            }
          } else {
            warningToast(res?.Message);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      errorToast("कृपया पूर्ण माहिती भरा.");
    }
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setDastNoDate(`${day}-${month}-${year}`);
    setValue("dastNoDate", `${day}-${month}-${year}`);
  };
  const handleDastNoDate = (e) => {
    setDastNoDate(e?.target?.value);
  };
  //---------------------------------------------------------------------------------
  const handleSave = async () => {
    if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserNoMhProperty &&
        isUserIndAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
    } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserNoMhProperty &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "712" &&
      isIndian == "india"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (isUserProp712 && isUserIndAdd && isUserDharak && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "712" &&
      isIndian == "foreign"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserProp712 &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "propertyCard" &&
      isIndian == "india"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropertyCard &&
        isUserIndAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,

            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "propertyCard" &&
      isIndian == "foreign"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropertyCard &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "ulpin" &&
      isIndian == "india"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (isUserPropULPIN && isUserIndAdd && isUserDharak && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
      property == "ulpin" &&
      isIndian == "foreign"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropULPIN &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMukhyarGhenar();
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
  const handleEditSave = async () => {
    if (userType == 1 && isMHProperty == "no" && isIndian == "india") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserNoMhProperty &&
        isUserIndAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
    } else if (userType == 1 && isMHProperty == "no" && isIndian == "foreign") {
      const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserNoMhProperty &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "712" &&
      isIndian == "india"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (isUserProp712 && isUserIndAdd && isUserDharak && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "712" &&
      isIndian == "foreign"
    ) {
      const isUserProp712 = await isValid.triggerUserProp712();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserProp712 &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "propertyCard" &&
      isIndian == "india"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropertyCard &&
        isUserIndAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "propertyCard" &&
      isIndian == "foreign"
    ) {
      const isUserPropertyCard = await isValid.triggerUserPropertyCard();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropertyCard &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "ulpin" &&
      isIndian == "india"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (isUserPropULPIN && isUserIndAdd && isUserDharak && commonValidation) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
      property == "ulpin" &&
      isIndian == "foreign"
    ) {
      const isUserPropULPIN = await isValid.triggerUserPropULPIN();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      const isUserDharak = await isValid.triggerUserDharak();
      const commonValidation = await trigger();

      if (
        isUserPropULPIN &&
        isUserForeignAdd &&
        isUserDharak &&
        commonValidation
      ) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateAttorneyInfoForTaker`,
          "POST",
          {
            editId: editId,
            selectedOptions: selectedOptions,
            usertype: userTypeLabel,
            usertype_code: userType,
            applicationid: applicationId,
            mutation_id: "1",
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
            attornytype: attornyType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            isPOAisPartofDast: isPOAisPartofDast,
            isDeclerationInvolvedInPOA: isDeclerationInvolvedInPOA,
            isPOAPermanant: isPOAPermanant,
            isTransferRights: isTransferRights,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              isHardEdit(false);
              getMukhyarGhenar();
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
    setSelectedOptions([]);
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
    setUserMhPropTypePropertyCard({
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
    setUserDharak({
      aliceName: "",
      gender: "",
      dob: "",
      motherName: "NA",
      motherNameEng: "NA",
    });
    setIsIndian("india");
    setIndiaAdress({
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
    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "yes",
    });
    setDistrict(null);
    setRegistrar(null);
    setDastNo("");
    setDastNoDate("");
    setDastNoYear("");
    setIsDastVarified(false);

    setIsPOAisPartofDast("yes");
    setIsDeclerationInvolvedInPOA("yes");
    setIsPOAPermanant("yes");
    setIsTransferRights("yes");

    reset();
    setIsReset(!isReset);
    // setIsReset(true);
    // setTimeout(() => {
    //   setIsReset(false);
    // }, 1000);
    setIsDastEdit(false);
    setIsSelectedOptnEdit(false);
  };
  const handleSelectedOptnReset = () => {
    reset({
      selectedOptions: [],
    });
    setIsSelectedOptnEdit(false);
  };
  const handleDastReset = () => {
    setDistrict(null);
    setRegistrar(null);
    setDastNo("");
    setDastNoDate("");
    setDastNoYear("");
    setIsDastVarified(false);

    setIsPOAisPartofDast("yes");
    setIsDeclerationInvolvedInPOA("yes");
    setIsPOAPermanant("yes");
    setIsTransferRights("yes");

    reset({
      dastNo: "",
      dastNoDate: "",
      dastNoYear: "",
      district: "",
      division: "",
      registrar: "",
    });
    setIsDastEdit(false);
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    setIsHardEdit(true);
    setIsDastEdit(true);
    setIsSelectedOptnEdit(true);
    setEditId(id);
    const obj = responseData.find((o) => o?.power_of_attorney_id == id);
    setEditObj(obj);
    setUserNoMhProp({
      suffix: obj?.userDetails?.suffix,
      suffixEng: obj?.userDetails?.suffixEng,
      suffixcode: "",
      suffixCodeEng: "",
      firstName: obj?.userDetails?.firstName,
      middleName: obj?.userDetails?.middleName,
      lastName: obj?.userDetails?.lastName,
      firstNameEng: obj?.userDetails?.firstNameEng,
      middleNameEng: obj?.userDetails?.middleNameEng,
      lastNameEng: obj?.userDetails?.lastNameEng,
    });
    setUserDharak({
      aliceName: obj?.dharak?.userdharak?.aliceName,
      gender: obj?.dharak?.userdharak?.gender,
      dob: obj?.dharak?.userdharak?.dob,
      motherName: obj?.dharak?.userdharak?.motherName,
      motherNameEng: obj?.dharak?.userdharak?.motherNameEng,
    });
    setIsIndian(obj?.address?.addressType == "INDIA" ? "india" : "foreign");
    setIndiaAdress({
      plotNo: obj?.address?.indiaAddress?.plotNo,
      building: obj?.address?.indiaAddress?.building,
      mainRoad: obj?.address?.indiaAddress?.mainRoad,
      impSymbol: obj?.address?.indiaAddress?.impSymbol,
      area: obj?.address?.indiaAddress?.area,
      mobile: obj?.address?.indiaAddress?.mobile,
      mobileOTP:
        obj?.address?.indiaAddress?.mobileOTP == "YES"
          ? "Verified"
          : "UnVerified",
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
    setForaighnAddress({
      address: obj?.address?.foreignAddress,
      mobile: "",
      email: "",
      emailOTP: "yes",
    });

    setDivision(obj?.division);
    setDistrict(obj?.district);
    setRegistrar(obj?.registrar);
    setDastNo(obj?.dastNo);
    setDastNoDate(obj?.dastNoDate);
    setDastNoYear(obj?.dastNoYear);
    setIsDastVarified(obj?.isDastVarified);
    setVerifiedDastData(JSON.parse(obj?.varifiedDastData));
    setIsPOAisPartofDast(obj?.isPOAisPartofDast == "YES" ? "yes" : "no");
    setIsDeclerationInvolvedInPOA(
      obj?.isDeclerationInvolvedInPOA == "YES" ? "yes" : "no"
    );
    setIsPOAPermanant(obj?.isPOAPermanant == "YES" ? "yes" : "no");
    setIsTransferRights(obj?.isTransferRights == "YES" ? "yes" : "no");

    setValue("dastNo", obj?.dastNo);
    setValue("dastNoDate", obj?.dastNoDate);
    setValue("dastNoYear", obj?.dastNoYear);
    setValue("district", obj?.district?.jdr);
    setValue("division", obj?.division?.dig);
    setValue("registrar", obj?.registrar?.sro);
    setValue("selectedOptions", [obj?.giver_name_in_marathi]);
  };

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeletePOAForTaker`,
      "POST",
      {
        power_of_attorney_id: id,
        applicationid: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getMukhyarGhenar();
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getMukhyarGhenar = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetPowerOfAttorneyInfoForTaker`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
          if (res?.ResponseData.length > 0) {
            setDisableShowNextBtn(false);
          } else {
            setDisableShowNextBtn(true);
          }
        } else {
          if (res?.ResponseData.length == 0) {
            setResponseData([]);
            setDisableShowNextBtn(true);
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
  const getMukhyarDenarDropdown = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetGiverTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          // successToast(res?.Message);
          setData(res?.ResponseData[0]);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const setInitialDivision = () => {
    sendRequest(
      `${URLS?.BaseURL}/IGRAPI/DIGList`,
      "POST",
      null,
      (res) => {
        setDivisionArr(JSON.parse(res?.ResponseData).Table);
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    getMukhyarGhenar();
    setAppDataApi();
    getMukhyarDenarDropdown();
    setInitialDivision();
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
          heading="मुखत्यारपत्र घेणार आवश्यक सूचना"
          arr={poaGhenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 className="heading">मुखत्यारपत्र देणार</h4>
          </Grid>
          <Grid item md={12}>
            {isSelectedOptnEdit && (
              <Grid item md={12} mb={1}>
                <Button
                  onClick={handleSelectedOptnReset}
                  variant="outlined"
                  startIcon={<EditNoteOutlinedIcon />}
                >
                  मुखत्यारपत्र देणाऱ्यात बदल करा
                </Button>
              </Grid>
            )}

            {/* <Autocomplete
              multiple
              options={data}
              className="textfield"
              disableCloseOnSelect
              getOptionLabel={(option) => option?.name}
              value={selectedOptions}
              onChange={(event, newValue) => {
                setSelectedOptions(newValue);
              }}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option?.name}
                  </li>
                );
              }}
              style={{ width: 500 }}
              renderInput={(params) => <TextField {...params} />}
            /> */}

            {isSelectedOptnEdit ? (
              <>
                <InputLabel className="inputlabel">
                  <b>मुखत्यारपत्र देणारे</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  size="small"
                  disabled
                  multiline
                  rows={2}
                  value={editObj?.giver_name_in_marathi}
                  style={{ width: 500 }}
                />
              </>
            ) : (
              <>
                <InputLabel className="inputlabel">
                  <b>मुखत्यारपत्र देणारे निवडा </b>
                  <span>*</span>
                </InputLabel>
                <Controller
                  name="selectedOptions"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Autocomplete
                        {...field}
                        multiple
                        options={data}
                        error={errors.selectedOptions}
                        className="textfield"
                        disableCloseOnSelect
                        getOptionLabel={(option) => option?.name}
                        value={selectedOptions}
                        onChange={(event, newValue) => {
                          field.onChange(newValue);
                          setSelectedOptions(newValue);
                        }}
                        renderOption={(props, option, { selected }) => {
                          const { key, ...optionProps } = props;
                          return (
                            <li key={key} {...optionProps}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option?.name}
                            </li>
                          );
                        }}
                        style={{ width: 500 }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.dastNo && errors.dastNo.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </>
            )}
          </Grid>
          <Grid item md={12}>
            <h4 className="heading">मुखत्यारपत्र घेणार</h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container spacing={2}>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>मुखत्यारकर्ता प्रकार </b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          value={userTypeLabel}
                          className="textfieldDisabled"
                          disabled
                          size="small"
                        />
                      </Grid>
                      {/* <Grid item md={3}>
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

                  <Grid item md={12}>
                    {isMHProperty == "no" ? (
                      <UserNoMHProperty
                        userNoMhProp={userNoMhProp}
                        setUserNoMhProp={setUserNoMhProp}
                        setIsValid={setIsValid}
                        isReset={isReset}
                        isEdit={isEdit}
                      />
                    ) : (
                      <>
                        {property == "712" && isULPIN == "no" && (
                          <UserMHPropertyType712
                            userMhPropType712={userMhPropType712}
                            setUserMhPropType712={setUserMhPropType712}
                            setIsValid={setIsValid}
                            isReset={isReset}
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
                            isReset={isReset}
                          />
                        )}
                        {isULPIN == "yes" && (
                          <UserMHPropertTypeULPIN
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
            <UserDharak
              userDharak={userDharak}
              setUserDharak={setUserDharak}
              setIsValid={setIsValid}
              applicationData={applicationData}
              mutCode={mutCode}
              isReset={isReset}
              isEdit={isEdit}
            />
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
              setIsValid={setIsValid}
              isReset={isReset}
            />
          </Grid>

          {isDastEdit && (
            <Grid item md={12}>
              <Button
                onClick={handleDastReset}
                variant="outlined"
                startIcon={<EditNoteOutlinedIcon />}
              >
                बदल करा
              </Button>
            </Grid>
          )}

          <Grid item md={12}>
            {isDastEdit ? (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>विभाग </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={editObj?.division?.dig}
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>जिल्हा </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={editObj?.district?.jdr}
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>दुय्यम निबंधक कार्यालय </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={editObj?.registrar?.sro}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <Controller
                    name="division"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>विभाग </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          className="textfield"
                          fullWidth
                          size="small"
                          value={division}
                          error={errors.division}
                          {...field}
                          onBlur={() => handleBlur("division")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDivision(e);
                          }}
                        >
                          {Array.isArray(divisionArr) &&
                            divisionArr.map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.digcode + i}
                                  value={val?.digcode}
                                >
                                  {val?.dig}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.division && errors.division.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={4}>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>जिल्हा </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          className="textfield"
                          fullWidth
                          size="small"
                          value={district}
                          error={errors.district}
                          {...field}
                          onBlur={() => handleBlur("district")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDistrict(e);
                          }}
                        >
                          {Array.isArray(districtArr) &&
                            districtArr.map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.jdrcode + i}
                                  value={val?.jdrcode}
                                >
                                  {val?.jdr}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.district && errors.district.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={4}>
                  <Controller
                    name="registrar"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>दुय्यम निबंधक कार्यालय </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          className="textfield"
                          fullWidth
                          size="small"
                          value={registrar}
                          error={errors.registrar}
                          {...field}
                          onBlur={() => handleBlur("registrar")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleRegistrar(e);
                          }}
                        >
                          {Array.isArray(SRO) &&
                            SRO.map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.srocode + i}
                                  value={val?.srocode}
                                >
                                  {val?.sro}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.registrar && errors.registrar.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item md={12}>
            {isDastEdit ? (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>रजीस्टर्ड दस्त क्रमांक </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={editObj?.dastNo}
                  />
                </Grid>
                <Grid item md={2}>
                  <InputLabel className="inputlabel">
                    <b>वर्ष </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    size="small"
                    disabled
                    value={editObj?.dastNoYear}
                  />
                </Grid>
                <Grid item md={2}>
                  <InputLabel>
                    <b> &nbsp;</b>
                  </InputLabel>
                  <Button variant="contained" fullWidth disabled>
                    Verify
                  </Button>
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>दस्त दिनांक </b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    size="small"
                    value={dastNoDate}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <Controller
                    name="dastNo"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>रजीस्टर्ड दस्त क्रमांक </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfield"
                          placeholder="दस्त नंबर"
                          size="small"
                          type="text"
                          value={dastNo}
                          error={errors.dastNo}
                          {...field}
                          onBlur={() => handleBlur("dastNo")}
                          // onChange={(e) => {
                          //   field.onChange(e);
                          //   handleDastNo(e);
                          // }}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue.replace(/\D/g, "");
                            if (inputValue.length > 10) {
                              inputValue = inputValue.slice(0, 10);
                            }
                            field.onChange(inputValue);
                            handleDastNo(inputValue);
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.dastNo && errors.dastNo.message}
                        </FormHelperText>
                        <FormHelperText>
                          अंक मराठी मध्ये नसावे. Please use english numbers.
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={2}>
                  <Controller
                    name="dastNoYear"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>वर्ष </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          placeholder="YYYY"
                          className="textfield"
                          // type="number"
                          type="text"
                          size="small"
                          value={dastNoYear}
                          error={errors.dastNoYear}
                          // inputProps={{
                          //   maxLength: 4,
                          //   max: 9999,
                          //   onInput: (e) => {
                          //     if (e.target.value.length > 4) {
                          //       e.target.value = e.target.value.slice(0, 4);
                          //     }
                          //   },
                          // }}
                          inputProps={{ maxLength: 4 }}
                          {...field}
                          onBlur={() => handleBlur("dastNoYear")}
                          onChange={(e) => {
                            handleDastNoYear(e);
                            // field.onChange(e);
                            field.onChange(
                              e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                            );
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.dastNoYear && errors.dastNoYear.message}
                        </FormHelperText>
                        <FormHelperText>
                          अंक मराठी मध्ये नसावे. Please use english numbers.
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={2}>
                  <InputLabel>
                    <b> &nbsp;</b>
                  </InputLabel>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleVerifyIGRApi}
                    disabled={!showField}
                  >
                    Verify
                  </Button>
                </Grid>
                <Grid item md={3}>
                  {isDastVarified ? (
                    <>
                      <InputLabel className="inputlabel">
                        <b>दस्त दिनांक </b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        disabled
                        size="small"
                        value={dastNoDate}
                      />
                    </>
                  ) : (
                    <Controller
                      name="dastNoDate"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel className="inputlabel">
                            <b>दस्त दिनांक </b>
                            <span>*</span>
                          </InputLabel>
                          <TextField
                            fullWidth
                            className="textfield"
                            type="date"
                            size="small"
                            value={dastNoDate}
                            onFocus={(event) => {
                              event.target.showPicker();
                            }}
                            inputProps={{
                              max: today,
                              min: "1900-01-01",
                            }}
                            error={errors.dastNoDate}
                            {...field}
                            onBlur={() => handleBlur("dastNoDate")}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDastNoDate(e);
                            }}
                          />
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.dastNoDate && errors.dastNoDate.message}
                          </FormHelperText>
                        </>
                      )}
                    />
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>

          {isDastVarified && (
            <Grid item md={12} mt={1}>
              <table
                style={{
                  width: "-webkit-fill-available",
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <tr>
                  <StyledTh>Document No</StyledTh>
                  <StyledTh>Property No</StyledTh>
                  <StyledTh>Village</StyledTh>
                </tr>
                {Array.isArray(verifiedDastData) &&
                  verifiedDastData.map((val, i) => {
                    return (
                      <tr key={i}>
                        <StyledTd>{val?.docnumber}</StyledTd>
                        <StyledTd>{val?.property_number}</StyledTd>
                        <StyledTd>{val?.village}</StyledTd>
                      </tr>
                    );
                  })}
              </table>
            </Grid>
          )}

          {/* <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>जनरल मुखत्यारपत्र दस्ताचा भाग आहे का?</b>
                </InputLabel>
                <RadioGroup
                  row
                  value={isPOAisPartofDast}
                  onChange={handleisPOAisPartofDast}
                  defaultValue="yes"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="होय"
                    disabled={isDastEdit}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={isDastEdit}
                  />
                </RadioGroup>
              </Grid>
              <Grid item md={9}>
                <InputLabel className="inputlabel">
                  <b>
                    जनरल मुखत्यारपत्र लिहून देणार हयात असलेबाबत घोषणापत्र
                    मुखत्यारपत्र दस्तात सामील आहे काय ?
                  </b>
                </InputLabel>
                <RadioGroup
                  row
                  value={isDeclerationInvolvedInPOA}
                  onChange={handleisDeclerationInvolvedInPOA}
                  defaultValue="yes"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="होय"
                    disabled={isDastEdit}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={isDastEdit}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>जनरल मुखत्यारपत्र कायम आहे का?</b>
                </InputLabel>
                <RadioGroup
                  row
                  value={isPOAPermanant}
                  onChange={handleisPOAPermanant}
                  defaultValue="yes"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="होय"
                    disabled={isDastEdit}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={isDastEdit}
                  />
                </RadioGroup>
              </Grid>
              <Grid item md={9}>
                <InputLabel className="inputlabel">
                  <b>हस्तांतरणाचे हक्क आहेत का?</b>
                </InputLabel>
                <RadioGroup
                  row
                  value={isTransferRights}
                  onChange={handleisTransferRights}
                  defaultValue="yes"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="होय"
                    disabled={isDastEdit}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="नाही"
                    disabled={isDastEdit}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid> */}

          <Grid container justifyContent="end" px={2} mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<RotateRightRoundedIcon />}
                sx={{ mr: 2 }}
                onClick={(e) => {
                  handleReset();
                  setIsHardEdit(false);
                }}
              >
                रीसेट करा
              </Button>
              <Button
                variant="contained"
                endIcon={<SaveRoundedIcon />}
                // onClick={isHardEdit ? handleEditSave : handleSave}
                onClick={handleSave}
              >
                {/* {isHardEdit ? "बदल जतन करा" : "जतन करा"} */}
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={2}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>मुखत्यारपत्र घेणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>अर्ज क्रमांक</TableCell>
                <TableCell>मुखत्यारपत्र देणार</TableCell>
                <TableCell>मुखत्यारपत्र घेणाऱ्याचे नाव</TableCell>
                <TableCell>मुखत्यारपत्र घेणाऱ्याचा पत्ता</TableCell>
                <TableCell>दुय्यम निबंधक कार्यालय / जिल्हा</TableCell>
                <TableCell>र.द.क्र. / वर्ष</TableCell>
                <TableCell>दस्त दिनांक</TableCell>
                <TableCell>दस्त पडताळणी</TableCell>
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
                      <TableCell>{val?.giver_name_in_marathi}</TableCell>
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
                        {val?.registrar?.sro} / {val?.district?.jdr}
                      </TableCell>
                      <TableCell>
                        {val?.dastNo}/{val?.dastNoYear}
                      </TableCell>
                      <TableCell>{val?.dastNoDate}</TableCell>
                      <TableCell>
                        {val?.isDastVarified ? "होय" : "नाही"}
                      </TableCell>
                      <TableCell>
                        {/* <IconButton
                          color="success"
                          onClick={() => handleEdit(val?.power_of_attorney_id)}
                        >
                          <EditNoteOutlinedIcon />
                        </IconButton> */}
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(val?.power_of_attorney_id)
                          }
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

export default MukhytarGhenar;
