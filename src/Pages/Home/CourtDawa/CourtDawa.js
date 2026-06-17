import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  IconButton,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { caseNoArr } from "../../../DemoArray/DemoArray";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { nabhuValidationSchema } from "../../../Validations/yupValidations";
import URLS from "../../../URLs/url";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { courtDawaNotesArr } from "../../../NotesArray/NotesArray";
import { filterOnlyLettersNumbersCommaDotAndSpaces } from "../../../Validations/utils";

const CourtDawa = () => {
  const navigate = useNavigate();
  const applicationId = sessionStorage.getItem("applicationId");
  const [applicationData, setApplicationData] = useState({});
  const { sendRequest } = AxiosInstance();
  const [naBhu, setNaBhu] = useState("");
  const [caseNo, setCaseNo] = useState({});
  const [caseTypeArr, setCaseTypeArr] = useState([]);
  const [caseType, setCaseType] = useState({});
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [stayOrder, setStayOrder] = useState("yes");
  const [orderDetails, setOrderDetails] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [disableNextBtn, setDisableShowNextBtn] = useState(true);

  //------------------------------Edit State---------------------------------
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isHardEdit, setIsHardEdit] = useState(false);
  const [editObj, setEditObj] = useState({});

  const isPOA = sessionStorage.getItem("isMainPatra");

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
        caseNo: yup.string().required("केस क्रमांक निवडा"),
        caseType: yup.string().required("केस प्रकार निवडा"),
      })
    ),
    defaultValues: {
      nabhu: "",
      caseNo: "",
      caseType: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleNaBhu = (e) => {
    const code = e?.target?.value;
    setNaBhu(code);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setSubPropNo(obj?.sub_property_no);
    setOrderDetails("");
  };
  const handleCase = (e) => {
    const code = e?.target?.value;
    const obj = caseNoArr.find((o) => o?.caseNoCode == code);
    setCaseNo(obj);
  };
  const handleCaseType = (e) => {
    const code = e?.target?.value;
    const obj = caseTypeArr.find((o) => o?.case_type == code);
    setCaseType({
      caseTypeCode: obj?.case_type.toString(),
      caseTypeLabel: obj?.case_type_description,
    });
  };
  const handleStayOrder = (e) => {
    setStayOrder(e?.target?.value);
  };
  const handleOrderDetails = (e) => {
    setOrderDetails(e?.target?.value);
  };
  const handleSave = async () => {
    const result = await trigger();
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/ApplicationAPIS/CreateCourtCLaimInfo`,
        "POST",
        {
          applicationid: applicationId,
          nabhu: naBhu,
          caseDawa: caseNo,
          caseType: caseType,
          stayOrder: stayOrder,
          orderDetails: orderDetails,
          lrPropertyUID: lrPropertyUID,
          subPropNo: subPropNo,
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            getCourtDawa();
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
      errorToast("Please Check All Fields");
    }
  };
  const handleEditSave = async () => {
    const result = await trigger();
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/ApplicationAPIS/EditCourtClaimInfo`,
        "POST",
        {
          editId: editId,
          applicationid: applicationId,
          nabhu: naBhu,
          caseDawa: caseNo,
          caseType: caseType,
          stayOrder: stayOrder,
          orderDetails: orderDetails,
          lrPropertyUID: lrPropertyUID,
          subPropNo: subPropNo,
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            getCourtDawa();
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
      errorToast("Please Check All Fields");
    }
  };
  const handleReset = () => {
    setIsEdit(false);
    setNaBhu("");
    setCaseNo({});
    setCaseType({});
    setLrPropertyUID("");
    setSubPropNo("");
    setStayOrder("yes");
    setOrderDetails("");

    reset();
  };
  const handleEdit = (id) => {
    setIsHardEdit(true);
    setIsEdit(true);
    const obj = responseData.find((o) => o?.court_claim_id == id);
    setEditId(obj?.court_claim_id);
    setEditObj(obj);
    setLrPropertyUID(obj?.lrPropertyUID);
    setStayOrder(obj?.stayOrder == "YES" ? "yes" : "no");
    setOrderDetails(obj?.orderDetails);
  };
  const handleEditDetails = () => {
    setIsEdit(false);
    setLrPropertyUID("");
    setValue("nabhu", "");
    setValue("caseNo", "");
    setValue("caseType", "");
  };
  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteCourtClaimInfo`,
      "POST",
      {
        court_claim_id: id,
        applicationid: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getCourtDawa();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.data?.message);
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
  const handlePrevious = () => {
    if (isPOA == "yes") {
      navigate("/home/main-patra");
    } else {
      navigate("/home/ferfar");
    }
  };
  const handleNext = () => {
    navigate("/home/documents");
  };
  const setAppDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData);
          getCaseTypeArr(res?.ResponseData?.district_code);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getCourtDawa = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetCourtClaimInfo`,
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
  const getCaseTypeArr = (distCode) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/caseTypeList`,
      "POST",
      distCode,
      (res) => {
        setCaseTypeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };

  useEffect(() => {
    setAppDataApi();
    // getCaseTypeArr();
    getCourtDawa();
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
            heading="कोर्ट दावा आवश्यक सूचना"
            arr={courtDawaNotesArr}
          />
        </Grid>

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container spacing={2}>
              <Grid item md={12}>
                <h4 className="heading">कोर्ट दावा माहिती</h4>
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
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>गाव/पेठ</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfieldDisabled"
                      placeholder={applicationData?.village_name}
                      size="small"
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Grid container spacing={2}>
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
                          value={editObj?.nabhu}
                        />
                      </>
                    ) : (
                      <Controller
                        name="nabhu"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>न.भू.क्र. क्रमांक निवडा </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              value={naBhu}
                              fullWidth
                              className="textfield"
                              size="small"
                              error={errors.nabhu}
                              {...field}
                              onBlur={() => handleBlur("nabhu")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleNaBhu(e);
                              }}
                            >
                              {Array.isArray(applicationData?.nabhDTL) &&
                                applicationData?.nabhDTL.map((val, i) => {
                                  return (
                                    <MenuItem key={i} value={val?.naBhu}>
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
                  <Grid item md={2}>
                    <InputLabel className="inputlabel">
                      <b>&nbsp;</b>
                    </InputLabel>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SearchRoundedIcon />}
                    >
                      केस क्रमांक शोधा
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>केस क्रमांक/रे.मु.नं.(XXXX99YY)</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.caseDawa?.caseNolabel}
                        />
                      </>
                    ) : (
                      <Controller
                        name="caseNo"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>केस क्रमांक/रे.मु.नं.(XXXX99YY) </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              fullWidth
                              className="textfield"
                              size="small"
                              value={caseNo}
                              error={errors.caseNo}
                              {...field}
                              onBlur={() => handleBlur("caseNo")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleCase(e);
                              }}
                            >
                              {Array.isArray(caseNoArr) &&
                                caseNoArr.map((val, i) => {
                                  return (
                                    <MenuItem
                                      key={val?.caseNoCode + i}
                                      value={val?.caseNoCode}
                                    >
                                      {val?.caseNolabel}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.caseNo && errors.caseNo.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item md={4}>
                    {isEdit ? (
                      <>
                        <InputLabel className="inputlabel">
                          <b>केस प्रकार</b>
                        </InputLabel>
                        <TextField
                          fullWidth
                          className="textfieldDisabled"
                          size="small"
                          disabled
                          value={editObj?.caseType?.caseTypeLabel}
                        />
                      </>
                    ) : (
                      <Controller
                        name="caseType"
                        control={control}
                        render={({ field }) => (
                          <>
                            <InputLabel className="inputlabel">
                              <b>केस प्रकार </b>
                              <span>*</span>
                            </InputLabel>
                            <Select
                              fullWidth
                              className="textfield"
                              size="small"
                              value={caseType}
                              error={errors.caseType}
                              {...field}
                              onBlur={() => handleBlur("caseType")}
                              onChange={(e) => {
                                field.onChange(e);
                                handleCaseType(e);
                              }}
                            >
                              {Array.isArray(caseTypeArr) &&
                                caseTypeArr.map((val, i) => {
                                  return (
                                    <MenuItem
                                      key={val?.case_type + i}
                                      value={val?.case_type}
                                    >
                                      {val?.case_type_description}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.caseType && errors.caseType.message}
                            </FormHelperText>
                          </>
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item md={3}>
                    <FormLabel
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <h4
                        style={{
                          padding: 0,
                          margin: 0,
                          fontSize: "17px",
                          fontWeight: 800,
                        }}
                      >
                        स्थगिती आदेश आहे का ?
                      </h4>
                      <span style={{ color: "red", fontWeightq: 700 }}>
                        &nbsp; *
                      </span>
                    </FormLabel>
                    <RadioGroup
                      row
                      value={stayOrder}
                      onChange={handleStayOrder}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="होय"
                        disabled={isEdit}
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="नाही"
                        disabled={isEdit}
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={8}>
                    <InputLabel className="inputlabel">
                      <b>आदेशाचा तपशील</b>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className={isEdit ? "textfieldDisabled" : "textfield"}
                      placeholder="येथे लिहा .."
                      name="mobile"
                      size="small"
                      multiline
                      disabled={isEdit}
                      rows={2}
                      value={orderDetails}
                      // onChange={handleOrderDetails}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        const filteredValue =
                          filterOnlyLettersNumbersCommaDotAndSpaces(value);
                        handleOrderDetails({
                          target: { name, value: filteredValue },
                        });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
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
                  onClick={isHardEdit ? handleEditSave : handleSave}
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
                  <TableCell>न.भू.क्र.</TableCell>
                  <TableCell>LR-Property UID</TableCell>
                  <TableCell>Sub-Property No.</TableCell>
                  <TableCell>केस क्रमांक</TableCell>
                  <TableCell>केस प्रकार</TableCell>
                  <TableCell>आदेशाचा तपशील</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(responseData) &&
                  responseData.map((val, i) => {
                    return (
                      <TableRow key={val?.court_claim_id + i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{val?.applicationid}</TableCell>
                        <TableCell>{val?.nabhu}</TableCell>
                        <TableCell>{val?.lrPropertyUID}</TableCell>
                        {/* <TableCell>{val?.subPropNo}</TableCell> */}
                        <TableCell>
                          {val?.milkat == "LAND" ? "-" : val?.subPropNo}
                        </TableCell>
                        <TableCell>{val?.caseDawa?.caseNolabel}</TableCell>
                        <TableCell>{val?.caseType?.caseTypeLabel}</TableCell>
                        <TableCell>{val?.orderDetails}</TableCell>
                        <TableCell>
                          {/* <IconButton
                            color="success"
                            onClick={() => handleEdit(val?.court_claim_id)}
                          >
                            <EditNoteOutlinedIcon />
                          </IconButton> */}
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(val?.court_claim_id)}
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
                title="कृपया कोर्ट दावा माहिती भरा"
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

export default CourtDawa;
