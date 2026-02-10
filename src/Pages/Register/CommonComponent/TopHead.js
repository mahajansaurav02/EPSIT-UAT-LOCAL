import { Grid } from "@mui/material";
import React from "react";

const TopHead = () => {
  return (
    <Grid item md={12}>
      <h4 style={{ padding: 0, margin: 0, fontSize: "16px", color: "white" }}>
        वापरकर्ता साइन अप प्रोफाइल
      </h4>
      <p
        style={{
          padding: 0,
          margin: 0,
          fontSize: "14px",
          marginTop: 5,
          color: "white",
        }}
      >
        वापरकरत्याने खाते उघडण्यासाठी पुढील माहिती भरावी.
      </p>
    </Grid>
  );
};

export default TopHead;
