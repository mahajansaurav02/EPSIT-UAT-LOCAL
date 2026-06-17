import React, { useEffect, useState } from "react";
import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
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
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import URLS from "../../../../../../URLs/url";
import LRInstance from "../../../../../../Instance/LRInstance";

const CompanyMHPropertyTypeULPIN = ({
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

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        ulpin: simpletextfieldValidationSchema,
        companyNameDropdown: yup.string().required("Company Name is required"),
        companyName: companyNamemarathiValidationSchema,
        companyNameEng: companyNameEnglishValidationSchema,
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
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      userName: e?.target?.value,
    });
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      [name]: value,
    });
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompPropULPIN: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
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
      <Grid item md={12}>
        <h4 className="heading">वापरकर्त्याची माहिती</h4>
      </Grid>
      <Grid item md={4} mb={2}>
        <Controller
          name="companyNameDropdown"
          control={control}
          render={({ field }) => (
            <>
              <InputLabel className="inputlabel">
                <b>वापरकर्त्याचे नाव </b> <span>*</span>
              </InputLabel>
              <Select
                fullWidth
                className="textfield"
                size="small"
                error={errors.companyNameDropdown}
                {...field}
                value={companyMhPropULPIN?.companyNameDropdown}
                onBlur={() => handleBlur("companyNameDropdown")}
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
                {errors.companyNameDropdown &&
                  errors.companyNameDropdown.message}
              </FormHelperText>
            </>
          )}
        />
      </Grid>
      <Grid item md={12}>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <>
              {/* <TextField
                fullWidth
                className="textfield"
                value={companyMhPropULPIN?.companyName}
                name="companyName"
                placeholder="इंफोटेक प्रायवेट लिमिटेड"
                error={errors.companyName}
                {...field}
                onBlur={() => handleBlur("companyName")}
                onChange={(e) => {
                  field.onChange(e);
                  handleCompanyDetails(e);
                }}
                size="small"
              /> */}
              <TransliterationTextField
                value={companyMhPropULPIN?.companyName}
                name="companyName"
                placeholder="इंफोटेक प्रायवेट लिमिटेड"
                error={errors.companyName}
                {...field}
                onBlur={() => handleBlur("companyName")}
                onChange={(e) => {
                  field.onChange(e);
                  handleCompanyDetails(e);
                }}
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors.companyName && errors.companyName.message}
              </FormHelperText>
            </>
          )}
        />
      </Grid>
      <Grid item md={12} mt={1}>
        <Controller
          name="companyNameEng"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                fullWidth
                className="textfield"
                value={companyMhPropULPIN?.companyNameEng}
                name="companyNameEng"
                placeholder="Infotech Pvt.Ltd."
                error={errors.companyNameEng}
                {...field}
                onBlur={() => handleBlur("companyNameEng")}
                onChange={(e) => {
                  field.onChange(e);
                  handleCompanyDetails(e);
                }}
                size="small"
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors.companyNameEng && errors.companyNameEng.message}
              </FormHelperText>
            </>
          )}
        />
      </Grid>
    </>
  );
};

export default CompanyMHPropertyTypeULPIN;
