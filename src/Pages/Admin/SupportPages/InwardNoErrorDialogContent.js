import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AxiosInstance from "../../../Instance/AxiosInstance";
import URLS from "../../../URLs/url";
import { errorToast } from "../../../ui/Toast";
import styled from "styled-components";
import ReactJson from "react-json-view";

const StyledTd = styled.td({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
  padding: 10,
});
const StyledTh = styled.th({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});

const InwardNoErrorDialogContent = ({ selectedApplication, isError }) => {
  const { sendRequest } = AxiosInstance();
  const [val, setVal] = useState({});
  const [showJson, setShowJson] = useState(false);

  const getDataByApplicationId = () => {
    sendRequest(
      `${URLS?.BaseURL}/GrievanceSystem/GetApplicationDataOnInwardNoClick`,
      "POST",
      selectedApplication?.applicationId,
      (res) => {
        setVal(res?.ResponseData);
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };

  useEffect(() => {
    getDataByApplicationId();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        {/*----------------------Inward No Error----------------------*/}
        {isError && (
          <Grid item md={12}>
            <p>
              <b>Inward no error -</b> {selectedApplication?.inwardNo}
            </p>
          </Grid>
        )}
        {/*----------------------General Application Details----------------------*/}
        <Grid item md={12}>
          <Grid container spacing={1}>
            <Grid item md={12} textAlign="center">
              <h4 style={{ color: "red", margin: 0 }}>Application Details</h4>
            </Grid>
            <Grid item md={3}>
              <b>Application Id - </b>
              {val?.applicationDtl?.applicationid}
            </Grid>
            <Grid item md={3}>
              <b>Application Created Date - </b>
              {val?.applicationDtl?.applicationdate}
            </Grid>
            <Grid item md={3}>
              <b>District - </b>
              {val?.applicationDtl?.DistrictName}
            </Grid>
            <Grid item md={3}>
              <b>Taluka - </b>
              {val?.applicationDtl?.OfficeName}
            </Grid>
            <Grid item md={3}>
              <b>Mutation Type - </b>
              {val?.applicationDtl?.applicationType}
            </Grid>
            <Grid item md={3}>
              <b>Mutation - </b>
              {val?.applicationDtl?.MutationTypeName}
            </Grid>
            <Grid item md={3}>
              <b>Is POA Selected - </b>
              {val?.applicationDtl?.do_you_have_power_of_attorney
                ? "Yes"
                : "No"}
            </Grid>
            <Grid item md={3}>
              <b>Is Court Dawa Selected - </b>
              {val?.applicationDtl?.Is_the_claim_pending_before_the_court
                ? "Yes"
                : "No"}
            </Grid>
          </Grid>
        </Grid>
        {/*----------------------Registered User Details----------------------*/}
        <Grid item md={12}>
          <Grid container spacing={1}>
            <Grid item md={12} textAlign="center">
              <h4 style={{ color: "red", margin: 0 }}>
                Registered User Details
              </h4>
            </Grid>
            <Grid item md={12} textAlign="center">
              <b>User Type - </b>
              {val?.registereduser?.usertype}
            </Grid>
            {val?.registereduser?.usertype == "व्यक्ती" ? (
              <>
                <Grid item md={4}>
                  <b>पहिले नाव - </b>
                  {val?.registereduser?.fname_in_marathi}
                </Grid>
                <Grid item md={4}>
                  <b>मधले नाव - </b>
                  {val?.registereduser?.mname_in_marathi}
                </Grid>
                <Grid item md={4}>
                  <b>आडनाव - </b>
                  {val?.registereduser?.lname_in_marathi}
                </Grid>
                <Grid item md={4}>
                  <b>First Name - </b>
                  {val?.registereduser?.fname_in_eng}
                </Grid>
                <Grid item md={4}>
                  <b>Middle Name - </b>
                  {val?.registereduser?.mname_in_eng}
                </Grid>
                <Grid item md={4}>
                  <b>Last Name - </b>
                  {val?.registereduser?.lname_in_eng}
                </Grid>
              </>
            ) : (
              <>
                <Grid item md={4}>
                  <b>कंपनीचे नाव - </b>
                  {val?.registereduser?.company_name_in_marathi}
                </Grid>
                <Grid item md={4}>
                  <b>Company Name - </b>
                  {val?.registereduser?.company_name_in_eng}
                </Grid>
              </>
            )}
            <Grid item md={12} textAlign="center">
              <b>Address Type - </b>
              {val?.registereduser?.address_type == "INDIA"
                ? "भारतीय"
                : "परदेश"}
            </Grid>

            {val?.registereduser?.address_type == "INDIA" ? (
              <Grid item md={12}>
                <Grid
                  container
                  spacing={2}
                  sx={{ border: "1px solid", borderRadius: 3, mt: 1 }}
                >
                  <Grid item md={3}>
                    <b>सदनिका / घर /प्लॉट नं. - </b>
                    {val?.registereduser?.flatno_plotno}
                  </Grid>
                  <Grid item md={3}>
                    <b>इमारत / सोसायटी क्रमांक किंवा नाव - </b>
                    {val?.registereduser?.societyname}
                  </Grid>
                  <Grid item md={3}>
                    <b>मुख्य रस्ता - </b>
                    {val?.registereduser?.mainstreet}
                  </Grid>
                  <Grid item md={3}>
                    <b>महत्त्वाची खूण - </b>
                    {val?.registereduser?.landmark}
                  </Grid>
                  <Grid item md={3}>
                    <b>परिसर / गावाचे नाव / वाडी - </b>
                    {val?.registereduser?.locality}
                  </Grid>
                  <Grid item md={3}>
                    <b>मोबाईल - </b>
                    {val?.registereduser?.mobileno}
                  </Grid>
                  <Grid item md={3}>
                    <b>पिन कोड - </b>
                    {val?.registereduser?.pincode}
                  </Grid>
                  <Grid item md={3}>
                    <b>पोस्टऑफिस नाव - </b>
                    {val?.registereduser?.postofficename}
                  </Grid>
                  <Grid item md={3}>
                    <b>गाव/पेठ - </b>
                    {val?.registereduser?.postofficename}
                  </Grid>
                  <Grid item md={3}>
                    <b>तालुका - </b>
                    {val?.registereduser?.taluka}
                  </Grid>
                  <Grid item md={3}>
                    <b>जिल्हा - </b>
                    {val?.registereduser?.district}
                  </Grid>
                  <Grid item md={3}>
                    <b>राज्य - </b>
                    {val?.registereduser?.state}
                  </Grid>
                  <Grid item md={6}>
                    <b>स्वाक्षरी - </b>
                    <br />
                    {val?.registereduser?.signed_file_path == "NA" ? (
                      "No Signature Proof Uploaded"
                    ) : (
                      <img
                        src={val?.registereduser?.signed_file_path}
                        alt="Signature_img"
                        style={{ width: "12em" }}
                      />
                    )}
                  </Grid>
                  <Grid item md={6}>
                    <b>पत्त्याचा पुरावा - </b>
                    <br />
                    {val?.registereduser?.address_proof_document_path ==
                    "NA" ? (
                      "No Address Proof Uploaded"
                    ) : (
                      <img
                        src={val?.registereduser?.address_proof_document_path}
                        alt="address_img"
                        style={{ width: "12em" }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid item md={12}>
                  Foreign address
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        {/*----------------------Nabhu Details----------------------*/}
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={12} textAlign="center">
              <h4 style={{ color: "red" }}>गाव व न.भू.क्र. माहिती</h4>
            </Grid>
            {Array.isArray(val?.mutationCTSNoData) &&
              val?.mutationCTSNoData.map((val, i) => {
                return (
                  <Grid item md={12} key={i}>
                    <Grid
                      container
                      justifyContent="space-evenly"
                      alignItems="center"
                    >
                      <Grid item md={1} alignSelf="start">
                        <b>{i + 1}</b>
                      </Grid>
                      <Grid item md={11}>
                        <Grid container spacing={1}>
                          <Grid item md={3}>
                            <b>गाव/पेठ :</b> {val?.villageName}
                          </Grid>
                          <Grid item md={3}>
                            <b>फेरफारासाठी मिळकत :</b>{" "}
                            {val?.milkat == "LAND"
                              ? "भूखंड / जमीन (प्लॉट)"
                              : "अपार्टमेंट"}
                          </Grid>
                          <Grid item md={3}>
                            <b>न.भू.क्र. क्रमांक :</b> {val?.naBhu}
                          </Grid>
                          <Grid item md={3}>
                            <b>Sub Property No. :</b> {val?.subPropNo}
                          </Grid>
                          <Grid item md={3}>
                            <b>LR-Property UID :</b> {val?.lrPropertyUID}
                          </Grid>
                          <Grid item md={3}>
                            <b>अर्जामध्ये नमूद मिळकत :</b> {val?.namud}
                          </Grid>
                          <Grid item md={3}>
                            <b>न.भू.क्र. क्षेत्र (चौ.मी.) :</b>{" "}
                            {val?.cityServeyAreaInSqm}
                          </Grid>
                          {val?.milkat == "FLAT" && (
                            <Grid item md={12}>
                              <Grid
                                container
                                spacing={2}
                                sx={{
                                  border: "1px solid",
                                  borderRadius: 3,
                                  mt: 1,
                                }}
                              >
                                <Grid item md={3}>
                                  <b>बिल्डिंगचे नाव - </b>
                                  {val?.buildingName}
                                </Grid>
                                <Grid item md={3}>
                                  <b>मजला प्रकार - </b>
                                  {val?.floorDesc}
                                </Grid>
                                <Grid item md={3}>
                                  <b>मजला क्र. - </b>
                                  {val?.floorNo}
                                </Grid>
                                <Grid item md={3}>
                                  <b>युनिट प्रकार - </b>
                                  {val?.buildingName}
                                </Grid>
                                <Grid item md={3}>
                                  <b>युनिट क्र. - </b>
                                  {val?.unitNo}
                                </Grid>
                                <Grid item md={3}>
                                  <b>बांधकाम क्षेत्र (चौ. मी.) - </b>
                                  {val?.buildupArea == "NA"
                                    ? val?.flatBuiltUpArea
                                    : val?.buildupArea}
                                </Grid>
                                <Grid item md={3}>
                                  <b>कारपेट क्षेत्र (चौ. मी.) - </b>
                                  {val?.carpetArea}
                                </Grid>
                                <Grid item md={3}>
                                  <b>टेरेस क्षेत्र (चौ. मी.) - </b>
                                  {val?.taraceArea}
                                </Grid>
                                <Grid item md={3}>
                                  <b>पार्किंग क्र. - </b>
                                  {val?.parkingNo}
                                </Grid>
                                <Grid item md={3}>
                                  <b>पार्किंग क्षेत्र (चौ. मी.) - </b>
                                  {val?.parkingArea}
                                </Grid>
                                <Grid item md={3}>
                                  <b>हिस्सा (%) - </b>
                                  {val?.hissa}
                                </Grid>
                              </Grid>
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

        {/*----------------------Dast Details----------------------*/}
        {val?.applicationDtl?.applicationType == "नोंदणी कृत" && (
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12} textAlign="center">
                <h4 style={{ color: "red" }}>दस्त माहिती</h4>
              </Grid>
              {Array.isArray(val?.dastInformation) &&
                val?.dastInformation.map((val, i) => {
                  return (
                    <Grid item md={12} key={i}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Grid item md={1} alignSelf="start">
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
        )}
        {/*----------------------Court Dawa Details----------------------*/}
        {val?.applicationDtl?.Is_the_claim_pending_before_the_court && (
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={12} textAlign="center">
                <h4 style={{ color: "red" }}>कोर्ट दावा माहिती</h4>
              </Grid>
              {Array.isArray(val?.courtClaimInformation) &&
                val?.courtClaimInformation.map((val, i) => {
                  return (
                    <Grid item md={12} key={i}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Grid item md={1} alignSelf="start">
                          <b>{i + 1}</b>
                        </Grid>
                        <Grid item md={11}>
                          <Grid container spacing={1}>
                            <Grid item md={4}>
                              <b>केस क्रमांक/रे.मु.नं. : </b>
                              {val?.caseDawa?.caseNolabel}
                            </Grid>
                            <Grid item md={4}>
                              <b>केस प्रकार :</b> {val?.caseType?.caseTypeLabel}
                            </Grid>
                            <Grid item md={4}>
                              <b>स्थगिती आदेश आहे का ? : </b>
                              {val?.stayOrder == "होय" ? "होय" : "नाही"}
                            </Grid>
                            <Grid item md={12}>
                              <b>आदेशाचा तपशील :</b> {val?.orderDetails}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        )}

        {/*----------------------Document Details----------------------*/}
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={12} textAlign="center">
              <h4 style={{ color: "red" }}>कागदपत्रे माहिती</h4>
            </Grid>
            <Grid item md={12}>
              <table
                style={{
                  width: "-webkit-fill-available",
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <tr>
                  <StyledTh>कागदपत्र कोड</StyledTh>
                  <StyledTh>कागदपत्र प्रकार</StyledTh>
                  <StyledTh>अपलोड केलेले कागदपत्र</StyledTh>
                </tr>

                {Array.isArray(val?.uploadedDocument) &&
                  val?.uploadedDocument.map((val, i) => {
                    return (
                      <tr key={val?.documentTypeCode + i}>
                        <StyledTd>{val?.documentTypeCode}</StyledTd>
                        <StyledTd>{val?.documentType}</StyledTd>
                        <StyledTd>{val?.docName}</StyledTd>
                      </tr>
                    );
                  })}
              </table>
              {Array.isArray(val?.uploadedDocument) &&
                val?.uploadedDocument.map((val, i) => {
                  return;
                })}
            </Grid>
            ;
          </Grid>
        </Grid>

        <Grid item md={12}>
          <Grid container justifyContent="center">
            <Grid item>
              <Button onClick={() => setShowJson(!showJson)}>Show json</Button>
            </Grid>
          </Grid>
        </Grid>
        {showJson && (
          <Grid item md={12}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item md={9}>
                <ReactJson
                  src={val}
                  theme="monokai"
                  iconStyle="square"
                  collapsed={1}
                  displayDataTypes={false}
                  enableClipboard={false}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default InwardNoErrorDialogContent;
