import React, { useState } from "react";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import GahankhatTaranBojaGhenara from "./SupportPages/GahanKhatTaranBojaGhenara";
import GahankhatTaranBojaDenara from "./SupportPages/GahanKhatTaranBojaDenara";

const GahankhatTaranBojaDakhalNond = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps =
    applicationData.mutation_type_code == "06"
      ? ["गहाणखत / तारण / बोजा घेणारा", "गहाणखत / तारण / बोजा देणारा"]
      : ["गहाणखत / तारण / बोजा धारकाचे नाव", "बँक / संस्था"];

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
                <GahankhatTaranBojaGhenara
                  setActiveStep={setActiveStep}
                  applicationData={applicationData}
                />
              )}
              {activeStep == 1 && (
                <GahankhatTaranBojaDenara applicationData={applicationData} />
              )}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default GahankhatTaranBojaDakhalNond;
