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
import { vatanipatraGhenarNotesArr } from "../../../../../../../NotesArray/NotesArray";
import ShowAddress from "../../SupportPages/ShowAddress";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const VatniPatraGhenar = ({ setActiveStep, applicationData, setDisableShowNextBtn }) => {
  const applicationId = sessionStorage.getItem("applicationId");
  const { sendRequest } = AxiosInstance();
  const [giver, setGiverData] = useState([]);
  const [isMoreUsers, setIsMoreUsers] = useState("no");
  const [userTypeArr, setUserTypeArr] = useState([]);
  const [userType, setUserType] = useState(1);
  const [userTypeLabel, setUserTypeLabel] = useState("व्यक्ती");
  const [isMHProperty, setIsMHProperty] = useState("");
  const [property, setProperty] = useState("");
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
  const [companyNoMhProp, setCompanyNoMhProp] = useState({
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
    landBuyArea: "",
  });
  const [companyDharak, setCompanyDharak] = useState({
    holderType: {},
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
  });
  const [foraighnAddress, setForaighnAddress] = useState({
    address: "",
    mobile: "",
    email: "",
    emailOTP: "yes",
  });

  //-------------------------------check validations------------------
  const [isValid, setIsValid] = useState({});
  const [isMobileNoVerified, setIsMobileNoVerified] = useState(false);

  //------------------------------Combined States----------------------------
  const [takerResponseData, setTakerResponseData] = useState([]);
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
      `${URLS?.BaseURL}/MutationAPIS/DeleteVataniPatraNondForTaker`,
      "POST",
      {
        applicationId,
        mutationId: id
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          getGhenarTableData()
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

    setCompanyNoMhProp({
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
      landBuyArea: "",
    });
    setCompanyDharak({
      holderType: {},
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
    });
    setForaighnAddress({
      address: "",
      mobile: "",
      email: "",
      emailOTP: "",
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
    const completed = takerResponseData.length > 0;

    sessionStorage.setItem(
      "allowPoa",
      completed ? "yes" : "no"
    );

    setDisableShowNextBtn(!completed);
  }, [takerResponseData]);

  const handleSave = async () => {
    const isIndividual = userType == 1;
    const isIndia = isIndian === "india";

    const isPropertyValid = isIndividual
      ? await isValid.triggerUserNoMhProperty()
      : await isValid.triggerCompNoMhProperty();

    const isAddressValid = isIndia
      ? await isValid.triggerUserIndAdd()
      : await isValid.triggerUserForeignAdd();

    const isDharakValid = isIndividual
      ? await isValid.triggerUserDharak()
      : await isValid.triggerCompanyDharak();

    if (!isPropertyValid || !isAddressValid || !isDharakValid) {
      warningToast("Please Check All Fields !!");
      return;
    }

    if (isIndia && !isMobileNoVerified) {
      warningToast("Please Verify Mobile No.");
      return;
    }

    const payload = {
      usertype: userTypeLabel,
      usertype_code: userType,
      applicationid: applicationId,
      // userid: ,
      isMHProperty: {
        hasProperty: isMHProperty,
        propertyType: property,
        userDetails: isIndividual
          ? { ...userNoMhProp }
          : { ...companyNoMhProp }
      },
      dharak: isIndividual
        ? {
          userdharak: {
            ...userDharak,
          },
        }
        : {
          companydharak: {
            ...companyDharak,
          },
        },

      address: {
        addressType: isIndian,
        indiaAddress: {
          ...indiaAddress,
        },
        foreignAddress: {
          ...foraighnAddress,
        },
      },
      giver: giver,
    };

    console.log(JSON.stringify(payload, null, 2));

    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/CreateVataniPatraNondForTaker`,
      "POST",
      payload,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          handleReset();
          getGhenarTableData();
        } else {
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const getGhenarTableData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetVataniPatraNondTakerInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setTakerResponseData(res?.ResponseData);
        } else {
          setTakerResponseData([])
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  }

  const getGiverData = () => {
    sendRequest(
      `${URLS?.BaseURL}/MutationAPIS/GetVataniPatraGiverInfo`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          const data = res?.ResponseData;
          const result = data.map(
            ({ mutation_dtl_id, userDetails, ActualctsNo }) => ({
              mutation_dtl_id,
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
  }

  useEffect(() => {
    getGhenarTableData()
    getGiverData()
  }, []);

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
          arr={vatanipatraGhenarNotesArr}
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
                    </Grid>
                  </Grid>

                  <UserNoMHProperty
                    heading="वाटणीपत्र घेणाऱ्याची माहिती"
                    inputlabel="वाटणीपत्र घेणाऱ्याचे नाव"
                    userNoMhProp={userNoMhProp}
                    setUserNoMhProp={setUserNoMhProp}
                    setIsValid={setIsValid}
                    isReset={isReset}
                  />
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
              responseData={takerResponseData}
              isMobileCompulsary={true}
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          </Grid>

          {takerResponseData.length > 0 && (
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
                variant="contained"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ mr: 2 }}
                onClick={() => setActiveStep(0)}
                disabled={takerResponseData.length == 0}
              >
                वाटणीपत्र देणार-घेणार
              </Button>
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
          <h3 style={{ marginLeft: 20 }}>वाटणीपत्र घेणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>वाटणीपत्र घेणाराचा प्रकार</TableCell>
                <TableCell>वाटणीपत्र घेणाराचे नाव</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>धारक प्रकार</TableCell>
                <TableCell>स्त्री /पुरुष</TableCell>
                <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                <TableCell>जन्म दिनांक</TableCell>
                <TableCell>अ.पा.क</TableCell>
                <TableCell>वाटणीपत्र घेणाराचा पत्ता</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(takerResponseData) &&
                takerResponseData.map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {applicationData?.district_name_in_marathi} /{" "}
                        {applicationData?.taluka_name} /{" "}
                        {applicationData?.village_name}
                      </TableCell>
                      <TableCell>{val?.userType}</TableCell>
                      <TableCell>{val?.fullNameInMarathi}</TableCell>
                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.aliceName
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.holderType
                            ?.owner_status_description
                          : val?.dharak?.companydharak?.holderType
                            ?.owner_status_description}
                      </TableCell>

                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.gender?.gender_description
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.aapakDropdown
                            ?.apk_description
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.dob
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {val?.userType == "व्यक्ती"
                          ? val?.dharak?.userdharak?.aapak
                          : "-"}
                      </TableCell>
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
                          onClick={() => handleDelete(val?.mutation_dtl_id)}
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

export default VatniPatraGhenar;
