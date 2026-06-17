import React, { useState } from "react";
import styles from "../../../ferfar.module.css";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MayatDharak from "./SupportPages/MayatDharak";
import MrutyuDakhla from "./SupportPages/MrutyuDakhla";
import Varas from "./SupportPages/Varas";

const steps = ["मयत धारक माहिती", "मृत्यू दाखला माहिती", "वारस माहिती"];
const VarasNond = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  return (
    <>
      <Grid item md={12}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} sx={{ px: "300px" }}>
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
                <MayatDharak
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <MrutyuDakhla
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 2 && <Varas applicationData={applicationData} />}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
      {/* {activeStep == 0 && (
        <Grid item md={12}>
          <TableContainer component={Paper} elevation={5}>
            <h3 style={{ marginLeft: 20 }}>मयत धारक माहिती तक्ता</h3>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell>अर्जामध्ये न.भू.क्र.</TableCell>
                  <TableCell>LR-Property UID</TableCell>
                  <TableCell>फेरफरसाठी मिळकत</TableCell>
                  <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                  <TableCell>मयत धारकाचे नाव</TableCell>
                  <TableCell>उर्फ नाव</TableCell>
                  <TableCell>नावे क्षेत्र (चौ.मी.)</TableCell>
                  <TableCell>मयत धारकाचा पत्ता</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>हवेली</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>47846587451</TableCell>
                  <TableCell>जमीन (NA प्लॉट)</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>नानासाहेब विठ्ठल शिंदे</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>
                    <Button variant="outlined">पत्ता पहा</Button>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditNoteOutlinedIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )} */}
      {/* {activeStep == 1 && (
        <Grid item md={12}>
          <TableContainer component={Paper} elevation={5}>
            <h3 style={{ marginLeft: 20 }}>मृत्यू दाखला माहिती तक्ता</h3>
            <Table className={styles.table}>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>मयत धारक</TableCell>
                  <TableCell>मृत्यू दिनांक</TableCell>
                  <TableCell>मृत्यू दाखला देणारे</TableCell>
                  <TableCell>मृत्यू दाखला क्रमांक</TableCell>
                  <TableCell>मृत्यू दाखला दिनांक</TableCell>
                  <TableCell>मृत्यू दाखला</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>नानासाहेब विठ्ठल शिंदे</TableCell>
                  <TableCell>20/04/2022</TableCell>
                  <TableCell>राजू दिघे</TableCell>
                  <TableCell>12456</TableCell>
                  <TableCell>20/04/2022</TableCell>
                  <TableCell>मृत्यू दाखला.pdf</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditNoteOutlinedIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )} */}
      {/* {activeStep == 2 && (
        <Grid item md={12}>
          <TableContainer component={Paper} elevation={5}>
            <h3 style={{ marginLeft: 20 }}>वारस माहिती तक्ता</h3>
            <Table className={styles.table}>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell rowSpan={2}>अ. क्र.</TableCell>
                  <TableCell rowSpan={2}>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell rowSpan={2}>वारस प्रकार</TableCell>
                  <TableCell colSpan={3}>वारसाचे नाव</TableCell>
                  <TableCell rowSpan={2}>उर्फ नाव</TableCell>
                  <TableCell rowSpan={2}>धारक प्रकार</TableCell>
                  <TableCell rowSpan={2}>धारकाशी नाते</TableCell>
                  <TableCell rowSpan={2}>स्त्री /पुरुष</TableCell>
                  <TableCell rowSpan={2}>अ.पा.क/ ए.कू.मॅ.</TableCell>
                  <TableCell rowSpan={2}>जन्म दिनांक</TableCell>
                  <TableCell rowSpan={2}>अ.पा.क</TableCell>
                  <TableCell rowSpan={2}>खरेदी क्षेत्र (चौ.मी.)</TableCell>
                  <TableCell rowSpan={2}>वारसाचा पत्ता</TableCell>
                  <TableCell rowSpan={2}>कृती करा</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>पहिले नाव</TableCell>
                  <TableCell>मधले नाव</TableCell>
                  <TableCell>आडनाव</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>हवेली</TableCell>
                  <TableCell>व्यक्ति</TableCell>
                  <TableCell>तुषार</TableCell>
                  <TableCell>नानासाहेब</TableCell>
                  <TableCell>शिंदे</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>Single Holder</TableCell>
                  <TableCell>मुलगा</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>23/05/2022</TableCell>
                  <TableCell>11/01/1887</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>
                    <Button variant="outlined">पत्ता पहा</Button>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditNoteOutlinedIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )} */}
    </>
  );
};

export default VarasNond;
