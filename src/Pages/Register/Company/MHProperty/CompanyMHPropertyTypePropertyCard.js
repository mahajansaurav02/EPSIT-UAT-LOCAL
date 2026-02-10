import {
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectVillage from "../../../../ui/SelectVillage/SelectVillage";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
  nabhuValidationSchema,
} from "../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../ui/TranslationTextfield/EngToMarTextfield";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../../../Validations/utils";

const CompanyMHPropertyTypePropertyCard = ({
  companyMhPropTypePropertyCard,
  setCompanyMhPropTypePropertyCard,
  setIsValid,
}) => {
  const [villageData, setVillageData] = useState({
    district: "",
    taluka: "",
    village: "",
  });
  const [naBhu, setNaBhu] = useState("");
  const [companyNameDropdown, setCompanyNameDropdown] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companyNameEng: "",
  });

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
        companyNameDropdown: yup.string().required("Company Name is required"),
        companyName: companyNamemarathiValidationSchema,
        companyNameEng: companyNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleNaBhu = (e) => {
    setNaBhu(e?.target?.value);
    setCompanyMhPropTypePropertyCard({
      ...companyMhPropTypePropertyCard,
      naBhu: e?.target?.value,
      ...villageData,
    });
  };
  const handleCompanyName = (e) => {
    setCompanyNameDropdown(e?.target?.value);
    setCompanyMhPropTypePropertyCard({
      ...companyMhPropTypePropertyCard,
      userName: e?.target?.value,
    });
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
    setCompanyMhPropTypePropertyCard({
      ...companyMhPropTypePropertyCard,
      [name]: value,
    });
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompPropertyCard: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12} mt={1}>
        <Grid container spacing={2}>
          <Grid item md={9}>
            <SelectVillage setVillageData={setVillageData} />
          </Grid>
          <Grid item md={3}>
            <Controller
              name="nabhu"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b> न.भू.क्र. क्रमांक निवडा </b>
                    <span>*</span>
                  </InputLabel>
                  <Select
                    fullWidth
                    className="textfield"
                    size="small"
                    error={errors.nabhu}
                    {...field}
                    value={naBhu}
                    onBlur={() => handleBlur("nabhu")}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNaBhu(e);
                    }}
                  >
                    <MenuItem value="1">480/20/121/52</MenuItem>
                    <MenuItem value="2">480/20/121/53</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.nabhu && errors.nabhu.message}
                  </FormHelperText>
                </>
              )}
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
                value={companyNameDropdown}
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
                value={companyDetails?.companyName}
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
                value={companyDetails?.companyName}
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
                value={companyDetails?.companyNameEng}
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

export default CompanyMHPropertyTypePropertyCard;
