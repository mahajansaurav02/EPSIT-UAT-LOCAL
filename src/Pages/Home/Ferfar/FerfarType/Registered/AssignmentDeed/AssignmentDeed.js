import React, { useState } from "react";
import AssignmentDeedDenar from "./SupportPages/AssignmentDeedDenar";
import AssignmentDeedGhenar from "./SupportPages/AssignmentDeedGhenar";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import { Assignment } from "@mui/icons-material";
import AssignmentDeedMahiti from "./SupportPages/AssignmentDeedMahiti";

const steps = ["असाइनमेंट डीड करून देणार ", "असाइनमेंट डीड करून घेणार","असाइनमेंट डीड माहिती"];
const AssignmentDeed = ({ applicationData }) => {
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
                <AssignmentDeedDenar
                  setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <AssignmentDeedGhenar     setActiveStep={setActiveStep} applicationData={applicationData} />
              
              )}
               {activeStep == 2 && (
                <AssignmentDeedMahiti     setActiveStep={setActiveStep} applicationData={applicationData} />
              
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default AssignmentDeed;
