import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import Denar from "./CommonFiles/Denar";
import Ghenar from "./CommonFiles/Ghenar";
import Pairing from "./CommonFiles/Pairing";

const GenericMutation = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const steps = ["देणार", "घेणार", "देणार-घेणार"];
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
                <Denar
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <Ghenar
                  applicationData={applicationData}
                  setActiveStep={setActiveStep}
                />
              )}
              {activeStep == 2 && (
                <Pairing
                  applicationData={applicationData}
                  setActiveStep={setActiveStep}
                />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default GenericMutation;
