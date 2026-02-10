import { Grid, InputLabel, Paper, TextField } from "@mui/material";

const ShowAddress = ({ address }) => {
  return (
    <Paper elevation={5} sx={{ p: 2, pt: 1 }}>
      <Grid item md={12}>
        <h4 className="heading">अर्जदारचा पत्ता</h4>
      </Grid>
      <Grid item md={12}>
        {address?.address_type == "INDIA" ? (
          <Grid container spacing={2}>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>सदनिका / घर /प्लॉट नं.</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.flatno_plotno}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>इमारत / सोसायटी क्रमांक किंवा नाव</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.societyname}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>मुख्य रस्ता</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.mainstreet}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>महत्त्वाची खूण</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.landmark}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>परिसर / गावाचे नाव / वाडी</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.locality}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>पिन कोड</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.pincode}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>पोस्टऑफिस नाव</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.postofficename}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>तालुका</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.taluka}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>जिल्हा</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.district}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>राज्य</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.state}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>मोबाईल</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.mobileno}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>ई मेल</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.emailid}
                size="small"
                disabled
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InputLabel className="inputlabel">
                <b>पत्ता</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                multiline
                rows={3}
                value={address?.address}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>मोबाईल</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.mobileno}
                size="small"
                disabled
              />
            </Grid>
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>ई मेल</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={address?.emailid}
                size="small"
                disabled
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ShowAddress;
