import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  InputAdornment,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
  simpletextfieldValidationSchema,
} from "../../../../../../Validations/yupValidations";
import LRInstance from "../../../../../../Instance/LRInstance";
import URLS from "../../../../../../URLs/url";

const CompanyMHPropertyTypeULPIN = ({
  isEdit,
  editFields,
  companyMhPropULPIN,
  setCompanyMhPropULPIN,
  setIsValid,
}) => {
  const { sendRequestLR } = LRInstance();
  const [propULPIN, setPropULPIN] = useState();
  const [propTypeULPIN, setPropTypeULPIN] = useState({
    ulpin: "",
    district: "पुणे",
    taluka: "हवेली",
    village: "बावधन",
  });
  // const [companyNameDropdown, setCompanyNameDropdown] = useState("");
  // const [companyDetails, setCompanyDetails] = useState({
  //   companyName: "",
  //   companyNameEng: "",
  // });

  const {
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        ulpin: simpletextfieldValidationSchema,
        companyName: yup.string().required("Company Name is required"),
        companyMar: companyNamemarathiValidationSchema,
        companyEng: companyNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleULPINChange = (e) => {
    const { name, value } = e?.target;
    setPropTypeULPIN({ ...propTypeULPIN, [name]: value });
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      ...propTypeULPIN,
      [name]: value,
    });

    const firstDigit = value.charAt(0);
    if (firstDigit >= 1 && firstDigit <= 4) {
      console.info("firstDigit-if->>", firstDigit);
    } else if (firstDigit >= "5" && firstDigit <= "9") {
      console.info("firstDigit-else->>", firstDigit);
    }
  };
  const searchULPIN = () => {
    sendRequestLR(
      `${URLS?.BaseUrlLR}/getULPINDetails`,
      "POST",
      {
        ulpin: propTypeULPIN?.ulpin,
      },
      (res) => {
        setPropULPIN(res);
        setPropTypeULPIN();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  const handleCompanyName = (e) => {
    // setCompanyNameDropdown(e?.target?.value);
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      companyNameDropdown: e?.target?.value,
    });
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    // setCompanyDetails({ ...companyDetails, [name]: value });
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      [name]: value,
    });
  };

  // useEffect(() => {
  //   setValue("ulpin", companyMhPropULPIN?.ulpin);
  //   setValue("companyName", companyMhPropULPIN?.companyNameDropdown);
  //   setValue("companyMar", companyMhPropULPIN?.companyName);
  //   setValue("companyEng", companyMhPropULPIN?.companyNameEng);
  // }, [isEdit]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompPropULPIN: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      {editFields ? (
        <>
          <Grid item md={12} mt={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Controller
                  name="ulpin"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>ULPIN </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        className="textfield"
                        type="number"
                        size="small"
                        name="ulpin"
                        error={errors.ulpin}
                        inputProps={{
                          maxLength: 11,
                          max: 99999999999,
                          min: 0,
                          onInput: (e) => {
                            if (e.target.value.startsWith("0")) {
                              e.target.value = e.target.value.slice(1);
                            }

                            if (e.target.value.length > 11) {
                              e.target.value = e.target.value.slice(0, 11);
                            }
                          },
                        }}
                        {...field}
                        value={propTypeULPIN?.ulpin}
                        onBlur={() => handleBlur("ulpin")}
                        placeholder="ULPIN टाका"
                        onChange={(e) => {
                          field.onChange(e);
                          handleULPINChange(e);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<SearchRoundedIcon />}
                                onClick={searchULPIN}
                              >
                                शोधा
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.ulpin && errors.ulpin.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>जिल्हा</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.district}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>
                    {propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? "तालुका"
                      : "तालुका / न. भू. कार्यालय"}
                  </b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.taluka}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.village}
                  size="small"
                />
              </Grid>
              <Grid item md={2.25}>
                <InputLabel className="inputlabel">
                  <b>
                    {propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? "खाता क्रमांक"
                      : "न.भू.क्र. क्रमांक"}
                  </b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={
                    propTypeULPIN?.ulpin.charAt(0) >= 1 &&
                    propTypeULPIN?.ulpin.charAt(0) <= 4
                      ? propTypeULPIN?.khataNo
                      : propTypeULPIN?.naBhu
                  }
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} mb={2} mt={1}>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>अर्जदारचे नाव </b> <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    className="textfield"
                    size="small"
                    error={errors.companyName}
                    {...field}
                    value={companyMhPropULPIN?.companyNameDropdown}
                    onBlur={() => handleBlur("companyName")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCompanyName(e);
                    }}
                  >
                    <MenuItem value="company-1">
                      इंफोटेक प्रायवेट लिमिटेड - 1
                    </MenuItem>
                    <MenuItem value="company-2">
                      इंफोटेक प्रायवेट लिमिटेड - 2
                    </MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.companyName && errors.companyName.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
          <Grid item md={12}>
            <Controller
              name="companyMar"
              control={control}
              render={({ field }) => (
                <>
                  <TextField
                    fullWidth
                    className="textfield"
                    value={companyMhPropULPIN?.companyName}
                    name="companyName"
                    placeholder="इंफोटेक प्रायवेट लिमिटेड"
                    error={errors.companyMar}
                    {...field}
                    onBlur={() => handleBlur("companyMar")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCompanyDetails(e);
                    }}
                    size="small"
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.companyMar && errors.companyMar.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
          <Grid item md={12} mt={1}>
            <Controller
              name="companyEng"
              control={control}
              render={({ field }) => (
                <>
                  <TextField
                    fullWidth
                    className="textfield"
                    value={companyMhPropULPIN?.companyNameEng}
                    name="companyNameEng"
                    placeholder="Infotech Pvt.Ltd."
                    error={errors.companyEng}
                    {...field}
                    onBlur={() => handleBlur("companyEng")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCompanyDetails(e);
                    }}
                    size="small"
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.companyEng && errors.companyEng.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item md={12} mt={1}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>ULPIN </b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfieldDisabled"
                  size="small"
                  disabled
                  value={companyMhPropULPIN?.ulpin}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>जिल्हा</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.district}
                  name="district"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>तालुका</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.taluka}
                  name="taluka"
                  size="small"
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ</b>
                </InputLabel>
                <TextField
                  fullWidth
                  disabled
                  className="textfieldDisabled"
                  value={propTypeULPIN?.village}
                  name="village"
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} mb={2} mt={1}>
            <InputLabel className="inputlabel">
              <b>अर्जदारचे नाव </b>
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              className="textfieldDisabled"
              disabled
              value={companyMhPropULPIN?.companyNameDropdown}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              fullWidth
              className="textfieldDisabled"
              disabled
              value={companyMhPropULPIN?.companyName}
              size="small"
            />
          </Grid>
          <Grid item md={12} mt={1}>
            <TextField
              fullWidth
              className="textfieldDisabled"
              disabled
              value={companyMhPropULPIN?.companyNameEng}
              size="small"
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default CompanyMHPropertyTypeULPIN;
