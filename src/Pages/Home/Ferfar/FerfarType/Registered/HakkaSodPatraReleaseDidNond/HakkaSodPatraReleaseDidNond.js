import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import HakkaSodDenar from "./SupportPages/HakkaSodDenar";
import HakkaSodGhenar from "./SupportPages/HakkaSodGhenar";

const steps = ["हक्कसोड देणार", "हक्कसोड घेणार"];

const HakkaSodPatraReleaseDidNond = ({ applicationData }) => {
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
                <HakkaSodDenar
                  setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <HakkaSodGhenar applicationData={applicationData} />
              )}
              {/* {activeStep == 2 && <Mobadla />} */}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default HakkaSodPatraReleaseDidNond;
