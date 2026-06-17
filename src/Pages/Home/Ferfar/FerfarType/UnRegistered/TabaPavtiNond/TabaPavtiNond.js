import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import TabaPavtiDenar from "./SupportPages/TabaPavtiDenar";
import TabaPavtiGhenar from "./SupportPages/TabaPavtiGhenar";
import TabaPavtiMahiti from "./SupportPages/TabaPavtiMahiti";
import SattaPrakarMahiti from "./SupportPages/SattaPrakarMahiti";

const steps = [
  "ताबा पावती देणार",
  "ताबा पावती घेणार",
  "ताबा पावती माहिती",
  "सत्ताप्रकार माहिती",
];

const TabaPavtiNond = () => {
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
            <React.Fragment>
              {activeStep == 0 && (
                <TabaPavtiDenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 1 && (
                <TabaPavtiGhenar setActiveStep={setActiveStep} />
              )}
              {activeStep == 2 && (
                <TabaPavtiMahiti setActiveStep={setActiveStep} />
              )}
              {activeStep == 3 && <SattaPrakarMahiti />}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default TabaPavtiNond;
