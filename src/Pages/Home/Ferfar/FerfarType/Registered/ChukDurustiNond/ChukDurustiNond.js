import {
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { errorToast, successToast, Toast } from "../../../../../../ui/Toast";
import NotesPaper from "../../../../../../ui/NotesPaper/NotesPaper";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UserAddress from "../SupportPages/UserAddress";
import { nabhuValidationSchema } from "../../../../../../Validations/yupValidations";
import URLS from "../../../../../../URLs/url";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShowAddress from "../SupportPages/ShowAddress";

const ChukDurustiNond = ({ applicationData }) => {
  // console.log(applicationData, "applicationData");
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [reason, setReason] = useState("");
  const [userDataArr, setUserDataArr] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [chukDurustiKaranData, setChukDurustiKaranData] = useState([]);

  //---------------------------state up data of Address---------------------
  const [isIndian, setIsIndian] = useState("india");
  const [indiaAddress, setIndiaAdress] = useState({
    plotNo: "",
    building: "",
    mainRoad: "",
    impSymbol: "",
    area: "",
    mobile: "",
    mobileOTP: "yes",
    pincode: "",
    postOfficeName: "",
    city: "",
    taluka: "",
    district: "",
    state: "",
    addressProofName: "",
    addressProofSrc: "",
    signatureName: "",
    signatureSrc: "",
  });
  const [foraighnAddress, setForaighnAddress] = useState({
    address: "",
    mobile: "",
    email: "",
    emailOTP: "yes",
    signatureName: "",
    signatureSrc: "",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});

  //------------------------------Combined States----------------------------
  const [responseData, setResponseData] = useState([]);
  //--------------------------------Show Address-----------------------------
  const [open, setOpen] = useState(false);
  const [addVal, setAddVal] = useState({});

  //------------------------------Is Mutation Undergoing-----------------------
  const [isMutationUndergoing, setIsMutationUndergoing] = useState(false);

  const handleDialogClose = () => {
    setOpen(false);
  };
  const showAddress = (val) => {
    setOpen(true);
    setAddVal(val?.address);
  };

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
        reason: yup.string().required("चूक दुरुस्ती दस्त करण्याचे कारण निवडा"),
      }),
    ),
    defaultValues: {
      nabhu: "",
      reason: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReasonData = (e) => {
    setReason(e?.target?.value);
  };

  const handleReset = () => {
    setNamud("");
    setMilkat("land");
    setLrPropertyUID("");
    setNaBhu("");
    setReason("");
    setUserDataArr([]);
    setIsIndian("india");
    setIndiaAdress({
      plotNo: "",
      building: "",
      mainRoad: "",
      impSymbol: "",
      area: "",
      mobile: "",
      mobileOTP: "",
      pincode: "",
      postOfficeName: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      addressProofName: "",
      addressProofSrc: "",
      signatureName: "",
      signatureSrc: "",
    });
    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "",
      signatureName: "",
      signatureSrc: "",
    });

    reset();
    setIsReset(!isReset);
  };

  //Object reference not set to an instance of an object.
  const handleSave = async () => {
    const result = await trigger();

    const isAddressValid =
      isIndian === "india"
        ? await isValid.triggerUserIndAdd()
        : await isValid.triggerUserForeignAdd();

    if (!result || !isAddressValid) {
      errorToast("Please Check All Fields");
      return;
    }

    if (!applicationData?.mutation_type_code) {
      errorToast("कृपया चूकदुरुस्ती नोंद करीता फेरफार निवडा");
      return;
    }

    const payload = {
      applicationid: applicationId,
      // userid: 0,
      village_code: applicationData?.village_code,
      userDetails: {
        subPropNo: subPropNo,
        nabhu: naBhu,
        lrPropertyUID: lrPropertyUID,
        milkat: milkat,
        namud: namud,
        selectedMutation: applicationData?.mutation_type_code,
        reason: reason,
      },
      address: {
        addressType: isIndian,
        ...(isIndian === "india"
          ? {
            indiaAddress: indiaAddress,
          }
          : {
            foreignAddress: foraighnAddress,
          }),
      },
    };

    console.info("payload->>", payload);

    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/SaveErrorCorrectionInfo`,
      "POST",
      payload,
      (res) => {
        if (res?.Code === "1") {
          successToast(res?.Message);
          getChukDurustiData();
          handleReset();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        console.error(err);
        errorToast(err?.Message || "Something went wrong");
      }
    );
  };

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteErrorCorrectionInfo`,
      "POST",
      {
        applicationid: applicationId,
        errorCorrectionId: id,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getChukDurustiData();
          getChukDurustiKaran();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };

  const getChukDurustiData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetErrorCorrectionInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          console.log(res, "response of chuk durusti info--->>");
          successToast(res?.Message);
          setResponseData(res?.ResponseData);
        } else {
          if (res?.ResponseData.length == 0) {
            console.log(res, "checkkkkk response is empty");
            setResponseData([]);
          } else {
            errorToast(res?.Message);
          }
        }
      },
      (err) => {
        console.log(err, "errorrrr");
        errorToast(err?.Message);
      },
    );
  };

  const getChukDurustiKaran = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getCorrectionMaster`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code === "1") {
          const parsedData = JSON.parse(res?.ResponseData || "[]");
          setChukDurustiKaranData(parsedData);
          successToast(res?.Message);
        } else {
          setChukDurustiKaranData([]);
          errorToast(res?.Message);
        }
      },
      (err) => {
        console.log(err, "errorrrr");
        errorToast(err?.Message);
      },
    );
  };
  const handleNaBhuNo = (e) => {
    const code = e?.target?.value;
    setNaBhu(e?.target?.value);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    // getUserDetails(obj?.actual_cts_no, obj?.sub_property_no);
    // getUserDetails(obj?.actual_cts_no);
  };

  // const getUserDetails = (nabhuNo, subPropNo) => {
  //   sendRequest(
  //     `${URLS?.BaseURL}/EPCISAPIS/getOwnerNameInfo`,
  //     "POST",
  //     {
  //       village_code: applicationData?.village_code,
  //       cts_no: nabhuNo,
  //       subprop_no: subPropNo,
  //     },
  //     (res) => {
  //       if (res?.Code == "1") {
  //         setUserDataArr(JSON.parse(res?.ResponseData));
  //       } else {
  //         errorToast(res?.Message);
  //         setUserDataArr([]);
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // };

  const getUserDetails = (nabhuNo) => {
    setUserLoading(true);
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/entryDetailsOfRegisteredMutation`,
      "POST",
      {
        district_code: applicationData?.district_code,
        office_code: applicationData?.taluka_code,
        village_code: applicationData?.village_code,
        cts_no: nabhuNo,
      },
      (res) => {
        if (res?.Code == "1") {
          setUserLoading(false);
          setUserDataArr(JSON.parse(res?.ResponseData));
        } else {
          errorToast(res?.Message);
          setUserDataArr([]);
        }
      },
      (err) => {
        console.error(err);
      },
    );
  };
  useEffect(() => {
    getChukDurustiData();
    getChukDurustiKaran();
  }, []);

  useEffect(() => {
    if (responseData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    }
  }, [responseData]);

  const handleRadioChange = (row) => {
    setSelectedRow(row);
  };

  return (
    <>
      <Toast />
      {/*------------------------------------address preview dialog--------------------- */}
      <Dialog onClose={handleDialogClose} open={open} maxWidth="md">
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
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
          <ShowAddress address={addVal} />
        </DialogContent>
      </Dialog>

      <Grid item md={12}>
        <NotesPaper
          heading="चूक दुरुस्ती माहिती भरण्यासाठी आवश्यक सूचना"
        // arr={mryutupatraDenarNotesArrUnRegistered}
        />
      </Grid>

      <Grid item md={12}>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">चूक दुरुस्ती माहिती</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Controller
                    name="nabhu"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>अर्जामधील न.भू.क्र. निवडा </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          className="textfield"
                          size="small"
                          value={naBhu}
                          error={errors.nabhu}
                          {...field}
                          onBlur={() => handleBlur("nabhu")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNaBhuNo(e);
                          }}
                        >
                          {Array.isArray(applicationData?.nabhDTL) &&
                            applicationData?.nabhDTL.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.naBhu}
                                  key={val?.naBhu + i}
                                >
                                  {val?.naBhu}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.nabhu && errors.nabhu.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>LR-Property UID</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={lrPropertyUID}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>फेरफारासाठी मिळकत </b>
                  </InputLabel>
                  <RadioGroup
                    row
                    // onChange={handleMilkat}
                    value={milkat}
                  >
                    <FormControlLabel
                      value="land"
                      control={<Radio />}
                      label="जमीन ( NA प्लॉट )"
                      disabled
                    />
                    <FormControlLabel
                      value="flat"
                      control={<Radio />}
                      label="अपार्टमेंट"
                      disabled
                    />
                  </RadioGroup>
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>अर्जामध्ये नमूद मिळकत</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={namud}
                    size="small"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            {userLoading && (
              <Grid item md={12} textAlign="center">
                <CircularProgress />
              </Grid>
            )}

            <Grid item md={3}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>चूक दुरुस्ती दस्त करण्याचे कारण </b>
                      <span>*</span>
                    </InputLabel>
                    <Select
                      fullWidth
                      className="textfield"
                      size="small"
                      // value={reason}
                      error={errors.reason}
                      {...field}
                      onBlur={() => handleBlur("reason")}
                      onChange={(e) => {
                        field.onChange(e);
                        handleReasonData(e);
                      }}
                    >
                      {Array.isArray(chukDurustiKaranData) &&
                        chukDurustiKaranData.map((item) => {
                          return (
                            <MenuItem key={item.sr_no_180}
                              value={item.name_180}>
                              {item?.name_180}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.reason && errors.reason.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>

            {/* <Grid item md={12}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>चूक दुरुस्ती दस्त करण्याचे कारण </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      fullWidth
                      size="small"
                      value={reason}
                      error={errors.reason}
                      {...field}
                      onBlur={() => handleBlur("reason")}
                      multiline
                      rows={4}
                      placeholder="कारण"
                      onChange={(e) => {
                        field.onChange(e);
                        handleReasonData(e);
                      }}
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.reason && errors.reason.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid> */}

            <Grid item md={12}>
              <UserAddress
                type="chukDurusti"
                isReset={isReset}
                isEdit={isEdit}
                hasSignature={false}
                isIndian={isIndian}
                setIsIndian={setIsIndian}
                indiaAddress={indiaAddress}
                setIndiaAdress={setIndiaAdress}
                foraighnAddress={foraighnAddress}
                setForaighnAddress={setForaighnAddress}
                setIsValid={setIsValid}
                responseData={responseData}
                isMobileCompulsary={true}
              />
            </Grid>
            <Grid container justifyContent="end" mt={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<RotateRightRoundedIcon />}
                  sx={{ mr: 2 }}
                  onClick={() => {
                    handleReset();
                  }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  onClick={handleSave}
                  // disabled={responseData.length >= 1}
                  sx={{ mr: 2 }}
                >
                  जतन करा
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Grid item md={12} mt={2}>
          <TableContainer component={Paper} elevation={5}>
            <h3 style={{ marginLeft: 20 }}>चूक दुरुस्ती माहिती तक्ता</h3>
            <Table>
              <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                <TableRow>
                  <TableCell>अ. क्र.</TableCell>
                  <TableCell>
                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                  </TableCell>
                  <TableCell>LR-Property UID</TableCell>
                  <TableCell>अर्जमधील न.भू.क्र.</TableCell>
                  <TableCell>Sub Property No.</TableCell>
                  <TableCell>फेरफरसाठी मिळकत</TableCell>
                  <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                  <TableCell>चूक दुरुस्ती दस्त करण्याचे कारण</TableCell>
                  {/* <TableCell>नावात बदल कारण </TableCell>
                  <TableCell>नावात बदल देणाऱ्याचे प्रकार </TableCell>
                  <TableCell>नावात बदल झालेले नाव</TableCell>
                  {/* <TableCell>उर्फ नाव</TableCell> */}
                  <TableCell>नावात बदल देणाऱ्याचा पत्ता</TableCell>
                  <TableCell>कृती करा</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(responseData) &&
                  responseData.map((val, i) => {
                    return (
                      <TableRow key={val?.mutation_dtl_id + i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {applicationData?.district_name_in_marathi} /{" "}
                          {applicationData?.taluka_name} /{" "}
                          {applicationData?.village_name}
                        </TableCell>
                        <TableCell>{val?.userDetails?.lrPropertyUID}</TableCell>
                        <TableCell>{val?.userDetails?.nabhu}</TableCell>
                        <TableCell>{val?.userDetails?.subPropNo}</TableCell>
                        <TableCell>
                          {val?.userDetails?.milkat == "land"
                            ? "भूखंड / जमीन (प्लॉट)"
                            : "अपार्टमेंट"}
                        </TableCell>
                        <TableCell>{val?.userDetails?.namud}</TableCell>
                        {/* <TableCell>
                          {val?.selectedUserDetails[0]?.first_name}{" "}
                          {val?.selectedUserDetails[0]?.middle_name}{" "}
                          {val?.selectedUserDetails[0]?.last_name}
                        </TableCell> */}
                        <TableCell>{val?.userDetails?.reason}</TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => showAddress(val)}
                          >
                            पत्ता पहा
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDelete(val?.error_correction_id)
                            }
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ChukDurustiNond;
