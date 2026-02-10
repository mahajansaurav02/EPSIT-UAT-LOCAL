import { FormHelperText, Grid, InputLabel, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
} from "../../../../../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import {
  filterOnlyLettersNumbersDotAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../../../Validations/utils";

const CompanyNoMHProperty = ({
  heading,
  inputlabel,
  companyNoMhProp,
  setCompanyNoMhProp,
  setIsValid,
}) => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        companyName: companyNamemarathiValidationSchema,
        companyNameEng: companyNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    setCompanyNoMhProp({ ...companyNoMhProp, [name]: value });
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompNoMhProperty: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <h4 className="heading">{heading}</h4>
      </Grid>
      <Grid item md={9}>
        <InputLabel className="inputlabel">
          <b>{inputlabel} </b>
          <span>*</span>
        </InputLabel>
        <Grid item md={12}>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <>
                {/* <TextField
                    fullWidth
                    className="textfield"
                    value={companyNoMhProp?.companyName}
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
                  value={companyNoMhProp?.companyName}
                  name="companyName"
                  placeholder="इंफोटेक प्रायवेट लिमिटेड"
                  error={errors.companyName}
                  {...field}
                  onBlur={() => handleBlur("companyName")}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  //   handleCompanyDetails(e);
                  // }}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyMarathiAndEnglishLettersWithSpaces(value);
                    field.onChange(filteredValue);
                    handleCompanyDetails({
                      target: { name, value: filteredValue },
                    });
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
                  value={companyNoMhProp?.companyNameEng}
                  name="companyNameEng"
                  placeholder="Infotech Pvt.Ltd."
                  error={errors.companyNameEng}
                  {...field}
                  onBlur={() => handleBlur("companyNameEng")}
                  // onChange={(e) => {
                  //   field.onChange(e);
                  //   handleCompanyDetails(e);
                  // }}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const filteredValue =
                      filterOnlyLettersNumbersDotAndSpaces(value);
                    field.onChange(filteredValue);
                    handleCompanyDetails({
                      target: { name, value: filteredValue },
                    });
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
      </Grid>
    </>
  );
};

export default CompanyNoMHProperty;
