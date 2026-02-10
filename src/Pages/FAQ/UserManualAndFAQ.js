import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Header from "../../ui/Header";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { faq } from "../../NotesArray/NotesArray";

const UserManualAndFAQ = () => {
  return (
    <>
      <AppBar position="fixed" color="default">
        <Header showSignInBtn={true} />
      </AppBar>

      <Container sx={{ mt: 15 }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "#ededed" }}>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">युजर मॅन्युअल</h4>
            </Grid>
            <Grid item md={12} textAlign="center">
              <a
                href="./images/user_manual/user_manual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                युजर मॅन्युअल बघण्यासाठी यावर क्लिक करा
              </a>
            </Grid>
            <Grid item md={12}>
              <h4 className="heading">FAQ</h4>
            </Grid>
            <Grid item md={12}>
              {Array.isArray(faq) &&
                faq.map((val, i) => {
                  return (
                    <Accordion key={i}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography component="span">
                          <b>{val?.faq}</b>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>{val?.desc}</AccordionDetails>
                    </Accordion>
                  );
                })}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default UserManualAndFAQ;
