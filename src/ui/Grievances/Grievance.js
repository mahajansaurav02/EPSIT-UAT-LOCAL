import React, { useEffect, useState } from "react";
import { errorToast, successToast, Toast } from "../Toast";
import {
  AppBar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SecuredHeader from "../SecuredHeader";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AxiosInstance from "../../Instance/AxiosInstance";
import URLS from "../../URLs/url";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GrievanceDialogContent from "./GrievanceDialogContent";
import CloseIcon from "@mui/icons-material/Close";

const Grievance = () => {
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const [grievanceData, setGrievanceData] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState({});
  const [open, setOpen] = useState(false);

  const showGrievance = (val) => {
    setSelectedGrievance(val);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    // getGrievancetableData();
  };

  const goToHomePage = () => {
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  const handleDelete = (val) => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/DeleteGrievance`,
      "POST",
      val,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getGrievancetableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getGrievancetableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetGrievanceUserDashboard`,
      "POST",
      null,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setGrievanceData(res?.ResponseData);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    getGrievancetableData();
  }, []);
  return (
    <>
      <Toast />

      <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar>

      {/*------------------------------------Preview Dialog--------------------- */}
      <Dialog onClose={handleDialogClose} open={open} maxWidth="md">
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 4,
              top: 4,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <GrievanceDialogContent val={selectedGrievance} />
        </DialogContent>
      </Dialog>

      <Paper elevation={5} sx={{ p: 5, m: 3, mt: 16 }}>
        <Grid container>
          <Grid item md={12} mt={2}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/grievances/grievances_form")}
                >
                  नवीन तक्रार
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} mt={2}>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>तक्रार क्रमांक</TableCell>
                    <TableCell>अर्ज क्रमांक</TableCell>
                    <TableCell>जिल्हा / तालुका</TableCell>
                    <TableCell>तक्रार प्रकार</TableCell>
                    <TableCell>प्राथमिक नं./ दुय्यम नं.</TableCell>
                    <TableCell>फेरफार प्रकार</TableCell>
                    <TableCell>अर्जाची सद्यस्थिती</TableCell>
                    <TableCell>तक्रार बघा</TableCell>
                    <TableCell>कृती करा</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Array.isArray(grievanceData) &&
                    grievanceData.map((val, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{val?.tickitId}</TableCell>
                          <TableCell>
                            {val?.applicationId == "NA"
                              ? "-"
                              : val?.applicationId}
                          </TableCell>
                          <TableCell>
                            {val?.district_name_in_marathi} / {val?.taluka_name}
                          </TableCell>
                          <TableCell>
                            {val?.issueCategory == "other"
                              ? "इतर"
                              : "अर्जाबाबत तक्रार"}
                          </TableCell>
                          <TableCell>
                            {val?.mobileno} /{" "}
                            {val?.secondaryMoNo ? val?.secondaryMoNo : "-"}
                          </TableCell>
                          <TableCell>{val?.mutationName}</TableCell>
                          <TableCell>
                            <Chip
                              // label={val?.grivanceStatus}
                              label={
                                val?.grivanceStatusCode === 5
                                  ? "Closed"
                                  : val?.grivanceStatusCode === 1
                                  ? "Open"
                                  : "In-Process"
                              }
                              color={
                                val?.grivanceStatusCode === 5
                                  ? "success"
                                  : val?.grivanceStatusCode === 1
                                  ? "error"
                                  : "warning"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              sx={{ textWrap: "nowrap" }}
                              onClick={() => showGrievance(val)}
                            >
                              बघा
                            </Button>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(val?.tickitId)}
                              disabled={val?.grivanceStatusCode !== 1}
                            >
                              <DeleteForeverOutlinedIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid container mt={1}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={goToHomePage}
            >
              होम पेज ला जा
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Grievance;
