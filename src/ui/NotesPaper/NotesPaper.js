import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";

const NotesPaper = ({ heading, arr }) => {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpanded(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Accordion
      sx={{ backgroundColor: "#EFEFEF", borderRadius: "10px" }}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      square
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <h3
          style={{
            color: "#F43A3A",
          }}
        >
          &nbsp; {heading}
        </h3>

        {/* <Typography
          component="span"
          sx={{
            color: "#F43A3A",
          }}
        >
          &nbsp; {heading}
        </Typography> */}
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ paddingRight: 2, marginTop: 0 }}>
          <ol style={{ marginTop: 0 }}>
            {Array.isArray(arr) &&
              arr.map((v, i) => {
                return <li key={i}>{v}</li>;
              })}
          </ol>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default NotesPaper;
