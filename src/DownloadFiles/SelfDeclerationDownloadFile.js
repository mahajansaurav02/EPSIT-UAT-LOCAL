import React, { useRef, useState } from "react";
import { Button, Card, Container } from "@mui/material";
import { useReactToPrint } from "react-to-print";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${day}-${month}-${year}`;

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
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src="/images/epsit.png"
                alt="GovtMaha_logo"
                width={160}
                height={70}
              />
              <span>
                <h5 style={{ textAlign: "center" }}>प्रपत्र - अ</h5>
                <h4 style={{ textAlign: "center" }}>स्वयंघोषणापत्र</h4>
              </span>
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
                justifyContent: "end",
                paddingRight: 10,
              }}
            >
              <img
                src={props?.applicants[0]?.profile_pic_file_path}
                style={{ width: "130px", height: "130px" }}
              />
            </span>
            {props?.registereduser?.usertype_code == 1 ? (
              <p>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; मी श्री/श्रीमती
                &nbsp;
                {props?.registereduser?.fname_in_marathi}{" "}
                {props?.registereduser?.mname_in_marathi}{" "}
                {props?.registereduser?.lname_in_marathi} &nbsp; श्री/श्रीमती
                &nbsp;
                {props?.registereduser?.mname_in_marathi}{" "}
                {props?.registereduser?.lname_in_marathi} &nbsp; यांचा
                मुलगा/मुलगी वय ------ वर्ष, राहणार &nbsp;
                {props?.registereduser?.address_type == "INDIA" ? (
                  <>
                    {props?.applicants[0]?.flatno_plotno},&nbsp;
                    {props?.applicants[0]?.landmark},&nbsp;
                    {/* {props?.applicants[0]?.locality}, */}
                    {props?.applicants[0]?.taluka}
                    ,&nbsp;
                    {props?.applicants[0]?.district}
                  </>
                ) : (
                  <>{props?.applicants[0]?.address}</>
                )}
                &nbsp; याद्वारे घोषित करतो / करते की, मी न.भू.क्र.
                {Array.isArray(applicationData?.nabhDTL) &&
                  applicationData?.nabhDTL
                    .map((item) => item.naBhu)
                    .join(",")}{" "}
                या मिळकतीस {props?.applicationDtl?.MutationTypeName} ने नांव
                दाखल करणेबाबत मा. नगर भूमापन अधिकारी यांचे कार्यालयात अर्ज सादर
                केला आहे. अर्जात नमुद सर्व माहिती माझ्या व्यक्तीगत माहिती व
                समजुतीनुसार खरी आहे. तसेच सदर मिळकतीबाबत कोणत्याही न्यायालयात
                दावा दाखल नाही किंवा प्रलंबित नाही. अर्जासोबत सादर केलेल्या कागद
                पत्रांच्या प्रतिमध्ये कोणतीही खाडाखोड करणेत आलेली नाही.
                अर्जासोबत सादर केलेल्या कागदपत्रांच्या प्रति खोट्या/बनावट
                असल्याचे आढळून आल्यास भारतीय न्याय संहिता 2023 चे कलम 229(2),
                236 व 237 च्या तरतुदीनुसार माझ्यावर खटला भरला जाईल व त्यानुसार
                मी शिक्षेस पात्र राहीन याची मला पूर्ण जाणीव आहे.
              </p>
            ) : (
              <p>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; मी &nbsp;
                {props?.registereduser?.company_name_in_marathi} राहणार &nbsp;
                {props?.registereduser?.address_type == "INDIA" ? (
                  <>
                    {props?.registereduser?.flatno_plotno},&nbsp;
                    {props?.registereduser?.landmark},&nbsp;
                    {props?.registereduser?.locality},
                    {props?.registereduser?.taluka}
                    ,&nbsp;
                    {props?.registereduser?.district}
                  </>
                ) : (
                  <>{props?.registereduser?.address}</>
                )}{" "}
                याद्वारे घोषित करतो / करते की, मी नगर भूमापन न.भू.क्र.
                {Array.isArray(applicationData?.nabhDTL) &&
                  applicationData?.nabhDTL
                    .map((item) => item.naBhu)
                    .join(",")}{" "}
                या मिळकतीस {props?.applicationDtl?.MutationTypeName} ने नांव
                दाखल करणेबाबत मा. नगर भूमापन अधिकारी यांचे कार्यालयात अर्ज सादर
                केला आहे. अर्जात नमुद सर्व माहिती माझ्या व्यक्तीगत माहिती व
                समजुतीनुसार खरी आहे. तसेच सदर मिळकतीबाबत कोणत्याही न्यायालयात
                दावा दाखल नाही किंवा प्रलंबित नाही. अर्जासोबत सादर केलेल्या कागद
                पत्रांच्या प्रतिमध्ये कोणतीही खाडाखोड करणेत आलेली नाही.
                अर्जासोबत सादर केलेल्या कागदपत्रांच्या प्रति खोट्या/बनावट
                असल्याचे आढळून आल्यास भारतीय न्याय संहिता 2023 चे कलम 229(2),
                236 व 237 च्या तरतुदीनुसार माझ्यावर खटला भरला जाईल व त्यानुसार
                मी शिक्षेस पात्र राहीन याची मला पूर्ण जाणीव आहे.
              </p>
            )}

            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <p>ठिकाण :- -----------------</p>
              </span>
              <span>
                <p>अर्जदाराची सही :- --------------------------</p>
              </span>
            </span>
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <p>दिनांक :- {formattedDate}</p>
              </span>
              <span>
                {props?.registereduser?.address_type == "FOREIGN" ? (
                  <p>ईमेल :- {props?.registereduser?.emailid}</p>
                ) : (
                  <p>मोबाईल नंबर :- {props?.registereduser?.mobileno}</p>
                )}
              </span>
            </span>
          </Container>
        </body>
      </html>
    </Card>
  </div>
));

const SelfDeclerationDownloadFile = ({ applicationData, previewData }) => {
  const componentRef = useRef(null);

  const title =
    previewData?.registereduser?.usertype_code == 1
      ? `${previewData?.registereduser?.fname_in_marathi}_${previewData?.registereduser?.mname_in_marathi}_${previewData?.registereduser?.lname_in_marathi}_${applicationData?.mutation_type}_स्वयंघोषणापत्र`
      : `${previewData?.registereduser?.company_name_in_marathi}_स्वयंघोषणापत्र`;

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

export default SelfDeclerationDownloadFile;
