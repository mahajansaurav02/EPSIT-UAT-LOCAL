import React, { useEffect, useState } from "react";
import {
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../Redux/slices/LanguageSlice";
import URLS from "../../URLs/url";
import AxiosInstance from "../../Instance/AxiosInstance";
import { errorToast } from "../Toast";

const SelectVillage = ({ setVillageData }) => {
  const { sendRequest } = AxiosInstance();
  const language = useSelector(selectLanguage);
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [officeArr, setOfficeArr] = useState([]);
  const [taluka, setTaluka] = useState({});
  const [villageArr, setVillageArr] = useState([]);
  const [village, setVillage] = useState({});

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        district: yup.string().required("District is required"),
        taluka: yup.string().required("Taluka is required"),
        village: yup.string().required("Village is required"),
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleDistrict = (e) => {
    const distCode = e?.target?.value;
    const obj = districtArr.find((o) => o.district_code == distCode);
    setDistrict(obj);
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOfficeByDistrict`,
      "POST",
      distCode,
      (res) => {
        setOfficeArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleTaluka = (e) => {
    const officeCode = e?.target?.value;
    const obj = officeArr.find((o) => o.office_code == officeCode);
    setTaluka(obj);

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getVillageByOffice`,
      "POST",
      officeCode,
      (res) => {
        setVillageArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const handleVillage = (e) => {
    const cCode = e?.target?.value;
    const obj = villageArr.find((o) => o?.village_code == cCode);
    setVillage(obj);

    setVillageData({
      district: {
        district_code: district?.district_code,
        district_name: district?.district_name,
        district_english_name: "NA",
      },
      taluka: {
        office_code: taluka?.office_code,
        office_name: taluka?.office_name,
      },
      village: {
        village_code: obj?.village_code,
        village_name: obj?.village_name,
      },
    });
  };

  const setInitialDistrict = () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/allDistrictList`,
      "POST",
      null,
      (res) => {
        setDistrictArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    setInitialDistrict();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>जिल्हा </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  className="textfield"
                  error={errors.district}
                  {...field}
                  value={district && district?.district_name}
                  onBlur={() => handleBlur("district")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDistrict(e);
                  }}
                >
                  {Array.isArray(districtArr) &&
                    districtArr.map((val, i) => {
                      return (
                        <MenuItem
                          key={val?.district_code + i}
                          value={val?.district_code}
                        >
                          {language?.lng == "mar"
                            ? val?.district_name
                            : val?.district_english_name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.district && errors.district.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        <Grid item md={4}>
          <Controller
            name="taluka"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>तालुका / न. भू. कार्यालय </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  error={errors.taluka}
                  className="textfield"
                  {...field}
                  value={taluka && taluka?.office_name}
                  onBlur={() => handleBlur("taluka")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleTaluka(e);
                  }}
                >
                  {Array.isArray(officeArr) &&
                    officeArr.map((val, i) => {
                      return (
                        <MenuItem
                          key={val?.office_code + i}
                          value={val?.office_code}
                        >
                          {val?.office_name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.taluka && errors.taluka.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
        <Grid item md={4}>
          <Controller
            name="village"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel className="inputlabel">
                  <b>गाव/पेठ </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  error={errors.village}
                  className="textfield"
                  {...field}
                  value={village?.village_name}
                  onBlur={() => handleBlur("village")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleVillage(e);
                  }}
                >
                  {Array.isArray(villageArr) &&
                    villageArr.map((val, i) => {
                      return (
                        <MenuItem
                          key={val?.village_code + i}
                          value={val?.village_code}
                        >
                          {val?.village_name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText sx={{ color: "red" }}>
                  {errors.village && errors.village.message}
                </FormHelperText>
              </>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SelectVillage;
