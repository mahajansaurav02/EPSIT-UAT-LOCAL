import { Button, Grid, InputLabel, Paper, TextField } from "@mui/material";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import { useState } from "react";

const BojaKamiKarne = () => {
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState("");
  return (
    <>
      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">
              गहाण खतानुसार तारण परत/ बोजा कमी करणे नोंद
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={2}>
                <InputLabel className="inputlabel">
                  <b>Search By Entry Date</b>
                </InputLabel>
                <TextField
                  fullWidth
                  type="date"
                  className="textfield"
                  value={selectedDate}
                  onFocus={(event) => {
                    event.target.showPicker();
                  }}
                  inputProps={{
                    max: today,
                    min: "1900-01-01",
                  }}
                  onChange={(e) => setSelectedDate(e?.target?.value)}
                  size="small"
                />
              </Grid>
              <Grid item md={2}>
                <InputLabel className="inputlabel">&nbsp;</InputLabel>
                <Button>Search Entry</Button>
              </Grid>
            </Grid>
          </Grid>

          
        </Grid>
      </Paper>
    </>
  );
};

export default BojaKamiKarne;
