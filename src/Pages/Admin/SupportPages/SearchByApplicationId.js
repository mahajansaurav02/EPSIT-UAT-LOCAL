import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import SecuredHeader from "../../../ui/SecuredHeader";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import URLS from "../../../URLs/url";
import ClearIcon from "@mui/icons-material/Clear";
import { searchByApplicationIdNotes } from "../../../NotesArray/NotesArray";

const SearchByApplicationId = () => {
  const { sendRequest } = AxiosInstance();
  const [applicationId, setApplicationId] = useState("");
  const [applicationData, setApplicationData] = useState({});
  const [showData, setShowData] = useState(false);

  const search = () => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetApplicationDataBySearch`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData[0]);
          successToast(res?.Message);
          setShowData(true);
          setApplicationId("");
        } else {
          errorToast(res?.Message);
          setShowData(false);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  return (
    <>
      <Toast />
      <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar>
      <Container sx={{ mt: 16 }}>
        <Paper
          elevation={5}
          sx={{ backgroundColor: "#EFEFEF", p: 1, borderRadius: 2 }}
        >
          <div style={{ paddingRight: 2, marginTop: 0 }}>
            <ol>
              {Array.isArray(searchByApplicationIdNotes) &&
                searchByApplicationIdNotes.map((v, i) => {
                  return <li key={i}>{v}</li>;
                })}
            </ol>
          </div>
        </Paper>
      </Container>
      <Container>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            {/* <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>Application Id</b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                size="small"
                value={applicationId}
                placeholder="Application Id"
                onChange={(e) => setApplicationId(e?.target?.value)}
              />
            </Grid> */}
            <Grid item md={6}>
              <InputLabel className="inputlabel">
                <b>Application Id</b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                size="small"
                value={applicationId}
                placeholder="Application Id"
                onChange={(e) => setApplicationId(e?.target?.value)}
                InputProps={{
                  endAdornment: applicationId && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setApplicationId("")}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item md={2}>
              <InputLabel>
                <b> &nbsp;</b>
              </InputLabel>
              <Button variant="contained" onClick={search}>
                Search
              </Button>
            </Grid>
          </Grid>
          {showData && (
            <Paper elevation={7} sx={{ p: 3, m: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <b>अर्ज क्रमांक :- </b>
                  {applicationData?.applicationId}
                </Grid>
                <Grid item md={4}>
                  <b>अर्जदाराचे नाव :- </b> {applicationData?.UserName}
                </Grid>
                <Grid item md={4}>
                  <b>मोबाईल नंबर :- </b> {applicationData?.mobileno}
                </Grid>
                <Grid item md={4}>
                  <b>जिल्हा :- </b> {applicationData?.district_name_in_marathi}
                </Grid>
                <Grid item md={4}>
                  <b>तालुका :- </b> {applicationData?.taluka_name}
                </Grid>
                <Grid item md={4}>
                  <b>फेरफार प्रकार :- </b> {applicationData?.mutationName}
                </Grid>
                <Grid item md={4}>
                  <b>तारीख :- </b> {applicationData?.Date}
                </Grid>
                <Grid item md={8}>
                  <b>Nic Status / Inward No.:- </b>
                  {applicationData?.inwardNo}
                </Grid>
              </Grid>
            </Paper>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default SearchByApplicationId;
