import React, { useEffect, useState } from "react";
import URLS from "../../../URLs/url";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import AxiosInstance from "../../../Instance/AxiosInstance";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  createTheme,
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
import UserDialogContent from "./UserDialogContent";
import { useNavigate } from "react-router-dom";
import Counter from "../../../ui/Counter/Counter";
import MUIDataTable from "mui-datatables";

const UserTable = () => {
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const [grievanceData, setGrievanceData] = useState([]);
  const [originalGrievanceData, setOriginalGrievanceData] = useState([]);
  const [grievanceCounts, setGrievanceCounts] = useState({
    error: 0,
    warning: 0,
    success: 0,
  });
  const [selectedGrievance, setSelectedGrievance] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [open, setOpen] = useState(false);

  //----------------------------------Mui Datatables---------------------------
  const theme = createTheme();
  const columns = [
    {
      name: "serial",
      label: "अ. क्र.",
      options: { filter: false, sort: false },
    },
    {
      name: "tickitId",
      label: "तक्रार क्रमांक",
      options: { filter: true, sort: true },
    },
    {
      name: "location",
      label: "जिल्हा / तालुका",
      options: { filter: true, sort: true },
    },
    {
      name: "issueCategory",
      label: "तक्रार प्रकार",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          value === "other" ? "इतर" : "अर्जाबाबत तक्रार",
      },
    },
    {
      name: "mutationName",
      label: "फेरफार प्रकार",
      options: { filter: true, sort: true },
    },
    {
      name: "mobileCombined",
      label: "प्राथमिक नं./ दुय्यम नं.",
      options: { filter: false, sort: false },
    },
    {
      name: "applicationId",
      label: "अर्ज क्रमांक",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (value === "NA" ? "-" : value),
      },
    },
    {
      name: "grivanceStatus",
      label: "स्थिति",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const val = grievanceData[dataIndex];
          const color =
            val?.grivanceStatusCode === 1
              ? "error"
              : [2, 6, 7].includes(val?.grivanceStatusCode)
              ? "warning"
              : "success";
          return <Chip label={val?.grivanceStatus} color={color} />;
        },
      },
    },
    {
      name: "AssignIssueTo",
      label: "पुन्हा नियुक्ती",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const val = grievanceData[dataIndex];
          return [4, 5, 7].includes(val?.grivanceStatusCode) ? (
            <Chip label={val?.AssignIssueTo} color="info" variant="outlined" />
          ) : (
            "-"
          );
        },
      },
    },
    {
      name: "action",
      label: "तक्रार बघा",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const val = grievanceData[dataIndex];
          return (
            <Button variant="outlined" onClick={() => showGrievance(val)}>
              तक्रार बघा
            </Button>
          );
        },
      },
    },
  ];

  const data = grievanceData.map((val, i) => ({
    serial: i + 1,
    tickitId: val?.tickitId,
    location: `${val?.district_name_in_marathi} / ${val?.taluka_name}`,
    issueCategory: val?.issueCategory,
    mutationName: val?.mutationName,
    mobileCombined: `${val?.mobileno} / ${val?.secondaryMoNo || "-"}`,
    applicationId: val?.applicationId,
    grivanceStatus: val?.grivanceStatus,
    AssignIssueTo: val?.AssignIssueTo,
    action: "", // placeholder, handled by customBodyRenderLite
  }));

  const options = {
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    responsive: "standard",
    download: false,
    print: false,
    search: true,
    filter: true,
    textLabels: {
      body: {
        noMatch: isDataLoading ? <CircularProgress /> : "डेटा उपलब्ध नाही.",
      },
    },
  };
  //----------------------------------Mui Datatables---------------------------

  const showGrievance = (val) => {
    setSelectedGrievance(val);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    getGrievanceDashboardData();
  };

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
    } else {
      data = originalGrievanceData.filter(
        (val) => ![1, 2, 6, 7].includes(val?.grivanceStatusCode)
      );
    }
    // setTimeout(() => {
    //   setGrievanceData(data);
    //   setIsDataLoading(false);
    // }, 500);
    setGrievanceData(data);
    setIsDataLoading(false);
  };

  const getPendingDays = (issueReportDate) => {
    const today = new Date();
    const issueDate = new Date(issueReportDate);
    const timeDiff = today - issueDate;
    const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const getGrievanceDashboardData = () => {
    setIsDataLoading(true);
    setGrievanceData([]);
    setOriginalGrievanceData([]);
    setGrievanceCounts({
      error: 0,
      warning: 0,
      success: 0,
    });
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetGrievanceDashboardForDept`,
      "POST",
      null,
      (res) => {
        setGrievanceData(res?.ResponseData);
        setOriginalGrievanceData(res?.ResponseData);
        const counts = { error: 0, warning: 0, success: 0 };
        res?.ResponseData?.forEach((val) => {
          const code = val?.grivanceStatusCode;
          if (code === 1) {
            counts.error += 1;
          } else if ([2, 6, 7].includes(code)) {
            counts.warning += 1;
          } else {
            counts.success += 1;
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
  // const getGrievanceDashboardData = () => {
  //   setIsDataLoading(true);
  //   sendRequest(
  //     `${URLS?.BaseURL}/GrievanceSystem/GetGrievanceDashboardForDept`,
  //     "POST",
  //     null,
  //     (res) => {
  //       setGrievanceData(res?.ResponseData);
  //       setIsDataLoading(false);
  //     },
  //     (err) => {
  //       errorToast(err?.Message);
  //       setIsDataLoading(false);
  //     }
  //   );
  // };

  useEffect(() => {
    getGrievanceDashboardData();
  }, []);

  return (
    <>
      {/* <Toast /> */}
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
          <UserDialogContent
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
                    text="Close/Resolved"
                  />
                </Grid>
                {/* <Grid
                  item
                  onClick={() => handleClickOnGrid("error")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.error}
                    backgroundCol="linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)"
                    text="Open"
                  />
                </Grid> */}
                <Grid
                  item
                  onClick={() => handleClickOnGrid("warning")}
                  style={{ cursor: "pointer" }}
                >
                  <Counter
                    end={grievanceCounts.warning}
                    backgroundCol="linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)"
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
                      navigate(
                        "/admin_login/grievance-compliance/inward-no-error"
                      )
                    }
                  >
                    Inward No Error
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
                <TableCell>अर्ज क्रमांक</TableCell>
                <TableCell>तक्रार कालावधी</TableCell>
                <TableCell>स्थिति</TableCell>
                <TableCell>पुन्हा नियुक्ती</TableCell>
                <TableCell>तक्रार बघा</TableCell>
              </TableRow>
            </TableHead>

            {isDataLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={10} align="center">
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
                      <TableCell>
                        {val?.applicationId === "NA" ? "-" : val?.applicationId}
                      </TableCell>
                      <TableCell>
                        {/* <b>
                          {val?.issueReportDate
                            ? `${getPendingDays(
                                val.issueReportDate
                              )} दिवसांपासून प्रलंबित`
                            : "तारीख उपलब्ध नाही"}
                        </b> */}
                        {val?.issueReportDate ? (
                          <>
                            <strong>
                              {getPendingDays(val.issueReportDate)}
                            </strong>{" "}
                            दिवसांपासून प्रलंबित
                          </>
                        ) : (
                          "तारीख उपलब्ध नाही"
                        )}
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
                        />
                      </TableCell>

                      <TableCell>
                        {[4, 5, 7].includes(val?.grivanceStatusCode) ? (
                          <Chip
                            label={val?.AssignIssueTo}
                            color="info"
                            variant="outlined"
                          />
                        ) : (
                          "-"
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

        {/* <ThemeProvider theme={theme}>
          <Box sx={{ width: "100%" }}>
            <MUIDataTable
              title={"तक्रारींची यादी"}
              data={data}
              columns={columns}
              options={options}
            />
          </Box>
        </ThemeProvider> */}
      </Grid>
    </>
  );
};

export default UserTable;
