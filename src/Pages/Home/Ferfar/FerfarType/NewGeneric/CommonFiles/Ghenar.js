import { Button, Grid } from "@mui/material";
import GhenarMahiti from "./SupportPagesGhenar/GhenarMahiti";

const Ghenar = ({ applicationData, setActiveStep }) => {
  return (
    <>
      <GhenarMahiti applicationData={applicationData} setActiveStep={setActiveStep} />
    </>
  );
};

export default Ghenar;
