import {
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import URLS from "../../../URLs/url";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { errorToast, successToast, Toast } from "../../../ui/Toast";

const AdminDialogContent = ({ val, handleDialogClose }) => {
  const { sendRequest } = AxiosInstance();
  const [userDetails, setUserDetails] = useState({});
  const [adminCompliance, setAdminCompliance] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [issueResolver, setIssueResolver] = useState(2);
  const [isIssueResolvedByUser, setIsIssueResolvedByUser] = useState("no");

  const handleAssignIssue = (e) => {
    setIssueResolver(e?.target?.value);
    if (e?.target?.value === 3) {
      setIsIssueResolvedByUser("yes");
    } else {
      setIsIssueResolvedByUser("no");
    }
  };

  const sendGrievance = (YorN) => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/SaveAdminTakrarPurtata`,
      "POST",
      {
        tickitId: val?.tickitId,
        userCompliance: "",
        applicaitonId: val?.applicationId,
        actualUserIssue: userDetails?.issueDescription,
        grievanceStatus: userDetails?.grivanceStatus,
        adminComplience: adminCompliance,
        takrarPurtataStatusInYOrN: "",
        isTakrarPurtataDone: isIssueResolvedByUser === "yes" ? "Y" : "N",
        AssignIssueToUserId: issueResolver,
        priority: "NA",
      },
      (res) => {
        successToast(res?.Message);
        handleDialogClose();
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getFilledDetails = () => {
    setIsDataLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetUserDetails`,
      "POST",
      val?.tickitId,
      (res) => {
        setUserDetails(res?.ResponseData);
        setIsDataLoading(false);
      },
      (err) => {
        errorToast(err?.Message);
        setIsDataLoading(false);
      }
    );
  };
  useEffect(() => {
    getFilledDetails();
  }, []);

  useEffect(() => {
    if (val?.grivanceStatusCode === 4) {
      setIsIssueResolvedByUser("yes");
    }
  }, [val]);
  return (
    <>
      {/*---------------------------------------------------------तक्रार---------------------*/}
      <Grid container spacing={1} mb={2}>
        <Grid item md={12}>
          <h4 className="heading">तक्रार</h4>
        </Grid>
        <Grid item md={4}>
          <b>जिल्हा :- </b> {val?.district_name_in_marathi}
        </Grid>
        <Grid item md={4}>
          <b>तालुका :- </b>
          {val?.taluka_name}
        </Grid>
        <Grid item md={4}>
          <b>फेरफार प्रकार :- </b>
          {val?.mutationName}
        </Grid>
        <Grid item md={5}>
          <b>अर्ज क्रमांक :- </b>
          {val?.applicationId}
        </Grid>
        <Grid item md={5}>
          <b>तक्रार क्रमांक :- </b>
          {val?.tickitId}
        </Grid>
      </Grid>
      {isDataLoading || !userDetails?.issueDescription ? (
        <Grid item textAlign="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={12}>
            <InputLabel>
              <b>अपलोड केलेली तक्रार</b>
            </InputLabel>
            <img
              src={userDetails?.docpath}
              width="100%"
              alt="No Image Uploaded !!"
            />
          </Grid>
          <Grid item md={12}>
            <InputLabel>
              <b>वापरकर्ता तक्रार</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              disabled
              fullWidth
              multiline
              rows={8}
              value={userDetails?.issueDescription}
            />
          </Grid>
        </Grid>
      )}
      {/*---------------------------------------------------------तक्रार निवारण---------------------*/}
      <Grid container spacing={1}>
        <Grid item md={12}>
          <h4 className="heading">तक्रार निवारण</h4>
        </Grid>

        {Array.isArray(userDetails?.grievanceReplyData) &&
          userDetails?.grievanceReplyData.map((val, i) => {
            return (
              <Grid item md={12} key={i}>
                <InputLabel>
                  <b>Reply From {val?.replyFrom}</b>
                </InputLabel>
                <TextField
                  className="textfield"
                  disabled
                  fullWidth
                  multiline
                  rows={2}
                  value={val?.reply}
                />
              </Grid>
            );
          })}
      </Grid>

      {/*---------------------------------------------------------तक्रार पाठवा---------------------*/}
      <Grid container spacing={2}>
        <Grid item md={12}>
          <h4 className="heading">तक्रार पाठवा</h4>
        </Grid>
        {val?.grivanceStatusCode === 4 || val?.grivanceStatusCode === 2 ? (
          <>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>तक्रार पूर्तता झाली का ?</b>
              </InputLabel>
              <Select
                fullWidth
                size="small"
                className="textfield"
                name="issueCategory"
                value={isIssueResolvedByUser}
                onChange={(e) => setIsIssueResolvedByUser(e?.target?.value)}
              >
                <MenuItem value="yes">हो</MenuItem>
                {val?.grivanceStatusCode !== 4 && (
                  <MenuItem value="no">नाही</MenuItem>
                )}
              </Select>
            </Grid>

            {isIssueResolvedByUser === "no" && (
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>तक्रार पुन्हा पूर्तता करणारा</b>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  className="textfield"
                  name="issueCategory"
                  value={issueResolver}
                  onChange={handleAssignIssue}
                >
                  <MenuItem value={1}>VIPL</MenuItem>
                  <MenuItem value={2}>NIC</MenuItem>
                </Select>
              </Grid>
            )}
            <Grid item md={12}>
              <InputLabel>
                <b>
                  {isIssueResolvedByUser === "yes"
                    ? "तक्रार पूर्तता झालेल्याचे कारण वापरकर्त्यास पाठवा"
                    : "तक्रार पुन्हा पूर्तता करण्यास पाठवण्याचे कारण"}
                </b>
              </InputLabel>
              <TextField
                className="textfield"
                fullWidth
                multiline
                rows={3}
                value={adminCompliance}
                onChange={(e) => setAdminCompliance(e?.target?.value)}
              />
            </Grid>
            <Grid item md={3} alignSelf="end">
              <Button
                variant="contained"
                onClick={() => sendGrievance("N")}
                fullWidth
              >
                {isIssueResolvedByUser === "yes"
                  ? "तक्रार पूर्तता झालेली आहे"
                  : "पुन्हा पूर्तता करायला पाठवा"}
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>तक्रार पूर्तता करणारा</b>
              </InputLabel>
              <Select
                fullWidth
                size="small"
                className="textfield"
                name="issueCategory"
                value={issueResolver}
                onChange={handleAssignIssue}
              >
                <MenuItem value={1}>VIPL</MenuItem>
                <MenuItem value={2}>NIC</MenuItem>
                <MenuItem value={3}>Self (Department)</MenuItem>
              </Select>
            </Grid>
            <Grid item md={12}>
              <InputLabel>
                <b>
                  {issueResolver == 3
                    ? "तक्रार पूर्तता झालेल्याचे कारण वापरकर्त्यास पाठवा"
                    : "तक्रार पूर्तता करण्यास पाठवण्याचे कारण"}
                </b>
              </InputLabel>
              <TextField
                className={
                  val?.grivanceStatusCode === 6 ||
                  val?.grivanceStatusCode === 7 ||
                  val?.grivanceStatusCode === 5
                    ? "textfieldDisabled"
                    : "textfield"
                }
                fullWidth
                multiline
                rows={3}
                disabled={
                  val?.grivanceStatusCode === 6 ||
                  val?.grivanceStatusCode === 7 ||
                  val?.grivanceStatusCode === 5
                }
                value={adminCompliance}
                onChange={(e) => setAdminCompliance(e?.target?.value)}
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>&nbsp;</b>
              </InputLabel>
              <Button
                variant="contained"
                onClick={() => sendGrievance("N")}
                fullWidth
                disabled={
                  val?.grivanceStatusCode === 6 ||
                  val?.grivanceStatusCode === 7 ||
                  val?.grivanceStatusCode === 5
                }
              >
                {issueResolver == 3
                  ? "तक्रार पूर्तता झालेली आहे"
                  : "पूर्तता करायला पाठवा"}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default AdminDialogContent;
