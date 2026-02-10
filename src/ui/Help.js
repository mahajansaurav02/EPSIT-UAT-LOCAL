import { Box, Button, Drawer, Grid, styled, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import "../Pages/Home/home.module.css";

const Help = ({ handleDrawerToggle, open }) => {
  const [openHelpDrawer, setOpenHelpDrawer] = useState(false);
  const [helpType, setHelpType] = useState("registered");

  const CustomTab = styled(Tab)(({ theme, selected }) => ({
    backgroundColor: selected ? "#084D92" : "#ffffff",
    color: selected ? "#ffffff" : "black",
  }));

  const handleChange = (val) => {
    setHelpType(val);
  };

  const toggleDrawer = (newOpen) => {
    setOpenHelpDrawer(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 360 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#fff",
            backgroundColor: "#258750",
            padding: 5,
            zIndex: 1111,
          }}
        >
          <HelpOutlineRoundedIcon /> मदत पोर्टल
        </div>
        <Tabs
          value={helpType}
          onChange={handleChange}
          textColor="inherit"
          centered
          sx={{
            borderRadius: 2,
            border: "1px solid #084D92",
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <CustomTab
            value="registered"
            label="नोंदणी कृत"
            selected={helpType === "registered"}
          />
          <CustomTab
            value="unregistered"
            label="अनोंदणी कृत"
            selected={helpType === "unregistered"}
          />
        </Tabs>
      </div>
      {/* <List> 
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={openHelpDrawer}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          style: {
            // backgroundColor: "#F6F6F6",
            backgroundColor: "#c48c55",
            marginTop: 102,
            borderTopLeftRadius: 10,
          },
        }}
      >
        {DrawerList}
      </Drawer>
      <Grid
        container
        justifyContent="space-between"
        position="sticky"
        top={130}
        // sx={{ backgroundColor: "gray" }}
      >
        <Grid item>
          <Button
            variant="contained"
            sx={{
              // bgcolor: "#157f80",
              bgcolor: "#c48c55",
              transform: "translateX(-28px)",
              width: 40,
              height: 34,
              minWidth: 40,
              minHeight: 34,
            }}
            size="small"
            onClick={handleDrawerToggle}
          >
            {open ? <ArrowBackIosRoundedIcon /> : <MenuRoundedIcon />}
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ borderRadius: 5 }}
            startIcon={<HelpOutlineRoundedIcon />}
            onClick={() => toggleDrawer(true)}
          >
            मदत
          </Button>
        </Grid> */}
      </Grid>
    </>
  );
};

export default Help;
