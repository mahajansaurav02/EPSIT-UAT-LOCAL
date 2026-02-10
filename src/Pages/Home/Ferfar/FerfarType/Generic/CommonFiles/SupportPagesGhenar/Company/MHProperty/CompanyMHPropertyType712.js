import React, { useEffect, useState } from "react";
import {
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
  khataNoValidationSchema,
} from "../../../../../../../../../Validations/yupValidations";
import SelectVillageEferfar from "../../../../../../../../../ui/SelectVillage/SelectVillageEferfar";
import TransliterationTextField from "../../../../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../../../../../../../../Validations/utils";

const CompanyMHPropertType712 = ({
  heading,
  inputlabel,
  companyMhPropType712,
  setCompanyMhPropType712,
  setIsValid,
}) => {
  const [villageData, setVillageData] = useState({
    district: {},
    taluka: {},
    village: {},
  });

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        khataNo: khataNoValidationSchema,
        companyNameDropdown: yup.string().required("Company Name is required"),
        companyName: companyNamemarathiValidationSchema,
        companyNameEng: companyNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleKhata = (e) => {
    setCompanyMhPropType712({
      ...companyMhPropType712,
      khataNo: e?.target?.value,
      ...villageData,
    });
  };

  const handleCompanyName = (e) => {
    setCompanyMhPropType712({
      ...companyMhPropType712,
      userName: e?.target?.value,
    });
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    setCompanyMhPropType712({ ...companyMhPropType712, [name]: value });
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompProp712: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12} mt={1}>
        <Grid container spacing={2}>
          <Grid item md={9}>
            <SelectVillageEferfar setVillageData={setVillageData} />
          </Grid>
          <Grid item md={3}>
            <Controller
              name="khataNo"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>खाता क्रमांक </b>
                    <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    className="textfield"
                    size="small"
                    error={errors.khataNo}
                    {...field}
                    value={companyMhPropType712?.khataNo}
                    onBlur={() => handleBlur("khataNo")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleKhata(e);
                    }}
                  >
                    <MenuItem value="1">480/20/121/52</MenuItem>
                    <MenuItem value="2">480/20/121/53</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.khataNo && errors.khataNo.message}
                  </FormHelperText>
                </>
              )}
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
                value={companyMhPropType712?.companyNameDropdown}
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
                value={companyMhPropType712?.companyName}
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
                value={companyMhPropType712?.companyName}
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
                value={companyMhPropType712?.companyNameEng}
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

export default CompanyMHPropertType712;
