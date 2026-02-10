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
import URLS from "../../../../../../URLs/url";
import { errorToast, Toast } from "../../../../../../ui/Toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  firstNameEnglishValidationSchema,
  firstNameMarathiValidationSchema,
  lastNameEnglishValidationSchema,
  lastNameMarathiValidationSchema,
  middleNameEnglishValidationSchema,
  middleNameMarathiValidationSchema,
} from "../../../../../../Validations/yupValidations";
import {
  filterOnlyLettersAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../Validations/utils";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";

const TabaPavti = () => {
  const { sendRequest } = AxiosInstance();
  const [userTypeArr, setUserTypeArr] = useState([]);
  const [userType, setUserType] = useState(1);
  const [userTypeLabel, setUserTypeLabel] = useState("व्यक्ती");
  const [suffixArr, setSuffixArr] = useState([]);
  const [radio, setRadio] = useState("no");

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
    remarks: "",
  });
  const [tenureDetails, setTenureDetails] = useState({
    srNo: 3,
    newTenure: "",
    area: "",
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

  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
    const obj = userTypeArr.find(
      (o) => o.applicant_category_code == e?.target?.value
    );
    setUserTypeLabel(obj?.applicant_category_type);
  };
  const handleSuffix = (e) => {
    const value = e?.target?.value;
    const obj = suffixArr.find((o) => o.name_title == value);
    setUserNoMhProp({
      ...userNoMhProp,
      suffix: value,
      suffixEng: obj?.name_title_english,
      suffixcode: obj?.name_title_code,
      suffixCodeEng: obj?.name_title_code,
    });
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserNoMhProp({ ...userNoMhProp, [name]: value });
  };
  const handleRadioChange = (e) => {
    const value = e?.target?.value;
    setRadio(value);
  };
  const handleTenureChange = (e) => {
    const { name, value } = e?.target;
    setTenureDetails({ ...tenureDetails, [name]: value });
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
    getSuffix();
  }, []);
  return (
    <>
      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">ताबा पावती</h4>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={2}>
                <InputLabel className="inputlabel">
                  <b>ताबा घेणाराचा प्रकार </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  value={userType}
                  onChange={handleChangeUserType}
                  fullWidth
                  className="textfield"
                  size="small"
                >
                  {Array.isArray(userTypeArr) &&
                    userTypeArr.map((val, i) => {
                      return (
                        <MenuItem value={val?.applicant_category_code} key={i}>
                          {val?.applicant_category_type}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <InputLabel className="inputlabel">
              <b>
                ताबा पावती घेणाराचे नाव <span> *</span> (नाव टाइप केल्यावर स्पेस
                बार दाबा. उ.दा.:- mahesh &gt;&gt; महेश)
              </b>
            </InputLabel>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <Select
                  className="textfield"
                  value={userNoMhProp?.suffix}
                  fullWidth
                  size="small"
                  onChange={handleSuffix}
                >
                  {Array.isArray(suffixArr) &&
                    suffixArr.slice(0, -1).map((val, i) => {
                      return (
                        <MenuItem
                          value={val?.name_title}
                          key={val?.name_title + i}
                        >
                          {val?.name_title}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TransliterationTextField
                        value={userNoMhProp?.firstName}
                        name="firstName"
                        placeholder="पहिले नाव"
                        error={errors.firstName}
                        {...field}
                        onBlur={() => handleBlur("firstName")}
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
                        {errors.firstName && errors.firstName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TransliterationTextField
                        value={userNoMhProp?.middleName}
                        name="middleName"
                        placeholder="मधले नाव"
                        error={errors.middleName}
                        {...field}
                        onBlur={() => handleBlur("middleName")}
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
                        {errors.middleName && errors.middleName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TransliterationTextField
                        value={userNoMhProp?.lastName}
                        name="lastName"
                        placeholder="आडनाव"
                        error={errors.lastName}
                        {...field}
                        onBlur={() => handleBlur("lastName")}
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
                        {errors.lastName && errors.lastName.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid item md={12} mt={1}>
              <InputLabel className="inputlabel">
                <b>
                  ताबा पावती घेणाराचे नाव <span> *</span> (इंग्रजी मध्ये)
                </b>
              </InputLabel>
              <Grid container justifyContent="space-between">
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    value={userNoMhProp?.suffixEng}
                    className="textfieldDisabled"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="firstNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userNoMhProp?.firstNameEng}
                          name="firstNameEng"
                          placeholder="First name"
                          error={errors.firstNameEng}
                          {...field}
                          onBlur={() => handleBlur("firstNameEng")}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.firstNameEng && errors.firstNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="middleNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userNoMhProp?.middleNameEng}
                          name="middleNameEng"
                          placeholder="Middle Name"
                          error={errors.middleNameEng}
                          {...field}
                          onBlur={() => handleBlur("middleNameEng")}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.middleNameEng && errors.middleNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <Controller
                    name="lastNameEng"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          fullWidth
                          className="textfield"
                          value={userNoMhProp?.lastNameEng}
                          name="lastNameEng"
                          placeholder="Surname"
                          error={errors.lastNameEng}
                          {...field}
                          onBlur={() => handleBlur("lastNameEng")}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const filteredValue =
                              filterOnlyLettersAndSpaces(value);
                            field.onChange(filteredValue);
                            handleUserDetails({
                              target: { name, value: filteredValue },
                            });
                          }}
                          size="small"
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.lastNameEng && errors.lastNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <InputLabel className="inputlabel">
              <b>Remarks</b>
              {/* <span>*</span> */}
            </InputLabel>
            {/* <Controller
              name="firstNameEng"
              control={control}
              render={({ field }) => (
                <> */}
            <TextField
              fullWidth
              className="textfield"
              value={userNoMhProp?.remarks}
              name="remarks"
              placeholder="Remarks"
              multiline
              rows={3}
              // error={errors.firstNameEng}
              // {...field}
              // onBlur={() => handleBlur("firstNameEng")}
              // onChange={(e) => {
              //   const { name, value } = e.target;
              //   const filteredValue = filterOnlyLettersAndSpaces(value);
              //   field.onChange(filteredValue);
              //   handleUserDetails({
              //     target: { name, value: filteredValue },
              //   });
              // }}
              onChange={(e) => {
                handleUserDetails(e);
              }}
              size="small"
            />
            {/* <FormHelperText sx={{ color: "red" }}>
                    {errors.firstNameEng && errors.firstNameEng.message}
                  </FormHelperText>
                </>
              )}
            /> */}
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>कालावधीमध्ये काही बदल आहे का ?</b>
            </InputLabel>
            <RadioGroup row onChange={handleRadioChange} value={radio}>
              <FormControlLabel value="yes" control={<Radio />} label="होय" />
              <FormControlLabel value="no" control={<Radio />} label="नाही" />
            </RadioGroup>
          </Grid>

          {radio == "yes" && (
            <Grid item md={12}>
              <Paper elevation={5} sx={{ p: 2 }} className="papermain">
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <h4 className="heading">कालावधी माहिती</h4>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>Sr. No.</b>
                        </InputLabel>
                        <TextField
                          className="textfieldDisabled"
                          value={tenureDetails?.srNo}
                          size="small"
                          name="srNo"
                          disabled
                        />
                      </Grid>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>New Tenure</b>
                        </InputLabel>
                        <TextField
                          className="textfield"
                          value={tenureDetails?.newTenure}
                          size="small"
                          name="newTenure"
                          onChange={(e) => handleTenureChange(e)}
                        />
                      </Grid>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">
                          <b>Area</b>
                        </InputLabel>
                        <TextField
                          className="textfield"
                          value={tenureDetails?.area}
                          size="small"
                          name="area"
                          onChange={(e) => handleTenureChange(e)}
                        />
                      </Grid>
                      <Grid item md={2}>
                        <InputLabel className="inputlabel">&nbsp;</InputLabel>
                        <Button variant="contained">
                          कालावधी माहिती जतन करा
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          <Grid item md={12} textAlign="right">
            <Button sx={{ marginRight: 2 }}>ताबा पावती माहिती जतन करा</Button>
          </Grid>

          <Grid item md={12}>
            <TableContainer component={Paper} elevation={5}>
              <h3 style={{ marginLeft: 20 }}>ताबा पावती माहिती तक्ता</h3>
              <Table>
                <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>Sr. No.</TableCell>
                    <TableCell>New Tenure</TableCell>
                    <TableCell>Tenure Area</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell> 1</TableCell>
                    <TableCell>Tenure 1</TableCell>
                    <TableCell>30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell> 2</TableCell>
                    <TableCell>Tenure 2</TableCell>
                    <TableCell>20</TableCell>
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

export default TabaPavti;
