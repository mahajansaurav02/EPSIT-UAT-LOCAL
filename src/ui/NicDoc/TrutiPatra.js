import React, { useEffect, useState } from "react";
import { Grid, Button, IconButton, CircularProgress } from "@mui/material";
import styled from "styled-components";
import AxiosInstance from "../../Instance/AxiosInstance";
import URLS from "../../URLs/url";
import { errorToast, successToast } from "../Toast";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

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

const TrutiPatra = ({ details, nicDoc, close }) => {
  const { sendRequest } = AxiosInstance();
  // const [isDataLoading, setIsDataLoading] = useState(true);
  const [disableSendTrutiBtn, setDisableSendTrutiBtn] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [responseData, setResponseData] = useState([]);

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

            sendRequest(
              `${URLS?.BaseURL}/ApplicationAPIS/SaveTrutiDocumentUpload`,
              "POST",
              {
                applicationid: details?.applicationID,
                inwardNo: details?.inwardno,
                docType: {
                  document_code: obj?.document_code.toString(),
                  document_name: obj?.document_name,
                  document_is_mandatory: obj?.document_is_mandatory,
                },
                docUpload: { docSrc: base64Data, docName: file.name },
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
  const sendTruti = () => {
    setDisableSendTrutiBtn(true);
    sendRequest(
      `${URLS?.BaseURL}/NICAPIS/CallNICTrutiPatraDTL`,
      "POST",
      details?.applicationID,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setDisableSendTrutiBtn(false);
          close();
        } else {
          errorToast(res?.Message);
          setDisableSendTrutiBtn(false);
        }
      },
      (err) => {
        errorToast(err?.Response?.Message);
        setDisableSendTrutiBtn(false);
      }
    );
  };

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/DeleteTrutiPatraDocumentUpload`,
      "POST",
      {
        applicationid: details?.applicationID,
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

  const getDocumentTableData = () => {
    // setIsDataLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetTrutiDocumentUploadedDTL`,
      "POST",
      details?.applicationID,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
          // setIsDataLoading(false);
        } else {
          if (res?.ResponseData.length == 0) {
            setResponseData([]);
          } else {
            errorToast(res?.Message);
            // setIsDataLoading(false);
          }
        }
      },
      (err) => {
        errorToast(err?.Message);
        // setIsDataLoading(false);
      }
    );
  };
  const getDocList = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getDocListMutationtype`,
      "POST",
      {
        mut_type: details?.mutation_type_code,
        mut_category: details?.application_type,
      },
      (res) => {
        setSelectedDocs(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    getDocumentTableData();
    getDocList();
  }, []);
  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item md={12}>
          <h4 className="heading">त्रुटि पत्र</h4>
        </Grid>
        <Grid item md={3}>
          <b>जिल्हा :- </b>
          {details?.district_name_in_marathi}
        </Grid>
        <Grid item md={4}>
          <b>तालुका :- </b>
          {details?.taluka}
        </Grid>
        <Grid item md={2}>
          <b>गाव :- </b>
          {details?.village}
        </Grid>
        <Grid item md={3}>
          <b>फेरफार प्रकार :- </b>
          {details?.mutation_type}
        </Grid>
        <Grid item md={4}>
          <b>अर्ज क्रमांक :- </b>
          {details?.applicationID}
        </Grid>
        <Grid item md={4}>
          <b>अर्ज केल्याची तारीख :- </b>
          {details?.application_date}
        </Grid>
        <Grid item md={4}>
          <b>आवक क्रमांक :- </b>
          {details?.inwardno}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={12}>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  त्रुटि डाउनलोड करा
                </td>
                <td>
                  {Array.isArray(nicDoc) &&
                    nicDoc.map((val, i) => (
                      <div key={i}>
                        <a
                          href={val?.docSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={val?.docName}
                          style={{
                            textDecoration: "none",
                            display: "block",
                            marginBottom: "5px",
                          }}
                        >
                          {val?.docName}
                        </a>
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item md={12}>
          <h4 className="heading">त्रुटि पूर्तता करा</h4>
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

            {/* {isDataLoading ? (
              <tr>
                <td colSpan={3} style={{ paddingTop: 5 }}>
                  <CircularProgress />
                </td>
              </tr>
            ) : (
              <> */}
            {Array.isArray(selectedDocs) &&
              selectedDocs.map((val, i) => {
                return (
                  <tr key={val?.document_code + i}>
                    <StyledTd>{val?.document_name}</StyledTd>
                    <StyledTd>
                      <Button
                        size="small"
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadRoundedIcon />}
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
                            (o) => o.documentTypeCode === val.document_code
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
                                &nbsp; &nbsp; &nbsp; &nbsp;
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(obj?.documentID)}
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
            {/* </>
            )} */}
          </table>
        </Grid>
        <Grid item md={12} mt={2} display="flex" justifyContent="end">
          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={sendTruti}
            disabled={disableSendTrutiBtn}
            startIcon={
              disableSendTrutiBtn ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {disableSendTrutiBtn
              ? "त्रुटि पूर्तता करायला पाठवत आहे"
              : "त्रुटि पूर्तता करायला पाठवा"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default TrutiPatra;
