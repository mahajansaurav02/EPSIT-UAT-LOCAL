import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RegistrationInstance from "../../../Instance/RegisterInstance";
import URLS from "../../../URLs/url";
import { errorToast, Toast } from "../../../ui/Toast";
import ReactApexChart from "react-apexcharts";
import ApplicationTable from "./OpenApplicationTable";
import {
  districtValidationSchema,
  talukaValidationSchema,
} from "../../../Validations/yupValidations";
import Header from "../../../ui/Header";

const UserDashboard = () => {
  const { sendRequest } = RegistrationInstance();
  const today = new Date().toISOString().split("T")[0];
  const [dates, setDates] = useState({
    fromDate: today,
    toDate: today,
    division: 0,
    district: 0,
    taluka: 0,
  });
  const [isTableDataLoading, setIsTableDataLoading] = useState(null);
  const [isMutationCountLoading, setIsMutationCountLoading] = useState(null);

  const [tableData, setTableData] = useState({});
  const [mutationCountData, setMutationCountData] = useState([]);

  const [division, setDivision] = useState([]);
  const [newDivisionData, setNewDivisionData] = useState([]);
  const [district, setDistrict] = useState([]);
  const [newDistrictData, setNewDistrictData] = useState([]);
  const [taluka, setTaluka] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [newDashboardData, setNewDashboardData] = useState([]);

  const [expandedDivision, setExpandedDivision] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [expandedOffice, setExpandedOffice] = useState(null);

  const [loadingDivision, setLoadingDivision] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [loadingMutation, setLoadingMutation] = useState(false);


  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setDates({ ...dates, [name]: value });
    setIsTableDataLoading(null);
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
      division: "0",
      district: "0",
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

  const handleDivision = async (e) => {
    const { name, value } = e?.target;
    if (value === 0) {
      setDates({ ...dates, division: 0, district: 0, taluka: 0 });
    }
    setDates({ ...dates, division: value });
    setTaluka([]);
    setIsTableDataLoading(null);
    setIsMutationCountLoading(null);

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
    setIsTableDataLoading(null);
    setIsMutationCountLoading(null);

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
    setIsTableDataLoading(null);
    setIsMutationCountLoading(null);
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
    (status) => statusColorMap[status] || "gray"
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

  const handleGetDivision = () => {
    setLoadingDivision(true);

    sendRequest(
      `${URLS.BaseURL}/EPCISAPIS/GetDashboardDataForDivision`,
      'POST',
      null,
      (res) => {
        setNewDivisionData(res.ResponseData || []);
        setLoadingDivision(false);
      },
      (err) => {
        setLoadingDivision(false);
        errorToast(err.Message);
      }
    );
  };

  const handleDivisionClick = (division) => {
    const regionCode = division.regionCode;

    // collapse if already open
    if (expandedDivision === regionCode) {
      setExpandedDivision(null);
      setNewDistrictData([]);
      setExpandedDistrict(null);
      setOfficeData([]);
      return;
    }

    setLoadingDistrict(true);

    sendRequest(
      `${URLS.BaseURL}/EPCISAPIS/GetDashboardDataForDistrict`,
      'POST',
      regionCode,
      (res) => {
        setNewDistrictData(res.ResponseData || []);
        setExpandedDivision(regionCode);

        // reset office section
        setExpandedDistrict(null);
        setOfficeData([]);

        setLoadingDistrict(false);
      },
      (err) => {
        setLoadingDistrict(false);
        errorToast(err.Message);
      }
    );
  };

  const handleDistrictClick = (regionCode, district) => {
    const districtCode = district.districtCode;

    // collapse office if same district clicked
    if (expandedDistrict === districtCode) {
      setExpandedDistrict(null);
      setOfficeData([]);
      return;
    }

    setLoadingOffice(true);

    sendRequest(
      `${URLS.BaseURL}/EPCISAPIS/GetDashboardDataForOffice`,
      'POST',
      {
        regionCode,
        districtCode,
      },
      (res) => {
        setOfficeData(res.ResponseData || []);
        setExpandedDistrict(districtCode);
        setLoadingOffice(false);
      },
      (err) => {
        setLoadingOffice(false);
        errorToast(err.Message);
      }
    );
  };

  const getDashboardData = (regionCode, districtCode, officeCode) => {
    setLoadingMutation(true)
    const payload = {
      region_code: String(regionCode),
      district_code: String(districtCode),
      office_code: String(officeCode),
    };
    sendRequest(
      `${URLS.BaseURL}/EPCISAPIS/GetCountOfMutationsForNewDashboard`,
      "POST",
      payload,
      (res) => {
        console.log(res, "res")
        setNewDashboardData(res.ResponseData);
        setLoadingMutation(false)
      },
      (err) => {
        errorToast(err.Message)
        setLoadingMutation(false)
      });
  };

  console.log({
    newDistrictData,
    newDivisionData,
    officeData
  })

  useEffect(() => {
    getRegion();
    // handleGetDivision()
    search();
  }, []);

  return (
    <>
      <Toast />
      <AppBar position="fixed" color="default">
        <Header showSignInBtn={true} />
      </AppBar>

      {/* <Button content="outlined" onClick={handleGetDivision} >
        Get Data
      </Button> */}

      {/* <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table stickyHeader
          sx={{
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #e5e7eb",
              fontSize: "14px",
            },
          }}>
          <TableHead sx={{
            "& .MuiTableCell-root": {
              background: "#1565C0",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              textAlign: "center",
              whiteSpace: "nowrap",
            },
          }}>
            <TableRow>
              <TableCell width={80}>Sr No</TableCell>
              <TableCell>विभाग</TableCell>
              <TableCell>EPSIT मध्ये प्राप्त एकूण अर्ज</TableCell>
              <TableCell>ePCIS मध्ये inward एकूण अर्ज</TableCell>
              <TableCell>एकूण निकाली अर्ज</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingDivision ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0 }}>
                  <Box
                    sx={{
                      height: 250,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size="2rem" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              newDivisionData.map((division, index) => (
                <React.Fragment key={division.regionCode}>
                  <TableRow
                    hover
                    sx={{
                      cursor: "pointer",
                      bgcolor: "#E3F2FD",
                      fontWeight: 700,

                      "& td": {
                        fontWeight: 700,
                        fontSize: "15px",
                      },

                      "&:hover": {
                        bgcolor: "#BBDEFB",
                      },
                    }}
                    onClick={() => handleDivisionClick(division)}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      {division.regionNameInMarathi}
                    </TableCell>

                    <TableCell>{division.createdApplicationCount}</TableCell>
                    <TableCell>{division.generatedInwardNoCount}</TableCell>
                    <TableCell>{division.totalApplicationCount}</TableCell>
                  </TableRow>

                  {expandedDivision === division.regionCode && loadingDistrict && (
                    <TableRow >
                      <TableCell colSpan={5} sx={{ p: 0 }}>
                        <Box
                          sx={{
                            height: 250,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress size="2rem" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {expandedDivision === division.regionCode &&
                    !loadingDistrict &&
                    newDistrictData.map((district, dIndex) => (
                      <React.Fragment key={district.districtCode}>
                        <TableRow
                          hover
                          sx={{
                            cursor: "pointer",
                            bgcolor: "#F5F9FF",

                            "& td": {
                              fontWeight: 600,
                            },

                            "&:hover": {
                              bgcolor: "#E3F2FD",
                            },
                          }}
                          onClick={() =>
                            handleDistrictClick(division.regionCode, district)
                          }
                        >
                          <TableCell>{`${index + 1}.${dIndex + 1}`}</TableCell>
                          <TableCell sx={{
                            pl: 6,
                            borderLeft: "5px solid #42A5F5",
                          }}>
                            {district.districtNameInMarathi}
                          </TableCell>
                          <TableCell>{district.createdApplicationCount}</TableCell>
                          <TableCell>{district.generatedInwardNoCount}</TableCell>
                          <TableCell>{district.totalApplicationCount}</TableCell>
                        </TableRow>

                        {expandedDistrict === district.districtCode && loadingOffice && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Box
                                sx={{
                                  height: 250,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CircularProgress size="2rem" />
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}

                        {expandedDistrict === district.districtCode &&
                          !loadingOffice &&
                          officeData.map((office, oIndex) => (
                            <React.Fragment key={office.officeCode}>
                              <TableRow
                                sx={{
                                  cursor: "pointer",
                                  bgcolor: "#FFFDF3",

                                  "&:hover": {
                                    bgcolor: "#FFF3CD",
                                  },
                                }}
                                onClick={() => {
                                  if (expandedOffice === office.officeCode) {
                                    setExpandedOffice(null);
                                    setNewDashboardData([]);
                                  } else {
                                    setExpandedOffice(office.officeCode);
                                    getDashboardData(
                                      division.regionCode,
                                      district.districtCode,
                                      office.officeCode
                                    );
                                  }
                                }}
                              >
                                <TableCell>{`${index + 1}.${dIndex + 1}.${oIndex + 1}`}</TableCell>
                                <TableCell sx={{
                                  pl: 10,
                                  borderLeft: "5px solid orange",
                                }}>
                                  {office.officeNameInMarathi}
                                </TableCell>
                                <TableCell>{office.createdApplicationCount}</TableCell>
                                <TableCell>{office.generatedInwardNoCount}</TableCell>
                                <TableCell>{office.totalApplicationCount}</TableCell>
                              </TableRow>

                              {expandedOffice === office.officeCode && (
                                <TableRow>
                                  <TableCell colSpan={5} sx={{ p: 2, bgcolor: "#f8fafc" }}>
                                    {loadingMutation ? (
                                      <Box
                                        sx={{
                                          height: 120,
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <CircularProgress size="2rem" />
                                      </Box>
                                    ) : newDashboardData.length > 0 ? (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow
                                          // sx={{
                                          //   bgcolor: "#1976d2",
                                          //   "& th": {
                                          //     color: "#fff",
                                          //     fontWeight: 700,
                                          //     textAlign: "center",
                                          //   },
                                          // }}
                                          >
                                            <TableCell></TableCell>
                                            <TableCell width={150}>फेरफार नाव</TableCell>
                                            <TableCell align="center">Created</TableCell>
                                            <TableCell align="center">Inward</TableCell>
                                            <TableCell align="center">Rejected</TableCell>
                                            <TableCell align="center">Error</TableCell>
                                          </TableRow>
                                        </TableHead>

                                        <TableBody>
                                          {newDashboardData.map((mutation, index) => {
                                            const created =
                                              mutation.Statuses.find(
                                                (s) => s.ApplicationStatusCode === 0
                                              )?.CountOfMutation || 0;

                                            const inward =
                                              mutation.Statuses.find(
                                                (s) => s.ApplicationStatusCode === 10
                                              )?.CountOfMutation || 0;

                                            const rejected =
                                              mutation.Statuses.find(
                                                (s) => s.ApplicationStatusCode === 12
                                              )?.CountOfMutation || 0;

                                            const error =
                                              mutation.Statuses.find(
                                                (s) => s.ApplicationStatusCode === 15
                                              )?.CountOfMutation || 0;

                                            return (
                                              <TableRow
                                                key={mutation.MutationName}
                                                hover
                                                sx={{
                                                  "&:nth-of-type(even)": {
                                                    bgcolor: "#fafafa",
                                                  },
                                                }}
                                              >
                                                <TableCell align="center"></TableCell>

                                                <TableCell sx={{
                                                  fontWeight: 500,
                                                  pl: 2,
                                                }}>{mutation.MutationName}</TableCell>

                                                <TableCell align="center">{created}</TableCell>

                                                <TableCell align="center">{inward}</TableCell>

                                                <TableCell align="center">{rejected}</TableCell>

                                                <TableCell align="center">{error}</TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <>
                                        <Box
                                          sx={{
                                            height: 70,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          No Mutation Found
                                        </Box>
                                      </>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}

                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer> */}

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

      <Grid container spacing={4} mt={1} px={4}>
        <Grid item md={6} xs={12} textAlign="center">
          {isMutationCountLoading === null ? null : isMutationCountLoading ? (
            <Paper elevation={2} sx={{ padding: 2 }}>
              <CircularProgress size="2rem" />
            </Paper>
          ) : (
            <Paper elevation={5} sx={{ padding: 2 }}>
              {mutationCountData.length == 0 ? (
                <h2>No Data Found</h2>
              ) : (
                <ReactApexChart
                  options={donutOptions}
                  series={series}
                  type="donut"
                  height={410}
                />
              )}
            </Paper>
          )}
        </Grid>

        <Grid item md={6} xs={12} textAlign="center">
          {isMutationCountLoading === null ? null : isMutationCountLoading ? (
            <Paper elevation={2} sx={{ padding: 2 }}>
              <CircularProgress size="2rem" />
            </Paper>
          ) : (
            <Paper elevation={5} sx={{ padding: 2 }}>
              {mutationCountData.length == 0 ? (
                <h2>No Data Found</h2>
              ) : (
                <ReactApexChart
                  options={mutationCountBarOptions}
                  series={seriesMutationCount}
                  type="bar"
                  height={400}
                />
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default UserDashboard;
