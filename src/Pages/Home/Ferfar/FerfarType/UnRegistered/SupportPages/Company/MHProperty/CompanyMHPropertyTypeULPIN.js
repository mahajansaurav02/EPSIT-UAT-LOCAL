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
} from "../../../../../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../../../../../ui/TranslationTextfield/EngToMarTextfield";

const CompanyMHPropertyTypeULPIN = ({
  heading,
  inputlabel,
  companyMhPropULPIN,
  setCompanyMhPropULPIN,
  setIsValid,
}) => {
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

  const handleUlpinChange = (e) => {
    setPropTypeULPIN({ ...propTypeULPIN, ulpin: e?.target?.value });
    setCompanyMhPropULPIN({
      ...companyMhPropULPIN,
      ...propTypeULPIN,
      ulpin: e?.target?.value,
    });
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
                    size="small"
                    error={errors.ulpin}
                    name="ulpin"
                    {...field}
                    // value={propTypeULPIN?.ulpin}
                    value={field.value || propTypeULPIN?.ulpin || ""}
                    onBlur={() => handleBlur("ulpin")}
                    placeholder="ULPIN टाका"
                    onChange={(e) => {
                      field.onChange(e);
                      handleUlpinChange(e);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<SearchRoundedIcon />}
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
      <Grid item md={12}>
        <h4 className="heading">{heading}</h4>
      </Grid>
      <Grid item md={4} mb={2}>
        <Controller
          name="companyNameDropdown"
          control={control}
          render={({ field }) => (
            <>
              <InputLabel className="inputlabel">
                <b>{inputlabel} </b> <span>*</span>
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
