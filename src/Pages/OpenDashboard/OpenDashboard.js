import {
  AppBar,
  Box,
  Container,
  Tab,
  Tabs,
  Tooltip as ToolTipBTN,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Header from "../../ui/Header";
import SearchByApplicationIdUser from "./SearchByApplicationIdUser";
import UserDashboard from "./Dashboard/UserDashboard";

const OpenDashboard = () => {
  //------------------------------Tabs Test------------------------
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <AppBar position="fixed" color="default">
        <Header showSignInBtn={true} />
      </AppBar>

      <Box sx={{ mt: 14 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Dashboard" sx={{ fontWeight: 600 }} />
          <Tab label="Search By Application Id" sx={{ fontWeight: 600 }} />
        </Tabs>

        <CustomTabPanel value={tabValue} index={0}>
          <UserDashboard />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <SearchByApplicationIdUser />
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default OpenDashboard;
