import React, { useEffect, useState } from "react";
import { errorToast, Toast } from "../../../ui/Toast";
import {
  AppBar,
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
import SecuredHeader from "../../../ui/SecuredHeader";
import URLS from "../../../URLs/url";
import AxiosInstance from "../../../Instance/AxiosInstance";
import MUIDataTable from "mui-datatables";
import InwardNoErrorDialogContent from "./InwardNoErrorDialogContent";

const InwardNoError = () => {
  const { sendRequest } = AxiosInstance();
  const [inwardNoErrorData, setInwardNoErrorData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState({});

  //----------------------------------Mui Datatables---------------------------
  const theme = createTheme();
  const columns = [
    {
      name: "serial",
      label: "अ. क्र.",
      options: { filter: false, sort: true },
    },
    // {
    //   name: "applicationId",
    //   label: "अर्ज क्रमांक",
    //   options: { filter: true, sort: true },
    // },
    {
      name: "applicationId",
      label: "अर्ज क्रमांक",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = inwardNoErrorData[rowIndex];

          return (
            <span
              onClick={() => handleClickOnApplicationId(rowData)}
              style={{ cursor: "pointer", color: "#1976d2" }}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "UserName",
      label: "अर्जदाराचे नाव",
      options: { filter: true, sort: true },
    },
    {
      name: "Date",
      label: "तारीख",
      options: { filter: true, sort: true },
    },
    {
      name: "location",
      label: "जिल्हा / तालुका",
      options: { filter: true, sort: true },
    },
    {
      name: "mutationName",
      label: "फेरफार प्रकार",
      options: { filter: true, sort: true },
    },
    {
      name: "mobileno",
      label: "मोबाइल नंबर",
      options: { filter: true, sort: true },
    },
    {
      name: "inwardNo",
      label: "Error",
      options: { filter: true, sort: true },
    },
  ];

  const data = inwardNoErrorData.map((val, index) => ({
    serial: index + 1,
    applicationId: val.applicationId,
    UserName: val.UserName,
    Date: val.ApplicationCreatedDate,
    location: `${val.district_name_in_marathi} / ${val.taluka_name}`,
    mutationName: val.mutationName,
    mobileno: val.mobileno,
    inwardNo: val.inwardNo,
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
  };
  //----------------------------------Mui Datatables---------------------------

  const handleDialogClose = () => {
    setOpen(false);
    getInwardNoErrorData();
  };

  const handleClickOnApplicationId = (val) => {
    setSelectedApplication(val);
    setOpen(true);
  };

  const getInwardNoErrorData = () => {
    setIsDataLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetApplicationDataForInwardNoError`,
      "POST",
      null,
      (res) => {
        setInwardNoErrorData(res?.ResponseData);
        setIsDataLoading(false);
      },
      (err) => {
        errorToast(err?.Message);
        setIsDataLoading(false);
      }
    );
  };

  useEffect(() => {
    getInwardNoErrorData();
  }, []);
  return (
    <>
      <Toast />
      {/*------------------------------------Preview Dialog for submitted data--------------------- */}
      <Dialog onClose={handleDialogClose} open={open} maxWidth="lg">
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
          <InwardNoErrorDialogContent
            selectedApplication={selectedApplication}
            isError={true}
          />
        </DialogContent>
      </Dialog>

      <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar>

      <Paper elevation={5} sx={{ p: 5, m: 3, mt: 16 }}>
        <Grid container>
          <Grid item md={12}>
            <h4 className="heading">Error In Inward No.</h4>
          </Grid>

          {/* <Grid item md={12} mt={2}>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>अर्ज क्रमांक</TableCell>
                    <TableCell>अर्जदाराचे नाव</TableCell>
                    <TableCell>तारीख</TableCell>
                    <TableCell>जिल्हा / तालुका</TableCell>
                    <TableCell>फेरफार प्रकार</TableCell>
                    <TableCell>मोबाइल नंबर</TableCell>
                    <TableCell>Error</TableCell>
                  </TableRow>
                </TableHead>

                {isDataLoading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {Array.isArray(inwardNoErrorData) &&
                      inwardNoErrorData.map((val, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            <span
                              onClick={() => handleClickOnApplicationId(val)}
                              style={{
                                cursor: "pointer",
                                color: "#1976d2",
                              }}
                            >
                              {val?.applicationId}
                            </span>
                          </TableCell>
                          <TableCell>{val?.UserName}</TableCell>
                          <TableCell>{val?.ApplicationCreatedDate}</TableCell>
                          <TableCell>
                            {val?.district_name_in_marathi} / {val?.taluka_name}
                          </TableCell>
                          <TableCell>{val?.mutationName}</TableCell>
                          <TableCell>{val?.mobileno}</TableCell>
                          <TableCell>{val?.inwardNo}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid> */}

          {/*----------------------------mui datatables trial---------------------------------- */}
          <Grid item md={12} mt={2}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <MUIDataTable
                // title={"Error In Inward No."}
                data={data}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default InwardNoError;
