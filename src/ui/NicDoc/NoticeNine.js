import { Grid } from "@mui/material";
import React from "react";

const NoticeNine = ({ details, nicDoc }) => {
  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item md={12}>
          <h4 className="heading">नोटिस ९</h4>
        </Grid>
        <Grid item md={3}>
          <b>जिल्हा :- </b>
          {details?.district_name_in_marathi}
        </Grid>
        <Grid item md={4}>
          <b>तालुका :- </b>
          {details?.taluka}
        </Grid>
        <Grid item md={2}>
          <b>गाव :- </b>
          {details?.village}
        </Grid>
        <Grid item md={3}>
          <b>फेरफार प्रकार :- </b>
          {details?.mutation_type}
        </Grid>
        <Grid item md={4}>
          <b>अर्ज क्रमांक :- </b>
          {details?.applicationID}
        </Grid>
        <Grid item md={4}>
          <b>अर्ज केल्याची तारीख :- </b>
          {details?.application_date}
        </Grid>
        <Grid item md={4}>
          <b>आवक क्रमांक :- </b>
          {details?.inwardno}
        </Grid>
      </Grid>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              नोटिस ९ डाउनलोड करा
            </td>
            <td>
              {Array.isArray(nicDoc) &&
                nicDoc.map((val, i) => (
                  <div key={i}>
                    <a
                      href={val?.docSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={val?.docName}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      {val?.docName}
                    </a>
                  </div>
                ))}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default NoticeNine;
