import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import MryutuPatraDenar from "./SupportPages/MryutuPatraDenar";
import MryutuPatraGhenar from "./SupportPages/MryutuPatraGhenar";

const steps = [
  "मृत्यूपत्र / इच्छापत्र करून देणार",
  "मृत्यूपत्र / इच्छापत्र लाभार्थी ",
];
const MryutuPatraIcchaPatraNondUnRegistered = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  return (
    <>
      <Grid item md={12}>
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
                <MryutuPatraDenar
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <MryutuPatraGhenar applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default MryutuPatraIcchaPatraNondUnRegistered;
