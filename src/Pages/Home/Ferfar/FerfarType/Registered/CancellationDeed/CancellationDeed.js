import React, { useState } from "react";
import KharediDenar from "./SupportPages/CancellationDeedDenar";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";

const steps = ["रद्दलेख देणार", ];
const CancellationDeed = ({ applicationData }) => {
  // const [activeStep, setActiveStep] = useState(0);

  // const handleStep = (step) => () => {
  //   setActiveStep(step);
  // };
  return (
    <>
      <Grid item md={12}>
        <Box sx={{ width: "100%" }}>
          <Stepper sx={{ px: "400px" }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color="inherit" >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div style={{ marginTop: 10 }}>
            <React.Fragment>
             
                <KharediDenar
                  // setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
              {/* {activeStep == 1 && (
                <KharediGhenar applicationData={applicationData} />
              )} */}
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </>
  );
};

export default CancellationDeed;
