import { Button, Grid, Paper } from "@mui/material";
import TabaPavti from "../DiffFilesAccToMutation/TabaPavti";
import DenarMahiti from "./SupportPagesDenar/DenarMahiti";

const Denar = ({ applicationData, setActiveStep, obj }) => {
  return (
    <>
      <DenarMahiti applicationData={applicationData} obj={obj} setActiveStep={setActiveStep} />
    </>
  );
};

export default Denar;
