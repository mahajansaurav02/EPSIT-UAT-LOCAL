import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import BakshishPatraDenar from "./SupportPages/BakshishPatraDenar";
import BakshishPatraGhenar from "./SupportPages/BakshishPatraGhenar";

const steps = ["बक्षीसपत्र देणार", "बक्षीसपत्र घेणार"];

const BakshishPatraNond = ({ applicationData }) => {
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
                <BakshishPatraDenar
                  setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <BakshishPatraGhenar applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default BakshishPatraNond;
