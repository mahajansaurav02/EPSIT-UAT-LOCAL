import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../../../../../ui/Toast";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import URLS from "../../../../../../../URLs/url";
import { bhadePattaMahitiNotesArr } from "../../../../../../../NotesArray/NotesArray";

const BhadePattaMahiti = () => {
  const { sendRequest } = AxiosInstance();
  const month = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [bhadepattaDetails, setbhadepattaDetails] = useState({
    tenureYear: "",
    tenureMonth: "",
    fromDate: "",
    toDate: "",
    amount: "",
  });
  const [radio, setRadio] = useState("no");
  const [isReset, setIsReset] = useState(false);
  const [responseData, setResponseData] = useState({});

  // const {
  //   control,
  //   trigger,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(
  //     yup.object().shape({
  //       tenureYear: yup
  //         .string()
  //         .required("भाडेपट्ट्याचा एकूण वर्षे कालावधी टाका."),
  //       tenureMonth: yup
  //         .string()
  //         .required("भाडेपट्ट्याचा एकूण महीने कालावधी टाका."),
  //       fromDate: yup.string().required("भाडेपट्ट्याची तारीख पासून टाका."),
  //       toDate: yup.string().required("भाडेपट्ट्याची तारीख पर्यंत टाका."),
  //       amount: yup.string().required("भाडेपट्ट्याची रक्कम टाका."),
  //     })
  //   ),
  //   defaultValues: {
  //     tenureYear: "",
  //     tenureMonth: "",
  //     fromDate: "",
  //     toDate: "",
  //     amount: "",
  //   },
  // });

  //new validations
  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        tenureYear: yup.string().when("$radio", {
          is: "no",
          then: (s) => s.required("भाडेपट्ट्याचा एकूण वर्षे कालावधी टाका."),
          otherwise: (s) => s.notRequired(),
        }),
        tenureMonth: yup.string().when("$radio", {
          is: "no",
          then: (s) => s.required("भाडेपट्ट्याचा एकूण महीने कालावधी टाका."),
          otherwise: (s) => s.notRequired(),
        }),
        fromDate: yup.string().when("$radio", {
          is: "no",
          then: (s) => s.required("भाडेपट्ट्याची तारीख पासून टाका."),
          otherwise: (s) => s.notRequired(),
        }),
        toDate: yup.string().when("$radio", {
          is: "no",
          then: (s) => s.required("भाडेपट्ट्याची तारीख पर्यंत टाका."),
          otherwise: (s) => s.notRequired(),
        }),
        amount: yup.string().required("भाडेपट्ट्याची रक्कम टाका."),
      })
    ),
    context: { radio },
    defaultValues: {
      tenureYear: "",
      tenureMonth: "",
      fromDate: "",
      toDate: "",
      amount: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleRadioChange = (e) => {
    setRadio(e?.target?.value);
    if (e?.target?.value === "no") {
      setbhadepattaDetails({
        tenureYear: "",
        tenureMonth: "",
        fromDate: "",
        toDate: "",
        amount: "",
      });

      setValue("tenureYear", "");
      setValue("tenureMonth", "");
      setValue("fromDate", "");
      setValue("toDate", "");
      setValue("amount", "");
    }
  };

  const handleReset = () => {
    setbhadepattaDetails({
      tenureYear: "",
      tenureMonth: "",
      fromDate: "",
      toDate: "",
      amount: "",
    });

    reset();
    setIsReset(!isReset);
  };

  const handleDetails = (e) => {
    const { name, value } = e?.target;
    if (name == "fromDate") {
      setbhadepattaDetails({ ...bhadepattaDetails, [name]: value, toDate: "" });
      setValue("toDate", "");
    } else {
      setbhadepattaDetails({ ...bhadepattaDetails, [name]: value });
    }
  };

  const handleSave = async () => {
    const result = await trigger();
    if (result) {
      sendRequest(
        `${URLS?.BaseURL}/MutationAPIS/SaveBhadepattaInfoData`,
        "POST",
        {
          applicationid: applicationId,
          leasePeriod: radio,
          bhadepattaTenureYear: bhadepattaDetails?.tenureYear,
          bhadepattaTenureMonth: bhadepattaDetails?.tenureMonth,
          bhadepattaFromDate: bhadepattaDetails?.fromDate,
          bhadepattaToDate: bhadepattaDetails?.toDate,
          bhadepattaAmount: bhadepattaDetails?.amount,
        },
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            handleReset();
            getBhadepattaMahitiTableData();
          } else {
            console.error(res?.Message);
            errorToast(res?.Message);
          }
        },
        (err) => {
          errorToast(err?.Message);
        }
      );
    } else {
      errorToast("Please Check All Fields !!");
    }
  };

  const handleDelete = (id, applicationIdFromTable) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteBhadepattaInfoData`,
      "POST",
      {
        info_id: id,
        applicationId: applicationIdFromTable,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getBhadepattaMahitiTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getBhadepattaMahitiTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetBhadepattaInfoData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          if (res?.ResponseData === null) {
            setResponseData({});
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
  useEffect(() => {
    getBhadepattaMahitiTableData();
  }, []);

  useEffect(() => {
    if (responseData && Object.keys(responseData).length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    } else {
      sessionStorage.setItem("allowPoa", "no");
    }
  }, [responseData]);

  return (
    <>
      <Toast />

      <Grid item md={12}>
        <NotesPaper
          heading="भाडेपट्टा माहिती भरण्यासाठी आवश्यक सूचना"
          arr={bhadePattaMahitiNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 className="heading">भाडेपट्टा माहिती</h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2} mb={1}>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>भाडेपट्टा कालावधी</b>
                </InputLabel>
                <RadioGroup row onChange={handleRadioChange} value={radio}>
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="मुदतीत"
                  />
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="निरंतर"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            {radio == "no" && (
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Controller
                    name="tenureYear"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>भाडेपट्ट्याचा एकूण कालावधी वर्षे </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          value={bhadepattaDetails?.tenureYear}
                          fullWidth
                          className="textfield"
                          size="small"
                          inputProps={{
                            maxLength: 3,
                            inputMode: "numeric",
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                            },
                          }}
                          name="tenureYear"
                          type="text"
                          error={errors.tenureYear}
                          {...field}
                          onBlur={() => handleBlur("tenureYear")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDetails(e);
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.tenureYear && errors.tenureYear.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="tenureMonth"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>भाडेपट्ट्याचा एकूण कालावधी महीने </b>
                          <span>*</span>
                        </InputLabel>
                        {/* <TextField
                          value={bhadepattaDetails?.tenureMonth}
                          fullWidth
                          className="textfield"
                          size="small"
                          type="number"
                          name="tenureMonth" 
                          error={errors.tenureMonth}
                          {...field}
                          onBlur={() => handleBlur("tenureMonth")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDetails(e);
                          }}
                        /> */}
                        <Select
                          fullWidth
                          size="small"
                          name="tenureMonth"
                          value={bhadepattaDetails?.tenureMonth}
                          className="textfield"
                          error={errors.tenureMonth}
                          {...field}
                          onBlur={() => handleBlur("tenureMonth")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDetails(e);
                          }}
                        >
                          {Array.isArray(month) &&
                            month.map((val) => {
                              return (
                                <MenuItem value={val} key={val}>
                                  {val}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.tenureMonth && errors.tenureMonth.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="fromDate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>भाडेपट्ट्याची तारीख पासून </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          className="textfield"
                          name="fromDate"
                          value={bhadepattaDetails?.fromDate}
                          onFocus={(event) => {
                            event.target.showPicker();
                          }}
                          inputProps={{
                            max: today,
                          }}
                          error={errors.fromDate}
                          {...field}
                          onBlur={() => handleBlur("fromDate")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.fromDate && errors.fromDate.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="toDate"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>भाडेपट्ट्याची तारीख पर्यंत </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          type="date"
                          className="textfield"
                          name="toDate"
                          value={bhadepattaDetails?.toDate}
                          onFocus={(event) => {
                            event.target.showPicker();
                          }}
                          inputProps={{
                            min: bhadepattaDetails?.fromDate,
                          }}
                          error={errors.toDate}
                          {...field}
                          onBlur={() => handleBlur("toDate")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDetails(e);
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.toDate && errors.toDate.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>भाडेपट्ट्याची रक्कम (रु.) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        value={bhadepattaDetails?.amount}
                        className="textfield"
                        size="small"
                        inputProps={{
                          maxLength: 100,
                          inputMode: "decimal",
                          onInput: (e) => {
                            const value = e.target.value;
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (!regex.test(value)) {
                              e.target.value =
                                value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                            }
                          },
                        }}
                        name="amount"
                        type="number"
                        error={errors.amount}
                        {...field}
                        onBlur={() => handleBlur("amount")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDetails(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.amount && errors.amount.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>

            <Grid>
              <Grid container justifyContent="end" px={2} mt={2}>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<RotateRightRoundedIcon />}
                    sx={{ mr: 2 }}
                    onClick={handleReset}
                  >
                    रीसेट करा
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<SaveRoundedIcon />}
                    onClick={handleSave}
                    disabled={Object.keys(responseData).length > 0}
                  >
                    जतन करा
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>भाडेपट्टा माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>भाडेपट्टा कालावधी वर्ष व महीने</TableCell>
                <TableCell>भाडेपट्टा दिनांक पासून</TableCell>
                <TableCell>भाडेपट्टा दिनांक पर्यंत</TableCell>
                <TableCell>भाडेपट्ट्याची रक्कम (रु.)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseData && Object.keys(responseData).length > 0 && (
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>
                    {responseData?.bhadepattaTenureYear} वर्ष{" "}
                    {responseData?.bhadepattaTenureMonth} महीने
                  </TableCell>
                  <TableCell>{responseData?.bhadepattaFromDate}</TableCell>
                  <TableCell>{responseData?.bhadepattaToDate}</TableCell>
                  <TableCell>{responseData?.bhadepattaAmount}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(
                          responseData?.Info_id,
                          responseData?.applicationid
                        )
                      }
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default BhadePattaMahiti;
