import { Button, Grid } from "@mui/material";
import GhenarMahiti from "./SupportPagesGhenar/GhenarMahiti";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const Ghenar = ({ applicationData, setActiveStep, setGhenarCompleted }) => {
  return (
    <>
      <GhenarMahiti applicationData={applicationData} setGhenarCompleted={setGhenarCompleted} />

      <Grid item textAlign="center" marginRight={2} marginTop={1}>
        <Button
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => setActiveStep(2)}
        >
          देणार-घेणार
        </Button>
      </Grid>
    </>
  );
};

export default Ghenar;
