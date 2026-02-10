import React, { useEffect, useState } from "react";
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "../home.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addApplicationType,
  selectApplicationType,
} from "../../../Redux/slices/HomeSlices/ApplicationTypeSlice";
import { selectLanguage } from "../../../Redux/slices/LanguageSlice";
import { useNavigate } from "react-router-dom";
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
import {
  districtValidationSchema,
  talukaValidationSchema,
} from "../../../Validations/yupValidations";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { createApplicationNotesArr } from "../../../NotesArray/NotesArray";

const ApplicationTYpe = () => {
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const dispatch = useDispatch();
  const reduxState = useSelector(selectApplicationType);
  const language = useSelector(selectLanguage);
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [loading, setLoading] = useState(true);
  const [officeArr, setOfficeArr] = useState([]);
  const [office, setOffice] = useState({});
  const [applicationArr, setApplicationArr] = useState([]);
  const [mutType, setMutType] = useState("Y");
  const [selectedDocHeading, setSelectedDocHeading] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);
  const [dropdownMutations, setDropdownMutations] = useState([]);
  const [selectedMutation, setSelectedMutation] = useState({});
  const [isPOA, setIsPOA] = useState("");
  const [isCourt, setIsCourt] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        district: districtValidationSchema,
        taluka: talukaValidationSchema,
        applicationType: yup.string().required("अर्ज प्रकार निवडा"),
        ferfarType: yup.string().required("फेरफार प्रकार निवडा"),
        isPOA: yup.string().required("मुखत्यार पत्र आहे का ते निवडा"),
        isCourtDawa: yup
          .string()
          .required("कोर्टापुढे दावा चालू आहे काय ते निवडा"),
      }),
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleNext = async () => {
    if (disableBtn) return;
    setDisableBtn(true);

    try {
      const result = await trigger();
      if (result) {
        await sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/CreateApplication`,
          "POST",
          // reduxState,
          {
            district: {
              district_code: district?.district_code,
              district_name: district?.district_name,
              district_english_name: "NA",
            },
            office: {
              office_code: office?.office_code,
              office_name: office?.office_name,
            },
            applicationType: mutType == "Y" ? "नोंदणी कृत" : "अनोंदणी कृत",
            mutationType: {
              mutationTypeName: selectedMutation?.mutation_type,
              mutationTypeCode: selectedMutation?.mutation_code,
            },
            isMainPatra: isPOA,
            isCourtDawa: isCourt,
            isDastApplicable: mutType == "Y" ? "yes" : "no",
          },
          (res) => {
            if (res?.Code === "1") {
              reset();
              successToast(res?.Message);
              sessionStorage.setItem(
                "applicationId",
                res?.ResponseData?.ApplicationID,
              );
              navigate("/home/application-details");
            }
          },
          (err) => {
            errorToast(err?.Message);
          },
        );
      } else {
        warningToast("Please Check All Fields");
      }
    } catch (error) {
      console.error("Error in API call:", error);
    } finally {
      setDisableBtn(false);
    }
  };
  const goToHomePage = () => {
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  const handleDistrict = (e) => {
    const distCode = e?.target?.value;
    setOfficeArr([]);
    const obj = districtArr.find((o) => o.district_code == distCode);
    setDistrict(obj);
    dispatch(
      addApplicationType({
        ...reduxState,
        district: {
          district_code: obj?.district_code,
          district_name: obj?.district_name,
          district_english_name: "NA",
        },
      }),
    );

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOfficeByDistrict`,
      "POST",
      distCode,
      (res) => {
        setOfficeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const handleTaluka = (e) => {
    const officeCode = e?.target?.value;
    const obj = officeArr.find((o) => o.office_code == officeCode);
    setOffice(obj);
    // setInitialApplicationType();
    dispatch(
      addApplicationType({
        ...reduxState,
        office: {
          office_code: obj?.office_code,
          office_name: obj?.office_name,
        },
      }),
    );
  };
  const handleApplicationType = (e) => {
    const value = e?.target?.value;
    setMutType(value == "अनोंदणीकृत" ? "N" : "Y");
    setDropdownMutations([]);
    setSelectedMutation({});

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getMutationType`,
      "POST",
      value == "अनोंदणीकृत" ? "N" : "Y",
      (res) => {
        setDropdownMutations(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      },
    );

    setSelectedDocs([]);
    setShowDocs(false);
    dispatch(
      addApplicationType({
        ...reduxState,
        applicationType: value == "अनोंदणीकृत" ? "अनोंदणी कृत" : "नोंदणी कृत",
        isDastApplicable: value == "अनोंदणीकृत" ? "no" : "yes",
        mutationType: {},
      }),
    );
    sessionStorage.setItem("isDast", value == "अनोंदणीकृत" ? "no" : "yes");
  };
  const handleMutationType = (e) => {
    const code = e?.target?.value;
    const obj = dropdownMutations.find((v) => v.mutation_code == code);
    setSelectedMutation(obj);
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetDocumentTypeByMutation`,
      "POST",
      code,
      (res) => {
        if (res?.Code == "1") {
          setSelectedDocHeading(res?.ResponseData?.mutationTypeHDR);
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getDocListMutationtype`,
      "POST",
      {
        mut_type: code,
        mut_category: mutType,
      },
      (res) => {
        setSelectedDocs(JSON.parse(res?.ResponseData));
        console.info("data->", JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
    setShowDocs(true);

    dispatch(
      addApplicationType({
        ...reduxState,
        mutationType: {
          mutationTypeName: obj?.mutation_type,
          mutationTypeCode: obj?.mutation_code,
        },
      }),
    );
  };
  const handleIsMainPatra = (e) => {
    setIsPOA(e?.target?.value);
    dispatch(
      addApplicationType({
        ...reduxState,
        isMainPatra: e?.target?.value,
      }),
    );
    sessionStorage.setItem("isMainPatra", e?.target?.value);
  };
  const handleIsDast = (e) => {
    dispatch(
      addApplicationType({
        ...reduxState,
        isDastApplicable: e?.target?.value,
      }),
    );
  };
  const handleIsCourtDawa = (e) => {
    setIsCourt(e?.target?.value);
    dispatch(
      addApplicationType({
        ...reduxState,
        isCourtDawa: e?.target?.value,
      }),
    );
    sessionStorage.setItem("isCourtDawa", e?.target?.value);
  };

  const setInitialDistrict = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/allDistrictList`,
      "POST",
      null,
      (res) => {
        setDistrictArr(JSON.parse(res?.ResponseData));
        setLoading(false);
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  const setInitialApplicationType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/pdeApplicationTypeList`,
      "POST",
      null,
      (res) => {
        setApplicationArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };
  useEffect(() => {
    setInitialDistrict();
    setInitialApplicationType();
  }, []);

  return (
    <>
      <Toast />
      <Grid item md={12} mt={2}>
        <NotesPaper
          heading="अर्ज भरण्यासाठी आवश्यक सूचना"
          arr={createApplicationNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ mt: 4 }} className="papermain">
        <Grid container p={2} pt={1} spacing={2}>
          <Grid item md={12} xs={12}>
            <h4 className="heading">कार्यालय व अर्ज प्रकार</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
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
                        value={district?.district_name}
                        error={errors.district}
                        // displayEmpty
                        // renderValue={() =>
                        //   district?.district_name ||
                        //   // (loading ? (
                        //   (districtArr.length === 0 ? (
                        //     <CircularProgress size={20} />
                        //   ) : (
                        //     "Select an option"
                        //   ))
                        // }
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
                                {language?.lng == "mar"
                                  ? val?.district_name
                                  : val?.district_english_name}
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
              <Grid item md={3} xs={12}>
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
                        value={reduxState?.office?.office_name}
                        className="textfield"
                        error={errors.taluka}
                        {...field}
                        displayEmpty
                        // renderValue={() =>
                        //   office?.office_name ||
                        //   (officeArr.length === 0 ? (
                        //     <CircularProgress size={20} />
                        //   ) : (
                        //     "Select an option"
                        //   ))
                        // }
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
              <Grid item md={3} xs={12}>
                <Controller
                  name="applicationType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>अर्ज प्रकार </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={reduxState?.applicationType}
                        className="textfield"
                        error={errors.applicationType}
                        // displayEmpty
                        // renderValue={() =>
                        //   reduxState?.applicationType ||
                        //   // (loading ? (
                        //   (applicationArr.length === 0 ? (
                        //     <CircularProgress size={20} />
                        //   ) : (
                        //     "Select an option"
                        //   ))
                        // }
                        {...field}
                        onBlur={() => handleBlur("applicationType")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleApplicationType(e);
                        }}
                      >
                        {Array.isArray(applicationArr) &&
                          applicationArr.map((val, i) => {
                            return (
                              <MenuItem value={val?.application_type} key={i}>
                                {val?.application_type}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.applicationType &&
                          errors.applicationType.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Controller
                  name="ferfarType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>फेरफार प्रकार </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={reduxState?.mutationType?.mutationTypeName}
                        className="textfield"
                        error={errors.ferfarType}
                        {...field}
                        onBlur={() => handleBlur("ferfarType")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleMutationType(e);
                        }}
                      >
                        {console.info(
                          "dropdownMutations->>",
                          dropdownMutations,
                        )}
                        {Array.isArray(dropdownMutations) &&
                          // dropdownMutations.map((val, i) => (
                          dropdownMutations
                            .filter((val) =>
                              [
                                "01",
                                "03",
                                "06",
                                "04",
                                "09",
                                "05",
                                "07",
                                "10",
                                "20",
                                "18",
                                "23",
                                // "24",
                                // "02",
                                "31",
                                "30",
                                "08",
                                "21",
                              ].includes(val?.mutation_code),
                            )
                            .map((val, i) => (
                              <MenuItem value={val?.mutation_code} key={i}>
                                {val?.mutation_type}
                              </MenuItem>
                            ))}
                      </Select>

                      <FormHelperText sx={{ color: "red" }}>
                        {errors.ferfarType && errors.ferfarType.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Controller
                  name="isPOA"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>आपल्याकडे मुखत्यार पत्र आहे का ? </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={reduxState?.isMainPatra}
                        className="textfield"
                        error={errors.isPOA}
                        {...field}
                        onBlur={() => handleBlur("isPOA")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleIsMainPatra(e);
                        }}
                      >
                        <MenuItem value="yes">होय</MenuItem>
                        <MenuItem value="no">नाही</MenuItem>
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.isPOA && errors.isPOA.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Controller
                  name="isCourtDawa"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>कोर्टापुढे दावा चालू आहे का ? </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={reduxState?.isCourtDawa}
                        className="textfield"
                        error={errors.isCourtDawa}
                        {...field}
                        onBlur={() => handleBlur("isCourtDawa")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleIsCourtDawa(e);
                        }}
                      >
                        <MenuItem value="yes">होय</MenuItem>
                        <MenuItem value="no">नाही</MenuItem>
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.isCourtDawa && errors.isCourtDawa.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <InputLabel className="inputlabel">
                  <b>मूळ दस्त माहिती लागू होते का ? </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={reduxState?.isDastApplicable == "yes" ? "होय" : "नाही"}
                  className="textfieldDisabled"
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item md={12} mt={2}>
            <Paper
              sx={{   
                backgroundColor: "#DDECFF",
                borderRadius: "10px",
                px: 2,
              }}
            >
              <Grid container spacing={3} py={1}>
                <Grid item md={3}>
                  <FormLabel className="inputlabel">
                    <h4
                      style={{
                        padding: 0,
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 800,
                      }}
                    >
                      आपल्याकडे मुखत्यार पत्र आहे का ? <span>*</span>
                    </h4>
                  </FormLabel>

                  <RadioGroup
                    row
                    value={reduxState?.isMainPatra}
                    onChange={handleIsMainPatra}
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
                <Grid item md={3}>
                  <FormLabel className="inputlabel">
                    <h4
                      style={{
                        padding: 0,
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 800,
                      }}
                    >
                      कोर्टापुढे दावा चालू आहे काय ? <span>*</span>
                    </h4>
                  </FormLabel>
                  <RadioGroup
                    row
                    value={reduxState?.isCourtDawa}
                    onChange={handleIsCourtDawa}
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
                <Grid item md={4}>
                  <FormLabel>
                    <h4
                      style={{
                        padding: 0,
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 800,
                      }}
                    >
                      मूळ दस्त माहिती लागू होते का ?
                    </h4>
                  </FormLabel>
                  <RadioGroup
                    row
                    value={reduxState?.isDastApplicable}
                    onChange={handleIsDast}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="होय"
                      disabled={reduxState?.applicationType == "नोंदणी कृत"}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="नाही"
                      disabled={reduxState?.applicationType == "नोंदणी कृत"}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Paper>
          </Grid> */}

          {showDocs && (
            <Grid item md={12}>
              <Paper
                sx={{ backgroundColor: "#FFF3F3", p: 2, borderRadius: "10px" }}
              >
                <h3
                  style={{
                    display: "inline-flex",
                    color: "#F43A3A",
                    marginBottom: 0,
                  }}
                >
                  <DescriptionOutlinedIcon /> &nbsp; {selectedDocHeading}
                </h3>
                <div style={{ paddingRight: 2 }}>
                  {reduxState?.mutationType != "" && (
                    <ol>
                      {Array.isArray(selectedDocs) &&
                        selectedDocs.map((v, i) => {
                          return (
                            <li className="req-documents" key={i}>
                              {v?.document_name}
                            </li>
                          );
                        })}
                    </ol>
                  )}
                </div>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Grid
        container
        // justifyContent="flex-end"
        justifyContent="space-between"
        px={2}
        mt={2}
      >
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
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleNext}
            disabled={disableBtn}
          >
            पुढे जा
          </Button>
        </Grid>
      </Grid>
      {/* <Grid>
        <img src="/images/landscape.svg" width="100%" />
      </Grid> */}
    </>
  );
};

export default ApplicationTYpe;
