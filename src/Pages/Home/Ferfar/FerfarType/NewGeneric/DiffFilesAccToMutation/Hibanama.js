import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import UserAddress from "../CommonFiles/Address/UserAddress";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  firstNameEnglishValidationSchema,
  firstNameMarathiValidationSchema,
  lastNameEnglishValidationSchema,
  lastNameMarathiValidationSchema,
  middleNameEnglishValidationSchema,
  middleNameMarathiValidationSchema,
} from "../../../../../../Validations/yupValidations";
import UserNoMHProperty from "../CommonFiles/SupportPagesGhenar/User/NoMHProperty/UserNoMHProperty";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import URLS from "../../../../../../URLs/url";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../../../../../Validations/utils";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import { errorToast, successToast, Toast, warningToast } from "../../../../../../ui/Toast";

const Hibanama = () => {
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const today = new Date().toISOString().split("T")[0];
  const [hibanamaDetails, setHibanamaDetails] = useState({
    permissionNo: "",
    permissionDate: "",
  });
  const [responseData, setResponseData] = useState([]);
  //-------------------------------check validations------------------------
  const [isValid, setIsValid] = useState({});
  const [isReset, setIsReset] = useState(false);
  const [userNoMhProp, setUserNoMhProp] = useState({
    suffix: "",
    suffixEng: "",
    suffixcode: "",
    suffixCodeEng: "",
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameEng: "",
    middleNameEng: "",
    lastNameEng: "",
  });
  const [aliceName, setAliceName] = useState("");
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

  const {
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: firstNameMarathiValidationSchema,
        middleName: middleNameMarathiValidationSchema,
        lastName: lastNameMarathiValidationSchema,
        firstNameEng: firstNameEnglishValidationSchema,
        middleNameEng: middleNameEnglishValidationSchema,
        lastNameEng: lastNameEnglishValidationSchema,
      })
    ),
    defaultValues: {
      firstName: "",
      firstNameEng: "",
      middleName: "",
      middleNameEng: "",
      lastName: "",
      lastNameEng: "",
    },
  });

  const handleReset = () => {
    setHibanamaDetails({
      permissionNo: "",
      permissionDate: "",
    });
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
  const handleHibanamaDetails = (e) => {
    const { name, value } = e?.target;
    setHibanamaDetails({ ...hibanamaDetails, [name]: value });
  };

  const handleSave = async () => {
    const isUserNoMhProperty = await isValid.triggerUserNoMhProperty();

    let isAddressValid = false;

    if (isIndian === "india") {
      isAddressValid = await isValid.triggerUserIndAdd();
    } else {
      isAddressValid = await isValid.triggerUserForeignAdd();
    }

    if (!isUserNoMhProperty || !isAddressValid) {
      warningToast("Please Check All Fields !!");
      return;
    }

    const payload = {
      applicationid: applicationId,
      permissionNo: hibanamaDetails?.permissionNo,
      permissionDate: hibanamaDetails?.permissionDate,

      witnessDetails: {
        suffix: userNoMhProp?.suffix,
        suffixEng: userNoMhProp?.suffixEng,
        suffixcode: userNoMhProp?.suffixcode,
        suffixCodeEng: userNoMhProp?.suffixCodeEng,
        firstName: userNoMhProp?.firstName,
        middleName: userNoMhProp?.middleName,
        lastName: userNoMhProp?.lastName,
        firstNameEng: userNoMhProp?.firstNameEng,
        middleNameEng: userNoMhProp?.middleNameEng,
        lastNameEng: userNoMhProp?.lastNameEng,
        aliceName,
      },

      address: {
        addressType: isIndian,
        ...(isIndian === "india"
          ? {
            indiaAddress,
          }
          : {
            foreignAddress: foraighnAddress,
          }),
      },
    };

    console.log("payload", JSON.stringify(payload, null, 2));

    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/SaveHibanamaWitnessInfo`,
      "POST",
      payload,
      (res) => {
        if (res?.Code === "1") {
          successToast(res?.Message);
          handleReset();
          getWitnessData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };;

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteHibanamaWitnessInfo`,
      "POST",
      {
        "witnessInfoId": id,
        "applicationid": applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getWitnessData();
        } else {
          console.error(res?.Message);
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
        console.error(err?.Message);
      }
    );
  }

  const getWitnessData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetHibanamaWitnessInfo`,
      "POST",
      applicationId,
      (res) => {
        console.log("res", res)
        setResponseData(res?.ResponseData);
        successToast(res?.Message);
      },
      (err) => {
        console.error(err?.Message);
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    getWitnessData();
  }, []);

  return (
    <>
      <Toast />
      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">हिबानामा</h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className="inputlabel">
                  <b>Waqf Board's Permission Number</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  value={hibanamaDetails?.permissionNo}
                  name="permissionNo"
                  onChange={(e) => {
                    handleHibanamaDetails(e);
                  }}
                  size="small"
                />
              </Grid>

              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>Waqf Board's Permission Date</b>
                </InputLabel>
                <TextField
                  fullWidth
                  type="date"
                  className="textfield"
                  name="permissionDate"
                  value={hibanamaDetails?.permissionDate}
                  onFocus={(event) => {
                    event.target.showPicker();
                  }}
                  inputProps={{
                    max: today,
                    min: "1900-01-01",
                  }}
                  onChange={(e) => handleHibanamaDetails(e)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <UserNoMHProperty
              heading="साक्षीदार माहिती"
              inputlabel="साक्षीदाराचे नाव"
              userNoMhProp={userNoMhProp}
              setUserNoMhProp={setUserNoMhProp}
              setIsValid={setIsValid}
              isReset={isReset}
            />
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                <InputLabel className="inputlabel">
                  <b>
                    उर्फ नाव (नाव टाइप केल्यावर स्पेस बार दाबा. उ.दा.:- mahesh
                    &gt;&gt; महेश)
                  </b>
                </InputLabel>
                <TransliterationTextField
                  value={aliceName}
                  name="aliceName"
                  placeholder="उर्फ नाव लिहा"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                    setAliceName(filteredValue);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <UserAddress
              type="hibanama"
              hasSignature={false}
              isReset={isReset}
              isIndian={isIndian}
              setIsIndian={setIsIndian}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              isMobileCompulsary={true}
            />
          </Grid>
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

          <Grid item md={12} mt={3}>
            <TableContainer component={Paper} elevation={5}>
              <h3 style={{ marginLeft: 20 }}>साक्षीदार माहिती तक्ता</h3>
              <Table>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>अ. क्र.</TableCell>
                    <TableCell>Waqf Board's Permission Number</TableCell>
                    <TableCell>Waqf Board's Permission Date</TableCell>
                    <TableCell>साक्षीदाराचे नाव</TableCell>
                    <TableCell>उर्फ नाव</TableCell>
                    <TableCell>साक्षीदाराचेजिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                    <TableCell>कृती करा</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(responseData) &&
                    responseData.map((val, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{val?.permissionNo || "-"}</TableCell>
                          <TableCell>{val?.permissionDate || "-"}</TableCell>
                          <TableCell>{val?.witnessDetails?.suffix + " " + val?.witnessDetails?.firstName + " " + val?.witnessDetails?.middleName + " " + val?.witnessDetails?.lastName}</TableCell>
                          <TableCell>{val?.witnessDetails?.aliceName || "-"}</TableCell>
                          <TableCell>{val?.address?.addressType == "FOREIGN" ? val?.address?.foreignAddress?.address
                            : val?.address?.indiaAddress}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(val?.witness_info_id)}
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
      </Paper>
    </>
  );
};

export default Hibanama;
