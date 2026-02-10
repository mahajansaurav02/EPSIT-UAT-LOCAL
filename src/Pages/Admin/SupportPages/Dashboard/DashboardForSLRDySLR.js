import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip as ToolTipBTN,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SecuredHeader from "../../../../ui/SecuredHeader";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AxiosInstance from "../../../../Instance/AxiosInstance";
import URLS from "../../../../URLs/url";
import { errorToast, Toast } from "../../../../ui/Toast";
import ContentPasteGoRoundedIcon from "@mui/icons-material/ContentPasteGoRounded";
import ReactApexChart from "react-apexcharts";
import ApplicationTable from "./ApplicationTable";
import {
  districtValidationSchema,
  talukaValidationSchema,
} from "../../../../Validations/yupValidations";

const DashboardForSLRDySLR = () => {
  const { sendRequest } = AxiosInstance();
  const divisionCode = sessionStorage.getItem("divisionCode");
  const districtCode = sessionStorage.getItem("districtCode");
  const today = new Date().toISOString().split("T")[0];
  const [dates, setDates] = useState({
    fromDate: today,
    toDate: today,
    division: divisionCode,
    district: districtCode,
    taluka: 0,
  });
  const [isTableDataLoading, setIsTableDataLoading] = useState(null);
  const [isExcelLoading, setIsExcelDataLoading] = useState(null);
  const [isMutationCountLoading, setIsMutationCountLoading] = useState(null);

  const [tableData, setTableData] = useState({});
  const [excelData, setExcelData] = useState({});
  const [mutationCountData, setMutationCountData] = useState([]);

  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [taluka, setTaluka] = useState([]);

  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setDates({ ...dates, [name]: value });
    setIsTableDataLoading(null);
    setIsExcelDataLoading(null);
    setIsMutationCountLoading(null);
  };

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        fromDate: yup.string().required("पासून दिनांक निवडा"),
        toDate: yup.string().required("पर्यन्त दिनांक निवडा"),
        division: yup.string().required("विभाग निवडा"),
        district: districtValidationSchema,
        taluka: talukaValidationSchema,
      })
    ),
    defaultValues: {
      fromDate: today,
      toDate: today,
      division: divisionCode,
      district: districtCode,
      taluka: "0",
    },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const search = async () => {
    const result = await trigger();
    if (result) {
      setIsTableDataLoading(true);
      setIsExcelDataLoading(true);
      setIsMutationCountLoading(true);

      sendRequest(
        `${URLS?.BaseURL}/EPCISAPIS/GetCountOfApplicationId`,
        "POST",
        {
          pageno: 0,
          pagesize: 0,
          fromDate: dates?.fromDate,
          toDate: dates?.toDate,
          region_code: dates?.division.toString(),
          district_code: dates?.district.toString(),
          office_code: dates?.taluka,
        },
        (res) => {
          setTableData(res?.ResponseData);
          setIsTableDataLoading(false);
        },
        (err) => {
          errorToast(err?.Message);
          setTableData({});
          setIsTableDataLoading(false);
        }
      );

      sendRequest(
        `${URLS?.BaseURL}/EPCISAPIS/exportExcel`,
        "POST",
        {
          pageno: 0,
          pagesize: 0,
          fromDate: dates?.fromDate,
          toDate: dates?.toDate,
          region_code: dates?.division.toString(),
          district_code: dates?.district.toString(),
          office_code: dates?.taluka,
        },
        (res) => {
          setExcelData(res);
          setIsExcelDataLoading(false);
        },
        (err) => {
          errorToast(err?.Message);
          setIsExcelDataLoading(false);
        }
      );

      sendRequest(
        `${URLS?.BaseURL}/EPCISAPIS/GetCountOfMutations`,
        "POST",
        {
          pageno: 0,
          pagesize: 0,
          fromDate: dates?.fromDate,
          toDate: dates?.toDate,
          region_code: dates?.division.toString(),
          district_code: dates?.district.toString(),
          office_code: dates?.taluka,
        },
        (res) => {
          setMutationCountData(res?.ResponseData);
          setIsMutationCountLoading(false);
        },
        (err) => {
          setIsMutationCountLoading(false);
          errorToast(err?.Message);
        }
      );
    } else {
      errorToast("Please Check All Fields !");
    }
  };

  const handleDownloadExcel = () => {
    const byteCharacters = atob(excelData.FileContents);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: excelData.ContentType });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = excelData.FileDownloadName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDivision = async (e) => {
    const { name, value } = e?.target;
    if (value === 0) {
      setDates({ ...dates, division: 0, district: 0, taluka: 0 });
    }
    setDates({ ...dates, division: value });
    setTaluka([]);

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/GetDistrictByRegion`,
      "POST",
      e?.target?.value.toString(),
      (res) => {
        setDistrict(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const handleDistrict = async (e) => {
    const { name, value } = e?.target;
    if (value === 0) {
      setDates({ ...dates, district: 0, taluka: 0 });
      setTaluka([]);
    }
    setDates({ ...dates, district: value });

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/getOfficeByDistrict`,
      "POST",
      e?.target?.value.toString(),
      (res) => {
        setTaluka(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  const handleTaluka = (e) => {
    const { name, value } = e?.target;
    setDates({ ...dates, taluka: value });
  };

  //---------------------------Chart---------------------

  const labels = mutationCountData.map((item) => item.MutationName);

  const series = mutationCountData.map((item) =>
    item.Statuses.reduce((total, status) => total + status.CountOfMutation, 0)
  );

  const donutOptions = {
    chart: {
      type: "pie",
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    title: {
      text: `${formatDate(dates?.fromDate)} पासून ${formatDate(
        dates?.toDate
      )} पर्यंत भरलेले फेरफार.`,
    },
    labels,
    legend: {
      position: "right",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "diagonal1",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const statusSet = new Set();
  mutationCountData.forEach((item) => {
    item.Statuses.forEach((status) => {
      statusSet.add(status.ApplicationStatus);
    });
  });
  const uniqueStatuses = Array.from(statusSet);

  const seriesMutationCount = uniqueStatuses.map((status) => {
    return {
      name: status,
      data: mutationCountData.map((item) => {
        const found = item.Statuses.find((s) => s.ApplicationStatus === status);
        return found ? found.CountOfMutation : 0;
      }),
    };
  });

  const statusColorMap = {
    "Partially Submitted / Pending": "orange",
    "Inward Number Error": "red",
    "Application is submitted to EPCIS": "green",
    "Application Processed by EPCIS": "blue",
  };

  const colors = uniqueStatuses.map(
    (status) => statusColorMap[status] || "gray" // default gray
  );

  const categories = mutationCountData.map((item) => item.MutationName);

  const mutationCountBarOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 350,
    },
    title: {
      text: `${formatDate(dates?.fromDate)} पासून ${formatDate(
        dates?.toDate
      )} पर्यंत फेरफार प्रकार प्रमाणे.`,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: "top",
    },
    series: series,
    colors: colors,
  };

  //---------------------Chart------------------------------

  const getRegion = async () => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/GetRegion`,
      "POST",
      null,
      (res) => {
        setDivision(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    getRegion();
    search();

    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/GetDistrictByRegion`,
      "POST",
      divisionCode,
      (res) => {
        setDistrict(JSON.parse(res?.ResponseData));
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
    // setValue("district", districtCode);
  }, []);

  return (
    <>
      <Toast />
      <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar>
      <Container sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={2.4}>
                <Controller
                  name="division"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>विभाग </b>
                        <span>*</span>
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        value={dates?.division}
                        className="textfield"
                        error={errors.division}
                        {...field}
                        displayEmpty
                        onBlur={() => handleBlur("division")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDivision(e);
                        }}
                      >
                        <MenuItem value={0}>संपूर्ण महाराष्ट्र</MenuItem>
                        {Array.isArray(division) &&
                          division
                            .filter((v) => v.region_code !== 7)
                            .map((val, i) => {
                              return (
                                <MenuItem
                                  key={val?.region_code + i}
                                  value={val?.region_code}
                                >
                                  {val?.region_name}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.division && errors.division.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.4}>
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
                        value={dates?.district}
                        className="textfield"
                        error={errors.district}
                        {...field}
                        displayEmpty
                        onBlur={() => handleBlur("district")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDistrict(e);
                        }}
                      >
                        <MenuItem value={0}>संपूर्ण जिल्हे</MenuItem>
                        {Array.isArray(district) &&
                          district.map((val, i) => {
                            return (
                              <MenuItem
                                key={val?.district_code + i}
                                value={val?.district_code}
                              >
                                {val?.district_name}
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
              <Grid item md={2.4}>
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
                        value={dates?.taluka}
                        className="textfield"
                        error={errors.taluka}
                        {...field}
                        displayEmpty
                        onBlur={() => handleBlur("taluka")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTaluka(e);
                        }}
                      >
                        <MenuItem value="0">संपूर्ण तालुके</MenuItem>
                        {Array.isArray(taluka) &&
                          taluka.map((val, i) => {
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
              <Grid item md={2.4}>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>पासून </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="date"
                        className="textfield"
                        name="fromDate"
                        value={dates?.fromDate}
                        onFocus={(event) => {
                          event.target.showPicker();
                        }}
                        inputProps={{
                          max: today,
                          min: "2025-04-04",
                        }}
                        error={errors.fromDate}
                        {...field}
                        onBlur={() => handleBlur("fromDate")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                        size="small"
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.fromDate && errors.fromDate.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={2.4}>
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel className="inputlabel">
                        <b>पर्यंत </b>
                        <span>*</span>
                      </InputLabel>
                      <TextField
                        fullWidth
                        type="date"
                        className="textfield"
                        name="toDate"
                        value={dates?.toDate}
                        onFocus={(event) => {
                          event.target.showPicker();
                        }}
                        inputProps={{
                          max: today,
                          min: dates?.fromDate,
                        }}
                        error={errors.toDate}
                        {...field}
                        onBlur={() => handleBlur("toDate")}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUserDetails(e);
                        }}
                        size="small"
                      />
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.toDate && errors.toDate.message}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>

              {/* {isExcelLoading === null ? null : isExcelLoading ? (
                <Grid item md={1}>
                  <InputLabel className="inputlabel">
                    <b>&nbsp;</b>
                  </InputLabel>
                  <CircularProgress size="2rem" />
                </Grid>
              ) : (
                <Grid item md={1}>
                  <InputLabel className="inputlabel">
                    <b>&nbsp;</b>
                  </InputLabel>
                  <ToolTipBTN title="Download Excel" arrow>
                    <IconButton color="info" onClick={handleDownloadExcel}>
                      <ContentPasteGoRoundedIcon />
                    </IconButton>
                  </ToolTipBTN>
                </Grid>
              )} */}
            </Grid>

            <Grid container spacing={1} justifyContent="center">
              <Grid item md={1}>
                <InputLabel className="inputlabel">
                  <b>&nbsp;</b>
                </InputLabel>
                <Button variant="contained" onClick={search}>
                  Search
                </Button>
              </Grid>
              {isExcelLoading === null ? null : isExcelLoading ? (
                <Grid item md={1}>
                  <InputLabel className="inputlabel">
                    <b>&nbsp;</b>
                  </InputLabel>
                  <CircularProgress size="2rem" />
                </Grid>
              ) : (
                <Grid item md={1}>
                  <InputLabel className="inputlabel">
                    <b>&nbsp;</b>
                  </InputLabel>
                  <ToolTipBTN title="Download Excel" arrow>
                    <IconButton color="info" onClick={handleDownloadExcel}>
                      <ContentPasteGoRoundedIcon />
                    </IconButton>
                  </ToolTipBTN>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {isTableDataLoading === null ? null : isTableDataLoading ? (
          <Grid item md={12} textAlign="center" mt={2}>
            <CircularProgress size="2rem" />
          </Grid>
        ) : (
          <Grid item md={12}>
            <ApplicationTable tableData={tableData} dates={dates} />
          </Grid>
        )}
      </Container>
      <Grid container spacing={4} mt={1} px={4} pb={3}>
        <Grid item md={6} xs={12} textAlign="center">
          {isMutationCountLoading === null ? null : isMutationCountLoading ? (
            <Paper elevation={4} sx={{ padding: 2 }}>
              <CircularProgress size="2rem" />
            </Paper>
          ) : (
            <Paper elevation={4} sx={{ padding: 2 }}>
              <ReactApexChart
                options={donutOptions}
                series={series}
                type="donut"
                height={410}
              />
            </Paper>
          )}
        </Grid>

        <Grid item md={6} xs={12} textAlign="center">
          {isMutationCountLoading === null ? null : isMutationCountLoading ? (
            <Paper elevation={4} sx={{ padding: 2 }}>
              <CircularProgress size="2rem" />
            </Paper>
          ) : (
            <Paper elevation={4} sx={{ padding: 2 }}>
              <ReactApexChart
                options={mutationCountBarOptions}
                series={seriesMutationCount}
                type="bar"
                height={400}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardForSLRDySLR;
