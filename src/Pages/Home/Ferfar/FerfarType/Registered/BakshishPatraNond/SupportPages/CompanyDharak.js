import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { holderTypeValidationSchema } from "../../../../../../../Validations/yupValidations";
import AxiosInstance from "../../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../../URLs/url";

const CompanyDharak = ({
  companyDharak,
  setCompanyDharak,
  setIsValid,
  isReset,
}) => {
  const { sendRequest } = AxiosInstance();
  const [dharakArr, setDharakArr] = useState([]);

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        holderType: holderTypeValidationSchema,
        // giftArea: yup.string().required("खरेदी क्षेत्र टाका"),
      })
    ),
    defaultValues: {
      // giftArea: "",
      holderType: "",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    reset();
  };

  const handleDharakType = (e) => {
    const code = e?.target?.value;
    const obj = dharakArr.find((o) => o?.account_type_code == code);
    setCompanyDharak({
      ...companyDharak,
      holderType: {
        owner_status_code: obj?.account_type_code.toString(),
        owner_status_description: obj?.account_type_description,
      },
    });
  };

  const handleCompanyDharak = (e) => {
    const { name, value } = e?.target;
    setCompanyDharak({ ...companyDharak, [name]: value });
  };

  const setDharakType = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/ownerAccountType`,
      "POST",
      null,
      (res) => {
        setDharakArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    setDharakType();
  }, []);

  useEffect(() => {
    handleReset();
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerCompanyDharak: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Controller
            name="holderType"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>धारक प्रकार </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  name="holderType"
                  fullWidth
                  className="textfield"
                  size="small"
                  value={companyDharak?.holderType}
                  error={errors.holderType}
                  {...field}
                  onBlur={() => handleBlur("holderType")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDharakType(e);
                  }}
                >
                  {Array.isArray(dharakArr) &&
                    dharakArr.map((val, i) => {
                      return (
                        <MenuItem
                          value={val?.account_type_code}
                          key={val?.account_type_code + i}
                        >
                          {val?.account_type_description}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.holderType && errors.holderType.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        {/* <Grid item md={3}>
          <Controller
            name="giftArea"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>बक्षीस क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  className="textfield"
                  name="giftArea"
                  size="small"
                  value={companyDharak?.giftArea}
                  error={errors.giftArea}
                  {...field}
                  onBlur={() => handleBlur("giftArea")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleCompanyDharak(e);
                  }}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors.giftArea && errors.giftArea.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default CompanyDharak;
