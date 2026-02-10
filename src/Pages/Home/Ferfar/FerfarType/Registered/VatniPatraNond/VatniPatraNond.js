import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import VatniPatraDenar from "./SupportPages/VatniPatraDenar";
import VatniPatraGhenar from "./SupportPages/VatniPatraGhenar";

const steps = ["वाटणीपत्र देणार", "वाटणीपत्र घेणार"];
const VatniPatraNond = ({ applicationData }) => {
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
                <VatniPatraDenar
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <VatniPatraGhenar applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default VatniPatraNond;
