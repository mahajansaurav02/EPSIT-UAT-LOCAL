import { Paper, Grid, Tooltip } from "@mui/material";
import React, { lazy, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useSelector } from "react-redux";
import AxiosInstance from "../../../Instance/AxiosInstance";
import { selectApplicationType } from "../../../Redux/slices/HomeSlices/ApplicationTypeSlice";
import { errorToast } from "../../../ui/Toast";
import URLS from "../../../URLs/url";
import DharnaDhikarNond from "./FerfarType/UnRegistered/DharnaDhikarNond/DharnaDhikarNond";

//--------------Registered-----------------------
const KherediNond = lazy(
  () => import("./FerfarType/Registered/KherediNond/KherediNond"),
);
const BakshishPatraNond = lazy(
  () => import("./FerfarType/Registered/BakshishPatraNond/BakshishPatraNond"),
);

const GahankhatTaranBojaDakhalNond = lazy(
  () =>
    import("./FerfarType/Registered/GahankhatTaranBojaDakhalNond/GahankhatTaranBojaDakhalNond"),
);
const GahankhatTaranBojaKamiKarneNond = lazy(
  () =>
    import("./FerfarType/Registered/GahankhatTaranBojaKamiKarneNond/GahankhatTaranBojaKamiKarneNond"),
);
const BhadePattaNond = lazy(
  () => import("./FerfarType/Registered/BhadePattaNond/BhadePattaNond"),
);

const HakkaSodPatraReleaseDidNond = lazy(
  () =>
    import("./FerfarType/Registered/HakkaSodPatraReleaseDidNond/HakkaSodPatraReleaseDidNond"),
);

const ChukDurustiNond = lazy(
  () => import("./FerfarType/Registered/ChukDurustiNond/ChukDurustiNond"),
);
const VatniPatraNond = lazy(
  () => import("./FerfarType/Registered/VatniPatraNond/VatniPatraNond"),
);
//--------------UnRegistered-----------------------
const VarasNond = lazy(
  () => import("./FerfarType/UnRegistered/VarasNond/VarasNond"),
);
const MryutuPatraIcchaPatraNondUnRegistered = lazy(
  () =>
    import("./FerfarType/UnRegistered/MryutupatraIcchaPatraNond/MryutuPatraIcchaPatraNondUnRegistered"),
);
const TabaPavtiNond = lazy(
  () => import("./FerfarType/UnRegistered/TabaPavtiNond/TabaPavtiNond"),
);
const EeKuMyaNondkamiKarne = lazy(
  () =>
    import("./FerfarType/UnRegistered/EeKuMyaNondKamiKarne/EkKuMyaNondKamiKarne"),
);
const HibaNama = lazy(
  () => import("./FerfarType/UnRegistered/HibaNama/HibaNama"),
);

const MayatacheNavKamiKarne = lazy(
  () =>
    import("./FerfarType/UnRegistered/MayatacheNavKamiKarne/MayatacheNavKamiKarne"),
);
const NavatBadalNond = lazy(
  () => import("./FerfarType/UnRegistered/NavatBadalNond/NavatBadalNond"),
);
const AaPaKNondKamiKarne = lazy(
  () =>
    import("./FerfarType/UnRegistered/AaPaKNondKamiKarne/AaPaKNondKamiKarne"),
);

//-------------------------------Generic-------------
const GenericMutation = lazy(
  () => import("./FerfarType/Generic/GenericMutation"),
);

//----------------------------New Generic-------------
const NewGenericMutation = lazy(
  () => import("./FerfarType/NewGeneric/NewGenericMutation"),
);

