import { CircularProgress, Grid, InputLabel, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AxiosInstance from "../../Instance/AxiosInstance";
import URLS from "../../URLs/url";
import { errorToast } from "../Toast";

const GrievanceDialogContent = ({ val }) => {
  const { sendRequest } = AxiosInstance();
  const [complianceReply, setComplianceReply] = useState({});

  const getReply = () => {
    // setIsDataLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetActualUserDetails`,
      "POST",
      val?.tickitId,
      (res) => {
        setComplianceReply(res?.ResponseData);
        // setIsDataLoading(false);
      },
      (err) => {
        errorToast(err?.Message);
        // setIsDataLoading(false);
      }
    );
  };
  useEffect(() => {
    getReply();
  }, []);

  return (
    <>
      <Grid container spacing={1} mb={2}>
        <Grid item md={12}>
          <h4 className="heading">केलेली तक्रार</h4>
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
        <Grid item md={4}>
          <b>तक्रार प्रकार :- </b>
          {val?.issueCategory == "other" ? "इतर" : "अर्जाबाबत तक्रार"}
        </Grid>
        <Grid item md={4}>
          <b>प्राथमिक नं. :- </b>
          {val?.mobileno}
        </Grid>
        <Grid item md={4}>
          <b>दुय्यम नं. :- </b>
          {val?.secondaryMoNo}
        </Grid>
        <Grid item md={5}>
          <b>अर्ज क्रमांक :- </b>
          {val?.applicationId}
        </Grid>
        <Grid item md={6}>
          <b>तक्रार क्रमांक :- </b>
          {val?.tickitId}
        </Grid>
      </Grid>

      {!val?.issueDescription ? (
        <Grid item textAlign="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={12}>
            <InputLabel>
              <b>अपलोड केलेली तक्रार</b>
            </InputLabel>
            <img src={val?.docpath} width="100%" alt="No Image Uploaded !!" />
          </Grid>
          <Grid item md={12}>
            <InputLabel>
              <b>तक्रार</b>
            </InputLabel>
            <TextField
              className="textfieldDisabled"
              disabled
              fullWidth
              multiline
              rows={3}
              value={val?.issueDescription}
            />
          </Grid>
        </Grid>
      )}
      <Grid item md={12} mt={1}>
        <InputLabel>
          <b>तक्रार निवारण</b>
        </InputLabel>
        <TextField
          className="textfield"
          disabled
          fullWidth
          multiline
          rows={5}
          value={complianceReply?.reply}
        />
      </Grid>
    </>
  );
};

export default GrievanceDialogContent;
