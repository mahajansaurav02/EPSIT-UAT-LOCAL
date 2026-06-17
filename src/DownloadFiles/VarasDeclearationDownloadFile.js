import React, { useRef } from "react";
import { Button, Card, Container } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
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
                <h5 style={{ textAlign: "center" }}>प्रपत्र</h5>
                <h4 style={{ textAlign: "center" }}>
                  वारसाबाबतचे स्वयंघोषणापत्र
                </h4>
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
                src={props?.registereduser?.profile_pic_file_path}
                style={{ width: "130px", height: "130px" }}
              />
            </span>

            <p>
              मी श्री/श्रीमती &nbsp;
              {props?.registereduser?.fname_in_marathi}{" "}
              {props?.registereduser?.mname_in_marathi}{" "}
              {props?.registereduser?.lname_in_marathi} श्री/श्रीमती &nbsp;
              {props?.registereduser?.mname_in_marathi}{" "}
              {props?.registereduser?.lname_in_marathi} यांचा मुलगा/मुलगी वय ---
              वर्ष, राहणार &nbsp;
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
              &nbsp; याद्वारे घोषित करतो / करते की, मी नगर भूमापन न.भू.क्र.
              {Array.isArray(applicationData?.nabhDTL) &&
                applicationData?.nabhDTL
                  .map((item) => item.naBhu)
                  .join(",")}{" "}
              या मिळकतीस {props?.Mutation[0]?.value[0]?.fullNameInMarathi} यांचे
              नाव असून ते दिनांक{" "}
              {props?.Mutation[1]?.value[0]?.userDetails?.dateOfDeath} रोजी मयत
              झाले/झाली असून त्याचे कायदेशीर वारस आम्ही
            </p>

            <table
              style={{
                width: "-webkit-fill-available",
                border: "1px solid black",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <tr>
                <StyledTh>अ. क्र.</StyledTh>
                <StyledTh>नाव</StyledTh>
                <StyledTh>नाते</StyledTh>
              </tr>
              {Array.isArray(props?.Mutation[2]?.value) &&
                props?.Mutation[2]?.value.map((val, i) => {
                  return (
                    <tr key={i}>
                      <StyledTd>{i + 1})</StyledTd>
                      <StyledTd>{val?.fullNameInMarathi}</StyledTd>
                      <StyledTd>
                        {val?.dharak?.deadRelation?.relation_name}
                      </StyledTd>
                    </tr>
                  );
                })}
            </table>

            <p>
              &nbsp; &nbsp; &nbsp; या प्रमाणे कायदेशीर वारस असून आमच्या
              व्यतीरिक्त कोणीही वारस नाही. वरील नमुद सर्व माहिती खरी असून खोटी
              आढळून आल्यास, भारतीय न्याय संहिता 2023 चे कलम 229(2), 236 व 237
              च्या तरतुदीनुसार माझ्यावर खटला भरला जाईल व त्यानुसार मी शिक्षेस
              पात्र राहीन याची मला पूर्ण जाणीव आहे.
            </p>

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
                <p>स्वयंघोषणापत्र करणाराची सही :- --------------------------</p>
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
                <p>मोबाईल नंबर :- {props?.registereduser?.mobileno}</p>
              </span>
            </span>
          </Container>
        </body>
      </html>
    </Card>
  </div>
));

const VarasDeclerationDownloadFile = ({ applicationData, previewData }) => {
  const componentRef = useRef(null);

  const getContent = () => componentRef.current;

  const handlePrint = useReactToPrint({
    content: getContent,
    documentTitle: `${previewData?.registereduser?.fname_in_marathi}_${previewData?.registereduser?.mname_in_marathi}_${previewData?.registereduser?.lname_in_marathi}_${applicationData?.mutation_type}_वारसाबाबतचे स्वयंघोषणापत्र`,
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

export default VarasDeclerationDownloadFile;
