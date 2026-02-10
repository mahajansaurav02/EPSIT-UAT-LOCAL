import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
  Typography,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import UserNoMHProperty from "../../SupportPages/User/NoMHProperty/UserNoMHProperty";
import UserMHPropertyType712 from "../../SupportPages/User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "../../SupportPages/User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "../../SupportPages/User/MHProperty/UserMHPropertyTypeULPIN";
import CompanyNoMHProperty from "../../SupportPages/Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "../../SupportPages/Company/MHProperty/CompanyMHPropertyType712";
import CompanyMHPropertyTypePropertyCard from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypeULPIN";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import CloseIcon from "@mui/icons-material/Close";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import UserAddress from "../../SupportPages/UserAddress";
import UserDharak from "./UserDharak";
import CompanyDharak from "./CompanyDharak";
import {
  errorToast,
  successToast,
  Toast,
  warningToast,
} from "../../../../../../../ui/Toast";
import URLS from "../../../../../../../URLs/url";
import NotesPaper from "../../../../../../../ui/NotesPaper/NotesPaper";
import { bakshishpatraGhenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import { useNavigate } from "react-router-dom";
import ShowAddress from "../../SupportPages/ShowAddress";

const VatniPatraGhenar = ({ applicationData }) => {
  const applicationId = sessionStorage.getItem("applicationId");
  const navigate = useNavigate();
  const { sendRequest } = AxiosInstance();
  const [giver, setGiverData] = useState([]);
  const [isMoreUsers, setIsMoreUsers] = useState("no");
  const [userTypeArr, setUserTypeArr] = useState([]);
  const [userType, setUserType] = useState(1);
  const [userTypeLabel, setUserTypeLabel] = useState("व्यक्ती");
  const [isMHProperty, setIsMHProperty] = useState("no");
  const [isULPIN, setIsULPIN] = useState("yes");
  const [property, setProperty] = useState("712");
  const [photo, setPhoto] = useState({
    passportName: "",
    passportSrc: "",
  });
  const [passportError, setPassportError] = useState("");
  //---------------------------state up data of Address---------------------
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
  const [userMhPropType712, setUserMhPropType712] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [userMhPropTypePropertyCard, setUserMhPropTypePropertyCard] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [userMhPropULPIN, setUserMhPropULPIN] = useState({
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    district: "",
    taluka: "",
    village: "",
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
  const [companyNoMhProp, setCompanyNoMhProp] = useState({
    companyName: "",
    companyNameEng: "",
  });
  const [companyMhPropType712, setCompanyMhPropType712] = useState({
    district: "",
    taluka: "",
    village: "",
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    companyName: "",
    companyNameEng: "",
  });
  const [companyMhPropTypePropertyCard, setCompanyMhPropTypePropertyCard] =
    useState({
      district: "",
      taluka: "",
      village: "",
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      companyName: "",
      companyNameEng: "",
    });
  const [companyMhPropULPIN, setCompanyMhPropULPIN] = useState({
    district: "",
    taluka: "",
    village: "",
    khataNo: "",
    naBhu: "",
    ulpin: "",
    userName: "",
    companyName: "",
    companyNameEng: "",
  });
  const [userDharak, setUserDharak] = useState({
    aliceName: "",
    aapakDropdown: {},
    aapak: "",
    aapakRelation: {},
    gender: {},
    holderType: {},
    dob: "",
    motherName: "",
    motherNameEng: "",
    giftArea: "NA",
  });
  const [companyDharak, setCompanyDharak] = useState({
    holderType: {},
    giftArea: "NA",
  });
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
  const [responseData, setResponseData] = useState([]);
  const [isReset, setIsReset] = useState(false);

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

  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
    const obj = userTypeArr.find(
      (o) => o.applicant_category_code == e?.target?.value
    );
    setUserTypeLabel(obj?.applicant_category_type);
  };
  const handleMHProperty = (e) => {
    setIsMHProperty(e?.target?.value);
  };
  const handleIsULPIN = (e) => {
    setIsULPIN(e?.target?.value);
  };
  const handlePropertyType = (e) => {
    setProperty(e?.target?.value);
  };
  const handlePassportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setPassportError("File should be less than 256 KB");
        setPhoto({
          ...photo,
          passportName: "",
          passportSrc: "",
        });
      } else {
        setPassportError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto({
            ...photo,
            passportSrc: reader.result,
            passportName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPassportError("");
      setPhoto({
        ...photo,
        passportName: "",
        passportSrc: "",
      });
    }
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

  const handleDelete = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/DeleteBakshishPatraForTaker`,
      "POST",
      {
        mutationId: id,
        applicationId: applicationId,
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleReset = () => {
    setUserType(1);
    setUserTypeLabel("व्यक्ती");
    setIsMHProperty("no");
    setIsULPIN("yes");
    setProperty("712");
    setPhoto({
      passportName: "",
      passportSrc: "",
    });
    setUserNoMhProp({
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
    setUserMhPropType712({
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      district: "",
      taluka: "",
      village: "",
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
    setUserMhPropTypePropertyCard({
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      district: "",
      taluka: "",
      village: "",
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
    setUserMhPropULPIN({
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      district: "",
      taluka: "",
      village: "",
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
    setCompanyNoMhProp({
      companyName: "",
      companyNameEng: "",
    });
    setCompanyMhPropType712({
      district: "",
      taluka: "",
      village: "",
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      companyName: "",
      companyNameEng: "",
    });
    setCompanyMhPropTypePropertyCard({
      district: "",
      taluka: "",
      village: "",
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      companyName: "",
      companyNameEng: "",
    });
    setCompanyMhPropULPIN({
      district: "",
      taluka: "",
      village: "",
      khataNo: "",
      naBhu: "",
      ulpin: "",
      userName: "",
      companyName: "",
      companyNameEng: "",
    });
    setUserDharak({
      aliceName: "",
      aapakDropdown: {},
      aapak: "",
      aapakRelation: {},
      gender: {},
      holderType: {},
      dob: "",
      motherName: "",
      motherNameEng: "",
      giftArea: "",
    });
    setCompanyDharak({
      holderType: {},
      giftArea: "",
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
    setIsMoreUsers("no");
    setIsReset(!isReset);
  };

  const setIntialUserType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/applicationTypeList`,
      "POST",
      null,
      (res) => {
        setUserTypeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  useEffect(() => {
    setIntialUserType();
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
          heading="वाटणीपत्र घेणारा आवश्यक सूचना"
          arr={bakshishpatraGhenarNotesArr}
        />
      </Grid>

      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 className="heading">वाटणीपत्र घेणार</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container spacing={2}>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>वाटणीपत्र घेणाराचा प्रकार </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          value={userType}
                          onChange={handleChangeUserType}
                          className="textfield"
                          fullWidth
                          size="small"
                        >
                          {Array.isArray(userTypeArr) &&
                            userTypeArr.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.applicant_category_code}
                                  key={i}
                                >
                                  {val?.applicant_category_type}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </Grid>
                      {/* <Grid item md={4}>
                        <InputLabel className="inputlabel">
                          <b>आपल्या नावे महाराष्ट्रात मिळकत आहे का ? </b>
                          <span>*</span>
                        </InputLabel>
                        <RadioGroup
                          row
                          value={isMHProperty}
                          onChange={handleMHProperty}
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
                      {isMHProperty == "yes" && (
                        <Grid item md={3}>
                          <InputLabel className="inputlabel">
                            <b>आपणास ULPIN माहीत आहे का ? </b>
                            <span>*</span>
                          </InputLabel>
                          <RadioGroup
                            row
                            value={isULPIN}
                            onChange={handleIsULPIN}
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
                      )}
                      {isMHProperty == "yes" && isULPIN == "no" && (
                        <Grid item md={3}>
                          <InputLabel className="inputlabel">
                            <b>मालमत्ता प्रकार निवडा </b>
                            <span>*</span>
                          </InputLabel>
                          <RadioGroup
                            row
                            sx={{ flexWrap: "nowrap" }}
                            value={property}
                            onChange={handlePropertyType}
                          >
                            <FormControlLabel
                              value="712"
                              control={<Radio />}
                              label="7/12"
                            />
                            <FormControlLabel
                              value="propertyCard"
                              control={<Radio />}
                              label="Property Card"
                            />
                          </RadioGroup>
                        </Grid>
                      )} */}
                    </Grid>
                  </Grid>

                  {userType == 1 ? (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <UserNoMHProperty
                          heading="वाटणीपत्र घेणाऱ्याची माहिती"
                          inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                          userNoMhProp={userNoMhProp}
                          setUserNoMhProp={setUserNoMhProp}
                          setIsValid={setIsValid}
                          isReset={isReset}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <UserMHPropertyType712
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              userMhPropType712={userMhPropType712}
                              setUserMhPropType712={setUserMhPropType712}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <UserMHPropertyTypePropertyCard
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              userMhPropTypePropertyCard={
                                userMhPropTypePropertyCard
                              }
                              setUserMhPropTypePropertyCard={
                                setUserMhPropTypePropertyCard
                              }
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {isULPIN == "yes" && (
                            <UserMHPropertTypeULPIN
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              userMhPropULPIN={userMhPropULPIN}
                              setUserMhPropULPIN={setUserMhPropULPIN}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <CompanyNoMHProperty
                          heading="वाटणीपत्र घेणाऱ्याची माहिती"
                          inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                          companyNoMhProp={companyNoMhProp}
                          setCompanyNoMhProp={setCompanyNoMhProp}
                          setIsValid={setIsValid}
                          isReset={isReset}
                        />
                      ) : (
                        <>
                          {property == "712" && isULPIN == "no" && (
                            <CompanyMHPropertType712
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              companyMhPropType712={companyMhPropType712}
                              setCompanyMhPropType712={setCompanyMhPropType712}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {property == "propertyCard" && isULPIN == "no" && (
                            <CompanyMHPropertyTypePropertyCard
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              companyMhPropTypePropertyCard={
                                companyMhPropTypePropertyCard
                              }
                              setCompanyMhPropTypePropertyCard={
                                setCompanyMhPropTypePropertyCard
                              }
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                          {isULPIN == "yes" && (
                            <CompanyMHPropertyTypeULPIN
                              heading="वाटणीपत्र घेणाऱ्याची माहिती"
                              inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                              companyMhPropULPIN={companyMhPropULPIN}
                              setCompanyMhPropULPIN={setCompanyMhPropULPIN}
                              setIsValid={setIsValid}
                              isReset={isReset}
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            {userType == 1 ? (
              <UserDharak
                userDharak={userDharak}
                isReset={isReset}
                setUserDharak={setUserDharak}
                setIsValid={setIsValid}
                mutCode={applicationData?.mutation_type_code}
              />
            ) : (
              <CompanyDharak
                companyDharak={companyDharak}
                isReset={isReset}
                setCompanyDharak={setCompanyDharak}
                setIsValid={setIsValid}
              />
            )}
          </Grid>

          <Grid item md={12}>
            <UserAddress
              type="vatniPatraGhenar"
              hasSignature={false}
              isIndian={isIndian}
              setIsIndian={setIsIndian}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              isReset={isReset}
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
                    आणखी वाटणीपत्र घेणार आहे का?
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
        </Grid>
      </Paper>
      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>वाटणीपत्र घेणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>वाटणीपत्र घेणाराचा प्रकार</TableCell>
                <TableCell>वाटणीपत्र घेणाराचे नाव</TableCell>
                <TableCell>वाटणीपत्र घेणाराचा पत्ता</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>धारक प्रकार</TableCell>
                <TableCell>स्त्री /पुरुष</TableCell>
                <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                <TableCell>जन्म दिनांक</TableCell>
                <TableCell>अ.पा.क</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    // onClick={() => showAddress(val)}
                  >
                    पत्ता पहा
                  </Button>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>

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
    </>
  );
};

export default VatniPatraGhenar;
