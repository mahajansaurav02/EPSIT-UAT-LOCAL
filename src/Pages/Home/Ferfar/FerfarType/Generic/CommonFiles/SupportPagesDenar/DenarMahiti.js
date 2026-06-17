import {
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
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TableContainer,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { nabhuValidationSchema } from "../../../../../../../Validations/yupValidations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast, Toast } from "../../../../../../../ui/Toast";
import URLS from "../../../../../../../URLs/url";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddAdditionalDenarDetails from "./AddAdditionalDenarDetails";
import ShowFilledDenarDetails from "./ShowFilledDenarDetails";

const DenarMahiti = ({ applicationData }) => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [actualArea, setActualArea] = useState("");

  const [userDataArr, setUserDataArr] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [denarData, setDenarData] = useState([]);

  const [selectedDenarForEdit, setSelectedDenarForEdit] = useState({});

  console.info("userDataArr->>", userDataArr);

  //--------------------------------Show Details-----------------------------
  const [openEditAdditionalDataDialog, setOpenEditAdditionalDataDialog] =
    useState(false);
  const [openShowFilledDetailsDialog, setOpenShowFilledDetailsDialog] =
    useState(false);

  const handleDialogCloseForAdditionalData = () => {
    setOpenEditAdditionalDataDialog(false);
    getGenericDenarTableData();
  };
  const showDetailsEditAdditionalFields = (val) => {
    setOpenEditAdditionalDataDialog(true);
    setSelectedDenarForEdit(val);
  };

  const handleDialogCloseForFilledData = () => {
    setOpenShowFilledDetailsDialog(false);
  };
  const showDetailsFilledFields = (val) => {
    setOpenShowFilledDetailsDialog(true);
  };

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
      })
    ),
    defaultValues: {
      nabhu: "",
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
    setActualArea(obj?.cityServeyAreaInSqm);
    getUserDetails(obj?.actual_cts_no, obj?.sub_property_no);
    setSelectedRows([]);
  };

  const getUserDetails = (nabhuNo, subPropNo) => {
    setUserLoading(true);
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
          setUserLoading(false);
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

  const handleSelectRow = (mutation_srno, owner_number) => {
    const uniqueKey = `${mutation_srno}-${owner_number}`;
    setSelectedRows((prev) =>
      prev.includes(uniqueKey)
        ? prev.filter((key) => key !== uniqueKey)
        : [...prev, uniqueKey]
    );
  };

  const handleSelected = () => {
    const selectedData = userDataArr.filter((row) =>
      selectedRows.includes(`${row.mutation_srno}-${row.owner_number}`)
    );
    const nabhuData = {
      naBhu,
      lrPropertyUID,
      milkat,
      namud,
      actualArea,
      subPropNo,
    };

    const mergedData = selectedData.map((item) => ({
      ...item,
      ...nabhuData,
      applicationId,
    }));

    if (selectedData.length === 0) {
      errorToast("कृपया निवडलेल्या न.भू.क्र. पैकी नाव/नावे निवडा");
    } else {
      sendRequest(
        `${URLS?.BaseURL}/MutationAPIS/CreateGenericNondForGiver`,
        "POST",
        mergedData,
        (res) => {
          if (res?.Code == "1") {
            successToast(res?.Message);
            setUserDataArr([]);
            setNaBhu("");
            setValue("nabhu", "");
            setLrPropertyUID("");
            setMilkat("land");
            setNamud("");
            setSubPropNo("");
            setActualArea("");
            getGenericDenarTableData();
          } else {
            errorToast(res?.Message);
          }
        },
        (err) => {
          errorToast(err?.Message);
        }
      );
    }
  };

  const handleDeleteGenericDenarEntry = (val) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteGenericNondForGiver`,
      "POST",
      {
        applicationid: applicationId,
        MutationId: val,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getGenericDenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getGenericDenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetGenericNondForGiver`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setDenarData(res?.ResponseData);
          successToast(res?.Message);
        } else {
          if (res?.ResponseData.length == 0) {
            setDenarData([]);
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
    getGenericDenarTableData();
  }, []);
  return (
    <>
      {/* <Toast /> */}

      {/*------------------------------------Edit Additional Details Dialog--------------------- */}
      <Dialog
        onClose={handleDialogCloseForAdditionalData}
        open={openEditAdditionalDataDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditAdditionalDataDialog(false)}
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
          <AddAdditionalDenarDetails
            val={selectedDenarForEdit}
            onClose={handleDialogCloseForAdditionalData}
          />
        </DialogContent>
      </Dialog>

      {/*------------------------------------Show Additional Details Dialog--------------------- */}
      <Dialog
        onClose={handleDialogCloseForFilledData}
        open={openShowFilledDetailsDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditAdditionalDataDialog(false)}
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
          <ShowFilledDenarDetails />
        </DialogContent>
      </Dialog>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">देणार</h4>
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
                              <MenuItem value={val?.naBhu} key={val?.naBhu + i}>
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
                <RadioGroup row value={milkat}>
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
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  value={actualArea}
                  size="small"
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>

          {!userLoading && userDataArr.length > 0 && (
            <Grid item md={12}>
              <h4 className="heading">
                निवडलेल्या न.भू.क्र.{naBhu} क्रमांकासाठी मालमत्ता पत्रिकेवरील
                नावे
              </h4>
              <Paper elevation={5} sx={{ backgroundColor: "#f4e7daff" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox" />
                        <TableCell>
                          <b>Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Mutation No</b>
                        </TableCell>
                        <TableCell>
                          <b>Owner No</b>
                        </TableCell>
                        <TableCell>
                          <b>Entry Date</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDataArr.map((row) => {
                        const uniqueKey = `${row.mutation_srno}-${row.owner_number}`;
                        const isChecked = selectedRows.includes(uniqueKey);
                        return (
                          <TableRow key={uniqueKey}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isChecked}
                                onChange={() =>
                                  handleSelectRow(
                                    row.mutation_srno,
                                    row.owner_number
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{row.owner_name}</TableCell>
                            <TableCell>{row.mutation_srno}</TableCell>
                            <TableCell>{row.owner_number}</TableCell>
                            <TableCell>{row.entry_date}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    mr: 2,
                    pb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelected}
                  >
                    जतन करा
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}

          {userLoading && (
            <Grid item md={12} textAlign="center">
              <CircularProgress />
            </Grid>
          )}

          <Grid item md={12}>
            <TableContainer component={Paper} elevation={5}>
              <h3 style={{ marginLeft: 20 }}>देणार माहिती तक्ता</h3>
              <Table>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>
                      जिल्हा / तालुका / न. भू. कार्यालय / गांव
                    </TableCell>
                    <TableCell>देणाराचे नाव</TableCell>
                    <TableCell>अर्जमधील न. भू. क्र.</TableCell>
                    <TableCell>Sub Property No.</TableCell>
                    <TableCell>फेरफारासाठी मिळकत</TableCell>
                    <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                    <TableCell>LR-Property UID</TableCell>
                    <TableCell>
                      मिळकत पत्रिके प्रमाणे क्षेत्र (चौ.मी.)
                    </TableCell>
                    <TableCell>देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</TableCell>
                    <TableCell>फेरफारासाठी दिलेले क्षेत्र (चौ.मी.)</TableCell>
                    <TableCell>भरलेली माहिती</TableCell>
                    <TableCell>कृती करा</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(denarData) &&
                    denarData.map((val, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            {applicationData?.district_name_in_marathi} /{" "}
                            {applicationData?.taluka_name} /{" "}
                            {applicationData?.village_name}
                          </TableCell>
                          <TableCell>
                            {val?.first_name} {val?.middle_name}{" "}
                            {val?.last_name}
                          </TableCell>
                          <TableCell>{val?.cts_number}</TableCell>
                          <TableCell>{val?.subPropNo}</TableCell>
                          <TableCell>
                            {val?.milkat == "land"
                              ? "भूखंड / जमीन (प्लॉट)"
                              : "अपार्टमेंट"}
                          </TableCell>
                          <TableCell>{val?.namud}</TableCell>
                          <TableCell>{val?.lrPropertyUID}</TableCell>
                          <TableCell>{val?.actualArea}</TableCell>
                          <TableCell>
                            {val?.areaForMutation?.availableArea}
                          </TableCell>
                          <TableCell>
                            {val?.areaForMutation?.mutationArea}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              onClick={showDetailsFilledFields}
                            >
                              माहिती पहा
                            </Button>
                          </TableCell>
                          <TableCell>
                            <>
                              <IconButton
                                color="success"
                                onClick={() =>
                                  showDetailsEditAdditionalFields(val)
                                }
                              >
                                <EditNoteOutlinedIcon />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDeleteGenericDenarEntry(
                                    val?.mutation_dtl_id
                                  )
                                }
                              >
                                <DeleteForeverOutlinedIcon />
                              </IconButton>
                            </>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default DenarMahiti;
