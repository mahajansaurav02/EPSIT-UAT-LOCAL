import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Container,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import SecuredHeader from "../SecuredHeader";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import AxiosInstance from "../../Instance/AxiosInstance";
import URLS from "../../URLs/url";
import { errorToast, successToast, Toast } from "../Toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  districtValidationSchema,
  talukaValidationSchema,
} from "../../Validations/yupValidations";

const GrievanceForm = () => {
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const [applicationIdData, setApplicatioIdData] = useState([]);

  const [grievanceData, setGrievanceData] = useState({
    applicationId: "",
    mutationName: "",
    issueCategory: "",
    issueDesc: "",
    imagesrc: "",
    imageName: "",
    district_code: "",
    district_name_in_marathi: "",
    taluka_code: "",
    taluka_name: "",
    secondaryMoNo: "",
  });
  const [grievanceProofError, setGrievanceProofError] = useState("");
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [officeArr, setOfficeArr] = useState([]);
  const [office, setOffice] = useState({});

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        district: districtValidationSchema,
        taluka: talukaValidationSchema,
        grievanceTextfield: yup
          .string()
          .required("कृपया आपली तक्रार प्रविष्ट करा."),
        applicationNo: yup.string().required("कृपया आपली तक्रार प्रविष्ट करा."),
        grievanceType: yup.string().required("कृपया तक्रार प्रकार निवडा."),
      })
    ),
    defaultValues: {
      district: "",
      taluka: "",
      grievanceTextfield: "",
      applicationNo: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleGrievanceType = (e) => {
    const val = e?.target?.value;
    if (val == "other") {
      setGrievanceData({
        ...grievanceData,
        issueCategory: val,
        applicationId: "",
        mutationName: "",
        district_code: "",
        district_name_in_marathi: "",
        taluka_code: "",
        taluka_name: "",
      });
      setApplicatioIdData([]);
    } else {
      setGrievanceData({
        ...grievanceData,
        issueCategory: val,
        district_code: "",
        district_name_in_marathi: "",
        taluka_code: "",
        taluka_name: "",
      });
    }
  };
  const handleApplicationType = (e) => {
    const obj = applicationIdData.find(
      (o) => o?.applicationId == e?.target?.value
    );
    setGrievanceData({
      ...grievanceData,
      applicationId: obj?.applicationId,
      mutationName: obj?.mutation_type,
      district_code: obj?.district_code,
      district_name_in_marathi: obj?.district_name_in_marathi,
      taluka_code: obj?.taluka_code,
      taluka_name: obj?.taluka_name,
    });
  };
  const handleGrievanceData = (e) => {
    const { name, value } = e?.target;
    setGrievanceData({ ...grievanceData, [name]: value });
  };
  const handleGrievanceProofFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setGrievanceProofError("तक्रार पुराव्याची साइज 256kb च्या वर आहे");
        setGrievanceData({
          ...grievanceData,
          imageName: "",
          imagesrc: "",
        });
      } else {
        setGrievanceProofError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setGrievanceData({
            ...grievanceData,
            imagesrc: reader.result,
            imageName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setGrievanceProofError("");
      setGrievanceData({
        ...grievanceData,
        imageName: "",
        imagesrc: "",
      });
    }
  };
  const goToHomePage = () => {
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  const handleSubmit = async () => {
    if (grievanceData?.issueCategory == "applicationRelated") {
      const result = await trigger([
        "grievanceType",
        "applicationNo",
        "grievanceTextfield",
      ]);
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/GrievanceSystem/SaveGrievanceSystemIssues`,
          "POST",
          grievanceData,
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              setTimeout(() => {
                navigate("/grievances");
              }, 2000);
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
    } else {
      const result = await trigger([
        "grievanceType",
        "district",
        "taluka",
        "grievanceTextfield",
      ]);
      if (result) {
        sendRequest(
          `${URLS?.BaseURL}/GrievanceSystem/SaveGrievanceSystemIssues`,
          "POST",
          grievanceData,
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              setTimeout(() => {
                navigate("/grievances");
              }, 2000);
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
    }
  };
  const handleReset = () => {
    setGrievanceData({
      applicationId: "",
      mutationName: "",
      issueCategory: "",
      issueDesc: "",
      imagesrc: "",
      imageName: "",
    });
    reset();
    setGrievanceProofError("");
  };
  const handleDistrict = (e) => {
    const distCode = e?.target?.value;
    setOfficeArr([]);
    const obj = districtArr.find((o) => o.district_code == distCode);
    setDistrict(obj);
    setGrievanceData({
      ...grievanceData,
      district_code: obj?.district_code,
      district_name_in_marathi: obj?.district_name,
    });

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOfficeByDistrict`,
      "POST",
      distCode,
      (res) => {
        setOfficeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleTaluka = (e) => {
    const officeCode = e?.target?.value;
    const obj = officeArr.find((o) => o.office_code == officeCode);
    setOffice(obj);
    setGrievanceData({
      ...grievanceData,
      taluka_code: obj?.office_code,
      taluka_name: obj?.office_name,
    });
  };
  const getApplicationId = () => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetMutationAndApplicationIdData`,
      "POST",
      null,
      (res) => {
        setApplicatioIdData(res?.ResponseData);
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const setInitialDistrict = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/allDistrictList`,
      "POST",
      null,
      (res) => {
        setDistrictArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    if (grievanceData?.issueCategory == "applicationRelated") {
      getApplicationId();
    }
    if (grievanceData?.issueCategory == "other") {
      setInitialDistrict();
    }
  }, [grievanceData?.issueCategory]);
  return (
    <>
      <Toast />

      <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar>
      <Container>
        <Paper elevation={5} sx={{ p: 5, m: 3, mt: 16 }}>
          <Grid container spacing={2} mb={1}>
            <Grid item md={12}>
              <h4 className="heading">Grievances</h4>
            </Grid>
            <Grid item md={2}>
              {/* <InputLabel className="inputlabel">
                <b>तक्रार प्रकार</b>
              </InputLabel>
              <Select
                fullWidth
                size="small"
                value={grievanceData?.issueCategory}
                className="textfield"
                name="issueCategory"
                onChange={handleGrievanceType}
              >
                <MenuItem value="applicationRelated">अर्जाबाबत तक्रार</MenuItem>
                <MenuItem value="other">इतर</MenuItem>
              </Select> */}

              <Controller
                name="grievanceType"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>तक्रार प्रकार </b>
                      <span>*</span>
                    </InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      value={grievanceData?.issueCategory}
                      className="textfield"
                      error={errors.grievanceType}
                      {...field}
                      displayEmpty
                      onBlur={() => handleBlur("grievanceType")}
                      onChange={(e) => {
                        field.onChange(e);
                        handleGrievanceType(e);
                      }}
                    >
                      <MenuItem value="applicationRelated">
                        अर्जाबाबत तक्रार
                      </MenuItem>
                      <MenuItem value="other">इतर</MenuItem>
                    </Select>
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.grievanceType && errors.grievanceType.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            {grievanceData?.issueCategory == "applicationRelated" && (
              <>
                <Grid item md={4}>
                  {/* <InputLabel className="inputlabel">
                    <b>अर्ज क्रमांक</b>
                  </InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={grievanceData?.applicationId}
                    className="textfield"
                    onChange={handleApplicationType}
                  >
                    {Array.isArray(applicationIdData) &&
                      applicationIdData.map((val, i) => {
                        return (
                          <MenuItem
                            value={val?.applicationId}
                            key={val?.applicationId}
                          >
                            {`${val?.applicationId} - ${val?.mutation_type}`}
                          </MenuItem>
                        );
                      })}
                  </Select> */}

                  <Controller
                    name="applicationNo"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>अर्ज क्रमांक </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          value={grievanceData?.applicationId}
                          className="textfield"
                          error={errors.applicationNo}
                          {...field}
                          displayEmpty
                          onBlur={() => handleBlur("applicationNo")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleApplicationType(e);
                          }}
                        >
                          {Array.isArray(applicationIdData) &&
                            applicationIdData.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.applicationId}
                                  key={val?.applicationId}
                                >
                                  {`${val?.applicationId} - ${val?.mutation_type}`}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.applicationNo && errors.applicationNo.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={2}>
                  <InputLabel className="inputlabel">
                    <b>जिल्हा</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    fullWidth
                    disabled
                    value={grievanceData?.district_name_in_marathi}
                    size="small"
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>कार्यालय </b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    fullWidth
                    disabled
                    value={grievanceData?.taluka_name}
                    size="small"
                  />
                </Grid>
              </>
            )}
            {grievanceData?.issueCategory == "other" && (
              <>
                <Grid item md={3}>
                  {/* <InputLabel className="inputlabel">
                    <b>जिल्हा </b>
                    <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    className="textfield"
                    value={district?.district_name_in_marathi}
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
                            key={val?.district_code + i}
                            value={val?.district_code}
                          >
                            {val?.district_name}
                          </MenuItem>
                        );
                      })}
                  </Select> */}

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
                          fullWidth
                          size="small"
                          className="textfield"
                          value={district?.district_name_in_marathi}
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
                                  key={val?.district_code + i}
                                  value={val?.district_code}
                                >
                                  {val?.district_name}
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
                  {/* <InputLabel className="inputlabel">
                    <b>कार्यालय </b>
                  </InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={office?.office_name}
                    className="textfield"
                    onChange={handleTaluka}
                  >
                    {Array.isArray(officeArr) &&
                      officeArr.map((val, i) => {
                        return (
                          <MenuItem
                            key={val?.office_code + i}
                            value={val?.office_code}
                          >
                            {val?.office_name}
                          </MenuItem>
                        );
                      })}
                  </Select> */}

                  <Controller
                    name="taluka"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>कार्यालय </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          value={office?.office_name}
                          className="textfield"
                          error={errors.taluka}
                          {...field}
                          displayEmpty
                          onBlur={() => handleBlur("taluka")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTaluka(e);
                          }}
                        >
                          {Array.isArray(officeArr) &&
                            officeArr.map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.office_code + i}
                                  value={val?.office_code}
                                >
                                  {val?.office_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.taluka && errors.taluka.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Controller
                name="grievanceTextfield"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>तक्रार </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      fullWidth
                      size="small"
                      value={grievanceData?.issueDesc}
                      error={errors.grievanceTextfield}
                      {...field}
                      onBlur={() => handleBlur("grievanceTextfield")}
                      multiline
                      rows={3}
                      name="issueDesc"
                      placeholder="तक्रार"
                      // onChange={handleGrievanceData}
                      onChange={(e) => {
                        field.onChange(e);
                        handleGrievanceData(e);
                      }}
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.grievanceTextfield &&
                        errors.grievanceTextfield.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>पर्यायी मोबाईल नंबर</b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                type="number"
                size="small"
                inputProps={{
                  maxLength: 10,
                  max: 9999999999,
                  onInput: (e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  },
                }}
                value={grievanceData?.secondaryMoNo}
                name="secondaryMoNo"
                placeholder="पर्यायी मोबाईल नंबर"
                onChange={handleGrievanceData}
              />
            </Grid>
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>तक्रार पुरावा</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                disabled
                value={grievanceData?.imageName}
                size="small"
                error={grievanceProofError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadRoundedIcon />}
                      >
                        अपलोड करा
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          hidden
                          onChange={handleGrievanceProofFileChange}
                        />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              {grievanceProofError ? (
                <p style={{ color: "red", fontSize: "13px", marginTop: 3 }}>
                  {grievanceProofError}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: 3,
                  }}
                >
                  तक्रार पुराव्याची साइज जास्तीत जास्त 256kb असावी व ती
                  JPG,JPEG,PNG स्वरूपात असावी.
                </p>
              )}
            </Grid>
            <Grid item md={12}>
              <Grid container justifyContent="space-between">
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
                    variant="contained"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ mr: 2 }}
                    onClick={() => navigate("/grievances")}
                  >
                    मागे जा
                  </Button>
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
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={handleSubmit}
                  >
                    जतन करा
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default GrievanceForm;
