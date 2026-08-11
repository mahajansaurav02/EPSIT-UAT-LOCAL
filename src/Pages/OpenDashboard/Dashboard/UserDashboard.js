import {
  AppBar,
  CircularProgress,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RegistrationInstance from "../../../Instance/RegisterInstance";
import URLS from "../../../URLs/url";
import { errorToast, Toast } from "../../../ui/Toast";
import Header from "../../../ui/Header";

const Dashboard = () => {
  const { sendRequest } = RegistrationInstance();

  const [officeData, setOfficeData] = useState([]);
  const [newDashboardData, setNewDashboardData] = useState([]);

  const [expandedDivision, setExpandedDivision] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [expandedOffice, setExpandedOffice] = useState(null);

  const [loadingDivision, setLoadingDivision] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [loadingMutation, setLoadingMutation] = useState(false);

  const [divisionData, setDivisionData] = useState([]);
  const [districtData, setDistrictData] = useState([]);

  const loadHierarchy = ({
    type,
    code,
    loadingSetter,
    dataSetter,
    onSuccess,
  }) => {
    loadingSetter(true);

    sendRequest(
      `${URLS.BaseURL}/EPCISAPIS/getDashboardMetrics`,
      "POST",
      {
        type,
        code: String(code),
      },
      (res) => {
        const response =
          res?.ResponseData?.ePCISgetDashboardMetricsResponse || [];

        console.log(`${type} Response:`, res);
        console.log(`${type} Data:`, res?.ResponseData?.ePCISgetDashboardMetricsResponse);

        dataSetter(response);

        if (onSuccess) {
          onSuccess(response);
        }

        loadingSetter(false);
      },
      (err) => {
        loadingSetter(false);
        errorToast(err.Message);
      }
    );
  };

  const handleGetDivision = () => {
    loadHierarchy({
      type: "DIVISIONS",
      code: "9999",
      loadingSetter: setLoadingDivision,
      dataSetter: setDivisionData,
    });
  };

  const handleDivisionClick = (division) => {
    const divisionCode = division.divisioncode;

    if (expandedDivision === divisionCode) {
      setExpandedDivision(null);
      setExpandedDistrict(null);
      setExpandedOffice(null);

      setDistrictData([]);
      setOfficeData([]);
      setNewDashboardData([]);

      return;
    }

    loadHierarchy({
      type: "DISTRICTS",
      code: divisionCode,

      loadingSetter: setLoadingDistrict,

      dataSetter: setDistrictData,

      onSuccess: () => {
        setExpandedDivision(divisionCode);

        setExpandedDistrict(null);
        setExpandedOffice(null);

        setOfficeData([]);
        setNewDashboardData([]);
      },
    });
  };

  const handleDistrictClick = (district) => {
    const districtCode = district.districtcode;

    if (expandedDistrict === districtCode) {
      setExpandedDistrict(null);
      setExpandedOffice(null);

      setOfficeData([]);
      setNewDashboardData([]);

      return;
    }

    loadHierarchy({
      type: "OFFICES",
      code: districtCode,

      loadingSetter: setLoadingOffice,

      dataSetter: setOfficeData,

      onSuccess: () => {
        setExpandedDistrict(districtCode);

        setExpandedOffice(null);
        setNewDashboardData([]);
      },
    });
  };

  const handleOfficeClick = (division, district, office) => {
    if (expandedOffice === office.officecode) {
      setExpandedOffice(null);
      setNewDashboardData([]);
      return;
    }

    setExpandedOffice(office.officecode);

    getDashboardData(
      division.divisioncode,
      district.districtcode,
      office.officecode
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

  const divisionTotals = React.useMemo(() => {
    return divisionData.reduce(
      (acc, item) => {
        acc.created += Number(item.totalCreatedApplicationCount || 0);
        acc.inward += Number(item.total_inward || 0);
        acc.pendingMS += Number(item.pending_at_ms_inward || 0);
        acc.pendingCTSO += Number(item.pending_at_ctso_inward || 0);
        acc.disposed += Number(item.disposed_inward || 0);

        return acc;
      },
      {
        created: 0,
        inward: 0,
        pendingMS: 0,
        pendingCTSO: 0,
        disposed: 0,
      }
    );
  }, [divisionData]);

  useEffect(() => {
    handleGetDivision();
  }, []);

  return (
    <>
      <Toast />
      <AppBar position="fixed" color="default">
        <Header showSignInBtn={true} />
      </AppBar>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table
          stickyHeader
          sx={{
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #e5e7eb",
              fontSize: "14px",
            },
          }}
        >
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                background: "#1565C0",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                textAlign: "center",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
                lineHeight: 1.4,
                border: "1px solid rgba(255,255,255,0.2)",
                py: 1.5,
              },
            }}
          >
            <TableRow>
              <TableCell width={80} align="center">Sr No</TableCell>
              <TableCell align="center">विभाग</TableCell>
              <TableCell align="center">EPSIT मध्ये प्राप्त एकूण अर्ज</TableCell>
              <TableCell align="center">ePCIS मध्ये inward एकूण अर्ज</TableCell>
              <TableCell align="center">परिरक्षण भूमापककडे प्रलंबीत</TableCell>
              <TableCell align="center">नगर भूमापन अ्धिकारी कडे प्रलंबीत</TableCell>
              <TableCell align="center">एकूण निकाली अर्ज</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingDivision ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0 }}>
                  <Box
                    sx={{
                      height: 250,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              divisionData.map((division, index) => (
                <React.Fragment key={division.divisioncode}>
                  <TableRow
                    hover
                    sx={{
                      cursor: "pointer",
                      bgcolor: "#E3F2FD",
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
                    <TableCell align="center">{index + 1}</TableCell>

                    <TableCell align="center">{division.divisionname}</TableCell>

                    <TableCell align="center">{division.totalCreatedApplicationCount}</TableCell>

                    <TableCell align="center">{division.total_inward}</TableCell>

                    <TableCell align="center">{division.pending_at_ms_inward}</TableCell>

                    <TableCell align="center">{division.pending_at_ctso_inward}</TableCell>

                    <TableCell align="center">{division.disposed_inward}</TableCell>
                  </TableRow>

                  {expandedDivision === division.divisioncode &&
                    loadingDistrict && (
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

                  {expandedDivision === division.divisioncode &&
                    !loadingDistrict &&
                    districtData.map((district, dIndex) => (
                      <React.Fragment key={district.districtcode}>
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
                          onClick={() => handleDistrictClick(district)}
                        >
                          <TableCell align="center">{`${index + 1}.${dIndex + 1}`}</TableCell>

                          <TableCell
                            sx={{
                              pl: 6,
                              borderLeft: "5px solid #42A5F5",
                            }}
                            align="center"
                          >
                            {district.districtname}
                          </TableCell>

                          <TableCell align="center">
                            {district.totalCreatedApplicationCount}
                          </TableCell>

                          <TableCell align="center">
                            {district.total_inward}
                          </TableCell>

                          <TableCell align="center">
                            {district.pending_at_ms_inward}
                          </TableCell>

                          <TableCell align="center">
                            {district.pending_at_ctso_inward}
                          </TableCell>

                          <TableCell align="center">
                            {district.disposed_inward}
                          </TableCell>
                        </TableRow>

                        {expandedDistrict === district.districtcode &&
                          loadingOffice && (
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

                        {expandedDistrict === district.districtcode &&
                          !loadingOffice &&
                          officeData.map((office, oIndex) => (
                            <React.Fragment key={office.officecode}>
                              <TableRow
                                hover
                                sx={{
                                  cursor: "pointer",
                                  bgcolor: "#FFFDF3",

                                  "&:hover": {
                                    bgcolor: "#FFF3CD",
                                  },
                                }}
                                onClick={() =>
                                  handleOfficeClick(
                                    division,
                                    district,
                                    office
                                  )
                                }
                              >
                                <TableCell align="center">
                                  {`${index + 1}.${dIndex + 1}.${oIndex + 1}`}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    pl: 10,
                                    borderLeft: "5px solid orange",
                                  }}
                                  align="center"
                                >
                                  {office.officename}
                                </TableCell>

                                <TableCell align="center">
                                  {office.totalCreatedApplicationCount}
                                </TableCell>

                                <TableCell align="center">
                                  {office.total_inward}
                                </TableCell>

                                <TableCell align="center">
                                  {office.pending_at_ms_inward}
                                </TableCell>

                                <TableCell align="center">
                                  {office.pending_at_ctso_inward}
                                </TableCell>

                                <TableCell align="center">
                                  {office.disposed_inward}
                                </TableCell>
                              </TableRow>

                              {expandedOffice === office.officecode && (
                                <TableRow>
                                  <TableCell
                                    colSpan={7}
                                    sx={{
                                      p: 2,
                                      bgcolor: "#f8fafc",
                                    }}
                                  >
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
                                        <TableHead
                                          sx={{
                                            bgcolor: "#E3F2FD",
                                            "& th": {
                                              color: "#0D47A1",
                                              fontWeight: 700,
                                              fontSize: "13px",
                                              borderBottom: "2px solid #1976d2",
                                              textAlign: "center",
                                            },
                                          }}
                                        >
                                          <TableRow>
                                            <TableCell />
                                            <TableCell width={100}>अ.क्र.</TableCell>

                                            <TableCell width={250}>
                                              फेरफार नाव
                                            </TableCell>

                                            <TableCell align="center">
                                              Created Application
                                            </TableCell>

                                            <TableCell align="center">
                                              Inward No Generated
                                            </TableCell>

                                            <TableCell align="center">
                                              Rejected
                                            </TableCell>

                                            <TableCell align="center">
                                              Inward Number Error
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody sx={{
                                          "& tr:nth-of-type(even)": {
                                            bgcolor: "#fafafa",
                                          },

                                          "& tr:hover": {
                                            bgcolor: "#E3F2FD",
                                          },

                                          "& td": {
                                            textAlign: "center",
                                            py: 1,
                                          },

                                          "& td:first-of-type": {
                                            textAlign: "left",
                                            fontWeight: 500,
                                          },
                                        }}>
                                          {newDashboardData.map((mutation, index) => {
                                            const created =
                                              mutation.Statuses.find(
                                                (s) =>
                                                  s.ApplicationStatusCode === 0
                                              )?.CountOfMutation || 0;

                                            const inward =
                                              mutation.Statuses.find(
                                                (s) =>
                                                  s.ApplicationStatusCode === 10
                                              )?.CountOfMutation || 0;

                                            const rejected =
                                              mutation.Statuses.find(
                                                (s) =>
                                                  s.ApplicationStatusCode === 12
                                              )?.CountOfMutation || 0;

                                            const error =
                                              mutation.Statuses.find(
                                                (s) =>
                                                  s.ApplicationStatusCode === 15
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
                                                <TableCell />

                                                <TableCell align="center">
                                                  {index + 1}
                                                </TableCell>

                                                <TableCell
                                                  sx={{
                                                    fontWeight: 500,
                                                    pl: 2,
                                                    textAlign: "left",
                                                  }}
                                                >
                                                  {mutation.MutationName}
                                                </TableCell>

                                                <TableCell align="center">
                                                  {created}
                                                </TableCell>

                                                <TableCell align="center">
                                                  {inward}
                                                </TableCell>

                                                <TableCell align="center">
                                                  {rejected}
                                                </TableCell>

                                                <TableCell align="center">
                                                  {error}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <Box
                                        sx={{
                                          height: 70,
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        No Application Found For Any Mutation
                                      </Box>
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
            {!loadingDivision && divisionData.length > 0 && (
              <TableRow
                sx={{
                  bgcolor: "#FFF8E1",

                  "& td": {
                    fontWeight: 700,
                    borderTop: "3px solid #1565C0",
                    fontSize: "15px",
                  },
                }}
              >
                <TableCell />

                <TableCell align="center">
                  <b>एकूण (Total)</b>
                </TableCell>

                <TableCell align="center">
                  {divisionTotals.created}
                </TableCell>

                <TableCell align="center">
                  {divisionTotals.inward}
                </TableCell>

                <TableCell align="center">
                  {divisionTotals.pendingMS}
                </TableCell>

                <TableCell align="center">
                  {divisionTotals.pendingCTSO}
                </TableCell>

                <TableCell align="center">
                  {divisionTotals.disposed}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Dashboard;
