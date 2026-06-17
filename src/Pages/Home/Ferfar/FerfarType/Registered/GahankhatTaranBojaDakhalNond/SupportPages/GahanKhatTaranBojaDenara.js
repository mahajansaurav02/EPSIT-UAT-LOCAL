import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  InputLabel,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogTitle,
} from "@mui/material";
import UserAddress from "../../SupportPages/UserAddress";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";
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
import TransliterationTextField from "../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import {
  gahankhatTaranBojaDenaraNotesArr,
  gahankhatTaranBojaKamiKarneDenaraNotesArr,
} from "../../../../../../../NotesArray/NotesArray";
import ShowAddress from "../../SupportPages/ShowAddress";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../Validations/utils";

const GahankhatTaranBojaDenara = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [giver, setGiverData] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [isMoreUsers, setIsMoreUsers] = useState("no");
  const [bankArr, setBankArr] = useState([]);
  const [userDetails, setUserDetails] = useState({
    bankDropdown: {},
    bankNameMar: "",
    bankNameEng: "",
    ifsc: "",
    bojaArea: "",
    bojaValue: "",
    bojaDate: "",
    bojaPeriod: "",
  });
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
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);

  //------------------------------Combined States----------------------------
  const [isReset, setIsReset] = useState(false);
  const [responseData, setResponseData] = useState([]);

  //--------------------------------Show Address-----------------------------
  const [open, setOpen] = useState(false);
  const [addVal, setAddVal] = useState({});

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
        bankDropdown: yup.string().required("बँक / संस्था निवडा"),
        bankNameMar: yup.string().required("बँक/संस्थेचे नाव टाका"),
        bankNameEng: yup.string().required("Please add bank name"),
        ifsc: yup.string().required("IFSC कोड टाका"),
        bojaArea: yup.string().required("बोजा क्षेत्र टाका"),
        bojaValue: yup.string().required("बोजा मूल्य टाका"),
        bojaDate: yup.string().required("बोजा दिनांक टाका"),
        bojaPeriod: yup.string().required("बोजा कालावधी टाका"),
      })
    ),
    defaultValues: {
      bankDropdown: "",
      bankNameEng: "",
      bankNameMar: "",
      bojaArea: "",
      bojaDate: "",
      bojaPeriod: "",
      bojaValue: "",
      ifsc: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleBankType = (e) => {
    const code = e?.target?.value;
    const obj = bankArr.find((o) => o?.institute_code == code);
    setUserDetails({ ...userDetails, bankDropdown: obj });
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleIsMoreUser = (e) => {
    setIsMoreUsers(e?.target?.value);
    if (e?.target?.value == "yes") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setIsMoreUsers("no");
      }, 1000);
    }
  };
  const handleSave = async () => {
    if (isIndian == "india") {
      const result = await trigger();
      const isUserIndAdd = await isValid.triggerUserIndAdd();
      if (result && isUserIndAdd) {
        if (isMobileNoVerified) {
          sendRequest(
            // `${URLS?.BaseURL}/MutationAPIS/CreateGahankhatInfoForTaker`,
            `${URLS?.BaseURL}/MutationAPIS/CreateGahankhatInfoForGiver`,
            "POST",
            {
              applicationid: applicationId,
              giver: giver,
              userDetails: {
                ...userDetails,
              },
              address: {
                addressType: isIndian,
                indiaAddress: indiaAddress,
              },
            },
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                handleReset();
                getGahanKhatGhenarTableData();
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
          warningToast("Please Verify Mobile No.");
        }
      } else {
        errorToast("Please Check All Fields");
      }
    } else {
      const result = await trigger();
      const isUserForeignAdd = await isValid.triggerUserForeignAdd();
      if (result && isUserForeignAdd) {
        sendRequest(
          // `${URLS?.BaseURL}/MutationAPIS/CreateGahankhatInfoForTaker`,
          `${URLS?.BaseURL}/MutationAPIS/CreateGahankhatInfoForGiver`,
          "POST",
          {
            applicationid: applicationId,
            giver: giver,
            userDetails: {
              ...userDetails,
            },
            address: {
              addressType: isIndian,
              foreignAddress: foraighnAddress,
            },
          },
          (res) => {
            if (res?.Code == "1") {
              successToast(res?.Message);
              handleReset();
              getGahanKhatGhenarTableData();
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
        warningToast("Please Check All Fields");
      }
    }
  };
  const handleReset = () => {
    setUserDetails({
      bankDropdown: {},
      bankNameMar: "",
      bankNameEng: "",
      ifsc: "",
      bojaArea: "",
      bojaValue: "",
      bojaDate: "",
      bojaPeriod: "",
    });
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
    setIsMoreUsers("no");
    reset();
    setIsReset(!isReset);
  };
  const handleDelete = (id) => {
    sendRequest(
      // `${URLS?.BaseURL}/MutationAPIS/DeleteGahankhatInfoForTaker`,
      `${URLS?.BaseURL}/MutationAPIS/DeleteGahankhatInfoForGiver`,
      "POST",
      {
        mutationId: id,
        applicationId: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getGahanKhatGhenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getGahanKhatDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetGahankhatInfoForTaker`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          // setGiverData(res?.ResponseData);
          const data = res?.ResponseData;
          const result = data.map(
            ({ mutation_givertaker_id, userDetails, ActualctsNo }) => ({
              mutation_dtl_id: mutation_givertaker_id,
              nabhu: ActualctsNo,
              subPropNo: userDetails?.subPropNo,
            })
          );
          setGiverData(result);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const getGahanKhatGhenarTableData = () => {
    sendRequest(
      // `${URLS?.BaseURL}/MutationAPIS/GetGahankhatInfoForTaker`,
      `${URLS?.BaseURL}/MutationAPIS/GetGahankhatInfoForGiver`,
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

  const setBankType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/bojaInstituteList`,
      "POST",
      null,
      (res) => {
        setBankArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    getGahanKhatDenarTableData();
    getGahanKhatGhenarTableData();
    setBankType();
  }, []);

  useEffect(() => {
    if (responseData.length > 0) {
      sessionStorage.setItem("allowPoa", "yes");
      window.dispatchEvent(new Event("storage"));
    }
  }, [responseData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          heading={
            applicationData.mutation_type_code == "06"
              ? "गहाणखत / तारण / बोजा देणाराची माहिती भरण्यासाठी आवश्यक सूचना"
              : "गहाणखत / तारण / बोजा बँक / संस्था माहिती भरण्यासाठी आवश्यक सूचना"
          }
          arr={
            applicationData.mutation_type_code == "06"
              ? gahankhatTaranBojaDenaraNotesArr
              : gahankhatTaranBojaKamiKarneDenaraNotesArr
          }
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">
              गहाणखत / तारण / बोजा{" "}
              {applicationData.mutation_type_code == "06"
                ? "देणारा"
                : "बँक / संस्था"}
              देणारा
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container>
              <Grid item md={4}>
                <Controller
                  name="bankDropdown"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>बँक / संस्था </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        value={userDetails?.bankDropdown}
                        fullWidth
                        className="textfield"
                        size="small"
                        error={errors.bankDropdown}
                        {...field}
                        onBlur={() => handleBlur("bankDropdown")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleBankType(e);
                        }}
                      >
                        {Array.isArray(bankArr) &&
                          bankArr.map((val, i) => {
                            return (
                              <MenuItem key={i} value={val?.institute_code}>
                                {val?.institute_description}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bankDropdown && errors.bankDropdown.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={1}>
              <Grid item md={8}>
                <Controller
                  name="bankNameMar"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>
                          बँक / संस्थेचे नाव <span>*</span>(नाव टाइप केल्यावर
                          स्पेस बार दाबा. उ.दा.:- bank &gt;&gt; बँक)
                        </b>
                      </InputLabel>
                      <TransliterationTextField
                        value={userDetails?.bankNameMar}
                        name="bankNameMar"
                        error={errors.bankNameMar}
                        placeholder="बँकेचे नाव"
                        {...field}
                        onBlur={() => handleBlur("bankNameMar")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                          field.onChange(filteredValue);
                          handleUserDetails({
                            target: { name, value: filteredValue },
                          });
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bankNameMar && errors.bankNameMar.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={8}>
                <Controller
                  name="bankNameEng"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>
                          बँक / संस्थेचे नाव <span> *</span> (इंग्रजी मध्ये)
                        </b>
                      </InputLabel>
                      <TextField
                        value={userDetails?.bankNameEng}
                        fullWidth
                        className="textfield"
                        size="small"
                        name="bankNameEng"
                        placeholder="Bank Name"
                        error={errors.bankNameEng}
                        {...field}
                        onBlur={() => handleBlur("bankNameEng")}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   handleUserDetails(e);
                        // }}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const filteredValue =
                            filterOnlyLettersAndSpaces(value);
                          field.onChange(filteredValue);
                          handleUserDetails({
                            target: { name, value: filteredValue },
                          });
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bankNameEng && errors.bankNameEng.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Controller
                  name="ifsc"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>IFSC Code / Registration No. </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        value={userDetails?.ifsc}
                        fullWidth
                        className="textfield"
                        size="small"
                        name="ifsc"
                        error={errors.ifsc}
                        {...field}
                        onBlur={() => handleBlur("ifsc")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.ifsc && errors.ifsc.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="bojaArea"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>बोजा क्षेत्र (चौ.मी.) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        value={userDetails?.bojaArea}
                        fullWidth
                        className="textfield"
                        size="small"
                        type="text"
                        inputProps={{
                          maxLength: 10,
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
                        name="bojaArea"
                        error={errors.bojaArea}
                        {...field}
                        onBlur={() => handleBlur("bojaArea")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bojaArea && errors.bojaArea.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="bojaValue"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>बोजा मूल्य (रु.) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        value={userDetails?.bojaValue}
                        fullWidth
                        className="textfield"
                        size="small"
                        inputProps={{
                          maxLength: 11,
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
                        name="bojaValue"
                        error={errors.bojaValue}
                        {...field}
                        onBlur={() => handleBlur("bojaValue")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}

                        // onChange={(e) => {
                        //   const sanitizedValue = e.target.value.replace(
                        //     /[^0-9]/g,
                        //     ""
                        //   );
                        //   field.onChange(sanitizedValue);
                        //   const sanitizedEvent = {
                        //     ...e,
                        //     target: {
                        //       ...e.target,
                        //       value: sanitizedValue,
                        //     },
                        //   };
                        //   handleUserDetails(sanitizedEvent);
                        // }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bojaValue && errors.bojaValue.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="bojaDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>बोजा दिनांक (पासून) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        type="date"
                        fullWidth
                        className="textfield"
                        size="small"
                        name="bojaDate"
                        value={userDetails?.bojaDate}
                        onFocus={(event) => {
                          event.target.showPicker();
                        }}
                        inputProps={{
                          max: today,
                          min: "1900-01-01",
                        }}
                        error={errors.bojaDate}
                        {...field}
                        onBlur={() => handleBlur("bojaDate")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bojaDate && errors.bojaDate.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="bojaPeriod"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>बोजा कालावधी (महिने) </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        value={userDetails?.bojaPeriod}
                        fullWidth
                        className="textfield"
                        size="small"
                        type="text"
                        // inputProps={{
                        //   maxLength: 10,
                        //   inputMode: "decimal",
                        //   onInput: (e) => {
                        //     const value = e.target.value;
                        //     const regex = /^\d*\.?\d{0,2}$/;
                        //     if (!regex.test(value)) {
                        //       e.target.value =
                        //         value.match(/^\d*\.?\d{0,2}/)?.[0] || "";
                        //     }
                        //   },
                        // }}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          onInput: (e) => {
                            const value = e.target.value;
                            const regex = /^[0-9]*$/;
                            if (!regex.test(value)) {
                              e.target.value =
                                value.match(/^[0-9]*/)?.[0] || "";
                            }
                          },
                        }}
                        name="bojaPeriod"
                        error={errors.bojaPeriod}
                        {...field}
                        onBlur={() => handleBlur("bojaPeriod")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.bojaPeriod && errors.bojaPeriod.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type={
                applicationData.mutation_type_code == "06"
                  ? "gahankhatTaranBojaDakhalNondDenar"
                  : "gahankhatTaranBojaKamiKarneNondDenar"
              }
              hasSignature={false}
              isReset={isReset}
              isIndian={isIndian}
              setIsIndian={setIsIndian}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              responseData={responseData}
              isMobileCompulsary={true}
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          </Grid>

          {responseData.length > 0 && (
            <Grid item md={12}>
              <Grid
                container
                alignItems="center"
                spacing={4}
                justifyContent="flex-end"
              >
                <Grid
                  item
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <Typography variant="h5" fontSize="14px" fontWeight={600}>
                    आणखी गहाणखत / तारण / बोजा देणार आहे का?
                  </Typography>
                </Grid>

                <Grid item>
                  <RadioGroup
                    row
                    onChange={handleIsMoreUser}
                    value={isMoreUsers}
                    defaultValue="no"
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="होय"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="नाही"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Grid>
          )}

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
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>
            गहाणखत / तारण / बोजा
            {applicationData.mutation_type_code == "06"
              ? " देणारा "
              : " बँक / संस्था "}
            माहिती तक्ता
          </h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                {/* <TableCell>स्थिती</TableCell> */}
                <TableCell>बँक/संस्था</TableCell>
                <TableCell>बँक/संस्थेचे नाव</TableCell>
                <TableCell>बँक/संस्थेचा पत्ता</TableCell>
                <TableCell>IFSC/ Registration No.</TableCell>
                <TableCell>बोजा क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>बोजा मूल्य (रु.)</TableCell>
                <TableCell>बोजा दिनांक (पासून):</TableCell>
                <TableCell>बोजा कालावधी (महिने)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(responseData) &&
                responseData.map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {val?.userDetails?.bankDropdown?.institute_description}
                      </TableCell>
                      <TableCell>{val?.userDetails?.bankNameMar}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => showAddress(val)}
                        >
                          पत्ता पहा
                        </Button>
                      </TableCell>
                      <TableCell>{val?.userDetails?.ifsc}</TableCell>
                      <TableCell>{val?.userDetails?.bojaArea}</TableCell>
                      <TableCell>{val?.userDetails?.bojaValue}</TableCell>
                      <TableCell>{val?.userDetails?.bojaDate}</TableCell>
                      <TableCell>{val?.userDetails?.bojaPeriod}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(val?.mutation_givertaker_id)
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
    </>
  );
};

export default GahankhatTaranBojaDenara;
