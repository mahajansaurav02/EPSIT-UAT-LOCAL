import {
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepButton,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useNavigate } from "react-router-dom";
// import MukhytarDenar from "./SupportPages/MukhytarDenar";
import MukhytarGhenar from "./SupportPages/MukhytarGhenar";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { errorToast } from "../../../ui/Toast";
import URLS from "../../../URLs/url";

const steps = ["मुखत्यारपत्र देणार", "मुखत्यारपत्र घेणार"];

const MainPatra = () => {
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [applicationData, setApplicationData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [disableNextBtn, setDisableShowNextBtn] = useState(true);

  const isCourtDawa = sessionStorage.getItem("isCourtDawa");

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (isCourtDawa == "yes") {
      navigate("/home/court-dawa");
    } else {
      navigate("/home/documents");
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

  const setAppDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    setAppDataApi();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
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
                  {Array.isArray(applicationData?.nabhDTL) &&
                    applicationData?.nabhDTL.map((val, i) => {
                      return (
                        <b key={i}>
                          {" "}
                          {i === applicationData?.nabhDTL.length - 1
                            ? val?.naBhu
                            : `${val?.naBhu}, `}
                        </b>
                      );
                    })}
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* <Grid item md={12}>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} sx={{ px: "400px" }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div style={{ marginTop: 10 }}>
              <React.Fragment>
                {activeStep == 0 && (
                  <MukhytarDenar
                    setActiveStep={setActiveStep}
                    nabhuDataArr={applicationData?.nabhDTL}
                    villageCode={applicationData?.village_code}
                    mutCode={applicationData?.mutation_type_code}
                    villageName={applicationData?.village_name}
                  />
                )}
                {activeStep == 1 && (
                  <MukhytarGhenar
                    mutCode={applicationData?.mutation_type_code}
                  />
                )}
              </React.Fragment>
            </div>
          </Box>
        </Grid> */}
        <Grid item md={12}>
          <Box sx={{ width: "100%" }}>
            <MukhytarGhenar
              mutCode={applicationData?.mutation_type_code}
              setDisableShowNextBtn={setDisableShowNextBtn}
            />
          </Box>
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
              onClick={() => navigate("/home/ferfar")}
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
                title="कृपया मुखत्यारपत्र माहिती भरा"
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

export default MainPatra;
