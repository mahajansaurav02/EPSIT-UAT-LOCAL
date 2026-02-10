import { Button, Grid, InputLabel, Paper, TextField } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";

const DeedmedConveyence = () => {
  return (
    <>
      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">Deedmed Conveyence</h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <InputLabel className="inputlabel">
                  <b>
                    Name Of Competent Authority who issueed the document on
                    behalf of the land holder.
                  </b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  //   value={hibanamaDetails?.permissionNo}
                  //   name="permissionNo"
                  //   onChange={(e) => {
                  //     handleHibanamaDetails(e);
                  //   }}
                  size="small"
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>Order Number</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  //   value={hibanamaDetails?.permissionNo}
                  //   name="permissionNo"
                  //   onChange={(e) => {
                  //     handleHibanamaDetails(e);
                  //   }}
                  size="small"
                />
              </Grid>
              <Grid item md={2}>
                <InputLabel className="inputlabel">
                  <b>Order Date</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  type="date"
                  //   value={hibanamaDetails?.permissionNo}
                  //   name="permissionNo"
                  //   onChange={(e) => {
                  //     handleHibanamaDetails(e);
                  //   }}
                  size="small"
                />
              </Grid>
              <Grid item md={12}>
                <InputLabel className="inputlabel">
                  <b>Deedmed Conveyance Remark</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  multiline
                  rows={3}
                  //   value={hibanamaDetails?.permissionNo}
                  //   name="permissionNo"
                  //   onChange={(e) => {
                  //     handleHibanamaDetails(e);
                  //   }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="end" px={2} mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<RotateRightRoundedIcon />}
                sx={{ mr: 2 }}
                // onClick={handleReset}
              >
                रीसेट करा
              </Button>
              <Button
                variant="contained"
                endIcon={<SaveRoundedIcon />}
                // onClick={handleSave}
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default DeedmedConveyence;
