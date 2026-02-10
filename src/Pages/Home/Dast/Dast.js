import {
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Button,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  IconButton,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../ui/Toast";
import URLS from "../../../URLs/url";
import { districtValidationSchema } from "../../../Validations/yupValidations";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { dastNotesArr } from "../../../NotesArray/NotesArray";
import styled from "styled-components";
import { filterOnlyLettersNumbersCommaDotAndSpaces } from "../../../Validations/utils";

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

const Dast = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [dastType, setDastType] = useState("");
  const [divisionArr, setDivisionArr] = useState([]);
  const [division, setDivision] = useState({});
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [SRO, setSRO] = useState([]);
  const [registrar, setRegistrar] = useState({});
  const [dastNo, setDastNo] = useState("");
  const [dastNoYear, setDastNoYear] = useState("");
  const [dastNoDate, setDastNoDate] = useState("");
  const [dastNabhu, setDastNabhu] = useState("");
  const [isDastVarified, setIsDastVarified] = useState(false);
  const [verifiedDastData, setVerifiedDastData] = useState([]);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [applicationData, setApplicationData] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [disableNextBtn, setDisableShowNextBtn] = useState(true);

  //------------------------------Edit State---------------------------------
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [editObj, setEditObj] = useState({});

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        dastType: yup.string().required("दस्त प्रकार निवडा"),
        division: yup.string().required("विभाग निवडा"),
        district: districtValidationSchema,
        registrar: yup.string().required("दुय्यम निबंधक कार्यालय निवडा"),
        dastNo: yup.string().required("नोंदणीकृत दस्त क्रमांक टाका"),
        // .matches(/^\d{1,10}$/, "फक्त १० आकडे टाका."),
        dastNoYear: yup
          .string()
          .trim()
          .required("नोंदणीकृत दस्त वर्ष टाका")
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
        // dastNabhu: yup
        //   .string()
        //   .required("दस्तामध्ये नमूद केलेले न.भू.क्र. टाका"),
        remarks: yup.string().required("चुकदुरुस्ती करण्याचे कारण लिहा"),
      })
    ),
    defaultValues: {
      dastType: "",
      division: "",
      district: "",
      registrar: "",
      dastNo: "",
      dastNoYear: "",
      dastNoDate: "",
      // dastNabhu: "",
      remarks: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    // setDastNoDate(`${day}-${month}-${year}`);
    setDastNoDate(`${year}-${month}-${day}`);
    setValue("dastNoDate", dateStr);
  };
  const formatNabhuNo = (verifiedDast) => {
    setDastNabhu(verifiedDast.map((item) => item.property_number).join(","));
    // setValue(
    //   "dastNabhu",
    //   verifiedDast.map((item) => item.property_number).join(",")
    // );
  };
  const handleDastType = (e) => {
    setDastType(e?.target?.value);
  };
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
      setShowVerifyButton(false);
    } else {
      setShowVerifyButton(true);
    }
    setVerifiedDastData([]);
  };
  const handleDastNoDate = (e) => {
    setDastNoDate(e?.target?.value);
  };
  const handleDastNabhu = (filteredValue) => {
    setDastNabhu(filteredValue);
  };
  const handleRemarks = (e) => {
    setRemarks(e?.target?.value);
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
              formatNabhuNo(JSON.parse(res.ResponseData).Table);
              setIsDastVarified(true);
            } else {
              setIsDastVarified(false);
              warningToast(
                "कृपया नोंदणीकृत दस्त क्रमांक / वर्ष तपासा, अन्यथा दस्त दिनांक व दस्तामध्ये नमूद केलेले न.भू.क्र. टाका"
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

  const handleSubmit = async () => {
    if (dastType == "mainDast") {
      const result = await trigger([
        "dastNo",
        "dastNoDate",
        "dastType",
        "dastNoYear",
        "division",
        "district",
        "registrar",
      ]);
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateDast`,
          "POST",
          {
            applicationid: applicationId,
            dastType: dastType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            dastNabhu: dastNabhu,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            remarks: "",
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getDastTable();
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
        errorToast("Please Check All Fields !");
      }
    } else {
      const newData = {
        applicationid: applicationId,
        dastType: dastType,
        division: division,
        district: district,
        registrar: registrar,
        dastNo: dastNo,
        dastNoYear: dastNoYear,
        dastNoDate: dastNoDate,
        dastNabhu: dastNabhu,
        isDastVarified: isDastVarified,
        verifiedDastData: JSON.stringify(verifiedDastData),
        remarks: remarks,
      };
      const isDuplicate = responseData.some(
        (item) =>
          Number(item.divisionCode) === newData.division.digcode &&
          Number(item.districtCode) === newData.district.jdrcode &&
          Number(item.registrarCode) === newData.registrar.srocode &&
          item.dastNo === newData.dastNo &&
          item.dastNoYear === newData.dastNoYear
      );
      if (isDuplicate) {
        errorToast("Duplicate entry found. Cannot proceed.");
      } else {
        const result = await trigger();
        if (result) {
          sendRequest(
            `${URLS?.BaseURL}/ApplicationAPIS/CreateDast`,
            "POST",
            {
              applicationid: applicationId,
              dastType: dastType,
              division: division,
              district: district,
              registrar: registrar,
              dastNo: dastNo,
              dastNoYear: dastNoYear,
              dastNoDate: dastNoDate,
              dastNabhu: dastNabhu,
              isDastVarified: isDastVarified,
              verifiedDastData: JSON.stringify(verifiedDastData),
              remarks: remarks,
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                getDastTable();
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
          errorToast("Please Check All Fields !");
        }
      }
    }
  };

  const handleEditSave = async () => {
    if (dastType == "mainDast") {
      const result = await trigger([
        "dastNo",
        "dastNoDate",
        "dastType",
        "dastNoYear",
        "division",
        "district",
        "registrar",
      ]);
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditDast`,
          "POST",
          {
            dastid: editId,
            applicationid: applicationId,
            dastType: dastType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            dastNabhu: dastNabhu,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            remarks: "",
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getDastTable();
              setIsHardEdit(false);
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
        errorToast("Please Check All Fields !");
      }
    } else {
      const result = await trigger();
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/EditDast`,
          "POST",
          {
            dastid: editId,
            applicationid: applicationId,
            dastType: dastType,
            division: division,
            district: district,
            registrar: registrar,
            dastNo: dastNo,
            dastNoYear: dastNoYear,
            dastNoDate: dastNoDate,
            dastNabhu: dastNabhu,
            isDastVarified: isDastVarified,
            verifiedDastData: JSON.stringify(verifiedDastData),
            remarks: remarks,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              getDastTable();
              setIsHardEdit(false);
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
        errorToast("Please Check All Fields !");
      }
    }
  };
  const handleEdit = async (id) => {
    setIsHardEdit(true);
    const obj = responseData.find((o) => o?.dast_id == id);
    setEditId(obj?.dast_id);
    setIsEdit(true);
    setEditObj(obj);

    setDastType(obj?.dastType);
    setDivision({
      dig: obj?.divisionName,
      digcode: Number(obj?.divisionCode),
    });
    setDistrict({
      jdr: obj?.districtName,
      jdrcode: Number(obj?.districtCode),
    });
    setRegistrar({
      sro: obj?.registrarName,
      srocode: Number(obj?.registrarCode),
    });
    setDastNo(obj?.dastNo);
    setDastNoYear(obj?.dastNoYear);
    setIsDastVarified(obj?.isDastVerified);
    setDastNoDate(obj?.dastNoDate);
    setDastNabhu(obj?.dastNabhu);
    setVerifiedDastData(JSON.parse(obj?.verifiedDastData));
    setRemarks(obj?.remarks == "" ? "Na" : obj?.remarks);

    setValue("dastType", obj?.dastType);
    setValue("division", obj?.divisionName);
    setValue("district", obj?.districtName);
    setValue("registrar", obj?.registrarName);
    setValue("dastNo", obj?.dastNo);
    setValue("dastNoYear", obj?.dastNoYear);
    setValue("dastNoDate", obj?.dastNoDate);
    setValue("remarks", obj?.remarks == "" ? "Na" : obj?.remarks);
  };
  const handleReset = () => {
    setDastType("");
    setDistrict(null);
    setRegistrar(null);
    setDastNo("");
    setDastNoDate("");
    setDastNoYear("");
    setDastNabhu("");
    setRemarks("");

    reset();
    setIsDastVarified(false);
    setIsEdit(false);
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteDast`,
      "POST",
      {
        dastid: id,
        applicationid: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getDastTable();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
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
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getDastTable = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetDastInfo`,
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
    setAppDataApi();
    getDastTable();
    setInitialDivision();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Toast />
      <Grid container spacing={2}>
        <Grid item md={12} mt={2}>
          <Paper elevation={5} sx={{ px: 2, p: 3 }} className="paper-back">
            <Grid container spacing={2}>
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
              <Grid item md={2}>
                <span className="paper-span">
                  गाव : <b>{applicationData?.village_name}</b>
                </span>
              </Grid>
              <Grid item md={6}>
                <span className="paper-span">
                  न.भू .क्र. :{" "}
                  {/* {Array.isArray(applicationData?.nabhDTL) &&
                    applicationData?.nabhDTL.map((val, i) => {
                      return (
                        <b key={i}>
                          {" "}
                          {i === applicationData?.nabhDTL.length - 1
                            ? val?.naBhu
                            : `${val?.naBhu}, `}
                        </b>
                      );
                    })} */}
                  <b>
                    {Array.isArray(applicationData?.nabhDTL) &&
                      applicationData?.nabhDTL
                        .map((item) => item.naBhu)
                        .join(",")}
                  </b>
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item md={12}>
          <NotesPaper
            heading="दस्त माहिती भरण्यासाठी आवश्यक सूचना"
            arr={dastNotesArr}
          />
        </Grid>

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container spacing={1}>
              <Grid item md={12}>
                <h4 className="heading">दस्त माहिती</h4>
              </Grid>
              {isEdit && (
                <Grid item md={12}>
                  <Button
                    onClick={handleReset}
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
                    {/* <Controller
                      name="dastType"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel className="inputlabel">
                            <b>दस्त प्रकार </b>
                            <span>*</span>
                          </InputLabel>
                          <Select
                            className="textfield"
                            value={dastType}
                            fullWidth
                            size="small"
                            error={errors.dastType}
                            {...field}
                            onBlur={() => handleBlur("dastType")}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDastType(e);
                            }}
                          >
                            <MenuItem value="mainDast">मूळ दस्त</MenuItem>
                            <MenuItem value="errorCorrect">
                              चूक दुरुस्ती
                            </MenuItem>
                          </Select>
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.dastType && errors.dastType.message}
                          </FormHelperText>
                        </>
                      )}
                    /> */}

                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>दस्त प्रकार </b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={
                            editObj?.dastType == "mainDast"
                              ? "मूळ दस्त"
                              : "चूक दुरुस्ती"
                          }
                        />
                      </>
                    ) : (
                      <Controller
                        name="dastType"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>दस्त प्रकार </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              className="textfield"
                              value={dastType}
                              fullWidth
                              size="small"
                              error={errors.dastType}
                              {...field}
                              onBlur={() => handleBlur("dastType")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleDastType(e);
                              }}
                            >
                              <MenuItem
                                value="mainDast"
                                disabled={responseData.length >= 1}
                              >
                                {/* मूळ दस्त */}
                                {responseData.length >= 1
                                  ? "मूळ दस्त (एकावेळी एकच मूळ दस्त भरता येईल)"
                                  : "मूळ दस्त"}
                              </MenuItem>
                              <MenuItem
                                value="errorCorrect"
                                disabled={responseData.length == 0}
                              >
                                {responseData.length == 0
                                  ? "चूक दुरुस्ती (मूळ दस्त माहिती भरणे अनिवार्य आहे)"
                                  : "चूक दुरुस्ती"}
                              </MenuItem>
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.dastType && errors.dastType.message}
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
                  <Grid item md={4}>
                    {/* <Controller
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
                    /> */}

                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>विभाग</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.divisionName}
                        />
                      </>
                    ) : (
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
                    )}
                  </Grid>
                  <Grid item md={4}>
                    {/* <Controller
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
                    /> */}

                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>जिल्हा</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.districtName}
                        />
                      </>
                    ) : (
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
                    )}
                  </Grid>
                  <Grid item md={4}>
                    {/* <Controller
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
                    /> */}

                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>दुय्यम निबंधक कार्यालय</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.registrarName}
                        />
                      </>
                    ) : (
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
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    {/* <Controller
                      name="dastNo"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel className="inputlabel">
                            <b>नोंदणीकृत दस्त क्रमांक </b>
                            <span>*</span>
                          </InputLabel>
                          <TextField
                            fullWidth
                            className="textfield"
                            placeholder="दस्त नंबर"
                            size="small"
                            value={dastNo}
                            error={errors.dastNo}
                            {...field}
                            onBlur={() => handleBlur("dastNo")}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDastNo(e);
                            }}
                          />
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.dastNo && errors.dastNo.message}
                          </FormHelperText>
                        </>
                      )}
                    /> */}

                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>नोंदणीकृत दस्त क्रमांक </b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.dastNo}
                        />
                      </>
                    ) : (
                      <Controller
                        name="dastNo"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>नोंदणीकृत दस्त क्रमांक </b>
                              <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              className="textfield"
                              placeholder="दस्त नंबर"
                              type="text"
                              size="small"
                              value={dastNo}
                              error={errors.dastNo}
                              {...field}
                              onBlur={() => handleBlur("dastNo")}
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
                    )}
                  </Grid>
                  <Grid item md={2}>
                    {/* <Controller
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
                            type="number"
                            size="small"
                            value={dastNoYear}
                            error={errors.dastNoYear}
                            inputProps={{
                              maxLength: 4,
                              max: 9999,
                              onInput: (e) => {
                                if (e.target.value.length > 4) {
                                  e.target.value = e.target.value.slice(0, 4);
                                }
                              },
                            }}
                            {...field}
                            onBlur={() => handleBlur("dastNoYear")}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDastNoYear(e);
                            }}
                          />
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.dastNoYear && errors.dastNoYear.message}
                          </FormHelperText>
                        </>
                      )}
                    /> */}

                    {isEdit ? (
                      <>
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
                      </>
                    ) : (
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
                                  e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 4)
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
                    )}
                  </Grid>
                  <Grid item md={2}>
                    <InputLabel>
                      <b> &nbsp;</b>
                    </InputLabel>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerifyIGRApi}
                      disabled={!showVerifyButton || isEdit}
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
                            {/* {field?.value} */}
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
                              onClick={(event) => {
                                if (event.target.showPicker) {
                                  event.target.showPicker();
                                }
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
              </Grid>
              {!isDastVarified && (
                // <Grid item md={12}>
                //   <Grid container spacing={2}>
                //     <Grid item md={6}>
                //       <Controller
                //         name="dastNabhu"
                //         control={control}
                //         render={({ field }) => (
                //           <>
                //             <InputLabel className="inputlabel">
                //               <b>दस्तामध्ये नमूद केलेले न.भू.क्र. </b>
                //               <span>*</span>
                //             </InputLabel>
                //             <TextField
                //               fullWidth
                //               placeholder="दस्तामध्ये नमूद केलेले न.भू.क्र."
                //               name="mobile"
                //               className="textfield"
                //               size="small"
                //               value={dastNabhu}
                //               error={errors.dastNabhu}
                //               {...field}
                //               onBlur={() => handleBlur("dastNabhu")}
                //               onChange={(e) => {
                //                 field.onChange(e);
                //                 handleDastNabhu(e);
                //               }}
                //             />
                //             <FormHelperText sx={{ color: "red" }}>
                //               {errors.dastNabhu && errors.dastNabhu.message}
                //             </FormHelperText>
                //             <FormHelperText>
                //               एकापेक्षा जास्त न. भू. क्र. असल्यास (485/20/121/52
                //               , 485/20/121/53) दोन न. भू. क्रमांकामध्ये ,
                //               द्यावा.
                //             </FormHelperText>
                //           </>
                //         )}
                //       />
                //     </Grid>
                //   </Grid>
                // </Grid>
                <Grid item md={12}>
                  <Grid container spacing={2}>
                    {isEdit ? (
                      <Grid item md={6}>
                        <InputLabel className="inputlabel">
                          <b>दस्तामध्ये नमूद केलेले न.भू.क्र.</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.dastNabhu}
                        />
                      </Grid>
                    ) : (
                      <Grid item md={6}>
                        <InputLabel className="inputlabel">
                          <b>दस्तामध्ये नमूद केलेले न.भू.क्र. </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          placeholder="दस्तामध्ये नमूद केलेले न.भू.क्र."
                          name="mobile"
                          className="textfield"
                          size="small"
                          value={dastNabhu}
                          onChange={(e) => {
                            const value = e?.target?.value;
                            const filteredValue = value
                              .replace(/[^\u0900-\u097Fa-zA-Z0-9\s,\/]/g, "")
                              .replace(/\s+/g, " ")
                              .trimStart();
                            handleDastNabhu(filteredValue);
                          }}
                        />
                        <FormHelperText>
                          एकापेक्षा जास्त न. भू. क्र. असल्यास (485/20/121/52 ,
                          485/20/121/53) दोन न. भू. क्रमांकामध्ये , द्यावा.
                        </FormHelperText>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
              {dastType == "errorCorrect" && (
                <Grid item md={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      {/* <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>चुकदुरुस्ती करण्याचे कारण </b>
                              <span>*</span>
                            </InputLabel>
                            <TextField
                              fullWidth
                              placeholder="येथे लिहा .."
                              className="textfield"
                              size="small"
                              multiline
                              rows={2}
                              value={remarks}
                              error={errors.remarks}
                              {...field}
                              onBlur={() => handleBlur("remarks")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleRemarks(e);
                              }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.remarks && errors.remarks.message}
                            </FormHelperText>
                          </>
                        )}
                      /> */}

                      {isEdit ? (
                        <>
                          <InputLabel className="inputlabel">
                            <b>चुकदुरुस्ती करण्याचे कारण </b>
                          </InputLabel>
                          <TextField
                            fullWidth
                            className="textfieldDisabled"
                            size="small"
                            disabled
                            value={editObj?.dastNabhu}
                          />
                        </>
                      ) : (
                        <Controller
                          name="remarks"
                          control={control}
                          render={({ field }) => (
                            <>
                              <InputLabel className="inputlabel">
                                <b>चुकदुरुस्ती करण्याचे कारण </b>
                                <span>*</span>
                              </InputLabel>
                              <TextField
                                fullWidth
                                placeholder="येथे लिहा .."
                                className="textfield"
                                size="small"
                                multiline
                                rows={2}
                                value={remarks}
                                error={errors.remarks}
                                {...field}
                                onBlur={() => handleBlur("remarks")}
                                // onChange={(e) => {
                                //   field.onChange(e);
                                //   handleRemarks(e);
                                // }}
                                onChange={(e) => {
                                  const { name, value } = e.target;
                                  const filteredValue =
                                    filterOnlyLettersNumbersCommaDotAndSpaces(
                                      value
                                    );
                                  field.onChange(filteredValue);
                                  handleRemarks({
                                    target: { name, value: filteredValue },
                                  });
                                }}
                              />
                              <FormHelperText sx={{ color: "red" }}>
                                {errors.remarks && errors.remarks.message}
                              </FormHelperText>
                            </>
                          )}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
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
            </Grid>

            <Grid container justifyContent="end" px={2} mt={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  onClick={() => {
                    handleReset();
                    setIsHardEdit(false);
                  }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  onClick={isHardEdit ? handleEditSave : handleSubmit}
                >
                  {isHardEdit ? "बदल जतन करा" : "जतन करा"}
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
                  <TableCell>दस्ताचा प्रकार</TableCell>
                  <TableCell>विभाग</TableCell>
                  <TableCell>जिल्हा</TableCell>
                  <TableCell>दुय्यम निबंधक कार्यालय</TableCell>
                  <TableCell>र.द.क./वर्ष</TableCell>
                  <TableCell>दस्त दिनांक</TableCell>
                  <TableCell>दस्तामध्ये नमूद केलेले न.भू.क्र.</TableCell>
                  <TableCell>दस्त पडताळणी</TableCell>
                  <TableCell>टिप्पणी</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(responseData) &&
                  responseData.map((val, i) => {
                    return (
                      <TableRow key={val?.dast_id + i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{val?.applicationid}</TableCell>
                        <TableCell>
                          {val?.dastType == "mainDast"
                            ? "मूळ दस्त"
                            : "चूक दुरुस्ती"}
                        </TableCell>
                        <TableCell>{val?.divisionName}</TableCell>
                        <TableCell>{val?.districtName}</TableCell>
                        <TableCell>{val?.registrarName}</TableCell>
                        <TableCell>
                          {val?.dastNo}/{val?.dastNoYear}
                        </TableCell>
                        <TableCell>{val?.dastNoDate}</TableCell>
                        <TableCell>{val?.dastNabhu}</TableCell>
                        <TableCell>
                          {val?.isDastVerified ? "होय" : "नाही"}
                        </TableCell>
                        <TableCell>
                          {val?.dastType == "mainDast" ? "-" : val?.remarks}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(val?.dast_id)}
                            disabled={responseData.length > 1 && i === 0} // Disable only the first row when more than one row exists
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                          {/* 
                          <Tooltip    
                            title={
                              responseData.length > 1 && i === 0
                                ? "Cannot delete the first row"
                                : ""
                            }
                            arrow
                          >
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(val?.dast_id)}
                                disabled={responseData.length > 1 && i === 0}
                              >
                                <DeleteForeverOutlinedIcon />
                              </IconButton>
                            </span>
                          </Tooltip> */}
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
              onClick={() => navigate("/home/nabhu")}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            {/* <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/home/ferfar")}
            >
              पुढे जा
            </Button> */}
            {disableNextBtn ? (
              <Tooltip
                arrow
                disableFocusListener
                disableTouchListener
                placement="top"
                title="कृपया दस्त माहिती भरा"
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
                onClick={() => navigate("/home/ferfar")}
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

export default Dast;
