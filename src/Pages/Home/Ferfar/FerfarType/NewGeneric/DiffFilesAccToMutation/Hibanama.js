import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Select,
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import URLS from "../../../../../../URLs/url";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../../../../../Validations/utils";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";

const Hibanama = () => {
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];
  const [hibanamaDetails, setHibanamaDetails] = useState({
    permissionNo: "",
    permissionDate: "",
  });
  const [suffixArr, setSuffixArr] = useState([]);

  //-------------------------------check validations------------------------
  const [isValid, setIsValid] = useState({});
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);
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
    control,
    trigger,
    reset,
    setValue,
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
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    reset();
  };
  const handleHibanamaDetails = (e) => {
    const { name, value } = e?.target;
    setHibanamaDetails({ ...hibanamaDetails, [name]: value });
  };

  const getSuffix = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/nameTitleList`,
      "POST",
      null,
      (res) => {
        setSuffixArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err?.Message);
      }
    );
  };
  useEffect(() => {
    getSuffix();
  }, []);
  return (
    <>
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
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          </Grid>
          <Grid container justifyContent="end" px={2} mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<RotateRightRoundedIcon />}
                sx={{ mr: 2 }}
                // onClick={handleReset}
              >
                रीसेट करा
              </Button>
              <Button
                variant="contained"
                endIcon={<SaveRoundedIcon />}
                // onClick={handleSave}
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
                    <TableCell>नाव</TableCell>
                    <TableCell>पत्ता</TableCell>
                    <TableCell>कृती करा</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>First Middle last name</TableCell>
                    <TableCell>
                      Flat no A712, Tanish Park, Charholi Br. Haveli, Pune
                      412105
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        // onClick={() => handleDelete(val?.mutation_dtl_id)}
                      >
                        <DeleteForeverOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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
