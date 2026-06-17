import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import AxiosInstance from "../../../Instance/AxiosInstance";
import URLS from "../../../URLs/url";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { docNotesArr } from "../../../NotesArray/NotesArray";
import VarasDeclerationDownloadFile from "../../../DownloadFiles/VarasDeclearationDownloadFile";
import SelfDeclerationDownloadFile from "../../../DownloadFiles/SelfDeclerationDownloadFile";
import styled from "styled-components";

const StyledTd = styled.td({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
  padding: 10,
});
const StyledTh = styled.th({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});

const Documents = () => {
  const navigate = useNavigate();
  const isCourtDawa = sessionStorage.getItem("isCourtDawa");
  const isPOA = sessionStorage.getItem("isMainPatra");
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [applicationData, setApplicationData] = useState({});
  const [previewData, setFinalPreviewData] = useState();
  const [selectedDocHeading, setSelectedDocHeading] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [openSelfDecleration, setOpenSelfDecleration] = useState(false);
  const [openSelfDeclerationVaras, setOpenSelfDeclerationVaras] =
    useState(false);
  const [disableuploadDocBtn, setDisableUploadDocBtn] = useState(false);

  const checkMandatoryDocs = () => {
    const mandatoryDocs = selectedDocs.filter(
      (doc) => doc.document_is_mandatory
    );
    const presentDocumentCodes = new Set(
      responseData.map((doc) => doc.documentTypeCode)
    );
    const missingDocs = mandatoryDocs.filter(
      (doc) => !presentDocumentCodes.has(doc.document_code)
    );

    if (missingDocs.length > 0) {
      errorToast(
        `आपण अनिवार्य कागदपत्रे अपलोड केलेले नाही:${missingDocs
          .map((doc) => doc.document_name)
          .join(", ")}`
      );
    } else {
      navigate("/home/self-decleration");
    }
  };

  const handleCloseSelfDeclerationDialog = () => {
    setOpenSelfDecleration(false);
  };
  const handleDownloadDelceration = () => {
    setOpenSelfDecleration(true);
  };
  const handleCloseSelfDeclerationVarasDialog = () => {
    setOpenSelfDeclerationVaras(false);
  };
  const handleDownloadDelcerationVaras = () => {
    setOpenSelfDeclerationVaras(true);
  };
  const handleUploadDocument = (event, code) => {
    const file = event.target.files[0];
    const obj = selectedDocs.find((o) => o?.document_code == code);

    if (file) {
      if (file.size > 2048 * 1024) {
        errorToast("अपलोड कागदपत्र साइज 2 MB च्या वर आहे");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const base64Data = reader.result.replace(
              /^data:application\/pdf;base64,/,
              ""
            );

            setDisableUploadDocBtn(true);
            sendRequest(
              `${URLS?.BaseURL}/ApplicationAPIS/SaveDocumentUpload`,
              "POST",
              {
                applicationid: applicationId,
                docType: obj,
                docUpload: { docSrc: base64Data, docName: file.name },
              },
              (res) => {
                if (res?.Code == "1") {
                  successToast(res?.Message);
                  getDocumentTableData();
                  setDisableUploadDocBtn(false);
                } else {
                  errorToast(res?.Message);
                  setDisableUploadDocBtn(false);
                }
              },
              (err) => {
                setDisableUploadDocBtn(false);
                errorToast(err?.Response?.Message);
              }
            );
          } else {
            errorToast("File could not be read. Please try again.");
          }
        };
        reader.onerror = () => {
          errorToast("An error occurred while reading the file.");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteDocumentUpload`,
      "POST",
      {
        applicationid: applicationId,
        uploaded_doc_id: id,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getDocumentTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Response?.Message);
      }
    );
  };
  const getDocList = (code, type) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getDocListMutationtype`,
      "POST",
      {
        mut_type: code,
        mut_category: type == "Unregistered" ? "N" : "Y",
      },
      (res) => {
        setSelectedDocs(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );

    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetDocumentTypeByMutation`,
      "POST",
      code,
      (res) => {
        if (res?.Code == "1") {
          setSelectedDocHeading(res?.ResponseData?.mutationTypeHDR);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };
  const handlePrevious = () => {
    if (isCourtDawa === "yes" && isPOA === "no") {
      navigate("/home/court-dawa");
    } else if (isPOA === "yes" && isCourtDawa === "no") {
      navigate("/home/main-patra");
    } else if (isPOA === "no" && isCourtDawa === "no") {
      navigate("/home/ferfar");
    } else {
      navigate("/home/court-dawa");
    }
  };
  const getDocumentTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetDocumentUploadedDTL`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            setResponseData([]);
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
  const setAppDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          console.info("res-GetApplicationData->>", res);
          setApplicationData(res?.ResponseData);
          getDocList(
            res?.ResponseData?.mutation_type_code,
            res?.ResponseData?.application_type_in_english
          );
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getFinalData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setFinalPreviewData(res?.ResponseData);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const handleDocumentAction = (e, docSrc, docName) => {
    e.preventDefault();

    // Open the document in a new tab
    const newTab = window.open(docSrc, "_blank");
    newTab?.focus();

    // Trigger the download
    const link = document.createElement("a");
    link.href = docSrc;
    link.download = docName || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setAppDataApi();
    getDocumentTableData();
    getFinalData();
  }, []);

  return (
    <>
      <Toast />
      {/*------------------------------------------self declearation download dialog */}
      <Dialog
        open={openSelfDecleration}
        onClose={handleCloseSelfDeclerationDialog}
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseSelfDeclerationDialog}
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
          <SelfDeclerationDownloadFile
            applicationData={applicationData}
            previewData={previewData}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openSelfDeclerationVaras}
        onClose={handleCloseSelfDeclerationVarasDialog}
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseSelfDeclerationVarasDialog}
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
          <VarasDeclerationDownloadFile
            applicationData={applicationData}
            previewData={previewData}
          />
        </DialogContent>
      </Dialog>

      <Grid container spacing={2} mt={0}>
        <Grid item md={12} mt={2}>
          <Paper elevation={5} sx={{ px: 2, p: 3 }} className="paper-back">
            <Grid container spacing={2}>
              <Grid item md={2}>
                <span className="paper-span">
                  जिल्हा : <b>{applicationData?.district_name_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  तालुका/न.भु. कार्यालय : <b>{applicationData?.taluka_name}</b>
                </span>
              </Grid>
              <Grid item md={2}>
                <span className="paper-span">
                  अर्ज प्रकार :{" "}
                  <b>{applicationData?.application_type_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  फेरफार प्रकार : <b>{applicationData?.mutation_type}</b>
                </span>
              </Grid>
              <Grid item md={2}>
                <span className="paper-span">
                  गाव : <b>{applicationData?.village_name}</b>
                </span>
              </Grid>
              <Grid item md={6}>
                <span className="paper-span">
                  न.भू .क्र. :{" "}
                  {Array.isArray(applicationData?.nabhDTL) &&
                    applicationData?.nabhDTL.map((val, i) => {
                      return (
                        <b key={i}>
                          {" "}
                          {i === applicationData?.nabhDTL.length - 1
                            ? val?.naBhu
                            : `${val?.naBhu}, `}
                        </b>
                      );
                    })}
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item md={12}>
          <NotesPaper
            heading="कागदपत्र भरण्यासाठी आवश्यक सूचना "
            arr={docNotesArr}
          />
        </Grid>
        <Grid item md={12}>
          <Paper elevation={5} sx={{ px: 2, py: 2 }} className="paperm">
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography
                  variant="h5"
                  color="#084D92"
                  fontSize="16px"
                  fontWeight={600}
                  display="inline-flex"
                  alignItems="center"
                >
                  <DescriptionOutlinedIcon /> &nbsp; अर्जदाराने
                  स्वयंघोषणापत्राची प्रत डाउनलोड करावी व स्वयंघोषणापत्राच्या
                  छापील प्रत वर स्वाक्षरी करून अपलोड करावे .
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<DownloadRoundedIcon />}
                  onClick={handleDownloadDelceration}
                >
                  डाउनलोड करा
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {applicationData.mutation_type_code == "01" && (
          <Grid item md={12}>
            <Paper elevation={5} sx={{ px: 2, py: 2 }} className="paperm">
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    variant="h5"
                    color="#084D92"
                    fontSize="16px"
                    fontWeight={600}
                    display="inline-flex"
                    alignItems="center"
                  >
                    <DescriptionOutlinedIcon /> &nbsp; अर्जदाराने वारसाबाबत
                    स्वयंघोषणापत्राची प्रत डाउनलोड करावी व स्वयंघोषणापत्राच्या
                    छापील प्रत वर स्वाक्षरी करून अपलोड करावे .
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<DownloadRoundedIcon />}
                    onClick={handleDownloadDelcerationVaras}
                  >
                    डाउनलोड करा
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        <Grid item md={12}>
          <Paper
            sx={{ backgroundColor: "#FFDFDF", p: 2, borderRadius: "10px" }}
          >
            <h3
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "#F43A3A",
                marginBottom: 0,
              }}
            >
              <DescriptionOutlinedIcon /> &nbsp; {selectedDocHeading}
            </h3>
            <div style={{ paddingRight: 2 }}>
              <ol>
                {Array.isArray(selectedDocs) &&
                  selectedDocs.map((v, i) => {
                    return (
                      <li className="req-documents" key={i}>
                        {v?.document_name}
                      </li>
                    );
                  })}
              </ol>
            </div>
          </Paper>
        </Grid>

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container spacing={2}>
              <Grid item md={12}>
                <h4 className="heading">कागदपत्रे</h4>
              </Grid>

              <Grid item md={12}>
                <table
                  style={{
                    width: "-webkit-fill-available",
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <StyledTh>आवश्यक कागदपत्रे</StyledTh>
                    <StyledTh>अपलोड कागदपत्र</StyledTh>
                    <StyledTh>अपलोड केलेले कागदपत्र</StyledTh>
                  </tr>
                  {Array.isArray(selectedDocs) &&
                    selectedDocs.map((val, i) => {
                      return (
                        <tr key={val?.document_code + i}>
                          <StyledTd>
                            {val?.document_name}{" "}
                            {val?.document_is_mandatory ? (
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: 900,
                                }}
                              >
                                *
                              </span>
                            ) : null}
                          </StyledTd>
                          <StyledTd>
                            <Button
                              size="small"
                              variant="contained"
                              component="label"
                              disabled={
                                val?.document_code === 26 ||
                                val?.document_code === 43 ||
                                disableuploadDocBtn
                              }
                              startIcon={
                                disableuploadDocBtn ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  <CloudUploadRoundedIcon />
                                )
                              }
                            >
                              अपलोड करा
                              <input
                                type="file"
                                accept="application/pdf"
                                hidden
                                onChange={(e) =>
                                  handleUploadDocument(e, val?.document_code)
                                }
                              />
                            </Button>
                          </StyledTd>
                          <StyledTd>
                            {Array.isArray(responseData) &&
                              responseData
                                .filter(
                                  (o) =>
                                    o.documentTypeCode === val.document_code
                                )
                                .map((obj, i) => {
                                  return (
                                    <p key={i}>
                                      <a
                                        href={obj?.docSrc}
                                        target="_blank"
                                        style={{ textDecoration: "none" }}
                                        download={obj?.docName}
                                      >
                                        {obj?.docName}
                                      </a>
                                      {/* <a 
                                        href="#"
                                        style={{ textDecoration: "none" }}
                                        onClick={(e) =>
                                          handleDocumentAction(
                                            e,
                                            obj?.docSrc,
                                            obj?.docName
                                          )
                                        }
                                      >
                                        {obj?.docName}
                                      </a> */}
                                      &nbsp; &nbsp; &nbsp; &nbsp;
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleDelete(obj?.documentID)
                                        }
                                        disabled={
                                          val?.document_code === 26 ||
                                          val?.document_code === 43
                                        }
                                      >
                                        <DeleteForeverOutlinedIcon />
                                      </IconButton>
                                    </p>
                                  );
                                })}
                          </StyledTd>
                        </tr>
                      );
                    })}
                </table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container justifyContent="space-between" px={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={goToHomePage}
            >
              होम पेज ला जा
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handlePrevious}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              // onClick={() => navigate("/home/self-decleration")}
              onClick={checkMandatoryDocs}
            >
              पुढे जा
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Documents;
