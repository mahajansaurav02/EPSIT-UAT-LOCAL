import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import {
  Box,
  Button,
  Checkbox,
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
import { errorToast, successToast, Toast } from "../../../../../../ui/Toast";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import URLS from "../../../../../../URLs/url";

const Pairing = ({ applicationData, setActiveStep }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [showDenarGhenar, setShowDenarGhenar] = useState(false);

  const [denarData, setDenarData] = useState([
    { name: "Abhishek Gujar", srNo: 1, area: 20, nabhu: 2 },
    { name: "Vaishnavi Kumbhar", srNo: 2, area: 30, nabhu: 5 },
    { name: "Shruti Dixit", srNo: 3, area: 200, nabhu: 77 },
  ]);
  const [selectedDenarRows, setSelectedDenarRows] = useState([]);

  const [ghenarData, setGhenarData] = useState([
    { name: "Gauri Tele", srNo: 1, type: "व्यक्ति" },
    { name: "Gauri Wadekar", srNo: 2, type: "व्यक्ति" },
    { name: "Sameer Kulkarni", srNo: 3, type: "व्यक्ति" },
  ]);
  const [selectedGhenarRows, setSelectedGhenarRows] = useState([]);

  const handleSelectDenarRow = (val) => {
    const unique = `${val}`;
    setSelectedDenarRows((prev) =>
      prev.includes(unique)
        ? prev.filter((key) => key !== unique)
        : [...prev, unique]
    );
  };

  const handleSelectGhenarRow = (val) => {
    const unique = `${val}`;
    setSelectedGhenarRows((prev) =>
      prev.includes(unique)
        ? prev.filter((key) => key !== unique)
        : [...prev, unique]
    );
  };

  const handleSaveDenarGhenar = () => {
    setShowDenarGhenar(true);
    if (selectedDenarRows.length > 0 && selectedGhenarRows > 0) {
      console.info("Pairing->>", {
        denar: selectedDenarRows,
        ghenar: selectedGhenarRows,
        applicationid: applicationId,
      });
    } else {
      errorToast("Please Select atleast 1 Deanra and 1 Ghenara !!");
    }
  };

  const getGenericDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetGenericNondForGiver`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setDenarData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setDenarData([]);
          } else {
            errorToast(res?.Message);
          }
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getGenericGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetGenericNondTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          console.info("ghenar-data->>", res?.ResponseData);
          setGhenarData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setGhenarData([]);
          } else if (res?.ResponseData != "") {
            errorToast(res?.Message);
          }
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    getGenericDenarTableData();
    getGenericGhenarTableData();
  }, []);
  return (
    <>
      <Toast />

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={6}>
            <TableContainer component={Paper} elevation={5}>
              <h3 style={{ marginLeft: 20 }}>देणार माहिती तक्ता</h3>
              <Table>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>देणाराचे नाव</TableCell>
                    <TableCell>अर्जमधील न. भू. क्र.</TableCell>
                    <TableCell>फेरफारासाठी मिळकत</TableCell>
                    <TableCell>क्षेत्र</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {denarData.map((val, i) => {
                    const unique = `${val?.mutation_dtl_id}`;
                    const isChecked = selectedDenarRows.includes(unique);
                    return (
                      <TableRow key={i}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isChecked}
                            onChange={() =>
                              handleSelectDenarRow(val?.mutation_dtl_id)
                            }
                          />
                        </TableCell>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{val?.fullNameInMarathi}</TableCell>
                        <TableCell>{val?.nabhu}</TableCell>
                        <TableCell>
                          {val?.milkat == "land"
                            ? "भूखंड / जमीन (प्लॉट)"
                            : "अपार्टमेंट"}
                        </TableCell>
                        <TableCell>
                          {val?.areaForMutation?.mutationArea}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={6}>
            <TableContainer component={Paper} elevation={5}>
              <h3 style={{ marginLeft: 20 }}>घेणारा माहिती तक्ता</h3>
              <Table>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>घेणाराचा प्रकार</TableCell>
                    <TableCell>घेणाऱ्याचे नाव</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ghenarData.map((val, i) => {
                    const unique = `${val?.mutation_dtl_id}`;
                    const isChecked = selectedGhenarRows.includes(unique);
                    return (
                      <TableRow key={i}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isChecked}
                            onChange={() =>
                              handleSelectGhenarRow(val?.mutation_dtl_id)
                            }
                          />
                        </TableCell>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{val?.userType}</TableCell>
                        <TableCell>{val?.fullNameInMarathi}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveDenarGhenar}
              >
                देणार घेणार माहिती जतन करा
              </Button>
            </Box>
          </Grid>

          {showDenarGhenar && (
            <Grid item md={12}>
              <TableContainer component={Paper} elevation={5}>
                <h3 style={{ marginLeft: 20 }}>देणार-घेणारा माहिती तक्ता</h3>
                <Table>
                  <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                    <TableRow>
                      <TableCell>अ. क्र.</TableCell>
                      <TableCell>देणाराचे नाव</TableCell>
                      <TableCell>घेणाऱ्याचे नाव</TableCell>
                      <TableCell>कृती करा</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>Abhishek, Shruti</TableCell>
                      <TableCell>Gauri Tele, Sameer Kulkarni</TableCell>
                      <TableCell>
                        <IconButton color="error">
                          <DeleteForeverOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default Pairing;
