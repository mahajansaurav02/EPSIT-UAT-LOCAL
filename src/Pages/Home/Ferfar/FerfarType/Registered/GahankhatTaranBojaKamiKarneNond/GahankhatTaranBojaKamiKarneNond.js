import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import GahankhatTaranBojaKamiKarneDenara from "./SupportPages/GahankhattaranBojaKamiKarneDenara";

const steps = [
  "गहाणखत / तारण / बोजा देणारा (बँक/संस्था)",
  "गहाणखत / तारण / बोजा घेणारा (व्यक्ति)",
];

const GahankhatTaranBojaKamiKarneNond = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  return (
    <>
      <Grid item md={12}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} sx={{ px: "350px" }}>
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
                <GahankhatTaranBojaKamiKarneDenara
                  setActiveStep={setActiveStep}
                />
              )}
              {activeStep == 1 && (
                <h2>गहाणखत / तारण / बोजा घेणारा (व्यक्ति)</h2>
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default GahankhatTaranBojaKamiKarneNond;
