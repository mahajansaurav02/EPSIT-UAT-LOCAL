import {
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../Instance/AxiosInstance";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import URLS from "../../../URLs/url";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UserDialogContent = ({ val, handleDialogClose }) => {
  const { sendRequest } = AxiosInstance();
  const userNameEng = sessionStorage.getItem("userNameEng");
  const [userDetails, setUserDetails] = useState({});
  const [userCompliance, setuserCompliance] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isResolved, setIsResolved] = useState("InProcess");

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        grievanceTextfield: yup
          .string()
          .required("कृपया आपली तक्रार पूर्तता करा."),
      })
    ),
    defaultValues: {
      grievanceTextfield: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const sendUserCompliance = async () => {
    const result = await trigger();
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/GrievanceSystem/SaveUserTakrarPurtata`,
        "POST",
        {
          tickitId: val?.tickitId,
          userCompliance: userCompliance,
          applicaitonId: val?.applicationId,
          actualUserIssue: userDetails?.issueDescription,
          grievanceStatus: isResolved,
          adminComplience: "",
          takrarPurtataStatusInYOrN: isResolved == "Resolved" ? "Y" : "N",
          isTakrarPurtataDone: "",
        },
        (res) => {
          successToast(res?.Message);
          handleDialogClose();
        },
        (err) => {
          errorToast(err?.Message);
        }
      );
    } else {
      errorToast("Please Fill All Fields");
    }
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
    if (val?.grivanceStatusCode === 7) {
      setIsResolved("Resolved");
    }
  }, [val]);
  return (
    <>
      <Toast />
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
      <Grid item md={12}>
        <h4 className="heading">तक्रार पाठवा</h4>
      </Grid>
      <Grid container spacing={1}>
        <Grid item md={3}>
          <InputLabel className="inputlabel">
            <b>तक्रार पूर्तता झाली आहे का? </b>
            <span>*</span>
          </InputLabel>
          <Select
            fullWidth
            size="small"
            className="textfield"
            name="issueCategory"
            value={isResolved}
            onChange={(e) => setIsResolved(e?.target?.value)}
          >
            <MenuItem value="Resolved">हो</MenuItem>
            {val?.grivanceStatusCode !== 7 && (
              <MenuItem value="InProcess">नाही</MenuItem>
            )}
          </Select>
        </Grid>
        <Grid item md={12}>
          <Controller
            name="grievanceTextfield"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>तक्रार पूर्तता </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  className="textfield"
                  fullWidth
                  multiline
                  rows={3}
                  value={userCompliance}
                  error={errors.grievanceTextfield}
                  {...field}
                  onBlur={() => handleBlur("grievanceTextfield")}
                  // onChange={(e) => setuserCompliance(e?.target?.value)}
                  onChange={(e) => {
                    field.onChange(e);
                    setuserCompliance(e?.target?.value);
                  }}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.grievanceTextfield &&
                    errors.grievanceTextfield.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        <Grid item md={12} textAlign="end">
          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={sendUserCompliance}
            disabled={
              val?.grivanceStatusCode === 4 ||
              val?.grivanceStatusCode === 5 ||
              val?.AssignIssueTo !== userNameEng
            }
          >
            तक्रार पूर्तता करा
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UserDialogContent;
