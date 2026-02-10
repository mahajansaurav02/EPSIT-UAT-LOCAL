import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import BhadePattaDenar from "./SupportPages/BhadePattaDenar";
import BhadePattaGhenar from "./SupportPages/BhadePattaGhenar";
import BhadePattaMahiti from "./SupportPages/BhadePattaMahiti";

const steps = ["भाडेपट्टा देणार", "भाडेपट्टा घेणार", "भाडेपट्टा माहिती"];

const BhadePattaNond = ({ applicationData }) => {
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
                <BhadePattaDenar
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <BhadePattaGhenar
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 2 && <BhadePattaMahiti />}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default BhadePattaNond;
