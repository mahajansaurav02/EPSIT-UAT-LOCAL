import { AppBar, Grid, Paper } from "@mui/material";
import SecuredHeader from "../../ui/SecuredHeader";
import AdminTable from "./SupportPages/AdminTable";
import UserTable from "./SupportPages/UserTable";

const GrievanceCompliance = () => {
  const role = sessionStorage.getItem("role");
  return (
    <>
        <AppBar position="fixed" color="default">
          <SecuredHeader />
        </AppBar>

      <Paper elevation={5} sx={{ p: 5, m: 3, mt: 16 }}>
        <Grid container>
          <Grid item md={12} mt={2}>
            {role === "Admin" ? <AdminTable /> : <UserTable />}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default GrievanceCompliance;
