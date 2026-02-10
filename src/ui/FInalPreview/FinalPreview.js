import React, { useState } from "react";
import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const FinalPreview = ({
  previewData,
  applicationData,
  setIsUserAgree,
  handleDialogClose,
}) => {
  const [userAccept, setUserAccept] = useState("");
  const isDast = sessionStorage.getItem("isDast");
  const isPOA = sessionStorage.getItem("isMainPatra");
  const isCourtDawa = sessionStorage.getItem("isCourtDawa");

  const handleUserAccept = (e) => {
    setUserAccept(e.target.value);
  };

  const handleAccept = () => {
    setIsUserAgree(true);
    handleDialogClose();
  };

  return (
    <>
      <Grid container flexDirection="column" justifyContent="center">
        <Grid item md={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className="final_preview_logo"
            px={10}
          >
            <Grid item>
              <img
                src="/images/epsit.png"
                alt="GovtMaha_logo"
                style={{ fontSize: "3em" }}
              />
            </Grid>
            <Grid item>
              <img src="/images/Emblem_new.svg" alt="govt_emblem" />
            </Grid>
            <Grid item>
              <img
                src="/images/bhumiabhilekh.png"
                alt="GovtMaha_logo"
                style={{ fontSize: "3em" }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} textAlign="center">
          <h4>
            Electronic Property System Integrated Tool (EPSIT) Module for
            Property Card Mutations in Maharashtra State - प्रॉपर्टी कार्ड
            फेरफार, महाराष्ट्र
          </h4>
        </Grid>
        <Grid item md={12}>
          <Grid container justifyContent="space-evenly">
            <Grid item md={4} textAlign="center">
              <b>अर्ज क्रमांक :</b> {previewData?.applicationDtl?.applicationid}
            </Grid>
            <Grid item md={4} textAlign="center">
              <b>फेरफार प्रकार :</b>{" "}
              {previewData?.applicationDtl?.MutationTypeName}
            </Grid>
            <Grid item md={4} textAlign="center">
              <b>अर्ज दिनांक :</b>{" "}
              {previewData?.applicationDtl?.applicationdate}
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item md={12} mt={2}>
          <Grid container justifyContent="space-evenly">
            <Grid item md={4} textAlign="center">
              <b>अर्ज प्रकार :</b>{" "}
              {previewData?.applicationDtl?.applicationType}
            </Grid>
            <Grid item md={4} textAlign="center">
              <b>तालुका / न.भू.कार्यालय :</b>{" "}
              {previewData?.applicationDtl?.OfficeName}
            </Grid>
            <Grid item md={4} textAlign="center">
              <b>जिल्हा :</b> {previewData?.applicationDtl?.DistrictName}
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item md={12} textAlign="center" mt={2}>
          <span>
            मी{" "}
            {previewData?.registereduser?.usertype_code == 1 ? (
              <b>
                {previewData?.registereduser?.fname_in_marathi}{" "}
                {previewData?.registereduser?.mname_in_marathi}{" "}
                {previewData?.registereduser?.lname_in_marathi}
              </b>
            ) : (
              <b>{previewData?.registereduser?.company_name_in_marathi}</b>
            )}
            , राहणार{" "}
            {previewData?.registereduser?.address_type == "FOREIGN" ? (
              <b>{previewData?.applicants[0]?.address}</b>
            ) : (
              <b>
                {previewData?.applicants[0]?.flatno_plotno},{" "}
                {previewData?.applicants[0]?.landmark},{" "}
                {previewData?.applicants[0]?.postofficename},{" "}
                {previewData?.applicants[0]?.state},{" "}
                {previewData?.applicants[0]?.pincode}{" "}
              </b>
            )}
            अर्जामधील नमूद न.भू .क्र.-{" "}
            <b>
              {Array.isArray(applicationData?.nabhDTL) &&
                applicationData?.nabhDTL.map((item) => item.naBhu).join(",")}
            </b>{" "}
            साठी <b>{previewData?.applicationDtl?.MutationTypeName}</b> करू
            इच्छितो.
          </span>
        </Grid>
        {/* <Divider /> */}
        {/* ---------------------------------------------------अर्जदारची माहिती------- */}
        <Grid item md={12}>
          <Grid container>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">अर्जदारची माहिती</h4>
            </Grid>

            {Array.isArray(previewData?.applicants) &&
              previewData?.applicants.map((val, i) => {
                return (
                  <Grid item md={12} key={i}>
                    <Grid
                      container
                      justifyContent="space-evenly"
                      alignItems="center"
                    >
                      <Grid item md={1}>
                        <b>{i + 1}</b>
                      </Grid>
                      <Grid item md={2.5}>
                        <img
                          src={val?.profile_pic_file_path}
                          alt="user_img"
                          style={{ width: "9em" }}
                        />
                      </Grid>
                      <Grid item md={2.5}>
                        <b>अर्जदाराचे नाव :</b>{" "}
                        {val?.usertype_code == 1
                          ? val?.applicantNameInMarathi
                          : val?.company_name_in_marathi}
                      </Grid>
                      <Grid item md={2.5}>
                        <b>अर्जदाराचा पत्ता : </b>
                        {val?.address_type == "INDIA"
                          ? `${val?.flatno_plotno}, ${val?.landmark}, ${val?.postofficename}, ${val?.state},${val?.pincode}`
                          : `${val?.address}`}
                      </Grid>
                      <Grid item md={2.5}>
                        <img
                          src={val?.signed_file_path}
                          alt="user_sign"
                          style={{ width: "9em" }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        {/* <Divider /> */}
        {/* ----------------------------------------------------न.भू.क्र.------------ */}
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                माहितीफेरफार नोंदी मध्ये परिणाम झालेले न.भू.क्र.
              </h4>
            </Grid>
            {Array.isArray(previewData?.mutationCTSNoData) &&
              previewData?.mutationCTSNoData.map((val, i) => {
                return (
                  <Grid item md={12} key={i}>
                    <Grid
                      container
                      justifyContent="space-evenly"
                      alignItems="center"
                      px={2}
                    >
                      <Grid item md={1}>
                        <b>{i + 1}</b>
                      </Grid>
                      <Grid item md={2.2}>
                        <b>गाव :</b> {val?.villageName}
                      </Grid>
                      <Grid item md={2}>
                        <b>फेरफरासाठी मिळकत :</b>{" "}
                        {val?.milkat == "LAND"
                          ? "जमीन (NA प्लॉट)"
                          : "अपार्टमेंट"}
                      </Grid>
                      <Grid item md={2.2}>
                        <b>अर्जामधील न.भू.क्र. :</b> {val?.naBhu}
                      </Grid>
                      <Grid item md={2.2}>
                        <b>LR-Property UID :</b> {val?.lrPropertyUID}
                      </Grid>
                      <Grid item md={2.2}>
                        <b>न.भू.क्र. क्षेत्र (चौ.मी.) :</b>{" "}
                        {/* {val?.cityServeyAreaInSqm} */}
                        {val?.milkat == "LAND"
                          ? val?.cityServeyAreaInSqm
                          : val?.flatBuiltUpArea}
                      </Grid>
                      {/* <Grid item md={11}>
                        <Grid container spacing={1} rowSpacing={3}>
                          <Grid item md={2.2}>
                            <b>गाव :</b> {val?.villageName}
                          </Grid>
                          <Grid item md={2.2}>
                            <b>फेरफरासाठी मिळकत :</b>{" "}
                            {val?.milkat == "LAND"
                              ? "जमीन (NA प्लॉट)"
                              : "अपार्टमेंट"}
                          </Grid>
                          <Grid item md={2.2}>
                            <b>अर्जामधील न.भू.क्र. :</b> {val?.naBhu}
                          </Grid>
                          <Grid item md={2.2}>
                            <b>LR-Property UID :</b> {val?.lrPropertyUID}
                          </Grid>
                          <Grid item md={2.2}>
                            <b>न.भू.क्र. क्षेत्र (चौ.मी.) :</b>{" "}
                            {val?.cityServeyAreaInSqm}
                          </Grid>
                        </Grid>
                      </Grid> */}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        {/* <Divider sx={{ mt: 2 }} /> */}
        {/* ---------------------------------------------------दस्त माहिती--------- */}
        {isDast == "yes" && (
          <>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={12} textAlign="left">
                  <h4 className="heading_final">दस्त माहिती</h4>
                </Grid>
                {Array.isArray(previewData?.dastInformation) &&
                  previewData?.dastInformation.map((val, i) => {
                    return (
                      <Grid item md={12} key={i}>
                        <Grid
                          container
                          justifyContent="space-evenly"
                          alignItems="center"
                        >
                          <Grid item md={1}>
                            <b>{i + 1}</b>
                          </Grid>
                          <Grid item md={11}>
                            <Grid container spacing={1}>
                              <Grid item md={3}>
                                <b>दस्त प्रकार :</b>{" "}
                                {val?.dastType == "mainDast"
                                  ? "मूळ दस्त"
                                  : "चूक दुरुस्ती"}
                              </Grid>
                              <Grid item md={3}>
                                <b>दुय्यम निबंधक कार्यालय :</b>{" "}
                                {val?.registrarName}
                              </Grid>
                              <Grid item md={3}>
                                <b>र. द. क. / वर्ष :</b> {val?.dastNo}/
                                {val?.dastNoYear}{" "}
                              </Grid>
                              <Grid item md={3}>
                                <b>दस्त दिनांक :</b> {val?.dastNoDate}
                              </Grid>
                              <Grid item md={3}>
                                <b>दस्तामध्ये नमूद केलेले न.भू.क्र. :</b>{" "}
                                {val?.dastNabhu}
                              </Grid>
                              {val?.dastType == "errorCorrect" && (
                                <Grid item md={3}>
                                  <b>चुकदुरुस्ती करण्याचे कारण :</b>{" "}
                                  {val?.remarks}
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
            {/* <Divider sx={{ mt: 2 }} /> */}
          </>
        )}
        {/* --------------------------------------------------फेरफार तपशील-------- */}
        {/* --------------------------------------------नोंदणी कृत------------*/}
        {/* -----------------------------------खरेदी नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "03" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            {Array.isArray(previewData?.Mutation) &&
              previewData?.Mutation.map((mut, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item md={12} textAlign="center" mt={1}>
                      <b>{mut?.type}</b>
                    </Grid>
                    {Array.isArray(mut?.value) &&
                      mut?.value.map((val, i) => {
                        return (
                          <Grid item md={12} key={i}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Grid item md={1}>
                                <b>{i + 1}</b>
                              </Grid>
                              <Grid item md={5}>
                                <b> {mut?.type} नाव :</b>{" "}
                                {val?.fullNameInMarathi}
                              </Grid>
                              <Grid item md={6}>
                                <b>पत्ता :</b>{" "}
                                {val?.address?.addressType == "INDIA"
                                  ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                  : `${val?.address?.foreignAddress?.address}`}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                );
              })}
          </Grid>
        )}
        {/* -----------------------------------बक्षीसपत्र नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "04" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            {Array.isArray(previewData?.Mutation) &&
              previewData?.Mutation.map((mut, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item md={12} textAlign="center" mt={1}>
                      <b>{mut?.type}</b>
                    </Grid>
                    {Array.isArray(mut?.value) &&
                      mut?.value.map((val, i) => {
                        return (
                          <Grid item md={12} key={i}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Grid item md={1}>
                                <b>{i + 1}</b>
                              </Grid>
                              <Grid item md={5}>
                                <b> {mut?.type} नाव :</b>{" "}
                                {val?.fullNameInMarathi}
                              </Grid>
                              <Grid item md={6}>
                                <b>पत्ता :</b>{" "}
                                {val?.address?.addressType == "INDIA"
                                  ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                  : `${val?.address?.foreignAddress?.address}`}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                );
              })}
          </Grid>
        )}
        {/* ------------------------गहाणखत / तारण / बोजा दाखल नोंद---------------------------*/}
        {(applicationData?.mutation_type_code === "06" ||
          applicationData?.mutation_type_code === "07") && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            {Array.isArray(previewData?.Mutation) &&
              previewData?.Mutation.map((mut, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item md={12} textAlign="center" mt={1}>
                      <b>{mut?.type}</b>
                    </Grid>
                    {Array.isArray(mut?.value) &&
                      mut?.value.map((val, i) => {
                        return (
                          <Grid item md={12} key={i}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Grid item md={1}>
                                <b>{i + 1}</b>
                              </Grid>
                              <Grid item md={5}>
                                <b> {mut?.type} नाव :</b>{" "}
                                {val?.fullNameInMarathi
                                  ? val?.fullNameInMarathi
                                  : val?.userDetails?.bankNameMar}
                              </Grid>
                              <Grid item md={6}>
                                <b>पत्ता :</b>{" "}
                                {val?.address?.addressType == "INDIA"
                                  ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                  : `${val?.address?.foreignAddress?.address}`}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                );
              })}
          </Grid>
        )}
        {/* -------------------------हक्कसोड पत्र /रिलीज डिड नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "09" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            {Array.isArray(previewData?.Mutation) &&
              previewData?.Mutation.map((mut, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item md={12} textAlign="center" mt={1}>
                      <b>{mut?.type}</b>
                    </Grid>
                    {Array.isArray(mut?.value) &&
                      mut?.value.map((val, i) => {
                        return (
                          <Grid item md={12} key={i}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Grid item md={1}>
                                <b>{i + 1}</b>
                              </Grid>
                              <Grid item md={5}>
                                <b> {mut?.type} नाव :</b>
                                {val?.fullNameInMarathi
                                  ? val?.fullNameInMarathi
                                  : val?.userDetails?.bankNameMar}
                              </Grid>
                              <Grid item md={6}>
                                <b>पत्ता :</b>{" "}
                                {val?.address?.addressType == "INDIA"
                                  ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                  : `${val?.address?.foreignAddress?.address}`}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                );
              })}
          </Grid>
        )}
        {/* -----------------------------------भाडेपट्टा नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "10" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>

            <Grid container>
              <Grid item md={12} textAlign="center" mt={1}>
                <b>{previewData?.Mutation[0]?.type}</b>
              </Grid>
              {Array.isArray(previewData?.Mutation[0]?.value) &&
                previewData?.Mutation[0]?.value.map((val, i) => {
                  return (
                    <Grid item md={12} key={i}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Grid item md={1}>
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={5}>
                          <b> {previewData?.Mutation[0]?.type} नाव :</b>{" "}
                          {val?.fullNameInMarathi}
                        </Grid>
                        <Grid item md={6}>
                          <b>पत्ता :</b>{" "}
                          {val?.address?.addressType == "INDIA"
                            ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                            : `${val?.address?.foreignAddress?.address}`}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              <Grid item md={12} textAlign="center" mt={1}>
                <b>{previewData?.Mutation[1]?.type}</b>
              </Grid>
              {Array.isArray(previewData?.Mutation[1]?.value) &&
                previewData?.Mutation[1]?.value.map((val, i) => {
                  return (
                    <Grid item md={12} key={i}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Grid item md={1}>
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={5}>
                          <b> {previewData?.Mutation[1]?.type} नाव :</b>{" "}
                          {val?.fullNameInMarathi}
                        </Grid>
                        <Grid item md={6}>
                          <b>पत्ता :</b>{" "}
                          {val?.address?.addressType == "INDIA"
                            ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                            : `${val?.address?.foreignAddress?.address}`}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              <Grid item md={12} textAlign="center" mt={1}>
                <b>{previewData?.Mutation[2]?.type}</b>
              </Grid>
              <Grid item md={12}>
                <Grid
                  container
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  <Grid item md={1}>
                    <b>1</b>
                  </Grid>
                  <Grid item md={3}>
                    <b>भाडेपट्ट्याचा एकूण कालावधी वर्षे :</b>
                    {previewData?.Mutation[2]?.value?.bhadepattaTenureYear}
                  </Grid>
                  <Grid item md={3}>
                    <b>भाडेपट्ट्याचा एकूण कालावधी महीने :</b>
                    {previewData?.Mutation[2]?.value?.bhadepattaTenureMonth}
                  </Grid>
                  <Grid item md={4}>
                    <b>भाडेपट्ट्याची तारीख पासून :</b>
                    {previewData?.Mutation[2]?.value?.bhadepattaFromDate}
                  </Grid>
                  <Grid item md={2}>
                    <b>भाडेपट्ट्याची तारीख पर्यंत :</b>
                    {previewData?.Mutation[2]?.value?.bhadepattaToDate}
                  </Grid>
                  <Grid item md={4}>
                    <b>भाडेपट्ट्याची रक्कम (रु.) :</b>
                    {previewData?.Mutation[2]?.value?.bhadepattaAmount}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {/* -------------------------------------------अनोंदणीकृत------------*/}
        {/* -----------------------------------वारस नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "01" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            <Grid container>
              <Grid item md={12} textAlign="center">
                <b>{previewData?.Mutation[0]?.type}</b>
              </Grid>
              <Grid item md={12} px={2}>
                <Grid container justifyContent="flex-start" alignItems="center">
                  <Grid item md={2}>
                    <b>1</b>
                  </Grid>
                  <Grid item md={4}>
                    <b> मयत धारकाचे नाव :</b>
                    {previewData?.Mutation[0]?.value[0]?.fullNameInMarathi}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container mt={1}>
              <Grid item md={12} textAlign="center" mb={1}>
                <b>{previewData?.Mutation[1]?.type}</b>
              </Grid>
              <Grid item md={12}>
                <Grid
                  container
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  <Grid item md={1}>
                    <b>1</b>
                  </Grid>
                  <Grid item md={2.5}>
                    <b>मृत्यू दिनांक :</b>
                    {
                      previewData?.Mutation[1]?.value[0]?.userDetails
                        ?.dateOfDeath
                    }
                  </Grid>
                  <Grid item md={2.5}>
                    <b>मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव :</b>
                    {
                      previewData?.Mutation[1]?.value[0]?.userDetails
                        ?.deathCertificateIssueOfficeDropdown
                        ?.certificate_authority_name
                    }
                  </Grid>
                  <Grid item md={2.5}>
                    <b>मृत्यू दाखला क्रमांक :</b>
                    {
                      previewData?.Mutation[1]?.value[0]?.userDetails
                        ?.deathCertificateNo
                    }
                  </Grid>
                  <Grid item md={2.5}>
                    <b>मृत्यू दाखला दिनांक :</b>
                    {
                      previewData?.Mutation[1]?.value[0]?.userDetails
                        ?.dateOfDeathCertificate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container mt={1}>
              <Grid item md={12} textAlign="center">
                <b>{previewData?.Mutation[2]?.type}</b>
              </Grid>
              <Grid item md={12} px={1}>
                {Array.isArray(previewData?.Mutation[2]?.value) &&
                  previewData?.Mutation[2]?.value.map((val, i) => {
                    return (
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                        key={i}
                      >
                        <Grid item md={1}>
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={3.5}>
                          <b>वारसाचे नाव :</b> {val?.fullNameInMarathi}
                        </Grid>
                        <Grid item md={2}>
                          <b>वारसाचे नाते :</b>
                          {val?.dharak?.deadRelation?.relation_name}
                        </Grid>
                        <Grid item md={5}>
                          <b>पत्ता : </b>
                          {val?.address?.addressType == "INDIA"
                            ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                            : `${val?.address?.foreignAddress?.address}`}
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {/* -----------------------------------मृत्युपत्र / इच्छापत्र नोंद---------------------------*/}
        {applicationData?.mutation_type_code == "05" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            <Grid container>
              <Grid item md={12} textAlign="center">
                <b>{previewData?.Mutation[0]?.type}</b>
              </Grid>
              <Grid item md={12} px={2}>
                <Grid container justifyContent="flex-start" alignItems="center">
                  <Grid item md={1}>
                    <b>1</b>
                  </Grid>
                  <Grid item md={3.3}>
                    <b>मृत्यूपत्र / इच्छापत्र करून देणारचे नाव :</b>
                    {previewData?.Mutation[0]?.value[0]?.fullNameInMarathi}
                  </Grid>
                  <Grid item md={3.3}>
                    <b>मृत्यू दिनांक :</b>
                    {
                      previewData?.Mutation[0]?.value[0]?.userDetails
                        ?.dateOfDeath
                    }
                  </Grid>
                  <Grid item md={3.4}>
                    <b>मृत्यू दाखला देणाऱ्या संस्थेचे / कार्यालयाचे नाव :</b>
                    {
                      previewData?.Mutation[0]?.value[0]?.userDetails
                        ?.deathCertificateIssueOfficeDropdown
                        ?.certificate_authority_name
                    }
                  </Grid>
                  <Grid item md={1}>
                    <b>&nbsp;</b>
                  </Grid>
                  <Grid item md={3}>
                    <b>मृत्यू दाखला क्रमांक :</b>
                    {
                      previewData?.Mutation[0]?.value[0]?.userDetails
                        ?.deathCertificateNo
                    }
                  </Grid>
                  <Grid item md={3}>
                    <b>मृत्यू दाखला दिनांक :</b>
                    {
                      previewData?.Mutation[0]?.value[0]?.userDetails
                        ?.dateOfDeathCertificate
                    }
                  </Grid>
                  <Grid item md={5}>
                    <b>पत्ता :</b>{" "}
                    {previewData?.Mutation[0]?.value[0]?.address?.addressType ==
                    "INDIA"
                      ? `${previewData?.Mutation[0]?.value[0]?.address?.indiaAddress?.plotNo}, ${previewData?.Mutation[0]?.value[0]?.address?.indiaAddress?.building}, ${previewData?.Mutation[0]?.value[0]?.address?.indiaAddress?.impSymbol}, ${previewData?.Mutation[0]?.value[0]?.address?.indiaAddress?.postOfficeName}, ${previewData?.Mutation[0]?.value[0]?.address?.indiaAddress?.pincode}`
                      : `${previewData?.Mutation[0]?.value[0]?.address?.foreignAddress?.address}`}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container mt={1}>
              <Grid item md={12} textAlign="center" mb={1}>
                <b>{previewData?.Mutation[1]?.type}</b>
              </Grid>
              {Array.isArray(previewData?.Mutation[1]?.value) &&
                previewData?.Mutation[1]?.value.map((val, i) => {
                  return (
                    <Grid item md={12} key={i}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Grid item md={1}>
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={5}>
                          <b> {previewData?.Mutation[1]?.type} नाव :</b>{" "}
                          {val?.fullNameInMarathi}
                        </Grid>
                        <Grid item md={6}>
                          <b>पत्ता :</b>{" "}
                          {val?.address?.addressType == "INDIA"
                            ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                            : `${val?.address?.foreignAddress?.address}`}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
            <Grid container mt={1}>
              <Grid item md={12} textAlign="center">
                <b>{previewData?.Mutation[2]?.type}</b>
              </Grid>
              <Grid item md={12} px={1}>
                {Array.isArray(previewData?.Mutation[2]?.value) &&
                  previewData?.Mutation[2]?.value.map((val, i) => {
                    return (
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                        key={i}
                      >
                        <Grid item md={1}>
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={3.5}>
                          <b>वारसाचे नाव :</b> {val?.fullNameInMarathi}
                        </Grid>
                        <Grid item md={2}>
                          <b>वारसाचे नाते :</b>
                          {val?.dharak?.deadRelation?.relation_name}
                        </Grid>
                        <Grid item md={5}>
                          <b>पत्ता : </b>
                          {val?.address?.addressType == "INDIA"
                            ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                            : `${val?.address?.foreignAddress?.address}`}
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        )}
        {/* -----------------------------------ए.कू.मॅ. नोंद कमी करणे---------------------------*/}
        {applicationData?.mutation_type_code == "20" && (
          <Grid item md={12}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">
                फेरफार तपशील :- {applicationData?.mutation_type}
              </h4>
            </Grid>
            {Array.isArray(previewData?.Mutation) &&
              previewData?.Mutation.map((mut, i) => {
                return (
                  <Grid container key={i}>
                    <Grid item md={12} textAlign="center" mt={1}>
                      <b>{mut?.type}</b>
                    </Grid>
                    {Array.isArray(mut?.value) &&
                      mut?.value.map((val, i) => {
                        return (
                          <Grid item md={12} key={i}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Grid item md={1}>
                                <b>{i + 1}</b>
                              </Grid>
                              <Grid item md={5}>
                                <b> {mut?.type} :</b> {val?.fullNameInMarathi}
                              </Grid>
                              <Grid item md={6}>
                                <b>पत्ता :</b>{" "}
                                {val?.address?.addressType == "INDIA"
                                  ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                  : `${val?.address?.foreignAddress?.address}`}
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                );
              })}
          </Grid>
        )}

        {/* <Divider sx={{ mt: 2 }} /> */}
        {/* -------------------------------------------------मुखत्यारपत्र माहिती-------- */}
        {isPOA === "yes" && (
          <>
            <Grid item md={12}>
              <Grid item md={12} textAlign="left">
                <h4 className="heading_final">मुखत्यारपत्र माहिती</h4>
              </Grid>
              {Array.isArray(previewData?.poa) &&
                previewData?.poa.map((val, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Grid item md={12} textAlign="center">
                        <b>मुखत्यारपत्र देणार</b>
                      </Grid>
                      <Grid item md={12} mt={1}>
                        {Array.isArray(val?.poAForGiver) &&
                          val?.poAForGiver.map((val, i) => {
                            return (
                              <Grid
                                container
                                justifyContent="space-evenly"
                                alignItems="center"
                                key={i}
                              >
                                <Grid item md={1}>
                                  <b>{i + 1}</b>
                                </Grid>
                                <Grid item md={5}>
                                  <b>मुखत्यारपत्र देणाऱ्याचे नाव : </b>
                                  {val?.fullNameInMarathi}
                                </Grid>
                                <Grid item md={6}>
                                  <b> पत्ता :</b>
                                  {val?.address?.addressType == "INDIA"
                                    ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                    : `${val?.address?.foreignAddress?.address}`}
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                      <Grid item md={12} textAlign="center" mt={1}>
                        <b>मुखत्यारपत्र घेणार</b>
                      </Grid>
                      <Grid item md={12}>
                        {Array.isArray(val?.poAForTaker) &&
                          val?.poAForTaker.map((val, i) => {
                            return (
                              <Grid
                                container
                                justifyContent="space-evenly"
                                alignItems="center"
                                key={i}
                              >
                                <Grid item md={1}>
                                  <b>{i + 1}</b>
                                </Grid>
                                <Grid item md={5}>
                                  <b>मुखत्यारपत्र घेणाऱ्याचे नाव : </b>
                                  {val?.fullNameInMarathi}
                                </Grid>
                                <Grid item md={6}>
                                  <b> पत्ता :</b>
                                  {val?.address?.addressType == "INDIA"
                                    ? `${val?.address?.indiaAddress?.plotNo}, ${val?.address?.indiaAddress?.building}, ${val?.address?.indiaAddress?.impSymbol}, ${val?.address?.indiaAddress?.postOfficeName}, ${val?.address?.indiaAddress?.pincode}`
                                    : `${val?.address?.foreignAddress?.address}`}
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                      <Divider sx={{ mt: 2, mb: 2 }} />
                    </React.Fragment>
                  );
                })}
            </Grid>
            {/* <Divider sx={{ mt: 2 }} /> */}
          </>
        )}
        {/*------------------------------------------------------कोर्ट दावा माहिती------- */}
        {isCourtDawa === "yes" && (
          <>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={12} textAlign="left">
                  <h4 className="heading_final">कोर्ट दावा माहिती</h4>
                </Grid>
                {Array.isArray(previewData?.courtClaimInformation) &&
                  previewData?.courtClaimInformation.map((val, i) => {
                    return (
                      <Grid item md={12} key={i}>
                        <Grid
                          container
                          justifyContent="space-evenly"
                          alignItems="center"
                        >
                          <Grid item md={1}>
                            <b>{i + 1}</b>
                          </Grid>
                          <Grid item md={11}>
                            <Grid container spacing={1}>
                              <Grid item md={3}>
                                <b>न.भू.क्र. :</b> {val?.nabhu}
                              </Grid>
                              <Grid item md={3}>
                                <b>केस क्रमांक :</b>{" "}
                                {val?.caseDawa?.caseNolabel}
                              </Grid>
                              <Grid item md={3}>
                                <b>केस प्रकार :</b>{" "}
                                {val?.caseType?.caseTypeLabel}
                              </Grid>
                              <Grid item md={3}>
                                <b>स्थगिती आदेश :</b>{" "}
                                {val?.stayOrder == "YES" ? "होय" : "नाही"}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
          </>
        )}
        {/* ------------------------------------------------------कागदपत्रे------------- */}
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">कागदपत्रे</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container justifyContent="space-evenly" alignItems="center">
                <Grid item md={1} alignSelf="flex-start">
                  <b>1</b>
                </Grid>
                <Grid item md={4}>
                  <b>फेरफार प्रकार :</b>{" "}
                  {previewData?.applicationDtl?.MutationTypeName}
                </Grid>
                <Grid item md={6}>
                  <b>जोडलेली कागदपत्रे :</b>
                  {Array.isArray(previewData?.uploadedDocument) &&
                    previewData?.uploadedDocument.map((val, i) => {
                      return (
                        <span key={i}>
                          {" "}
                          {i === val.length - 1
                            ? val?.documentType
                            : `${val?.documentType}, `}
                        </span>
                      );
                    })}
                </Grid>
                {/* <Grid item md={11}>
                  <Grid container spacing={1}>
                    <Grid item md={6}>
                      <b>फेरफार प्रकार :</b>{" "}
                      {previewData?.applicationDtl?.MutationTypeName}
                    </Grid>
                    <Grid item md={6}>
                      <b>जोडलेली कागदपत्रे :</b>
                      {Array.isArray(previewData?.uploadedDocument) &&
                        previewData?.uploadedDocument.map((val, i) => {
                          return (
                            <span key={i}>
                              {" "}
                              {i === val.length - 1
                                ? val?.documentType
                                : `${val?.documentType}, `}
                            </span>
                          );
                        })}
                    </Grid>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Divider sx={{ mt: 2 }} /> */}
        {/* -----------------------------------------------------स्वयंघोषणपत्र----------- */}
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={12} textAlign="left">
              <h4 className="heading_final">स्वयंघोषणापत्र</h4>
            </Grid>
            <Grid item md={12} textAlign="center">
              <sapn>
                मी{" "}
                {previewData?.registereduser?.usertype_code == 1 ? (
                  <b>
                    {previewData?.registereduser?.fname_in_marathi}{" "}
                    {previewData?.registereduser?.mname_in_marathi}{" "}
                    {previewData?.registereduser?.lname_in_marathi}
                  </b>
                ) : (
                  <b>{previewData?.registereduser?.company_name_in_marathi}</b>
                )}{" "}
                या अर्जात दिलेली माहिती योग्य व अचूक असून त्यामध्ये माहित असलेले
                कोणतीही बाब / माहिती लपवून ठेवलेली नाही अथवा चुकीची नमूद केलेली
                नाही, असे केले असल्यास मी भारतीय न्याय संहिता 2023 चे कलम
                229(2), 236 व 237 अन्वये दंडात्मक / कायदेशीर कारवाईसाठी पात्र
                राहील याची मला जाणीव आहे, म्हणून हे स्वयंघोषणापत्र करत आहे.
                अर्जासोबत सादर केलेली कागदपत्रे सत्यप्रत असल्याबाबत
                स्वयंस्वाक्षरीत केले आहेत.
              </sapn>
            </Grid>
            {/* <Grid item md={12}>
              <b>स्वयंघोषणपत्राची जोडलेली प्रत :</b> {uploadFileName}
            </Grid> */}
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2 }} />
        <Grid container alignItems="center" spacing={1} justifyContent="center">
          <Grid item>
            <Typography variant="h6" fontSize="15px" fontWeight={600}>
              अर्जात भरलेल्या महितीशी आपण सहमत आहात का ?
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup
              row
              value={userAccept}
              onChange={(e) => handleUserAccept(e)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label="होय"
              />
              <FormControlLabel
                value="no"
                control={<Radio size="small" />}
                label="नाही"
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Grid item md={12} textAlign="center">
          <Grid container spacing={2} justifyContent="center">
            {userAccept == "no" && (
              <Grid item>
                <Button variant="outlined" onClick={() => handleDialogClose()}>
                  Reset
                </Button>
              </Grid>
            )}
            <Grid item>
              {userAccept == "yes" && (
                <Button variant="contained" onClick={handleAccept}>
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FinalPreview;
