import React, { useEffect, useState } from "react";
import URLS from "../../../URLs/url";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import AxiosInstance from "../../../Instance/AxiosInstance";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  createTheme,
  CssBaseline,
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
  ThemeProvider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AdminDialogContent from "./AdminDialogContent";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import Counter from "../../../ui/Counter/Counter";

const AdminTable = () => {
  const { sendRequest } = AxiosInstance();
  const navigate = useNavigate();

  const [grievanceData, setGrievanceData] = useState([]);
  const [originalGrievanceData, setOriginalGrievanceData] = useState([]);
  const [grievanceCounts, setGrievanceCounts] = useState({
    error: 0,
    warning: 0,
    success: 0,
    resolved: 0,
  });
  const [selectedGrievance, setSelectedGrievance] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const showGrievance = (val) => {
    setSelectedGrievance(val);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    getGrievanceDashboardData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //----------------------------------Mui Datatables---------------------------
  const theme = createTheme();
  const columns = [
    {
      name: "name",
      label: "अ. क्र.",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "company",
      label: "तक्रार क्रमांक",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "city",
      label: "जिल्हा / तालुका",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "state",
      label: "फेरफार प्रकार",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "state",
      label: "प्राथमिक नं./ दुय्यम नं.",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "state",
      label: "अर्ज क्रमांक",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "state",
      label: "स्थिति",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "state",
      label: "issue assigned to",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
    { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
    { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
    {
      name: "James Houston",
      company: "Test Corp",
      city: "Dallas",
      state: "TX",
    },
  ];

  // const options = {
  //   filterType: "checkbox",
  // };
  //----------------------------------Mui Datatables---------------------------

  const handleClickOnGrid = (type) => {
    setIsDataLoading(true);
    let data;

    if (type == "warning") {
      data = originalGrievanceData.filter((val) => {
        return [2, 6, 7].includes(val?.grivanceStatusCode);
      });
    } else if (type == "error") {
      data = originalGrievanceData.filter((val) => {
        return val?.grivanceStatusCode === 1;
      });
    } else if (type == "resolved") {
      data = originalGrievanceData.filter((val) => {
        return val?.grivanceStatusCode === 4;
      });
    } else {
      data = originalGrievanceData.filter(
        (val) => ![1, 2, 4, 6, 7].includes(val?.grivanceStatusCode)
      );
    }
    setGrievanceData(data);
    setIsDataLoading(false);
  };

  const getGrievanceDashboardData = () => {
    setIsDataLoading(true);
    setGrievanceData([]);
    setOriginalGrievanceData([]);
    setGrievanceCounts({
      error: 0,
      warning: 0,
      success: 0,
      resolved: 0,
    });
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetGrievanceDashboardForDept`,
      "POST",
      null,
      (res) => {
        setGrievanceData(res?.ResponseData);
        setOriginalGrievanceData(res?.ResponseData);
        const counts = { error: 0, warning: 0, success: 0, resolved: 0 };
        res?.ResponseData?.forEach((val) => {
          const code = val?.grivanceStatusCode;
          if (code === 1) {
            counts.error += 1;
          } else if ([2, 6, 7].includes(code)) {
            counts.warning += 1;
          } else if (code === 5) {
            counts.success += 1;
          } else {
            counts.resolved += 1;
          }
        });

        setGrievanceCounts(counts);
        setIsDataLoading(false);
      },
      (err) => {
        errorToast(err?.Message);
        setIsDataLoading(false);
      }
    );
  };
  useEffect(() => {
    getGrievanceDashboardData();
  }, []);

  return (
    <>
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
          <AdminDialogContent
            val={selectedGrievance}
            handleDialogClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      <Grid container>
        <Grid item md={12} mb={2}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Grid container spacing={2}>
                <Grid
                  item
                  onClick={() => setGrievanceData(originalGrievanceData)}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={originalGrievanceData?.length}
                    backgroundCol="linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)"
                    text="Total Grievances"
                  />
                </Grid>
                <Grid
                  item
                  onClick={() => handleClickOnGrid("success")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.success}
                    backgroundCol="linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)"
                    text="Close"
                  />
                </Grid>
                <Grid
                  item
                  onClick={() => handleClickOnGrid("resolved")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.resolved}
                    backgroundCol="linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)"
                    text="Resolved By NIC/VIPL"
                  />
                </Grid>
                <Grid
                  item
                  onClick={() => handleClickOnGrid("error")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.error}
                    backgroundCol="linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)"
                    text="Open"
                  />
                </Grid>
                <Grid
                  item
                  onClick={() => handleClickOnGrid("warning")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.warning}
                    backgroundCol="linear-gradient(135deg, #FAD961 10%, #F76B1C 100%)"
                    text="Assigned/InProgress"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate("/admin_login/grievance-compliance/dashboard")
                    }
                  >
                    Dashboard
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(
                        "/admin_login/grievance-compliance/search-by-app-id"
                      )
                    }
                  >
                    अर्ज क्रमांकाने शोधा
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>तक्रार क्रमांक</TableCell>
                <TableCell>जिल्हा / तालुका</TableCell>
                <TableCell>तक्रार प्रकार</TableCell>
                <TableCell>फेरफार प्रकार</TableCell>
                <TableCell>प्राथमिक नं./ दुय्यम नं.</TableCell>
                <TableCell>तक्रार तारीख</TableCell>
                <TableCell>अर्ज क्रमांक</TableCell>
                <TableCell>स्थिति</TableCell>
                <TableCell>Issue Status Message</TableCell>
                <TableCell> तक्रार बघा</TableCell>
              </TableRow>
            </TableHead>

            {isDataLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {Array.isArray(grievanceData) &&
                  grievanceData.map((val, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{val?.tickitId}</TableCell>
                      <TableCell>
                        {val?.district_name_in_marathi} / {val?.taluka_name}
                      </TableCell>
                      <TableCell>
                        {val?.issueCategory === "other"
                          ? "इतर"
                          : "अर्जाबाबत तक्रार"}
                      </TableCell>
                      <TableCell>{val?.mutationName}</TableCell>
                      <TableCell>
                        {val?.mobileno} /{" "}
                        {val?.secondaryMoNo ? val?.secondaryMoNo : "-"}
                      </TableCell>
                      <TableCell>{formatDate(val?.issueReportDate)}</TableCell>
                      <TableCell>
                        {val?.applicationId === "NA" ? "-" : val?.applicationId}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={val?.grivanceStatus}
                          color={
                            val?.grivanceStatusCode === 1
                              ? "error"
                              : [2, 6, 7].includes(val?.grivanceStatusCode)
                              ? "warning"
                              : "success"
                          }
                          // variant="outlined"
                        />
                        {/* {val?.seenby != null && (
                        <div>{`Seen by ${val?.seenby}`}</div>
                      )} */}
                      </TableCell>
                      <TableCell>
                        {val?.grivanceStatusCode == 1 ? (
                          <span>-</span>
                        ) : (
                          // <span>
                          //   <b>
                          //     {val?.seenby == null
                          //       ? `Assigned to ${val?.AssignIssueTo}`
                          //       : `Seen by ${val?.seenby}`}
                          //   </b>
                          // </span>
                          <Chip
                            label={
                              val?.seenby == null
                                ? `Assigned to ${val?.AssignIssueTo}`
                                : `Seen by ${val?.seenby}`
                            }
                            color={val?.seenby == null ? "info" : "secondary"}
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => showGrievance(val)}
                        >
                          तक्रार बघा
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>

      {/*----------------------------mui datatables trial---------------------------------- */}
      {/* <ThemeProvider theme={theme}>
        <CssBaseline />
        <MUIDataTable
          title={"Employee List"}
          data={data}
          columns={columns}
          // options={options}
        />
      </ThemeProvider> */}
    </>
  );
};

export default AdminTable;
