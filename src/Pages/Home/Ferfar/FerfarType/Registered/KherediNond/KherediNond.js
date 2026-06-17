import React, { useState } from "react";
import KharediDenar from "./SupportPages/KharadiDenar";
import KharediGhenar from "./SupportPages/kharediGhenar";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";

const steps = ["खरेदी देणार", "खरेदी घेणार"];
const KherediNond = ({ applicationData }) => {
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
                <KharediDenar
                  setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <KharediGhenar applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default KherediNond;
