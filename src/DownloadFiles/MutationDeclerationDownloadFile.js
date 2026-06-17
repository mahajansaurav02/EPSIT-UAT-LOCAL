import React, { useRef } from "react";
import { Button, Card, Container } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${day}-${month}-${year}`;

const StyledTd = styled.td({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});
const StyledTh = styled.th({
  border: "1px solid black",
  borderCollapse: "collapse",
  textAlign: "center",
});

const ComponentToPrint = React.forwardRef(({ props, applicationData }, ref) => (
  <div>
    <Card>
      <html ref={ref}>
        <body>
          <Container
            style={{
              p: "8px",
              border: "1px solid black",
              borderStyle: "double",
              borderRadius: "8px",
            }}
          >
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <img
                src="/images/epsit.png"
                alt="GovtMaha_logo"
                width={160}
                height={70}
              />
              <h4 style={{ textAlign: "center" }}>फेरफार नोंदीसाठी अर्ज</h4>
              <img
                src="/images/bhumiabhilekh_2.png"
                alt="GovtMaha_logo"
                width={130}
                height={90}
              />
            </span>
            <hr />
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              {props?.registereduser?.usertype_code == 1 ? (
                <p>
                  श्री / श्रीमती {props?.registereduser?.fname_in_marathi}{" "}
                  {props?.registereduser?.mname_in_marathi}{" "}
                  {props?.registereduser?.lname_in_marathi}
                  <br />
                  रा.- &nbsp;
                  {props?.registereduser?.address_type == "INDIA" ? (
                    <>
                      {props?.applicants[0]?.flatno_plotno},&nbsp;
                      {props?.applicants[0]?.landmark},&nbsp;
                      <br />
                      {/* &nbsp; &nbsp; {props?.applicants[0]?.locality}, */}
                      {props?.applicants[0]?.taluka},&nbsp;
                      {props?.applicants[0]?.district} <br />
                    </>
                  ) : (
                    <>{props?.applicants[0]?.address}</>
                  )}
                </p>
              ) : (
                <p>
                  {props?.registereduser?.company_name_in_marathi} <br />
                  रा. -
                  {props?.registereduser?.address_type == "INDIA" ? (
                    <>
                      {props?.applicants[0]?.flatno_plotno},&nbsp;
                      {props?.applicants[0]?.landmark},&nbsp;
                      <br />
                      {/* &nbsp; &nbsp; {props?.applicants[0]?.locality}, */}
                      {props?.applicants[0]?.taluka},&nbsp;
                      {props?.applicants[0]?.district} <br />
                    </>
                  ) : (
                    <>{props?.applicants[0]?.address}</>
                  )}
                  <br />
                </p>
              )}
              <img
                src={props?.applicants[0]?.profile_pic_file_path}
                style={{ width: "130px", height: "130px" }}
              />
            </span>

            <p>
              प्रती, <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; मा. नगर भूमापन अधिकारी / उप अधिक्षक
              भूमि अभिलेख, <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; तालुका{" "}
              {props?.applicationDtl?.OfficeName} जिल्हा{" "}
              {props?.applicationDtl?.DistrictName}
            </p>

            <p style={{ textAlign: "center" }}>
              विषय :- अधिकार अभिलेखात नाव दाखल करणेबाबत.
            </p>
            <p style={{ textAlign: "center" }}>
              मौजे {applicationData?.village_name} कार्यालय{" "}
              {applicationData?.taluka_name} जिल्हा{" "}
              {applicationData?.district_name_in_marathi} येथील <br />
              न.भू.क्र.{" "}
              {Array.isArray(applicationData?.nabhDTL) &&
                applicationData?.nabhDTL
                  .map((item) => item.naBhu)
                  .join(",")}{" "}
              क्षेत्र -
              {/* {
                props?.Mutation.slice(-1)?.value?.dharak?.userdharak
                  ?.landBuyArea
              } */}
              {/* {props?.Mutation.slice(-1).type} */}
            </p>

            <p>
              महोदय, <br />
            </p>
            {props?.registereduser?.usertype_code == 1 ? (
              <p>
                &nbsp;&nbsp;&nbsp; मी श्री / श्रीमती &nbsp;
                {props?.registereduser?.fname_in_marathi}{" "}
                {props?.registereduser?.mname_in_marathi}{" "}
                {props?.registereduser?.lname_in_marathi} रा.
                {props?.registereduser?.address_type == "INDIA" ? (
                  <>
                    {props?.applicants[0]?.flatno_plotno}, &nbsp;
                    {props?.applicants[0]?.landmark},&nbsp; ता.-{" "}
                    {props?.applicants[0]?.taluka} जिल्हा-{" "}
                    {props?.applicants[0]?.district}
                  </>
                ) : (
                  <>{props?.applicants[0]?.address}</>
                )}{" "}
                विनंती पुर्वक अर्ज करतो की, मी विषयांकित जमिनीबाबत{" "}
                {applicationData?.mutation_type} या अधिकारान्वये जमिन संपादन
                केलेली आहे.
              </p>
            ) : (
              <p>
                &nbsp;&nbsp;&nbsp; मी &nbsp;
                {props?.registereduser?.company_name_in_marathi} रा.-
                {props?.registereduser?.address_type == "INDIA" ? (
                  <>
                    {props?.applicants[0]?.flatno_plotno}, &nbsp;
                    {props?.applicants[0]?.landmark},&nbsp;
                    {props?.applicants[0]?.locality},&nbsp; ता. -{" "}
                    {props?.applicants[0]?.taluka} जिल्हा -{" "}
                    {props?.applicants[0]?.district}{" "}
                  </>
                ) : (
                  <>{props?.applicants[0]?.address}</>
                )}
                विनंती पुर्वक अर्ज करतो की, मी विषयांकित जमिनीबाबत{" "}
                {applicationData?.mutation_type} या अधिकारान्वये जमीन संपादन
                केलेली आहे.
              </p>
            )}
            <p>
              &nbsp;&nbsp;&nbsp; तरी खाली नमुद केलेल्या पुराव्यांच्या आधारे माझे
              प्रस्तुत जमिनीत निर्माण झालेल्या अधिकारांबाबत योग्य ती फेरफार नोंद
              करुन माझे नाव अधिकार अभिलेखात दाखल करावे हि विनंती.
            </p>
            <p>
              &nbsp;&nbsp;&nbsp; जमीन ज्या अधिकारान्वये धारण केलेली आहे त्या
              अधिकारान्वये धारण केलेली जमीन नावे होण्याच्या अनुषंगाने खालील
              कागदपत्रे सोबत जोडलेली आहेत.
            </p>

            <table
              style={{
                width: "-webkit-fill-available",
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <tr>
                <StyledTh>अ. क्र.</StyledTh>
                <StyledTh>कागदपत्र प्रकार</StyledTh>
                <StyledTh>कागदपत्र</StyledTh>
              </tr>
              {Array.isArray(props?.uploadedDocument) &&
                props?.uploadedDocument.map((val, i) => {
                  return (
                    <tr key={i}>
                      <StyledTd>{i + 1})</StyledTd>
                      <StyledTd>{val?.documentType}</StyledTd>
                      <StyledTd>{val?.docName}</StyledTd>
                    </tr>
                  );
                })}
            </table>

            <p
              style={{
                textAlign: "right",
                marginBottom: "40px",
              }}
            >
              आपला विश्वासू
            </p>
            {props?.registereduser?.usertype_code == 1 ? (
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ textAlign: "left" }}>दिनांक :- {formattedDate}</p>
                <p style={{ textAlign: "right" }}>
                  (श्री/श्रीमती - {props?.registereduser?.fname_in_marathi}{" "}
                  {props?.registereduser?.mname_in_marathi}{" "}
                  {props?.registereduser?.lname_in_marathi} )
                </p>
              </span>
            ) : (
              <p style={{ textAlign: "right" }}>
                ({props?.registereduser?.company_name_in_marathi})
              </p>
            )}

            <p style={{ textAlign: "center" }}>सत्य प्रतिज्ञा लेख</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp; वर नमुद केलेली सर्व माहिती खरी असून
              त्याचे सत्यतेबाबत मी खात्री केली असून यामध्ये काहीही खोटे आढळून
              आल्यास मी भारतीय न्याय संहिता 2023 चे कलम 229(2), 236 व 237 च्या
              तरतुदीनुसार होणा-या कायदेशिर कारवाईस पात्र राहील याची मला जाणीव
              आहे.
            </p>
            <p
              style={{
                textAlign: "right",
                marginBottom: "40px",
              }}
            >
              आपला विश्वासू
            </p>

            {props?.registereduser?.usertype_code == 1 ? (
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ textAlign: "left" }}>दिनांक :- {formattedDate}</p>
                <p style={{ textAlign: "right" }}>
                  (श्री/श्रीमती - {props?.registereduser?.fname_in_marathi}{" "}
                  {props?.registereduser?.mname_in_marathi}{" "}
                  {props?.registereduser?.lname_in_marathi} )
                </p>
              </span>
            ) : (
              <p style={{ textAlign: "right" }}>
                ({props?.registereduser?.company_name_in_marathi})
              </p>
            )}
            <p>
              <b>सुचना</b> - अनुसुचित नमुद केलेले आवश्यक कागदपत्रांची पुर्तता
              केलेली नसल्यास अर्जाची दखल घेतली जाणार नाही.
            </p>
          </Container>
        </body>
      </html>
    </Card>
  </div>
));

const MutationDeclerationDownloadFile = ({ applicationData, previewData }) => {
  const componentRef = useRef(null);

  const title =
    previewData?.registereduser?.usertype_code == 1
      ? `${previewData?.registereduser?.fname_in_marathi}_${previewData?.registereduser?.mname_in_marathi}_${previewData?.registereduser?.lname_in_marathi}_${applicationData?.mutation_type}_फेरफार साठी अर्ज`
      : `${previewData?.registereduser?.company_name_in_marathi}_फेरफार साठी अर्ज`;
  const getContent = () => componentRef.current;

  const handlePrint = useReactToPrint({
    content: getContent,
    documentTitle: title,
  });
  return (
    <div>
      <ComponentToPrint
        props={previewData}
        applicationData={applicationData}
        ref={componentRef}
      />
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          प्रत काढा
        </Button>
      </div>
    </div>
  );
};

export default MutationDeclerationDownloadFile;
