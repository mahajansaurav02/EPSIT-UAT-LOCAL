import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
  TextField,
} from "@mui/material";
import NotesPaper from "../../../../../../ui/NotesPaper/NotesPaper";
import { errorToast, Toast } from "../../../../../../ui/Toast";
import ShowAddress from "../SupportPages/ShowAddress";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../URLs/url";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UserAddress from "../SupportPages/UserAddress";
import { nabhuValidationSchema } from "../../../../../../Validations/yupValidations";
import { filterOnlyMarathiLettersAndSpaces } from "../../../../../../Validations/utils";
const DharnaDhikarNond = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameObj, setUserNameObj] = useState({});
  const [userDataArr, setUserDataArr] = useState([]);
  const [selectedUserArr, setSelectedUserArr] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reasonArr, setReasonArr] = useState([]);

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
        userName: yup.string().required("धारणा धिकार निवडा"),
      })
    ),
    defaultValues: {
      nabhu: "",
      userName: "",
      firstNameEng: "",
      middleNameEng: "",
      lastNameEng: "",
      motherName: "",
      motherNameEng: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleNaBhuNo = (e) => {
    const code = e?.target?.value;
    setNaBhu(e?.target?.value);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    getUserDetails(obj?.actual_cts_no, obj?.sub_property_no);
  };
  const getUserDetails = (nabhuNo, subPropNo) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOwnerNameInfo`,
      "POST",
      {
        village_code: applicationData?.village_code,
        cts_no: nabhuNo,
        subprop_no: subPropNo,
      },
      (res) => {
        if (res?.Code == "1") {
          setUserDataArr(JSON.parse(res?.ResponseData));
        } else {
          errorToast(res?.Message);
          setUserDataArr([]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleUserName = (e) => {
    const code = e?.target?.value;
    const obj = userDataArr.find((o) => o?.owner_name == code);
    setUserName(code);
    setUserNameObj(obj);
    setIsMutationUndergoing(false);
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/validateMultipleMutationApplications`,
      "POST",
      {
        district_code: applicationData?.district_code,
        office_code: applicationData?.taluka_code,
        village_code: applicationData?.village_code,
        cts_no: obj?.cts_number,
        mutation_srno: obj?.mutation_srno,
        owner_no: obj?.owner_number,
        subprop_no: subPropNo,
      },
      (res) => {
        if (res?.Code == "1") {
          setIsMutationUndergoing(true);
          errorToast(res?.Message);
        } else {
          setIsMutationUndergoing(false);
          sendRequest(
            `${URLS?.BaseURL}/EPCISAPIS/getOwnerDetails`,
            "POST",
            {
              village_code: applicationData?.village_code,
              cts_no: obj?.cts_number,
              mut_sr_no: obj?.mutation_srno,
              owner_no: obj?.owner_number,
            },
            (res) => {
              const arr = JSON.parse(res?.ResponseData);
              setSelectedUserArr(arr);
            },
            (err) => {
              console.error(err);
            }
          );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const getReason = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/reasonForOwnerNameChange`,
      "POST",
      null,
      (res) => {
        if (res?.Code == "1") {
          setReasonArr(JSON.parse(res?.ResponseData));
        } else {
          errorToast(res?.Message);
          setReasonArr([]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    getReason();
  }, []);
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
          heading="धारणा धिकार माहिती भरण्यासाठी आवश्यक सूचना"
          // arr={mryutupatraDenarNotesArrUnRegistered}
        />
      </Grid>
      <Grid item md={12}>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">धारणा धिकार नोंद</h4>
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
            <Grid item md={4} mb={2}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>धारक निवडा </b>
                      <span>*</span>
                    </InputLabel>
                    <Select
                      fullWidth
                      className="textfield"
                      size="small"
                      value={userName}
                      error={errors.userName}
                      {...field}
                      onBlur={() => handleBlur("userName")}
                      onChange={(e) => {
                        field.onChange(e);
                        handleUserName(e);
                      }}
                    >
                      {Array.isArray(userDataArr) &&
                        userDataArr.map((val, i) => {
                          return (
                            <MenuItem
                              key={val?.owner_number + i}
                              value={val?.owner_name}
                            >
                              {val?.owner_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.userName && errors.userName.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item md={2}>
              <InputLabel className="inputlabel">
                <b>धारणा धिकार सद्यस्थिती</b>
              </InputLabel>
              <TextField
                fullWidth
                // value={userDetails?.firstName}
                className="textfieldDisabled"
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={2}>
              <Controller
                name="deathCertificateIssueOfficeDropdown"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>धारणा धिकार कारण </b>
                      <span>*</span>
                    </InputLabel>
                    <Select
                      name="deathCertificateIssueOfficeDropdown"
                      fullWidth
                      className="textfield"
                      size="small"
                      // value={userDetails?.deathCertificateIssueOfficeDropdown}
                      // error={errors.deathCertificateIssueOfficeDropdown}
                      // {...field}
                      // onBlur={() =>
                      //   handleBlur("deathCertificateIssueOfficeDropdown")
                      // }
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   handleOfficeNameDetails(e);
                      // }}
                    >
                      {Array.isArray(reasonArr) &&
                        reasonArr.map((val, i) => {
                          return (
                            <MenuItem
                              value={val?.name_change_by_code}
                              key={val?.name_change_by_code + i}
                            >
                              {val?.name_change_by_description}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {/* <FormHelperText sx={{ color: "red" }}>
                        {errors.deathCertificateIssueOfficeDropdown &&
                          errors.deathCertificateIssueOfficeDropdown.message}
                      </FormHelperText> */}
                  </>
                )}
              />
            </Grid>
            <Grid item md={2}>
              <Controller
                name="deathCertificateNo"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>क्रमांक </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField
                      fullWidth
                      className="textfield"
                      size="small"
                      name="deathCertificateNo"
                      // value={userDetails?.deathCertificateNo}
                      // error={errors.deathCertificateNo}
                      // {...field}
                      // onBlur={() => handleBlur("deathCertificateNo")}
                      // onChange={(e) => {
                      //   const { name, value } = e.target;
                      //   const filteredValue =
                      //     filterOnlyLettersNumbersAndSpacesForMryutuDakhlaNo(
                      //       value
                      //     );
                      //   field.onChange(filteredValue);
                      //   handleUserDetails({
                      //     target: { name, value: filteredValue },
                      //   });
                      // }}
                    />
                    {/* <FormHelperText sx={{ color: "red" }}>
                        {errors.deathCertificateNo &&
                          errors.deathCertificateNo.message}
                      </FormHelperText> */}
                  </>
                )}
              />
            </Grid>
            <Grid item md={2}>
              <InputLabel className="inputlabel">
                <b>धारणाधिकारातील बदल </b>
                <span>*</span>
              </InputLabel>
              <TextField
                fullWidth
                className="textfield"
                size="small"
                onChange={(e) => {
                  const { name, value } = e.target;
                  const filteredValue =
                    filterOnlyMarathiLettersAndSpaces(value);
                  // handleUserDetails({
                  //   target: { name, value: filteredValue },
                  // });
                }}
              />
            </Grid>

            <Grid item md={12}>
              <UserAddress
                type="dharnaDhikarNond"
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
                  // onClick={() => {
                  //   handleReset();
                  // }}
                >
                  रीसेट करा
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SaveRoundedIcon />}
                  // onClick={handleSave}
                  //   disabled={isMutationUndergoing || responseData.length >= 1}
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

export default DharnaDhikarNond;
