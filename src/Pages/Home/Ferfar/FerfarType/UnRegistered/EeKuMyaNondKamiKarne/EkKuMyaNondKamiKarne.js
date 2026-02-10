import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import EeKuMya from "./SupportPages/EeKuMya";
import EeKuMyaDharakachiVarasNond from "./SupportPages/EeKuMyaDharakachiVarasNond";

const steps = ["एकत्र कुटुंब मॅनेजर (ए.कू.मॅ.)", "ए.कू.मॅ. सहधारकाची नोंद"];

const EeKuMyaNondkamiKarne = ({ applicationData }) => {
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
                <EeKuMya
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <EeKuMyaDharakachiVarasNond applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default EeKuMyaNondkamiKarne;
