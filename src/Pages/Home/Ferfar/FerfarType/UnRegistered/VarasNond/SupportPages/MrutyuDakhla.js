import {
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
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
import React, { useEffect, useState } from "react";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast } from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { mryutuDakhlaNotesArr } from "../../../../../../../NotesArray/NotesArray";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyLettersNumbersAndSpacesForMryutuDakhlaNo,
} from "../../../../../../../Validations/utils";

const MrutyuDakhla = ({ setActiveStep }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [issueOfficeArr, setIssurOfficeArr] = useState([]);
  const [mayatId, setMayatId] = useState("");
  const [userDetails, setUserDetails] = useState({
    suffix: "",
    suffixEng: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
    isNameSame: "yes",
    reason: "",
    dateOfDeath: "",
    deathCertificateIssueOfficeDropdown: {},
    deathCertificateNo: "",
    dateOfDeathCertificate: "",
  });
  const [uploadDoc, setUploadDoc] = useState({ docName: "", docSrc: "" });
  const [uploadDocError, setUploadDocError] = useState("");
  const [uploadCorrectNameDoc, setCorrectNameDoc] = useState({
    docName: "",
    docSrc: "",
  });
  const [uploadCorrectNameDocError, setCorrectNameDocError] = useState("");
  const [mayatDharak, setMayatDharakData] = useState([]);
  const [mayatObj, setMayatObj] = useState({});
  const [responseData, setResponseData] = useState([]);

  const handleReset = () => {
    setUserDetails({
      suffix: "",
      suffixEng: "",
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      isNameSame: "yes",
      reason: "",
      dateOfDeath: "",
      deathCertificateIssueOfficeDropdown: {},
      deathCertificateNo: "",
      dateOfDeathCertificate: "",
    });
    setUploadDoc({ docName: "", docSrc: "" });
    setCorrectNameDoc({
      docName: "",
      docSrc: "",
    });

    reset();
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
        mayatDharak: yup.string().required("मयत धारक निवडा"),
        dateOfDeath: yup.string().required("मयताची दिनांक निवडा"),
        deathCertificateIssueOfficeDropdown: yup
          .string()
          .required("मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव निवडा"),
        deathCertificateNo: yup.string().required("मयत दाखला क्रमांक टाका"),
        dateOfDeathCertificate: yup.string().required("मयत दाखला दिनांक निवडा"),
      })
    ),
    defaultValues: {
      mayatDharak: "",
      dateOfDeath: "",
      dateOfDeathCertificate: "",
      deathCertificateIssueOfficeDropdown: "",
      deathCertificateNo: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleMayatDharak = (e) => {
    const code = e?.target?.value;
    const obj = mayatDharak.find((o) => o?.mayat_id == code);
    setMayatObj(obj);
    setMayatId(obj?.mayat_id);
    setUserDetails({
      ...userDetails,
      // mayat_id: obj?.mayat_id,
      suffix: obj?.userDetails?.suffix,
      suffixEng: obj?.userDetails?.suffixEng,
      firstName: obj?.userDetails?.firstName,
      middleName: obj?.userDetails?.middleName,
      lastName: obj?.userDetails?.lastName,
      firstNameEng: obj?.userDetails?.firstNameEng,
      middleNameEng: obj?.userDetails?.middleNameEng,
      lastNameEng: obj?.userDetails?.lastNameEng,
    });
  };
  const handleRadioChange = (e) => {
    const value = e?.target?.value;
    if (value == "yes") {
      setUserDetails({ ...userDetails, isNameSame: value, reason: "" });
    } else {
      setUserDetails({ ...userDetails, isNameSame: value });
    }
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, [name]: value });
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
  const handleUploadCorrectNameDocument = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        // 2 MB = 2048 * 1024 bytes
        setCorrectNameDocError("अपलोड कागदपत्र साइज 2 MB च्या वर आहे");
        setCorrectNameDoc({
          ...uploadDoc,
          docName: "",
          docSrc: "",
        });
      } else {
        setCorrectNameDocError("");
        const reader = new FileReader();
        setValue("file", file.name);
        reader.onloadend = () => {
          if (reader.result) {
            // Safely process the result
            const base64Data = reader.result.replace(
              /^data:application\/pdf;base64,/,
              ""
            );
            setCorrectNameDoc({
              ...uploadDoc,
              docSrc: base64Data,
              docName: file.name,
            });
          } else {
            setCorrectNameDocError("File could not be read. Please try again.");
            setCorrectNameDoc({
              ...uploadDoc,
              docName: "",
              docSrc: "",
            });
          }
        };
        reader.onerror = () => {
          // Handle FileReader errors
          setCorrectNameDocError("An error occurred while reading the file.");
          setCorrectNameDoc({
            ...uploadDoc,
            docName: "",
            docSrc: "",
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setCorrectNameDocError("");
      setCorrectNameDoc({
        ...uploadDoc,
        docName: "",
        docSrc: "",
      });
    }
  };
  const handleSave = async () => {
    const result = await trigger();
    if (result) {
      if (uploadDoc?.docName) {
        sendRequest(
          `${URLS?.BaseURL}/MutationAPIS/SaveMrutyuCertificate`,
          "POST",
          {
            applicationid: applicationId,
            mayat_id: mayatId,
            userDetails: userDetails,
            docUpload: uploadDoc,
            uploadCorrectNameDoc: uploadCorrectNameDoc,
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getMryutuDakhlaTableData();
            } else {
              console.error(res?.Message);
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.response?.Message);
          }
        );
      } else {
        errorToast("कृपया मृत्यू दाखला अपलोड करा !");
      }
    } else {
      errorToast("Please Check All Fields !");
    }
  };
  const getMryutuDakhlaTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetMrutuDharakInfo`,
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
  const getMryutuDakhlaData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetMayatDharakInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setMayatDharakData(res?.ResponseData);
        } else {
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
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
  useEffect(() => {
    getMryutuDakhlaData();
    getMryutuDakhlaTableData();
    setDeathCertificateIssueOfficeArr();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Toast />
      <Grid item md={12}>
        <NotesPaper
          heading="मृत्यू दाखला माहिती भरण्यासाठी आवश्यक सूचना"
          arr={mryutuDakhlaNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">मृत्यू दाखला</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Controller
                  name="mayatDharak"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>मयत धारक निवडा </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        className="textfield"
                        size="small"
                        value={mayatObj}
                        error={errors.mayatDharak}
                        {...field}
                        onBlur={() => handleBlur("mayatDharak")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleMayatDharak(e);
                        }}
                      >
                        {Array.isArray(mayatDharak) &&
                          mayatDharak.map((val, i) => {
                            return (
                              <MenuItem
                                value={val?.mayat_id}
                                key={val?.mayat_id + i}
                              >
                                {val?.fullNameInMarathi}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.mayatDharak && errors.mayatDharak.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between">
              <Grid item md={2}>
                <InputLabel className="inputlabel">
                  <b>मयत धारकाचे नाव </b>
                </InputLabel>
                <TextField
                  fullWidth
                  value={userDetails?.suffix}
                  disabled
                  className="textfieldDisabled"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel>&nbsp;</InputLabel>
                <TextField
                  fullWidth
                  value={userDetails?.firstName}
                  className="textfieldDisabled"
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel>&nbsp;</InputLabel>
                <TextField
                  fullWidth
                  value={userDetails?.middleName}
                  disabled
                  className="textfieldDisabled"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel>&nbsp;</InputLabel>
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
            <Grid container justifyContent="space-between">
              <Grid item md={2}>
                <TextField
                  fullWidth
                  value={userDetails?.suffixEng}
                  disabled
                  className="textfieldDisabled"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  value={userDetails?.firstNameEng}
                  disabled
                  className="textfieldDisabled"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  value={userDetails?.middleNameEng}
                  className="textfieldDisabled"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  fullWidth
                  value={userDetails?.lastNameEng}
                  disabled
                  className="textfieldDisabled"
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                <InputLabel className="inputlabel">
                  <b>
                    मयत धारकाचे मृत्यू दाखल्यावरील नाव व मिळकत पत्रिकेवरील नाव
                    सारखे आहे का ?
                  </b>
                </InputLabel>
                <RadioGroup
                  row
                  onChange={handleRadioChange}
                  value={userDetails?.isNameSame}
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
              {userDetails?.isNameSame == "no" && (
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>नाव सारखे नसल्याचे कारण ?</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfield"
                    size="small"
                    name="reason"
                    value={userDetails?.reason}
                    onChange={handleUserDetails}
                  />
                </Grid>
              )}
              {userDetails?.isNameSame == "no" && (
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>बरोबर नावाचा पुरावा</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    fullWidth
                    disabled
                    size="small"
                    value={
                      uploadCorrectNameDoc?.docName
                        ? uploadCorrectNameDoc?.docName
                        : ""
                    }
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
                              // accept="image/*"
                              hidden
                              onChange={handleUploadCorrectNameDocument}
                            />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {uploadCorrectNameDocError && uploadCorrectNameDocError}
                  </FormHelperText>
                </Grid>
              )}
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
                          min: "1900-01-01",
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
                        <b>मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        name="deathCertificateIssueOfficeDropdown"
                        fullWidth
                        className="textfield"
                        size="small"
                        value={userDetails?.deathCertificateIssueOfficeDropdown}
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
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
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
                          // min: "1900-01-01",
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
                {/* <FormHelperText sx={{ color: "red" }}>
                  {uploadDocError && uploadDocError}
                </FormHelperText> */}
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
                sx={{ mr: 2 }}
                disabled={responseData.length >= 1}
              >
                जतन करा
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setActiveStep(2)}
                disabled={responseData.length == 0}
              >
                वारसाची माहिती भरा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>मृत्यू दाखला माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>मयत धारक</TableCell>
                <TableCell>मृत्यू दिनांक</TableCell>
                <TableCell>मृत्यू दाखला क्रमांक</TableCell>
                <TableCell>मृत्यू दाखला दिनांक</TableCell>
                <TableCell>मृत्यू दाखला</TableCell>
                {/* <TableCell>कृती करा</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(responseData) &&
                responseData.map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{val?.fullNameInMarathi}</TableCell>
                      <TableCell>{val?.userDetails?.dateOfDeath}</TableCell>

                      <TableCell>
                        {val?.userDetails?.deathCertificateNo}
                      </TableCell>
                      <TableCell>
                        {val?.userDetails?.dateOfDeathCertificate}
                      </TableCell>
                      <TableCell>
                        <a
                          href={val?.docUpload?.documentSrc}
                          target="_blank"
                          download={val?.docUpload?.documentName}
                        >
                          {val?.docUpload?.documentName}
                        </a>
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

export default MrutyuDakhla;
