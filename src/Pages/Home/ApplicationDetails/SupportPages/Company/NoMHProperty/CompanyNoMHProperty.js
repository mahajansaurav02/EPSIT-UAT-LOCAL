import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  companyNameEnglishValidationSchema,
  companyNamemarathiValidationSchema,
} from "../../../../../../Validations/yupValidations";
import TransliterationTextField from "../../../../../../ui/TranslationTextfield/EngToMarTextfield";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  filterOnlyLettersNumbersDotAndSpaces,
  filterOnlyMarathiAndEnglishLettersWithSpaces,
} from "../../../../../../Validations/utils";

const CompanyNoMHProperty = ({
  isEdit,
  companyNoMhProp,
  setCompanyNoMhProp,
  setIsValid,
  isReset,
  isFirstUser,
}) => {
  const [editFields, setEditFields] = useState(false);
  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        companyName: companyNamemarathiValidationSchema,
        companyNameEng: companyNameEnglishValidationSchema,
      })
    ),
    defaultValues: {
      companyName: "",
      companyNameEng: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReset = () => {
    setEditFields(false);
    reset();
    if (isFirstUser) {
      setCompanyNoMhProp({
        ...companyNoMhProp,
      });
      setValue("companyName", companyNoMhProp?.companyName);
      setValue("companyNameEng", companyNoMhProp?.companyNameEng);
    } else {
      setCompanyNoMhProp({
        ...companyNoMhProp,
        companyName: "",
        companyNameEng: "",
      });
    }
  };

  const handleCompanyDetails = (e) => {
    const { name, value } = e?.target;
    setCompanyNoMhProp({ ...companyNoMhProp, [name]: value });
  };

  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("companyName", companyNoMhProp?.companyName);
      setValue("companyNameEng", companyNoMhProp?.companyNameEng);
    }
  }, [isEdit]);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompNoMhProperty: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      {editFields && (
        <Grid item md={12} mt={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            अर्जदाराच्या माहितीत बदल करा
          </Button>
        </Grid>
      )}

      <Grid item md={9} mt={1}>
        {editFields ? (
          <Grid item md={9} mt={1}>
            <Grid item md={12}>
              <TextField
                fullWidth
                value={companyNoMhProp?.companyName}
                className="textfieldDisabled"
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={12} mt={1}>
              <TextField
                fullWidth
                className="textfieldDisabled"
                disabled
                value={companyNoMhProp?.companyNameEng}
                size="small"
              />
            </Grid>
          </Grid>
        ) : (
          <>
            {isFirstUser ? (
              <>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    value={companyNoMhProp?.companyName}
                    className="textfieldDisabled"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item md={12} mt={1}>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    disabled
                    value={companyNoMhProp?.companyNameEng}
                    size="small"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item md={12}>
                  <InputLabel className="inputlabel">
                    <b>अर्जदारचे नाव </b>
                    <span>*</span>
                  </InputLabel>
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TransliterationTextField
                          value={companyNoMhProp?.companyName}
                          name="firstName"
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
                              filterOnlyMarathiAndEnglishLettersWithSpaces(
                                value
                              );
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
                          {errors.companyNameEng &&
                            errors.companyNameEng.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default CompanyNoMHProperty;
