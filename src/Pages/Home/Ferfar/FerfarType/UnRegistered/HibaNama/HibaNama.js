import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import HibaNamaDenar from "./SupportPages/HibaNamaDenar";
import HibaNamaGhenar from "./SupportPages/HibaNamaGhenar";
import HibaNamaEvidance from "./SupportPages/HibaNamaEvidance";
import WaqfBoardTransfer from "./SupportPages/WaqfBoardTransfer";

// const steps = [
//   "हिबानामा देणार",
//   "हिबानामा घेणार",
//   "वक्फ बोर्डाची हस्तांतरणाची परवानगी",
//   "हिबानामा साक्षीदार माहिती",
// ];
const steps = ["हिबानामा देणार", "हिबानामा घेणार", "हिबानामा साक्षीदार माहिती"];

const HibaNama = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  return (
    <>
      <Grid item md={12}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} sx={{ px: "200px" }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div style={{ marginTop: 10 }}>
            {/* <React.Fragment>
              {activeStep == 0 && (
                <HibaNamaDenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 1 && (
                <HibaNamaGhenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 2 && (
                <WaqfBoardTransfer setActiveStep={setActiveStep} />
              )}
              {activeStep == 3 && <HibaNamaEvidance />}
            </React.Fragment> */}
            <React.Fragment>
              {activeStep == 0 && (
                <HibaNamaDenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 1 && (
                <HibaNamaGhenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 2 && (
                <WaqfBoardTransfer setActiveStep={setActiveStep} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default HibaNama;
