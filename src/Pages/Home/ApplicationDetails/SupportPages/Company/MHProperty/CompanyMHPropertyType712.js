import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
  khataNoValidationSchema,
} from "../../../../../../Validations/yupValidations";
import SelectVillageEferfar from "../../../../../../ui/SelectVillage/SelectVillageEferfar";

const CompanyMHPropertType712 = ({
  isEdit,
  editFields,
  companyMhPropType712,
  setCompanyMhPropType712,
  setIsValid,
}) => {
  const [villageData, setVillageData] = useState({
    district: {},
    taluka: {},
    village: {},
  });
  // const [khataNo, setKhata] = useState("");
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
        khataNo: khataNoValidationSchema,
        companyName: yup.string().required("Company Name is required"),
        companyMar: companyNamemarathiValidationSchema,
        companyEng: companyNameEnglishValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleKhata = (e) => {
    // setKhata(e?.target?.value);
    setCompanyMhPropType712({
      ...companyMhPropType712,
      khataNo: e?.target?.value,
      ...villageData,
    });
  };

  const handleCompanyName = (e) => {
    // setCompanyNameDropdown(e?.target?.value);
    setCompanyMhPropType712({
      ...companyMhPropType712,
      companyNameDropdown: e?.target?.value,
    });
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    // setCompanyDetails({ ...companyDetails, [name]: value });
    setCompanyMhPropType712({ ...companyMhPropType712, [name]: value });
  };

  // useEffect(() => {
  //   setValue("khataNo", companyMhPropType712?.khataNo);
  //   setValue("companyName", companyMhPropType712?.companyNameDropdown);
  //   setValue("companyMar", companyMhPropType712?.companyName);
  //   setValue("companyEng", companyMhPropType712?.companyNameEng);
  // }, [isEdit]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompProp712: trigger,
    }));
  }, [trigger, setIsValid]);

  return (
    <>
      {editFields ? (
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
                        size="small"
                        error={errors.khataNo}
                        {...field}
                        className="textfield"
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
                    size="small"
                    error={errors.companyName}
                    {...field}
                    className="textfield"
                    value={companyMhPropType712?.companyNameDropdown}
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
                    // value={companyDetails?.companyName}
                    value={companyMhPropType712?.companyName}
                    name="companyName"
                    placeholder="इंफोटेक प्रायवेट लिमिटेड"
                    error={errors.companyMar}
                    {...field}
                    className="textfield"
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
                    // value={companyDetails?.companyNameEng}
                    value={companyMhPropType712?.companyNameEng}
                    name="companyNameEng"
                    placeholder="Infotech Pvt.Ltd."
                    error={errors.companyEng}
                    {...field}
                    className="textfield"
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
                  <b>जिल्हा </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={companyMhPropType712?.district}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>तालुका </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={companyMhPropType712?.taluka}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ </b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  className="textfieldDisabled"
                  disabled
                  value={companyMhPropType712?.village}
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel className="inputlabel">
                  <b>खाता क्रमांक </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={companyMhPropType712?.khataNo}
                  className="textfieldDisabled"
                  disabled
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
              value={companyMhPropType712?.companyNameDropdown}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              fullWidth
              className="textfieldDisabled"
              disabled
              value={companyMhPropType712?.companyName}
              size="small"
            />
          </Grid>
          <Grid item md={12} mt={1}>
            <TextField
              fullWidth
              className="textfieldDisabled"
              disabled
              value={companyMhPropType712?.companyNameEng}
              size="small"
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default CompanyMHPropertType712;
