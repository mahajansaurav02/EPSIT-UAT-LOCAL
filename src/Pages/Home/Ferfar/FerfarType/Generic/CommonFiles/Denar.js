import { Button, Grid, Paper } from "@mui/material";
import TabaPavti from "../DiffFilesAccToMutation/TabaPavti";
import DenarMahiti from "./SupportPagesDenar/DenarMahiti";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Toast } from "../../../../../../ui/Toast";
import BojaKamiKarne from "../DiffFilesAccToMutation/BojaKamiKarne";

const Denar = ({ applicationData, setActiveStep }) => {
  return (
    <>
      {/* <Toast /> */}

      {applicationData?.mutation_type_code == "18" && <TabaPavti />}
      {applicationData?.mutation_type_code == "07" && <BojaKamiKarne />}

      <DenarMahiti applicationData={applicationData} />

      <Grid item textAlign="center" marginRight={2} marginTop={1}>
        <Button
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => setActiveStep(1)}
        >
          घेणाऱ्याची माहिती भरा
        </Button>
      </Grid>
    </>
  );
};

export default Denar;
