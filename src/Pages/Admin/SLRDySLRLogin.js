import { AppBar, Grid, Paper } from "@mui/material";
import SecuredHeader from "../../ui/SecuredHeader";
import DashboardForSLRDySLR from "./SupportPages/Dashboard/DashboardForSLRDySLR";

const SLRDySLRLogin = () => {
  return (
    <>
      {/* <AppBar position="fixed" color="default">
        <SecuredHeader />
      </AppBar> */}

      <Paper elevation={5} sx={{ m: 3, mt: 16 }}>
        <DashboardForSLRDySLR />
      </Paper>
    </>
  );
};

export default SLRDySLRLogin;
