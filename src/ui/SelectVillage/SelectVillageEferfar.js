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

const SelectVillageEferfar = ({ setVillageData, isReset }) => {
  const { sendRequest } = AxiosInstance();
  const language = useSelector(selectLanguage);
  const [districtArr, setDistrictArr] = useState([]);
  const [district, setDistrict] = useState({});
  const [talukaArr, setTalukaArr] = useState([]);
  const [taluka, setTaluka] = useState({});
  const [villageArr, setVillageArr] = useState([]);
  const [village, setVillage] = useState({});

  const {
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        district: yup.string().required("District is required"),
        taluka: yup.string().required("Taluka is required"),
        village: yup.string().required("Village is required"),
      })
    ),
    defaultValues: {
      district: "",
      taluka: "",
      village: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleReset = () => {
    setDistrict({});
    setTaluka({});
    setVillage({});
    reset();
  };

  const handleDistrict = (e) => {
    const code = e?.target?.value;
    const obj = districtArr.find((o) => o?.districtcode == code);
    setDistrict(obj);

    sendRequest(
      `${URLS?.BaseURL}/LGDAPIS/getTalukasOfDistrict`,
      "POST",
      code,
      (res) => {
        setTalukaArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleTaluka = (e) => {
    const code = e?.target?.value;
    const obj = talukaArr.find((o) => o?.subdistrictcode == code);
    setTaluka(obj);

    sendRequest(
      `${URLS?.BaseURL}/LGDAPIS/getVillagesOfDistrictAndTaluka`,
      "POST",
      {
        distcode: district?.districtcode,
        talukacode: code,
      },
      (res) => {
        setVillageArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const handleVillage = (e) => {
    const code = e?.target?.value;
    const obj = villageArr.find((o) => o?.villagecode == code);
    setVillage(obj);

    setVillageData({
      district: {
        district_code: district?.districtcode,
        district_name: district?.districtlocalname,
        district_english_name: district?.districtnameenglish,
      },
      taluka: {
        office_code: taluka?.subdistrictcode,
        office_name: taluka?.subdistrictlocalname,
      },
      village: {
        village_code: obj?.villagecode,
        village_name: obj?.villagelocalname,
      },
    });
  };

  const getInitialDistrict = () => {
    sendRequest(
      `${URLS?.BaseURL}/LGDAPIS/getDistrictofState`,
      "POST",
      null,
      (res) => {
        setDistrictArr(JSON.parse(res?.ResponseData));
      },
      (err) => {
        console.error(err);
      }
    );
  };
  useEffect(() => {
    handleReset();
  }, [isReset]);
  useEffect(() => {
    getInitialDistrict();
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
                  value={district && district?.districtcode}
                  onBlur={() => handleBlur("district")}
                  // onFocus={() => handleBlur("district")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDistrict(e);
                  }}
                >
                  {Array.isArray(districtArr) &&
                    districtArr.map((val, i) => {
                      return (
                        <MenuItem
                          key={val?.districtcode + i}
                          value={val?.districtcode}
                        >
                          {val?.districtlocalname}
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
                  <b>तालुका </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  error={errors.taluka}
                  className="textfield"
                  {...field}
                  value={taluka && taluka?.subdistrictcode}
                  onBlur={() => handleBlur("taluka")}
                  onChange={(e) => {
                    field.onChange(e);
                    handleTaluka(e);
                  }}
                >
                  {Array.isArray(talukaArr) &&
                    talukaArr.map((val, i) => {
                      return (
                        <MenuItem
                          key={val?.subdistrictcode + i}
                          value={val?.subdistrictcode}
                        >
                          {val?.subdistrictlocalname}
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
                  value={village && village?.villagecode}
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
                          key={val?.villagecode + i}
                          value={val?.villagecode}
                        >
                          {language?.lng == "mar"
                            ? val?.villagelocalname
                            : val?.villagenameenglish}
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

export default SelectVillageEferfar;
