import React, { useState } from "react";
import KharediDenar from "./SupportPages/CancellationDeedDenar";
import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";

<<<<<<< HEAD
const steps = ["रद्दलेख देणार", ];
const CancellationDeed = ({ applicationData }) => {
  // const [activeStep, setActiveStep] = useState(0);

  // const handleStep = (step) => () => {
  //   setActiveStep(step);
  // };
=======
const steps = ["रद्दलेख देणार",];
const CancellationDeed = ({ applicationData }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
>>>>>>> origin/main
  return (
    <>
      <Grid item md={12}>
        <Box sx={{ width: "100%" }}>
          <Stepper sx={{ px: "400px" }}>
            {steps.map((label, index) => (
              <Step key={label}>
<<<<<<< HEAD
                <StepButton color="inherit" >
=======
                <StepButton color="inherit" onClick={handleStep(index)}>
>>>>>>> origin/main
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div style={{ marginTop: 10 }}>
            <React.Fragment>
<<<<<<< HEAD
             
                <KharediDenar
                  // setActiveStep={setActiveStep}
                  nabhuDataArr={applicationData?.nabhDTL}
                  applicationData={applicationData}
                />
=======

              <KharediDenar
                setActiveStep={setActiveStep}
                nabhuDataArr={applicationData?.nabhDTL}
                applicationData={applicationData}
              />
>>>>>>> origin/main
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
