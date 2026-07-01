import { Grid, Paper } from "@mui/material";

const ShowFilledDenarDetails = ({ data }) => {
  console.log("data in show filled denar details", data);
  return (
    <Paper elevation={5} sx={{ p: 2, pt: 1 }}>
      <Grid item md={12}>
        <h4>भरलेली माहिती (Show)</h4>
        <Grid container spacing={2}></Grid>
        <Grid item md={3}>
          <b>नाव</b>
        </Grid>
        <Grid item md={9}>
          {data?.owner_name}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ShowFilledDenarDetails;
