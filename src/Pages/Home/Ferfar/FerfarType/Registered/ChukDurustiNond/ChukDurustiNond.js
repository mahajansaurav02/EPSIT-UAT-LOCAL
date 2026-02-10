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
} from "@mui/material";
import { errorToast, successToast, Toast } from "../../../../../../ui/Toast";
import NotesPaper from "../../../../../../ui/NotesPaper/NotesPaper";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import { useState } from "react";
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

const ChukDurustiNond = ({ applicationData }) => {
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
  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();

      if (result && isUserIndAdd) {
        if (selectedRow) {
          successToast("Data is in console !");
          console.info("payload->>", {
            applicationid: applicationId,
            village_code: applicationData?.village_code,
            userDetails: {
              subPropNo: subPropNo,
              nabhu: naBhu,
              lrPropertyUID: lrPropertyUID,
              milkat: milkat,
              namud: namud,
              selectedMutation: selectedRow,
              reason: reason,
            },
            address: {
              addressType: isIndian,
              indiaAddress: indiaAddress,
            },
          });
        } else {
          errorToast(" कृपया चूकदुरुस्ती नोंद करीता फेरफार निवडा");
        }

        // sendRequest(
        //   `${URLS?.BaseURL}/MutationAPIS/CreateBhadepattaNondGiver`,
        //   "POST",
        //   {
        //     applicationid: applicationId,
        //     village_code: applicationData?.village_code,
        //     ctsNo: selectedUserArr[0]?.cts_number,
        //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
        //     ownerNo: selectedUserArr[0]?.owner_number,
        //     userDetails: {
        //       ...userDetails,
        //       userName: userName,
        //       suffix: suffix,
        //       suffixEng: suffixEng,
        //       suffixcode: suffixcode,
        //       suffixCodeEng: suffixCodeEng,
        //       subPropNo: subPropNo,
        //       nabhu: naBhu,
        //       lrPropertyUID: lrPropertyUID,
        //       milkat: milkat,
        //       namud: namud,
        //     },
        //     areaOfMutation: {
        //       isFullAreaGiven: radio,
        //       actualArea: actualArea,
        //       mutationArea: mutationArea,
        //       availableArea: availableArea,
        //     },
        //     address: {
        //       addressType: isIndian,
        //       indiaAddress: indiaAddress,
        //     },
        //   },
        //   (res) => {
        //     if (res?.Code == "1") {
        //       successToast(res?.Message);
        //       handleReset();
        //       getBhadepattaDenarTableData();
        //     } else {
        //       console.error(res?.Message);
        //       errorToast(res?.Message);
        //     }
        //   },
        //   (err) => {
        //     errorToast(err?.Message);
        //   },
        // );
      } else {
        errorToast("Please Check All Fields");
      }
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      if (result && isUserForeignAdd) {
        if (selectedRow) {
          successToast("Data is in console !");

          console.info("payload->>", {
            applicationid: applicationId,
            village_code: applicationData?.village_code,
            userDetails: {
              nabhu: naBhu,
              lrPropertyUID: lrPropertyUID,
              milkat: milkat,
              namud: namud,
              subPropNo: subPropNo,
              selectedMutation: selectedRow,
              reason: reason,
            },
            address: {
              addressType: isIndian,
              foreignAddress: foraighnAddress,
            },
          });
        } else {
          errorToast(" कृपया चूकदुरुस्ती नोंद करीता फेरफार निवडा");
        }
        // sendRequest(
        //   `${URLS?.BaseURL}/MutationAPIS/CreateBhadepattaNondGiver`,
        //   "POST",
        //   {
        //     applicationid: applicationId,
        //     village_code: applicationData?.village_code,
        //     ctsNo: selectedUserArr[0]?.cts_number,
        //     mutationSroNo: selectedUserArr[0]?.mutation_srno,
        //     ownerNo: selectedUserArr[0]?.owner_number,
        //     userDetails: {
        //       ...userDetails,
        //       userName: userName,
        //       suffix: suffix,
        //       suffixEng: suffixEng,
        //       suffixcode: suffixcode,
        //       suffixCodeEng: suffixCodeEng,
        //       nabhu: naBhu,
        //       lrPropertyUID: lrPropertyUID,
        //       milkat: milkat,
        //       namud: namud,
        //       subPropNo: subPropNo,
        //     },
        //     areaOfMutation: {
        //       isFullAreaGiven: radio,
        //       actualArea: actualArea,
        //       mutationArea: mutationArea,
        //       availableArea: availableArea,
        //     },
        //     address: {
        //       addressType: isIndian,
        //       foreignAddress: foraighnAddress,
        //     },
        //   },
        //   (res) => {
        //     if (res?.Code == "1") {
        //       successToast(res?.Message);
        //       handleReset();
        //       getBhadepattaDenarTableData();
        //     } else {
        //       errorToast(res?.Message);
        //     }
        //   },
        //   (err) => {
        //     errorToast(err?.Message);
        //   },
        // );
      } else {
        errorToast("Please Check All Fields");
      }
    }
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
    getUserDetails(obj?.actual_cts_no);
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
  // const handleUserName = (e) => {
  //   const code = e?.target?.value;
  //   const obj = userDataArr.find((o) => o?.owner_name == code);
  //   setUserName(code);
  //   setUserNameObj(obj);
  //   setIsMutationUndergoing(false);
  //   sendRequest(
  //     `${URLS?.BaseURL}/EPCISAPIS/validateMultipleMutationApplications`,
  //     "POST",
  //     {
  //       district_code: applicationData?.district_code,
  //       office_code: applicationData?.taluka_code,
  //       village_code: applicationData?.village_code,
  //       cts_no: obj?.cts_number,
  //       mutation_srno: obj?.mutation_srno,
  //       owner_no: obj?.owner_number,
  //       subprop_no: subPropNo,
  //     },
  //     (res) => {
  //       if (res?.Code == "1") {
  //         setIsMutationUndergoing(true);
  //         errorToast(res?.Message);
  //       } else {
  //         setIsMutationUndergoing(false);
  //         sendRequest(
  //           `${URLS?.BaseURL}/EPCISAPIS/getOwnerDetails`,
  //           "POST",
  //           {
  //             village_code: applicationData?.village_code,
  //             cts_no: obj?.cts_number,
  //             mut_sr_no: obj?.mutation_srno,
  //             owner_no: obj?.owner_number,
  //           },
  //           (res) => {
  //             const arr = JSON.parse(res?.ResponseData);
  //             setSelectedUserArr(arr);
  //           },
  //           (err) => {
  //             console.error(err);
  //           },
  //         );
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //     },
  //   );
  // };

  const handleRadioChange = (row) => {
    setSelectedRow(row);
  };
  return (
    <>
      <Toast />
      {/*------------------------------------address preview dialog--------------------- */}
      {/* <Dialog onClose={handleDialogClose} open={open} maxWidth="md">
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
      </Dialog> */}

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

            {!userLoading && userDataArr.length > 0 && (
              <Grid item md={12}>
                <h4 className="heading">चूकदुरुस्ती नोंद करीता फेरफार निवडा</h4>
                <Paper elevation={5} sx={{ backgroundColor: "#f4e7daff" }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>Select</b>
                          </TableCell>
                          <TableCell>
                            <b>Mutation No.</b>
                          </TableCell>
                          <TableCell>
                            <b>Mutation Date</b>
                          </TableCell>
                          <TableCell>
                            <b>SRO / Document No. / Date</b>
                          </TableCell>
                          <TableCell>
                            <b>Entry Details</b>
                          </TableCell>
                          <TableCell>
                            <b>Owner Details</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {Array.isArray(userDataArr) &&
                          userDataArr.map((row, index) => (
                            <TableRow key={index + row.var_mutation_number}>
                              <TableCell>
                                <Radio
                                  checked={selectedRow === row}
                                  onChange={() => handleRadioChange(row)}
                                />
                              </TableCell>
                              <TableCell>{row.var_mutation_number}</TableCell>
                              <TableCell>{row.var_mutation_date}</TableCell>
                              <TableCell>
                                {row.var_sro_office_name_marathi} /{" "}
                                {row.var_document_number} /{" "}
                                {row.var_document_date}
                              </TableCell>
                              <TableCell>{row.var_entry_details}</TableCell>
                              <TableCell>{row.var_owner_details}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}

            {userLoading && (
              <Grid item md={12} textAlign="center">
                <CircularProgress />
              </Grid>
            )}

            <Grid item md={12}>
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
            </Grid>

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
      </Grid>
    </>
  );
};

export default ChukDurustiNond;
