import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Chip,
  CircularProgress,
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
  Tooltip,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SecuredHeader from "../../ui/SecuredHeader";
import AxiosInstance from "../../Instance/AxiosInstance";
import URLS from "../../URLs/url";
import { errorToast, successToast, Toast } from "../../ui/Toast";
import Swal from "sweetalert2";
import TrutiPatra from "../../ui/NicDoc/TrutiPatra";
import NoticeNine from "../../ui/NicDoc/NoticeNine";
import NikaliPatra from "../../ui/NicDoc/NikaliPatra";
import RejectionPatra from "../../ui/NicDoc/RejectionPatra";

const HomeApplication = () => {
  const { sendRequest } = AxiosInstance();
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [openTrutiPatra, setOpenTrutiPatra] = useState(false);
  const [openNoticeNine, setOpenNoticeNine] = useState(false);
  const [openNikaliPatra, setOpenNikaliPatra] = useState(false);
  const [openRejectionPatra, setOpenRejectionPatra] = useState(false);

  const [nicDoc, setNicDoc] = useState([]);
  const [selectedForCompliance, setSelectedForCompliance] = useState({});

  const handleTrutiPatraDialogClose = () => {
    setOpenTrutiPatra(false);
    getHomePageData();
  };
  const handleNoticeNineDialogClose = () => {
    setOpenNoticeNine(false);
  };
  const handleNikaliPatraDialogClose = () => {
    setOpenNikaliPatra(false);
  };
  const handleRejectionPatraDialogClose = () => {
    setOpenRejectionPatra(false);
  };
  const handleShowTrutiPatra = (id) => {
    setOpenTrutiPatra(true);
    const obj = homeData.find((o) => o?.applicationID == id);
    setNicDoc(obj?.nicDocData);
    setSelectedForCompliance(obj);
  };
  const handleShowNoticeNine = (id) => {
    setOpenNoticeNine(true);
    const obj = homeData.find((o) => o?.applicationID == id);
    setNicDoc(obj?.nicDocData);
    setSelectedForCompliance(obj);
  };
  const handleShowNikaliPatra = (id) => {
    setOpenNikaliPatra(true);
    const obj = homeData.find((o) => o?.applicationID == id);
    setNicDoc(obj?.nicDocData);
    setSelectedForCompliance(obj);
  };
  const handleShowRejectionPatra = (id) => {
    setOpenRejectionPatra(true);
    const obj = homeData.find((o) => o?.applicationID == id);
    setNicDoc(obj?.nicDocData);
    setSelectedForCompliance(obj);
  };

  const handleNewApplication = () => {
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("application-type");
  };
  const handleReSubmit = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/ReSubmitApplication`,
      "POST",
      id,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getHomePageData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.statusText);
        console.error(err?.statusText);
      }
    );
  };
  const handleDelete = (id, mutType) => {
    Swal.fire({
      title: `<p style="font-size: 0.8em;">सदर ${mutType} फेरफार अर्ज डिलीट करायचा आहे का ?</p> <p style="font-size: 0.8em;"> (अर्ज क्र.- ${id})</p>`,
      // title: "फेरफार अर्ज डिलीट करायचे का ?",
      html: '<span style="color: red;">डिलीट झाल्यानंतर पुन्हा नवीन अर्ज करावा लागेल !</span>',
      position: "center",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "हो मी सहमत आहे",
      cancelButtonText: "नाही",
    }).then((result) => {
      if (result.isConfirmed) {
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/DeleteApplication`,
          "POST",
          id,
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              Swal.fire(
                "Deleted!",
                "सदर फेरफार अर्ज डिलीट झालेला आहे",
                "success"
              );
              getHomePageData();
            } else {
              errorToast(res?.Message);
            }
          },
          (err) => {
            errorToast(err?.Message);
          }
        );
      }
    });
  };
  const handleEdit = (id, isDast, isPoa, isCourtDawa) => {
    sessionStorage.setItem("applicationId", id);
    sessionStorage.setItem("isDast", isDast == "YES" ? "yes" : "no");
    sessionStorage.setItem("isMainPatra", isPoa == "YES" ? "yes" : "no");
    sessionStorage.setItem("isCourtDawa", isCourtDawa == "YES" ? "yes" : "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home/application-details");
  };

  const getHomePageData = () => {
    setIsDataLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetDashboard`,
      "POST",
      null,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setHomeData(res?.ResponseData);
          setIsDataLoading(false);
        } else {
          errorToast(res?.Message);
          setIsDataLoading(false);
        }
      },
      (err) => {
        errorToast(err?.statusText);
        setIsDataLoading(false);
      }
    );
  };
  useEffect(() => {
    getHomePageData();
  }, []);
  return (
    <>
      <Toast />

      {/*------------------------------------truti patra dialog--------------------- */}
      <Dialog
        onClose={handleTrutiPatraDialogClose}
        open={openTrutiPatra}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleTrutiPatraDialogClose}
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
          <TrutiPatra
            details={selectedForCompliance}
            nicDoc={nicDoc}
            close={handleTrutiPatraDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/*------------------------------------notice 9 dialog--------------------- */}
      <Dialog
        onClose={handleNoticeNineDialogClose}
        open={openNoticeNine}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleNoticeNineDialogClose}
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
          <NoticeNine details={selectedForCompliance} nicDoc={nicDoc} />
        </DialogContent>
      </Dialog>

      {/*------------------------------------nikali patra dialog--------------------- */}
      <Dialog
        onClose={handleNikaliPatraDialogClose}
        open={openNikaliPatra}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleNikaliPatraDialogClose}
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
          <NikaliPatra details={selectedForCompliance} nicDoc={nicDoc} />
        </DialogContent>
      </Dialog>

      {/*------------------------------------Rejection patra dialog--------------------- */}
      <Dialog
        onClose={handleRejectionPatraDialogClose}
        open={openRejectionPatra}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleRejectionPatraDialogClose}
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
          <RejectionPatra details={selectedForCompliance} nicDoc={nicDoc} />
        </DialogContent>
      </Dialog>

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="default"
      >
        <SecuredHeader />
      </AppBar>
      <Paper elevation={5} sx={{ p: 5, m: 3, mt: 16 }}>
        <Grid container>
          <Grid item md={12}>
            <h4 className="heading">प्रॉपर्टी कार्ड फेरफार</h4>
          </Grid>
          <Grid item md={12} mt={2}>
            <Grid container spacing={2} justifyContent="end">
              <Grid item>
                <Tooltip title="मदत / युजर मॅन्युअल" arrow>
                  <IconButton
                    onClick={() =>
                      window.open(
                        "./images/user_manual/user_manual.pdf",
                        "_blank"
                      )
                    }
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNewApplication}
                >
                  नवीन अर्ज
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
                    <TableCell>अर्ज क्रमांक</TableCell>
                    <TableCell>अर्ज दिनांक</TableCell>
                    <TableCell>
                      जिल्हा / तालुका / न. भू. कार्यालय / गांव
                    </TableCell>
                    <TableCell>फेरफार प्रकार</TableCell>
                    <TableCell>परिणाम होणारे न. भू . क्र.</TableCell>
                    <TableCell>जोडलेली कागदपत्रे</TableCell>
                    <TableCell>आवक क्रमांक</TableCell>
                    <TableCell>त्रुटी पत्र / नोटीस / निकाली पत्र</TableCell>
                    <TableCell>अर्जाची लॉगिन मधील सद्यस्थिती</TableCell>
                    <TableCell>
                      अर्जाची न.भू . कार्यालयातील सद्यस्थिती
                    </TableCell>
                    <TableCell>कार्यालय संपर्क</TableCell>
                    <TableCell>कृती करा</TableCell>
                  </TableRow>
                </TableHead>
                {isDataLoading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {Array.isArray(homeData) &&
                      homeData.map((val, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{val?.applicationID}</TableCell>
                            <TableCell>{val?.application_date}</TableCell>
                            <TableCell>
                              {val?.district_name_in_marathi}/{val?.taluka}/
                              {val?.village}
                            </TableCell>
                            <TableCell>{val?.mutation_type}</TableCell>
                            <TableCell>
                              {val?.nabhunos == null ? "-" : val?.nabhunos}
                            </TableCell>
                            <TableCell>
                              {val?.uploaded_docName == null
                                ? "-"
                                : val?.uploaded_docName}
                            </TableCell>
                            {/* <TableCell>{val?.inwardno}</TableCell> */}
                            <TableCell>{val?.slashinwardno}</TableCell>
                            <TableCell
                            // sx={{
                            //   display: "flex",
                            //   flexDirection: "column",
                            //   rowGap: 1,
                            //   justifyContent: "center",
                            //   alignItems: "center",
                            // }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  rowGap: 5,
                                }}
                              >
                                {val?.status?.code == 4 ? (
                                  <Button
                                    variant="outlined"
                                    sx={{ textWrap: "nowrap" }}
                                    onClick={() =>
                                      handleShowTrutiPatra(val?.applicationID)
                                    }
                                  >
                                    त्रुटि पत्र बघा
                                  </Button>
                                ) : (
                                  <span>-</span>
                                )}
                                {val?.status?.code == 7 ? (
                                  <Button
                                    variant="outlined"
                                    sx={{ textWrap: "nowrap" }}
                                    onClick={() =>
                                      handleShowNoticeNine(val?.applicationID)
                                    }
                                  >
                                    नोटिस बघा
                                  </Button>
                                ) : (
                                  <span>-</span>
                                )}
                                {val?.status?.code == 6 ? (
                                  <Button
                                    variant="outlined"
                                    sx={{ textWrap: "nowrap" }}
                                    onClick={() =>
                                      handleShowNikaliPatra(val?.applicationID)
                                    }
                                  >
                                    निकाली पत्र बघा
                                  </Button>
                                ) : (
                                  <span>-</span>
                                )}
                                {val?.status?.code == 5 ? (
                                  <Button
                                    variant="outlined"
                                    sx={{ textWrap: "nowrap" }}
                                    onClick={() =>
                                      handleShowRejectionPatra(
                                        val?.applicationID
                                      )
                                    }
                                  >
                                    अर्ज नाकारण्याचे पत्र बघा
                                  </Button>
                                ) : (
                                  <span>-</span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Chip
                                color={
                                  val?.status?.code == 1
                                    ? "success"
                                    : val?.status?.code == 5
                                    ? "error"
                                    : "warning"
                                }
                                label={val?.status?.label}
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {val?.inwardno_status == null ? (
                                "-"
                              ) : (
                                <Chip
                                  color="success"
                                  label={val?.inwardno_status}
                                />
                              )}
                            </TableCell>
                            <TableCell sx={{ textWrap: "nowrap" }}>-</TableCell>
                            {/* <TableCell sx={{ textWrap: "nowrap" }}>
                              {[1, 4, 5, 6, 7].includes(val?.status?.code) ? (
                                "-"
                              ) : (
                                <>
                                  {val?.status?.code == 3 ? (
                                    <IconButton
                                      color="primary"
                                      onClick={() =>
                                        handleReSubmit(val?.applicationID)
                                      }
                                    >
                                      <ReplayOutlinedIcon />
                                    </IconButton>
                                  ) : (
                                    <>
                                      <IconButton
                                        color="success"
                                        onClick={() =>
                                          handleEdit(
                                            val?.applicationID,
                                            val?.isDastApplicable,
                                            val?.isMainPatra,
                                            val?.isCourtDawa
                                          )
                                        }
                                      >
                                        <EditNoteOutlinedIcon />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleDelete(
                                            val?.applicationID,
                                            val?.mutation_type
                                          )
                                        }
                                      >
                                        <DeleteForeverOutlinedIcon />
                                      </IconButton>
                                    </>
                                  )}
                                </>
                              )}
                            </TableCell> */}
                            <TableCell sx={{ textWrap: "nowrap" }}>
                              {val?.status?.code == 3 ? (
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleReSubmit(val?.applicationID)
                                  }
                                >
                                  <ReplayOutlinedIcon />
                                </IconButton>
                              ) : val?.status?.code == 2 ? (
                                <>
                                  <IconButton
                                    color="success"
                                    onClick={() =>
                                      handleEdit(
                                        val?.applicationID,
                                        val?.isDastApplicable,
                                        val?.isMainPatra,
                                        val?.isCourtDawa
                                      )
                                    }
                                  >
                                    <EditNoteOutlinedIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleDelete(
                                        val?.applicationID,
                                        val?.mutation_type
                                      )
                                    }
                                  >
                                    <DeleteForeverOutlinedIcon />
                                  </IconButton>
                                </>
                              ) : val?.status?.code == 8 ? (
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDelete(
                                      val?.applicationID,
                                      val?.mutation_type
                                    )
                                  }
                                >
                                  <DeleteForeverOutlinedIcon />
                                </IconButton>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default HomeApplication;
