import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
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
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useNavigate } from "react-router-dom";
import { milkatArr } from "../../../DemoArray/DemoArray";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../ui/Toast";
import AxiosInstance from "../../../Instance/AxiosInstance";
import URLS from "../../../URLs/url";

//-------------
import CircularProgress from "@mui/material/CircularProgress";
import { nabhuValidationSchema } from "../../../Validations/yupValidations";
import { nabhuNotesArr } from "../../../NotesArray/NotesArray";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";

const NaBhu = () => {
  const isDast = sessionStorage.getItem("isDast");
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [villageArr, setVillageArr] = useState([]);
  const [village, setVillage] = useState({});
  const [nabhuNo, setNabhuNo] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [nabhuArr, setNabhuArr] = useState([]);
  const [naBhu, setNaBhu] = useState("");
  const [namud, setNamud] = useState("CTS-Sampurna milkat");
  const [milkat, setMilkat] = useState("land");
  const [inDast, setInDast] = useState("nabhu");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [cityServeyAreaInSqm, setCityServeyAreaInSqm] = useState("");
  const [buildupArea, setBuildupArea] = useState("");
  const [flatDetailsNic, setFlatDetailsNic] = useState({});
  const [flatDetails, setFlatDetails] = useState({
    buildingName: "",
    floorType: {},
    floorNo: "",
    unitType: {},
    unitNo: "0.00",
    buildupArea: "0.00",
    carpetArea: "0.00",
    taraceArea: "0.00",
    parkingNo: "0.00",
    parkingArea: "0.00",
    hissa: "0.00",
  });
  const [unitTypeArr, setUnitTypeArr] = useState([]);
  const [floorTypeArr, setFloorTypeArr] = useState([]);
  const [flatArr, setFlatArr] = useState([]);
  const [applicationData, setApplicationData] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [disableNextBtn, setDisableShowNextBtn] = useState(true);

  //------------------------------Edit State---------------------------------
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [editObj, setEditObj] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        village: yup.string().required("कृपया गाव निवडा"),
        nabhuNo: yup
          .string()
          .required("नगर भुमापन क्रमांक (सिटी सर्वे नंबर) टाकणे गरजेचे आहे"),
        surveyNo: yup
          .string()
          .required("सर्वे नंबर / गट नंबर टाकणे गरजेचे आहे"),
        nabhuDropdown: nabhuValidationSchema,
        flat: yup.string().required("अर्जामध्ये नमूद मिळकत निवडा"),
        buildingName: yup.string().required("कृपया बिल्डिंग चे नाव टाका"),
        floorType: yup.string().required("कृपया मजला प्रकार टाका"),
        floorNo: yup.string().required("कृपया मजला क्रमांक टाका"),
        unitType: yup.string().required("कृपया युनिट प्रकार निवडा"),
        unitNo: yup.string().required("कृपया युनिट नं. टाका"),
        carpetArea: yup.string().required("कृपया कारपेट क्षेत्र टाका"),
      })
    ),
    defaultValues: {
      village: "",
      nabhuNo: "",
      surveyNo: "",
      nabhuDropdown: "",
      flat: "",
      buildingName: "",
      floorType: "",
      floorNo: "",
      unitType: "",
      unitNo: "0.00",
      carpetArea: "0.00",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleVillage = (e) => {
    const cCode = e?.target?.value;
    const obj = villageArr.find((o) => o?.village_code == cCode);
    setVillage(obj);
  };
  const handleNabhuNo = (e) => {
    setNabhuNo(e);
    setNabhuArr([]);
    setNaBhu("");
    setLrPropertyUID("");
    setCityServeyAreaInSqm("");
    setFlatArr([]);
    setFlatDetailsNic({});

    setValue("nabhuDropdown", "");
  };
  const handleSearchNabhu = async () => {
    setNaBhu("");
    const result = await trigger(["village", "nabhuNo"]);
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/EPCISAPIS/getCTSNoDetails`,
        "POST",
        {
          village_code: village?.village_code,
          cts_no: nabhuNo,
        },
        (res) => {
          if (res?.Code == "1") {
            setNabhuArr(JSON.parse(res?.ResponseData));
          } else {
            errorToast(res?.Message);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      warningToast("Please check all fields");
    }
  };
  const handleSurveyNo = (e) => {
    setSurveyNo(e?.target?.value);
    setNabhuArr([]);
    setNaBhu("");
    setLrPropertyUID("");
    setCityServeyAreaInSqm("");
  };
  const handleNaBhu = (e) => {
    const code = e?.target?.value;
    const obj = nabhuArr.find((o) => o?.cts_number == code);
    setNaBhu(e?.target?.value);
    setLrPropertyUID(obj?.cts_puid);
    setCityServeyAreaInSqm(obj?.cts_numbe_area);
    if (milkat == "flat") {
      sendRequest(
        `${URLS?.BaseURL}/EPCISAPIS/getFlatList`,
        "POST",
        {
          village_code: village?.village_code,
          cts_no: code,
        },
        (res) => {
          setFlatArr(JSON.parse(res?.ResponseData));
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };
  const handleNamud = (e) => {
    const code = e?.target?.value;
    const obj = flatArr.find((o) => o?.sub_property_number == code);
    if (code == "other") {
      setNamud("other");
    } else {
      setNamud(
        `${obj?.building_name} / ${obj?.building_number} / floor no- ${obj?.floor_number} / flat no- ${obj?.flat_number}`
      );
    }

    if (code != "other" && code != "") {
      setFlatDetailsNic(obj);
      setBuildupArea("30");
    } else {
      setBuildupArea("");
    }
  };
  const handleMilkat = (e) => {
    setMilkat(e?.target?.value);
    setNabhuArr([]);
    setNabhuNo("");
    setNaBhu("");
    setLrPropertyUID("");
    setCityServeyAreaInSqm("");

    setValue("nabhuNo", "");
    setValue("nabhuDropdown", "");
    // reset({ nabhuNo: "", nabhuDropdown: "", surveyNo: "" });
    if (e?.target?.value == "land") {
      setNamud("CTS-Sampurna milkat");
      setFlatArr([]);
      setFlatDetailsNic({});
    } else {
      setNamud("");
    }
  };
  const handleInDast = (e) => {
    setInDast(e?.target?.value);
    setValue("nabhuNo", "");
    setValue("surveyNo", "");
    setNabhuNo("");
    setSurveyNo("");
  };
  const handleFlatDetails = (e) => {
    const { name, value } = e?.target;
    setFlatDetails({ ...flatDetails, [name]: value });
  };
  const handleUnitType = (e) => {
    const code = e?.target?.value;
    const obj = unitTypeArr.find((o) => o?.unit_code_156 == code);
    setFlatDetails({ ...flatDetails, unitType: obj });
  };
  const handleFloorType = (e) => {
    const code = e?.target?.value;
    const obj = floorTypeArr.find((o) => o?.floor_type == code);
    setFlatDetails({ ...flatDetails, floorType: obj });
  };

  // // handleSave for all 6 conditions nabhu and subapropno
  // const handleSave = async () => {
  //   if (milkat == "land") {
  //     if (inDast == "nabhu") {
  //       const result = await trigger(["village", "nabhuNo", "nabhuDropdown"]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: {},
  //             nic_flat_details: "",
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: "",
  //             subPropNo: "1",
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     } else {
  //       const result = await trigger(["village", "surveyNo", "nabhuDropdown"]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: {},
  //             nic_flat_details: "",
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: "",
  //             subPropNo: "1",
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     }
  //   } else if (milkat == "flat" && namud == "other") {
  //     if (inDast == "nabhu") {
  //       const result = await trigger([
  //         "village",
  //         "nabhuNo",
  //         "nabhuDropdown",
  //         "buildingName",
  //         "floorType",
  //         "floorNo",
  //         "unitType",
  //         "unitNo",
  //         "buildupArea",
  //         "carpetArea",
  //       ]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: flatDetails,
  //             nic_flat_details: "",
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: flatDetails?.carpetArea,
  //             subPropNo: "999999",
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     } else {
  //       const result = await trigger([
  //         "village",
  //         "surveyNo",
  //         "nabhuDropdown",
  //         "buildingName",
  //         "floorType",
  //         "floorNo",
  //         "unitType",
  //         "unitNo",
  //         "buildupArea",
  //         "carpetArea",
  //       ]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: flatDetails,
  //             nic_flat_details: "",
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: flatDetails?.carpetArea,
  //             subPropNo: "999999",
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     }
  //   } else {
  //     if (inDast == "nabhu") {
  //       const result = await trigger([
  //         "village",
  //         "nabhuNo",
  //         "nabhuDropdown",
  //         "flat",
  //       ]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: {},
  //             nic_flat_details: JSON.stringify(flatDetailsNic),
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
  //             subPropNo: flatDetailsNic?.sub_propperty_no,
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     } else {
  //       const result = await trigger([
  //         "village",
  //         "surveyNo",
  //         "nabhuDropdown",
  //         "flat",
  //       ]);
  //       if (result) {
  //         sendRequest(
  //           `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
  //           "POST",
  //           {
  //             applicationid: applicationId,
  //             inDast: inDast,
  //             village: village,
  //             milkat: milkat,
  //             nabhuNo: nabhuNo,
  //             surveyNo: surveyNo,
  //             naBhu: naBhu,
  //             namud: namud,
  //             flatDetails: {},
  //             nic_flat_details: JSON.stringify(flatDetailsNic),
  //             lrPropertyUID: lrPropertyUID,
  //             cityServeyAreaInSqm: cityServeyAreaInSqm,
  //             flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
  //             subPropNo: flatDetailsNic?.sub_propperty_no,
  //           },
  //           (res) => {
  //             if (res?.Code == "1") {
  //               successToast(res?.Message);
  //               getNabhuTable();
  //               resetVal();
  //             } else {
  //               errorToast(res?.Message);
  //             }
  //           },
  //           (err) => {
  //             errorToast(err?.Message);
  //           }
  //         );
  //       } else {
  //         errorToast("Please Fill All Fields");
  //       }
  //     }
  //   }
  // };

  // handleSave for all 3 conditions only nabhu
  const handleSave = async () => {
    if (milkat == "land") {
      const newData = {
        applicationid: applicationId,
        inDast: inDast,
        village: village,
        milkat: milkat,
        nabhuNo: nabhuNo,
        surveyNo: surveyNo,
        naBhu: naBhu,
        namud: namud,
        flatDetails: {},
        nic_flat_details: "",
        lrPropertyUID: lrPropertyUID,
        cityServeyAreaInSqm: cityServeyAreaInSqm,
        flatBuiltUpArea: "",
        subPropNo: "1",
      };
      const isDuplicate = responseData.some(
        (item) =>
          item.subPropNo === newData.subPropNo && item.naBhu === newData.naBhu
      );

      if (isDuplicate) {
        errorToast("Duplicate entry found. Cannot proceed.");
      } else {
        const result = await trigger(["village", "nabhuNo", "nabhuDropdown"]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
            "POST",
            {
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: {},
              nic_flat_details: "",
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: "",
              subPropNo: "1",
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      }
    } else if (milkat == "flat" && namud == "other") {
      // const newData = {
      //   applicationid: applicationId,
      //   inDast: inDast,
      //   village: village,
      //   milkat: milkat,
      //   nabhuNo: nabhuNo,
      //   surveyNo: surveyNo,
      //   naBhu: naBhu,
      //   namud: namud,
      //   flatDetails: flatDetails,
      //   nic_flat_details: "",
      //   lrPropertyUID: lrPropertyUID,
      //   cityServeyAreaInSqm: cityServeyAreaInSqm,
      //   flatBuiltUpArea: flatDetails?.carpetArea,
      //   subPropNo: "999999",
      // };
      // const isDuplicate = responseData.some(
      //   (item) =>
      //     item.subPropNo === newData.subPropNo && item.naBhu === newData.naBhu
      // );

      // if (isDuplicate) {
      //   errorToast("Duplicate entry found. Cannot proceed.");
      // } else {
      const result = await trigger([
        "village",
        "nabhuNo",
        "nabhuDropdown",
        "buildingName",
        "floorType",
        "floorNo",
        "unitType",
        "unitNo",
        "buildupArea",
        "carpetArea",
      ]);
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
          "POST",
          {
            applicationid: applicationId,
            inDast: inDast,
            village: village,
            milkat: milkat,
            nabhuNo: nabhuNo,
            surveyNo: surveyNo,
            naBhu: naBhu,
            namud: namud,
            flatDetails: flatDetails,
            nic_flat_details: "",
            lrPropertyUID: lrPropertyUID,
            cityServeyAreaInSqm: cityServeyAreaInSqm,
            flatBuiltUpArea: flatDetails?.carpetArea,
            subPropNo: "999999",
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getNabhuTable();
              resetVal();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      } else {
        errorToast("Please Fill All Fields");
      }
      // }
    } else {
      const newData = {
        applicationid: applicationId,
        inDast: inDast,
        village: village,
        milkat: milkat,
        nabhuNo: nabhuNo,
        surveyNo: surveyNo,
        naBhu: naBhu,
        namud: namud,
        flatDetails: {},
        nic_flat_details: JSON.stringify(flatDetailsNic),
        lrPropertyUID: lrPropertyUID,
        cityServeyAreaInSqm: cityServeyAreaInSqm,
        flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
        subPropNo: flatDetailsNic?.sub_propperty_no,
      };
      const isDuplicate = responseData.some(
        (item) => item.subPropNo === newData.subPropNo
      );
      if (isDuplicate) {
        errorToast("Duplicate entry found. Cannot proceed.");
      } else {
        const result = await trigger([
          "village",
          "nabhuNo",
          "nabhuDropdown",
          "flat",
        ]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/CreateMutationCTS`,
            "POST",
            {
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: {},
              nic_flat_details: JSON.stringify(flatDetailsNic),
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
              subPropNo: flatDetailsNic?.sub_propperty_no,
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      }
    }
  };

  const handleEditSave = async () => {
    if (milkat == "land") {
      if (inDast == "nabhu") {
        const result = await trigger(["village", "nabhuNo", "nabhuDropdown"]);

        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
            "POST",
            {
              editId: editId,
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: {},
              nic_flat_details: "",
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: "",
              subPropNo: "1",
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      } else {
        const result = await trigger(["village", "surveyNo", "nabhuDropdown"]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
            "POST",
            {
              editId: editId,
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: {},
              nic_flat_details: "",
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: "",
              subPropNo: "1",
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      }
    } else if (milkat == "flat" && namud == "other") {
      if (inDast == "nabhu") {
        const result = await trigger([
          "village",
          "nabhuNo",
          "nabhuDropdown",
          "buildingName",
          "floorType",
          "floorNo",
          "unitType",
          "unitNo",
          "buildupArea",
        ]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
            "POST",
            {
              editId: editId,
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: flatDetails,
              nic_flat_details: "",
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: flatDetails?.carpetArea,
              subPropNo: "999999",
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      } else {
        const result = await trigger([
          "village",
          "surveyNo",
          "nabhuDropdown",
          "buildingName",
          "floorType",
          "floorNo",
          "unitType",
          "unitNo",
          "buildupArea",
        ]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
            "POST",
            {
              editId: editId,
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: flatDetails,
              nic_flat_details: "",
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: flatDetails?.carpetArea,
              subPropNo: "999999",
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      }
    } else {
      if (inDast == "nabhu") {
        const result = await trigger([
          "village",
          "nabhuNo",
          "nabhuDropdown",
          "flat",
        ]);

        if (result) {
          // sendRequest(
          //   `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
          //   "POST",
          //   {
          //     editId: editId,
          //     applicationid: applicationId,
          //     inDast: inDast,
          //     village: village,
          //     milkat: milkat,
          //     nabhuNo: nabhuNo,
          //     surveyNo: surveyNo,
          //     naBhu: naBhu,
          //     namud: namud,
          //     flatDetails: {},
          //     nic_flat_details: JSON.stringify(flatDetailsNic),
          //     lrPropertyUID: lrPropertyUID,
          //     cityServeyAreaInSqm: cityServeyAreaInSqm,
          //     flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
          //     subPropNo: flatDetailsNic?.sub_propperty_no,
          //   },
          //   (res) => {
          //     if (res?.Code == "1") {
          //       successToast(res?.Message);
          //       getNabhuTable();
          //       resetVal();
          //     }  else {
          //       errorToast(res?.Message);
          //     }
          //   },
          //   (err) => {
          //     errorToast(err?.Message);
          //   }
          // );
        } else {
          errorToast("Please Fill All Fields");
        }
      } else {
        const result = await trigger([
          "village",
          "surveyNo",
          "nabhuDropdown",
          "flat",
        ]);
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/EditMutationCTS`,
            "POST",
            {
              editId: editId,
              applicationid: applicationId,
              inDast: inDast,
              village: village,
              milkat: milkat,
              nabhuNo: nabhuNo,
              surveyNo: surveyNo,
              naBhu: naBhu,
              namud: namud,
              flatDetails: {},
              nic_flat_details: JSON.stringify(flatDetailsNic),
              lrPropertyUID: lrPropertyUID,
              cityServeyAreaInSqm: cityServeyAreaInSqm,
              flatBuiltUpArea: flatDetailsNic?.build_up_area_of_flat,
              subPropNo: flatDetailsNic?.sub_propperty_no,
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getNabhuTable();
                resetVal();
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.Message);
            }
          );
        } else {
          errorToast("Please Fill All Fields");
        }
      }
    }
  };
  const resetVal = () => {
    setIsEdit(false);
    setIsHardEdit(false);
    setVillage({});
    setMilkat("land");
    setNabhuNo("");
    setNaBhu("");

    setSurveyNo("");
    setNabhuArr([]);
    setLrPropertyUID("");
    setCityServeyAreaInSqm("");
    setFlatArr([]);
    setFlatDetailsNic({});

    reset();
  };
  const handleEdit = async (id) => {
    setIsHardEdit(true);
    const obj = responseData.find((o) => o?.mutation_cts_no_id == id);
    setEditId(obj?.mutation_cts_no_id);
    setEditObj(obj);
    setIsEdit(true);
    setVillage({
      amount: obj?.amount,
      village_code: obj?.villageCode,
      village_english_name: obj?.village_english_name,
      village_lgd_code: obj?.villageLGDCode,
      village_name: obj?.villageName,
      zone_code: obj?.zone_code,
    });
    setNabhuNo(obj?.nabhuNo);
    setNaBhu(obj?.naBhu);
    setCityServeyAreaInSqm(obj?.cityServeyAreaInSqm);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat == "LAND" ? "land" : "flat");
    setNamud(obj?.namud);

    setValue("village", obj?.villageName);
    setValue("nabhuNo", obj?.nabhuNo);
    setValue("nabhuDropdown", obj?.naBhu);
    setValue("flat", obj?.namud);
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteMutationCTS`,
      "POST",
      {
        mutation_cts_no_id: id,
        applicationid: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getNabhuTable();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleEditDetails = () => {
    setIsEdit(false);
    setNaBhu("");
    setCityServeyAreaInSqm("");
    setLrPropertyUID("");
    reset();
  };
  const setInitialVillages = (data) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getVillageByOffice`,
      "POST",
      data,
      (res) => {
        setVillageArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleNext = () => {
    if (isDast === "yes") {
      navigate("/home/dast");
    } else {
      navigate("/home/ferfar");
    }
  };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  const getNabhuTable = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetMutationCTS`,
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
          setInitialVillages(res?.ResponseData?.taluka_code);
        } else {
          console.error(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const setUnitType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getUnitTypeList`,
      "POST",
      null,
      (res) => {
        setUnitTypeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const setFloorType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getFloorTypeList`,
      "POST",
      null,
      (res) => {
        setFloorTypeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    getNabhuTable();
    setAppDataApi();
  }, []);
  useEffect(() => {
    if (namud == "other") {
      setUnitType();
      setFloorType();
    }
  }, [namud]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Toast />
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
            heading="अर्ज भरण्यासाठी आवश्यक सूचना"
            arr={nabhuNotesArr}
          />
        </Grid>

        {/* <Grid item md={12}>
          <Paper elevation={5} sx={{ px: 2, py: 2 }} className="paperm">
            <Grid container>
              <Grid item>
                <Grid container alignItems="center" spacing={4}>
                  <Grid
                    item
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <Typography variant="h5" fontSize="16px" fontWeight={600}>
                      दस्तात काय नमूद आहे ?
                    </Typography>
                    <span style={{ color: "red", fontWeight: 700 }}>
                      &nbsp; *
                    </span>
                  </Grid>
                  <Grid item>
                    <RadioGroup row onChange={handleInDast} value={inDast}>
                      <FormControlLabel
                        value="nabhu"
                        control={<Radio />}
                        label="नगर भुमापन क्रमांक (सिटी सर्वे नंबर)"
                      />
                      <FormControlLabel
                        value="surveynoorgatno"
                        control={<Radio />}
                        label="सर्वे नंबर / गट नंबर"
                        disabled
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid> */}

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container>
              <Grid item md={12}>
                <h4 className="heading">गाव व न.भू.क्र. माहिती</h4>
              </Grid>
              {isEdit && (
                <Grid item md={12}>
                  <Button
                    onClick={handleEditDetails}
                    variant="outlined"
                    startIcon={<EditNoteOutlinedIcon />}
                  >
                    बदल करा
                  </Button>
                </Grid>
              )}
              <Grid item md={12}>
                <Grid container spacing={3}>
                  <Grid item md={4}>
                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>गाव/पेठ</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.villageName}
                        />
                      </>
                    ) : (
                      <Controller
                        name="village"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>गाव/पेठ </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              size="small"
                              fullWidth
                              className="textfield"
                              value={village?.village_name}
                              error={errors.village}
                              {...field}
                              onBlur={() => handleBlur("village")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleVillage(e);
                              }}
                            >
                              {Array.isArray(villageArr) &&
                                villageArr.map((val, i) => {
                                  return (
                                    <MenuItem
                                      key={val.village_code + i}
                                      value={val?.village_code}
                                    >
                                      {val?.village_name}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.village && errors.village.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>फेरफारासाठी मिळकत </b>
                      <span>*</span>
                    </InputLabel>
                    <RadioGroup row onChange={handleMilkat} value={milkat}>
                      <FormControlLabel
                        value="land"
                        control={<Radio disabled={isEdit} />}
                        label="भूखंड / जमीन (प्लॉट)"
                      />
                      <FormControlLabel
                        value="flat"
                        control={<Radio disabled={isEdit} />}
                        label="अपार्टमेंट"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    {inDast == "nabhu" ? (
                      <>
                        {isEdit ? (
                          <>
                            <InputLabel className="inputlabel">
                              <b>अर्जामधील नमूद न.भू.क्र. (अंकी भाग)</b>
                            </InputLabel>
                            <TextField
                              fullWidth
                              className="textfieldDisabled"
                              size="small"
                              disabled
                              value={editObj?.nabhuNo}
                            />
                          </>
                        ) : (
                          <>
                            <InputLabel className="inputlabel">
                              <b>अर्जामधील नमूद न.भू.क्र. (अंकी भाग) </b>
                              <span>*</span>
                            </InputLabel>
                            <Controller
                              name="nabhuNo"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    className="textfield"
                                    type="text"
                                    value={nabhuNo}
                                    error={errors.nabhuNo}
                                    {...field}
                                    onBlur={() => handleBlur("nabhuNo")}
                                    onChange={(e) => {
                                      let inputValue = e.target.value;
                                      inputValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      field.onChange(inputValue);
                                      handleNabhuNo(inputValue);
                                    }}
                                    // onChange={(e) => {
                                    //   field.onChange(e);
                                    //   handleNabhuNo(e);
                                    // }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<SearchRoundedIcon />}
                                            onClick={handleSearchNabhu}
                                          >
                                            शोधा
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <FormHelperText sx={{ color: "red" }}>
                                    {errors.nabhuNo && errors.nabhuNo.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {isEdit ? (
                          <>
                            <InputLabel className="inputlabel">
                              <b>
                                अर्जामधील नमूद सर्वे नंबर / गट नंबर (अंकी भाग)
                              </b>
                            </InputLabel>
                            <TextField
                              fullWidth
                              className="textfieldDisabled"
                              size="small"
                              disabled
                              value={editObj?.surveyNo}
                            />
                          </>
                        ) : (
                          <>
                            <InputLabel className="inputlabel">
                              <b>
                                अर्जामधील नमूद सर्वे नंबर / गट नंबर (अंकी भाग)
                              </b>
                              <span>*</span>
                            </InputLabel>
                            <Controller
                              name="surveyNo"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    className="textfield"
                                    value={surveyNo}
                                    error={errors.surveyNo}
                                    {...field}
                                    onBlur={() => handleBlur("surveyNo")}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleSurveyNo(e);
                                    }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<SearchRoundedIcon />}
                                          >
                                            शोधा
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <FormHelperText sx={{ color: "red" }}>
                                    {errors.surveyNo && errors.surveyNo.message}
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item md={4}>
                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>न.भू.क्र. क्रमांक</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.naBhu}
                        />
                      </>
                    ) : (
                      <Controller
                        name="nabhuDropdown"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>न.भू.क्र. क्रमांक निवडा </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              size="small"
                              fullWidth
                              className="textfield"
                              value={naBhu}
                              error={errors.nabhuDropdown}
                              {...field}
                              onBlur={() => handleBlur("nabhuDropdown")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleNaBhu(e);
                              }}
                            >
                              {Array.isArray(nabhuArr) &&
                                nabhuArr.map((val, i) => {
                                  return (
                                    <MenuItem key={i} value={val?.cts_number}>
                                      {val?.cts_number}
                                    </MenuItem>
                                  );
                                })}
                            </Select>

                            <FormHelperText sx={{ color: "red" }}>
                              {errors.nabhuDropdown &&
                                errors.nabhuDropdown.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item md={4}>
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
                </Grid>
              </Grid>
              <Grid item md={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>अर्जामध्ये नमूद मिळकत </b>
                        </InputLabel>
                        <TextField
                          value={editObj?.namud}
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                        />
                      </>
                    ) : (
                      <>
                        {milkat == "land" ? (
                          Array.isArray(milkatArr?.jamin) &&
                          milkatArr?.jamin.map((val, i) => {
                            return (
                              <>
                                {" "}
                                <InputLabel className="inputlabel">
                                  <b>अर्जामध्ये नमूद मिळकत </b>
                                  <span>*</span>
                                </InputLabel>
                                <TextField
                                  key={i}
                                  value={val?.label}
                                  fullWidth
                                  className="textfieldDisabled"
                                  size="small"
                                  disabled
                                />
                              </>
                            );
                          })
                        ) : (
                          <Controller
                            name="flat"
                            control={control}
                            render={({ field }) => (
                              <>
                                <InputLabel className="inputlabel">
                                  <b>अर्जामध्ये नमूद मिळकत </b>
                                  <span>*</span>
                                </InputLabel>
                                <Select
                                  value={namud}
                                  className="textfield"
                                  fullWidth
                                  size="small"
                                  error={errors.flat}
                                  {...field}
                                  onBlur={() => handleBlur("flat")}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleNamud(e);
                                  }}
                                >
                                  {Array.isArray(flatArr) &&
                                    flatArr.map((val, i) => {
                                      return (
                                        <MenuItem
                                          key={val?.sub_property_number + i}
                                          value={val?.sub_property_number}
                                        >
                                          Building Name - {val?.building_name}/
                                          {val?.building_number}, Floor No -{" "}
                                          {val?.floor_number}, Flat No -
                                          {val?.flat_number}
                                        </MenuItem>
                                      );
                                    })}
                                  <MenuItem value="other">Other</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: "red" }}>
                                  {errors.flat && errors.flat.message}
                                </FormHelperText>
                              </>
                            )}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>न.भू.क्र. क्षेत्र (चौ.मी.)</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      value={cityServeyAreaInSqm}
                      size="small"
                      className="textfieldDisabled"
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {milkat == "flat" && namud == "other" && (
              <>
                {isEdit ? (
                  <Grid container mt={1} spacing={2}>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>बिल्डिंगचे नाव</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.buildingName}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>मजला प्रकार</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.floorDesc}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>मजला क्र.</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.floorNo}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>युनिट प्रकार</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.unit_name_156}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>युनिट क्र.</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.unitNo}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>बांधकाम क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.buildupArea}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>कारपेट क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.carpetArea}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>टेरेस क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.taraceArea}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>पार्किंग क्र.</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.parkingNo}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>पार्किंग क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.parkingArea}
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>हिस्सा (%)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfieldDisabled"
                        value={editObj?.hissa}
                        size="small"
                        disabled
                      />
                    </Grid>
                  </Grid>
                ) : (
                  //old one
                  // <Grid container mt={1} spacing={2}>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="buildingName"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>बिल्डिंगचे नाव </b>
                  //             <span>*</span>
                  //           </InputLabel>
                  //           <TextField
                  //             fullWidth
                  //             value={flatDetails?.buildingName}
                  //             className="textfield"
                  //             name="buildingName"
                  //             size="small"
                  //             error={errors.buildingName}
                  //             {...field}
                  //             onBlur={() => handleBlur("buildingName")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleFlatDetails(e);
                  //             }}
                  //           />
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.buildingName &&
                  //               errors.buildingName.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="floorType"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>मजला प्रकार </b> <span>*</span>
                  //           </InputLabel>
                  //           <Select
                  //             fullWidth
                  //             size="small"
                  //             name="floorType"
                  //             value={flatDetails?.floorType}
                  //             className="textfield"
                  //             error={errors.floorType}
                  //             {...field}
                  //             onBlur={() => handleBlur("floorType")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleFloorType(e);
                  //             }}
                  //           >
                  //             {Array.isArray(floorTypeArr) &&
                  //               floorTypeArr.map((val, i) => {
                  //                 return (
                  //                   <MenuItem value={val?.floor_type} key={i}>
                  //                     {val?.floor_desc}
                  //                   </MenuItem>
                  //                 );
                  //               })}
                  //           </Select>
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.floorType && errors.floorType.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="floorNo"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>मजला क्र. </b> <span>*</span>
                  //           </InputLabel>
                  //           <TextField
                  //             fullWidth
                  //             value={flatDetails?.floorNo}
                  //             className="textfield"
                  //             name="floorNo"
                  //             type="number"
                  //             size="small"
                  //             error={errors.floorNo}
                  //             {...field}
                  //             onBlur={() => handleBlur("floorNo")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleFlatDetails(e);
                  //             }}
                  //           />
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.floorNo && errors.floorNo.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="unitType"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>युनिट प्रकार </b>
                  //             <span>*</span>
                  //           </InputLabel>
                  //           <Select
                  //             fullWidth
                  //             size="small"
                  //             name="unitType"
                  //             value={flatDetails?.unitType}
                  //             className="textfield"
                  //             error={errors.unitType}
                  //             {...field}
                  //             onBlur={() => handleBlur("unitType")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleUnitType(e);
                  //             }}
                  //           >
                  //             {Array.isArray(unitTypeArr) &&
                  //               unitTypeArr.map((val, i) => {
                  //                 return (
                  //                   <MenuItem
                  //                     value={val?.unit_code_156}
                  //                     key={i}
                  //                   >
                  //                     {val?.unit_name_156}
                  //                   </MenuItem>
                  //                 );
                  //               })}
                  //           </Select>
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.unitType && errors.unitType.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="unitNo"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>युनिट क्र. </b> <span>*</span>
                  //           </InputLabel>
                  //           <TextField
                  //             fullWidth
                  //             value={flatDetails?.unitNo}
                  //             className="textfield"
                  //             type="number"
                  //             inputProps={{
                  //               maxLength: 10,
                  //               max: 9999999999,
                  //               onInput: (e) => {
                  //                 if (e.target.value.length > 10) {
                  //                   e.target.value = e.target.value.slice(
                  //                     0,
                  //                     10
                  //                   );
                  //                 }
                  //               },
                  //             }}
                  //             name="unitNo"
                  //             size="small"
                  //             error={errors.unitNo}
                  //             {...field}
                  //             onBlur={() => handleBlur("unitNo")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleFlatDetails(e);
                  //             }}
                  //           />
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.unitNo && errors.unitNo.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <InputLabel className="inputlabel">
                  //       <b>बांधकाम क्षेत्र (चौ. मी.) </b>
                  //     </InputLabel>
                  //     <TextField
                  //       fullWidth
                  //       value={flatDetails?.buildupArea}
                  //       className="textfield"
                  //       type="number"
                  //       name="buildupArea"
                  //       size="small"
                  //       onChange={handleFlatDetails}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <Controller
                  //       name="carpetArea"
                  //       control={control}
                  //       render={({ field }) => (
                  //         <>
                  //           <InputLabel className="inputlabel">
                  //             <b>कारपेट क्षेत्र (चौ. मी.)</b> <span>*</span>
                  //           </InputLabel>
                  //           <TextField
                  //             fullWidth
                  //             value={flatDetails?.carpetArea}
                  //             className="textfield"
                  //             type="number"
                  //             name="carpetArea"
                  //             size="small"
                  //             error={errors.carpetArea}
                  //             {...field}
                  //             onBlur={() => handleBlur("carpetArea")}
                  //             onChange={(e) => {
                  //               field.onChange(e);
                  //               handleFlatDetails(e);
                  //             }}
                  //           />
                  //           <FormHelperText sx={{ color: "red" }}>
                  //             {errors.carpetArea && errors.carpetArea.message}
                  //           </FormHelperText>
                  //         </>
                  //       )}
                  //     />
                  //   </Grid>
                  //   <Grid item md={3}>
                  //     <InputLabel className="inputlabel">
                  //       <b>टेरेस क्षेत्र (चौ. मी.)</b>
                  //     </InputLabel>
                  //     <TextField
                  //       fullWidth
                  //       value={flatDetails?.taraceArea}
                  //       className="textfield"
                  //       type="number"
                  //       name="taraceArea"
                  //       size="small"
                  //       onChange={handleFlatDetails}
                  //     />
                  //   </Grid>
                  //   <Grid item md={4}>
                  //     <InputLabel className="inputlabel">
                  //       <b>पार्किंग क्र.</b>
                  //     </InputLabel>
                  //     <TextField
                  //       fullWidth
                  //       value={flatDetails?.parkingNo}
                  //       className="textfield"
                  //       name="parkingNo"
                  //       size="small"
                  //       onChange={handleFlatDetails}
                  //     />
                  //   </Grid>
                  //   <Grid item md={4}>
                  //     <InputLabel className="inputlabel">
                  //       <b>पार्किंग क्षेत्र (चौ. मी.)</b>
                  //     </InputLabel>
                  //     <TextField
                  //       fullWidth
                  //       value={flatDetails?.parkingArea}
                  //       className="textfield"
                  //       type="number"
                  //       name="parkingArea"
                  //       size="small"
                  //       onChange={handleFlatDetails}
                  //     />
                  //   </Grid>
                  //   <Grid item md={4}>
                  //     <InputLabel className="inputlabel">
                  //       <b>हिस्सा (%)</b>
                  //     </InputLabel>
                  //     <TextField
                  //       fullWidth
                  //       value={flatDetails?.hissa}
                  //       className="textfield"
                  //       type="number"
                  //       name="hissa"
                  //       size="small"
                  //       onChange={handleFlatDetails}
                  //     />
                  //   </Grid>
                  // </Grid>

                  <Grid container mt={1} spacing={2}>
                    <Grid item md={3}>
                      <Controller
                        name="buildingName"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>बिल्डिंगचे नाव </b>
                              <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              value={flatDetails?.buildingName}
                              className="textfield"
                              name="buildingName"
                              size="small"
                              error={errors.buildingName}
                              inputProps={{
                                maxLength: 300,
                                onInput: (e) => {
                                  e.target.value = e.target.value
                                    .replace(
                                      /[^\u0900-\u097Fa-zA-Z0-9\s.,]/g,
                                      ""
                                    )
                                    .replace(/\s+/g, " ")
                                    .trimStart();
                                },
                              }}
                              {...field}
                              onBlur={() => handleBlur("buildingName")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFlatDetails(e);
                              }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.buildingName &&
                                errors.buildingName.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <Controller
                        name="floorType"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>मजला प्रकार </b> <span>*</span>
                            </InputLabel>
                            <Select
                              fullWidth
                              size="small"
                              name="floorType"
                              value={flatDetails?.floorType}
                              className="textfield"
                              error={errors.floorType}
                              {...field}
                              onBlur={() => handleBlur("floorType")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFloorType(e);
                              }}
                            >
                              {Array.isArray(floorTypeArr) &&
                                floorTypeArr.map((val, i) => {
                                  return (
                                    <MenuItem value={val?.floor_type} key={i}>
                                      {val?.floor_desc}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.floorType && errors.floorType.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <Controller
                        name="floorNo"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>मजला क्र. </b> <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              value={flatDetails?.floorNo}
                              className="textfield"
                              name="floorNo"
                              type="number"
                              inputProps={{
                                maxLength: 4,
                                max: 9999,
                                min: 0,
                                // onInput: (e) => {
                                //   if (e.target.value.length > 4) {
                                //     e.target.value = e.target.value.slice(0, 4);
                                //   }
                                // },
                                onInput: (e) => {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 4);
                                },
                              }}
                              size="small"
                              error={errors.floorNo}
                              {...field}
                              onBlur={() => handleBlur("floorNo")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFlatDetails(e);
                              }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.floorNo && errors.floorNo.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <Controller
                        name="unitType"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>युनिट प्रकार </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              fullWidth
                              size="small"
                              name="unitType"
                              value={flatDetails?.unitType}
                              className="textfield"
                              error={errors.unitType}
                              {...field}
                              onBlur={() => handleBlur("unitType")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleUnitType(e);
                              }}
                            >
                              {Array.isArray(unitTypeArr) &&
                                unitTypeArr.map((val, i) => {
                                  return (
                                    <MenuItem
                                      value={val?.unit_code_156}
                                      key={i}
                                    >
                                      {val?.unit_name_156}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.unitType && errors.unitType.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>

                    <Grid item md={3}>
                      <Controller
                        name="unitNo"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>युनिट क्र. </b> <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              value={flatDetails?.unitNo}
                              className="textfield"
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
                              name="unitNo"
                              size="small"
                              error={errors.unitNo}
                              {...field}
                              onBlur={() => handleBlur("unitNo")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFlatDetails(e);
                              }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.unitNo && errors.unitNo.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>

                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>बांधकाम क्षेत्र (चौ. मी.) </b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={flatDetails?.buildupArea}
                        className="textfield"
                        type="text"
                        name="buildupArea"
                        size="small"
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
                        onChange={handleFlatDetails}
                      />
                    </Grid>

                    <Grid item md={3}>
                      <Controller
                        name="carpetArea"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>कारपेट क्षेत्र (चौ. मी.)</b> <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              value={flatDetails?.carpetArea}
                              className="textfield"
                              type="text"
                              name="carpetArea"
                              size="small"
                              error={errors.carpetArea}
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
                              {...field}
                              onBlur={() => handleBlur("carpetArea")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFlatDetails(e);
                              }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.carpetArea && errors.carpetArea.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    </Grid>

                    <Grid item md={3}>
                      <InputLabel className="inputlabel">
                        <b>टेरेस क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={flatDetails?.taraceArea}
                        className="textfield"
                        type="text"
                        name="taraceArea"
                        size="small"
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
                        onChange={handleFlatDetails}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>पार्किंग क्र.</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={flatDetails?.parkingNo}
                        className="textfield"
                        type="text"
                        name="parkingNo"
                        size="small"
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          onInput: (e) => {
                            const value = e.target.value;
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (!regex.test(value)) {
                              e.target.value =
                                value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                            }
                          },
                        }}
                        onChange={handleFlatDetails}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>पार्किंग क्षेत्र (चौ. मी.)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={flatDetails?.parkingArea}
                        className="textfield"
                        type="text"
                        name="parkingArea"
                        size="small"
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
                        onChange={handleFlatDetails}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel className="inputlabel">
                        <b>हिस्सा (%)</b>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={flatDetails?.hissa}
                        className="textfield"
                        type="text"
                        name="hissa"
                        size="small"
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
                        onChange={handleFlatDetails}
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            {isEdit &&
              editObj?.buildingName == "NA" &&
              namud != "CTS-Sampurna milkat" && (
                <Grid container mt={1} spacing={2}>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>क्षेत्र (चौ. मी.)</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfieldDisabled"
                      value={editObj?.flatBuiltUpArea}
                      size="small"
                      disabled
                    />
                  </Grid>
                </Grid>
              )}

            {flatDetailsNic?.build_up_area_of_flat && (
              <Grid container mt={1} spacing={2}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>क्षेत्र (चौ. मी.)</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={flatDetailsNic?.build_up_area_of_flat}
                    size="small"
                    disabled
                  />
                </Grid>
              </Grid>
            )}

            <Grid container justifyContent="end" px={2} mt={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  onClick={() => {
                    resetVal();
                    // setIsHardEdit(false);
                  }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  // onClick={isHardEdit ? handleEditSave : handleSave}
                  onClick={handleSave}
                  // disabled={disableBtn}
                >
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
                  <TableCell>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell>न.भू.क्र.</TableCell>
                  <TableCell>फेरफरसाठी मिळकत</TableCell>
                  <TableCell>LR-Property UID</TableCell>
                  <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                  <TableCell>Sub Property No</TableCell>
                  <TableCell>न.भू.क्र. क्षेत्र (चौ. मी.)</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Array.isArray(responseData) &&
                    // responseData.length > 0 ? (
                    responseData.map((val, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{val?.applicationid}</TableCell>
                          <TableCell>
                            {applicationData?.district_name_in_marathi} /{" "}
                            {applicationData?.taluka_name} / {val?.villageName}
                          </TableCell>
                          <TableCell>{val?.naBhu}</TableCell>
                          <TableCell>
                            {val?.milkat == "LAND"
                              ? "जमीन (NA प्लॉट)"
                              : "अपार्टमेंट"}
                          </TableCell>
                          <TableCell>{val?.lrPropertyUID}</TableCell>
                          <TableCell>{val?.namud}</TableCell>
                          <TableCell>
                            {/* {val?.milkat == "LAND" ? "-" : val?.subPropNo} */}
                            {val?.subPropNo}
                          </TableCell>
                          <TableCell>
                            {val?.milkat == "LAND"
                              ? val?.cityServeyAreaInSqm
                              : val?.flatBuiltUpArea}
                          </TableCell>
                          <TableCell>
                            {/* <IconButton
                              color="success" 
                              onClick={() =>
                                handleEdit(val?.mutation_cts_no_id)
                              }
                            >
                              <EditNoteOutlinedIcon />
                            </IconButton> */}
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDelete(val?.mutation_cts_no_id)
                              }
                            >
                              <DeleteForeverOutlinedIcon />
                              {/* रद्द करा */}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  // ) : (
                  //   <TableRow>
                  //     <TableCell colSpan={3} align="center">
                  //       No entries available
                  //     </TableCell>
                  //   </TableRow>
                  // )
                }

                {/* {responseData.length === 0 && <p>No entries available.</p>} */}
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
              onClick={() => navigate("/home/application-details")}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            {/* <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={handleNext}
            >
              पुढे जा
            </Button> */}
            {disableNextBtn ? (
              <Tooltip
                arrow
                disableFocusListener
                disableTouchListener
                placement="top"
                title="कृपया न.भू.क्र. माहिती भरा"
              >
                <span>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    disabled={disableNextBtn}
                  >
                    पुढे जा
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={handleNext}
                disabled={disableNextBtn}
              >
                पुढे जा
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NaBhu;
