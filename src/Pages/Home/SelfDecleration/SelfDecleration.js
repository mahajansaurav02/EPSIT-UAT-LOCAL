import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import FinalPreview from "../../../ui/FInalPreview/FinalPreview";
import CloseIcon from "@mui/icons-material/Close";
import URLS from "../../../URLs/url";
import MutationDeclerationDownloadFile from "../../../DownloadFiles/MutationDeclerationDownloadFile";
import NotesPaper from "../../../ui/NotesPaper/NotesPaper";
import { selfDeclrNotesArr } from "../../../NotesArray/NotesArray";
import Swal from "sweetalert2";

const SelfDecleration = () => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("userNameMar");
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [disableFinalBtn, setDisableFinalBtn] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  const [declearationDoc, setDeclearationDoc] = useState({
    selfDeclerationProofName: "",
    selfDeclerationProofSrc: "",
  });
  const [selfDeclearationError, setSelfDeclearationError] = useState("");
  const [open, setOpen] = useState(false);
  const [previewData, setFinalPreviewData] = useState();
  const [openSelfDecleration, setOpenSelfDecleration] = useState(false);

  // --------User Agree---------------------------
  const [isUserAgree, setIsUserAgree] = useState(false);
  const [loadingBackdrop, setLoadingBackdrop] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleCloseSelfDeclerationDialog = () => {
    setOpenSelfDecleration(false);
  };
  const handleselfDeclerationProofFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        // 2 MB = 2048 * 1024 bytes
        setSelfDeclearationError("अपलोड कागदपत्र साइज 2 MB च्या वर आहे");
        setDeclearationDoc({
          ...declearationDoc,
          selfDeclerationProofName: "",
          selfDeclerationProofSrc: "",
        });
      } else {
        setSelfDeclearationError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            // Safely process the result
            const base64Data = reader.result.replace(
              /^data:application\/pdf;base64,/,
              ""
            );
            setDeclearationDoc({
              ...declearationDoc,
              selfDeclerationProofSrc: base64Data,
              selfDeclerationProofName: file.name,
            });
          } else {
            setSelfDeclearationError(
              "File could not be read. Please try again."
            );
            setDeclearationDoc({
              ...declearationDoc,
              selfDeclerationProofName: "",
              selfDeclerationProofSrc: "",
            });
          }
        };
        reader.onerror = () => {
          // Handle FileReader errors
          setSelfDeclearationError("An error occurred while reading the file.");
          setDeclearationDoc({
            ...declearationDoc,
            selfDeclerationProofName: "",
            selfDeclerationProofSrc: "",
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSelfDeclearationError("");
      setDeclearationDoc({
        ...declearationDoc,
        selfDeclerationProofName: "",
        selfDeclerationProofSrc: "",
      });
    }
  };
  const handleDownloadDelceration = () => {
    setOpenSelfDecleration(true);
  };
  const handleFinalSubmit = () => {
    Swal.fire({
      title: "अर्ज फेरफार नोंदीसाठी पाठवा",
      html: '<span style="color: red;">पाठवल्यावर नंतर अर्जात बदल करता येणार नाही !</span>',
      position: "center",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "हो मी सहमत आहे",
      cancelButtonText: "नाही",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("applicationId");
        sessionStorage.setItem("isCourtDawa", "no");
        sessionStorage.setItem("isDast", "no");
        sessionStorage.setItem("isMainPatra", "no");
        sessionStorage.setItem("allowPoa", "no");
        setDisableFinalBtn(true);
        setLoadingBackdrop(true);
        sendRequest(
          `${URLS?.BaseURL}/ApplicationAPIS/SaveSelfDeclaration`,
          "POST",
          {
            applicationid: applicationId,
            docUpload: {
              docName: declearationDoc?.selfDeclerationProofName,
              docSrc: declearationDoc?.selfDeclerationProofSrc,
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              Swal.fire(
                "Submitted!",
                "अर्ज फेरफार नोंदीसाठी पाठवला गेलेला आहे",
                "success"
              );
              setLoadingBackdrop(false);
              navigate("/home");
            } else if (res?.Code == "0") {
              Swal.fire("Error!", res?.Message, "error");
              setLoadingBackdrop(false);
              navigate("/home");
            }
          },
          (err) => {
            console.info("err-SaveSelfDeclaration->>", err);
            errorToast(err?.Message);
          }
        );
      }
    });
  };

  // const handleFinalSubmit = () => {
  //   Swal.fire({
  //     title: "अर्ज फेरफार नोंदीसाठी पाठवा",
  //     html: '<span style="color: red;">पाठवल्यावर नंतर अर्जात बदल करता येणार नाही !</span>',
  //     position: "center",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "हो मी सहमत आहे",
  //     cancelButtonText: "नाही",
  //     showLoaderOnConfirm: true,
  //     preConfirm: () => {
  //       sessionStorage.removeItem("applicationId");
  //       sessionStorage.setItem("isCourtDawa", "no");
  //       sessionStorage.setItem("isDast", "no");
  //       sessionStorage.setItem("isMainPatra", "no");
  //       sessionStorage.setItem("allowPoa", "no");

  //       return sendRequest(
  //         `${URLS?.BaseURL}/ApplicationAPIS/SaveSelfDeclaration`,
  //         "POST",
  //         {
  //           applicationid: applicationId,
  //           docUpload: {
  //             docName: declearationDoc?.selfDeclerationProofName,
  //             docSrc: declearationDoc?.selfDeclerationProofSrc,
  //           },
  //         }
  //       )
  //         .then((res) => {
  //           if (res?.Code == "1") {
  //             successToast(res?.Message);
  //             Swal.fire(
  //               "Submitted!",
  //               "अर्ज फेरफार नोंदीसाठी पाठवला गेलेला आहे",
  //               "success"
  //             );
  //             navigate("/home");
  //           } else {
  //             throw new Error(res?.Message || "Unexpected error occurred");
  //           }
  //         })
  //         .catch((err) => {
  //           Swal.showValidationMessage(
  //             `Error: ${err?.message || "Request failed"}`
  //           );
  //           errorToast(err?.Message);
  //         });
  //     },
  //   }).then((result) => {
  //     if (result.isDismissed) {
  //       console.log("Action cancelled by user");
  //     }
  //   });
  // };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
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
  const setAppDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    setAppDataApi();
    getFinalData();
  }, []);
  return (
    <>
      <Toast />

      {/*------------------------------------preview dialog--------------------- */}
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
          <FinalPreview
            previewData={previewData}
            applicationData={applicationData}
            setIsUserAgree={setIsUserAgree}
            handleDialogClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/*------------------------------self declearation download dialog-----------*/}
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
          <MutationDeclerationDownloadFile
            applicationData={applicationData}
            previewData={previewData}
          />
        </DialogContent>
      </Dialog>

      {/*------------------------------save backdrop-----------*/}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingBackdrop}
      >
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Submitting...
          </Typography>
        </div>
      </Backdrop>

      <Grid container spacing={2}>
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
            heading="अर्ज अपलोड करण्यासाठी आवश्यक सूचना"
            arr={selfDeclrNotesArr}
          />
        </Grid>

        <Grid item md={12}>
          <Paper elevation={5} sx={{ p: 2 }} className="papermain">
            <Grid container spacing={2}>
              <Grid item md={12}>
                <h4 className="heading">स्वयंघोषणापत्र</h4>
              </Grid>
              <Grid item md={12}>
                <span style={{ fontSize: "18px", fontWeight: 400 }}>
                  मी <b>{name}</b>. या अर्जात दिलेली माहिती योग्य व अचूक असून
                  त्यामध्ये माहित असलेले कोणतीही बाब / माहिती लपवून ठेवलेली नाही
                  अथवा चुकीची नमूद केलेली नाही, असे केले असल्यास मी भारतीय न्याय
                  संहिता 2023 चे कलम 229(2), 236 व 237 अन्वये दंडात्मक /
                  कायदेशीर कारवाईसाठी पात्र राहील याची मला जाणीव आहे, म्हणून हे
                  स्वयंघोषणापत्र करत आहे. अर्जासोबत सादर केलेली कागदपत्रे
                  सत्यप्रत असल्याबाबत स्वयंस्वाक्षरीत केले आहेत.
                </span>
              </Grid>
            </Grid>
          </Paper>
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
                  <DescriptionOutlinedIcon /> भरलेली माहिती तपासून बघा व आवश्यक
                  असल्यास दुरुस्त करा.
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleOpenDialog}
                  disabled={isUserAgree}
                >
                  भरलेली माहिती बघा
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {isUserAgree && (
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
                    <DescriptionOutlinedIcon /> &nbsp; अर्जदाराने फेरफाराचा अर्ज{" "}
                    {applicationData?.mutation_type} &nbsp;प्रत डाउनलोड करावी व
                    स्वाक्षरी करून अपलोड करावे.
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

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Grid item md={5}>
                  <InputLabel className="inputlabel">
                    <b>
                      अर्जाची छापील प्रतीवर स्वाक्षरी करून येथे अपलोड करावी.
                    </b>
                    <span> *</span>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    size="small"
                    value={declearationDoc?.selfDeclerationProofName}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            variant="contained"
                            component="label"
                            startIcon={<img src="/images/pdflogo.svg" />}
                          >
                            शोधा
                            <input
                              type="file"
                              accept="application/pdf"
                              // accept="image/*"
                              hidden
                              onChange={handleselfDeclerationProofFileChange}
                            />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {selfDeclearationError && selfDeclearationError}
                  </FormHelperText>
                </Grid>

                <Grid item md={3} textAlign="end">
                  <Button
                    variant="contained"
                    onClick={handleFinalSubmit}
                    disabled={
                      !declearationDoc?.selfDeclerationProofName ||
                      disableFinalBtn
                    }
                    endIcon={<KeyboardDoubleArrowRightRoundedIcon />}
                  >
                    अर्ज फेरफार नोंद घेण्यासाठी पाठवा
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

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
              onClick={() => navigate("/home/documents")}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            {/* <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/home")}
            >
              पुढे जा
            </Button> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SelfDecleration;