const Ferfar = () => {
  const navigate = useNavigate();
  const reduxState = useSelector(selectApplicationType);
  const isDast = sessionStorage.getItem("isDast");
  const isCourtDawa = sessionStorage.getItem("isCourtDawa");
  const isPOA = sessionStorage.getItem("isMainPatra");
  const allowPoa = sessionStorage.getItem("allowPoa");
  const { sendRequest } = AxiosInstance();
  const applicationId = sessionStorage.getItem("applicationId");
  const [applicationData, setApplicationData] = useState({});
  const [disableNextBtn, setDisableShowNextBtn] = useState(true);

  const handleNext = () => {
    if (isPOA === "no" && isCourtDawa === "yes") {
      navigate("/home/court-dawa");
    } else if (isPOA === "yes" && isCourtDawa === "no") {
      navigate("/home/main-patra");
    } else if (isPOA === "no" && isCourtDawa === "no") {
      navigate("/home/documents");
    } else {
      navigate("/home/main-patra");
    }
  };
  const handlePrevious = () => {
    if (isDast === "yes") {
      navigate("/home/dast");
    } else {
      navigate("/home/nabhu");
    }
  };
  const goToHomePage = () => {
    sessionStorage.removeItem("applicationId");
    sessionStorage.setItem("isCourtDawa", "no");
    sessionStorage.setItem("isDast", "no");
    sessionStorage.setItem("isMainPatra", "no");
    sessionStorage.setItem("allowPoa", "no");
    navigate("/home");
  };

  const setApplicationDataApi = () => {
    sendRequest(
      `${URLS?.BaseURL}/ApplicationAPIS/GetApplicationData`,
      "POST",
      applicationId,
      (res) => {
        if (res?.Code == "1") {
          setApplicationData(res?.ResponseData);
        }
      },
      (err) => {
        errorToast(err?.Message);
      },
    );
  };

  useEffect(() => {
    setApplicationDataApi();
  }, []);

  useEffect(() => {
    const checkSessionStorage = () => {
      const allowPoa = sessionStorage.getItem("allowPoa");
      setDisableShowNextBtn(allowPoa !== "yes");
    };
    checkSessionStorage();
    window.addEventListener("storage", checkSessionStorage);
    return () => {
      window.removeEventListener("storage", checkSessionStorage);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12} mt={2}>
          <Paper elevation={5} sx={{ px: 2, p: 3 }} className="paper-back">
            <Grid container spacing={2}>
              <Grid item md={2}>
                <span className="paper-span">
                  जिल्हा : <b>{applicationData?.district_name_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  तालुका/न.भु. कार्यालय : <b>{applicationData?.taluka_name}</b>
                </span>
              </Grid>
              <Grid item md={2}>
                <span className="paper-span">
                  अर्ज प्रकार :{" "}
                  <b>{applicationData?.application_type_in_marathi}</b>
                </span>
              </Grid>
              <Grid item md={4}>
                <span className="paper-span">
                  फेरफार प्रकार : <b>{applicationData?.mutation_type}</b>
                </span>
              </Grid>
              <Grid item md={2}>
                <span className="paper-span">
                  गाव : <b>{applicationData?.village_name}</b>
                </span>
              </Grid>
              <Grid item md={6}>
                <span className="paper-span">
                  न.भू .क्र. :{" "}
                  {Array.isArray(applicationData?.nabhDTL) &&
                    applicationData?.nabhDTL.map((val, i) => {
                      return (
                        <b key={i}>
                          {" "}
                          {i === applicationData?.nabhDTL.length - 1
                            ? val?.naBhu
                            : `${val?.naBhu}, `}
                        </b>
                      );
                    })}
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {applicationData?.application_type_in_marathi == "नोंदणी कृत" ? (
          <>
            {applicationData?.mutation_type_code == "03" && (
              <KherediNond applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "04" && (
              <BakshishPatraNond applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "06" && (
              <GahankhatTaranBojaDakhalNond applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "07" && (
              // <GahankhatTaranBojaDakhalNond applicationData={applicationData} />
              <GahankhatTaranBojaDakhalNond applicationData={applicationData} />
              // <GahankhatTaranBojaKamiKarneNond
              //   applicationData={applicationData}
              // />
              // <GenericMutation applicationData={applicationData} />
              // <NewGenericMutation applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "10" && (
              <BhadePattaNond applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "09" && (
              <HakkaSodPatraReleaseDidNond applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "05" && (
              <MryutuPatraIcchaPatraNondUnRegistered
                applicationData={applicationData}
              />
            )}
            {applicationData.mutation_type_code == "30" && (
              <ChukDurustiNond applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "08" && (
              <VatniPatraNond applicationData={applicationData} />
            )}
            {applicationData?.mutation_type_code == "24" && (
              <NewGenericMutation applicationData={applicationData} />
            )}
          </>
        ) : (
          <>
            {applicationData.mutation_type_code == "01" && (
              <VarasNond applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "05" && (
              <MryutuPatraIcchaPatraNondUnRegistered
                applicationData={applicationData}
              />
            )}
            {applicationData.mutation_type_code == "20" && (
              <EeKuMyaNondkamiKarne applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "18" && (
              // <GenericMutation applicationData={applicationData} />
              <NewGenericMutation applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "23" && (
              <NewGenericMutation applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "02" && (
              <MayatacheNavKamiKarne applicationData={applicationData} />
            )}
            {applicationData.mutation_type_code == "31" && (
              <NavatBadalNond applicationData={applicationData} />
            )}
            {/* {applicationData.mutation_type_code == "31" && (
              <DharnaDhikarNond applicationData={applicationData} />
            )} */}
            {applicationData.mutation_type_code == "21" && (
              <AaPaKNondKamiKarne applicationData={applicationData} />
            )}
          </>
        )}

        <Grid container justifyContent="space-between" px={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={goToHomePage}
            >
              होम पेज ला जा
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handlePrevious}
              sx={{ mr: 2 }}
            >
              मागे जा
            </Button>
            {disableNextBtn ? (
              <Tooltip
                arrow
                disableFocusListener
                disableTouchListener
                placement="top"
                title="कृपया पूर्ण माहिती भरा"
              >
                <span>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    // disabled={allowPoa === "no"}
                    disabled={disableNextBtn}
                  >
                    पुढे जा
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={handleNext}
                // disabled={allowPoa === "no"}
                disabled={disableNextBtn}
              >
                पुढे जा
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Ferfar;
