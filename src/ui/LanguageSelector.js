import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { addlanguage, selectLanguage } from "../Redux/slices/LanguageSlice";
import { useSelector, useDispatch } from "react-redux";

const CustomTab = styled(Tab)(({ theme, selected }) => ({
  backgroundColor: selected ? "#084D92" : "#ffffff",
  color: selected ? "#ffffff" : "black",
  //   "&:hover": {
  //     backgroundColor: selected ? "darkblue" : "grey",
  //   },
}));

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const reduxLang = useSelector(selectLanguage);
  const [language, setLanguage] = React.useState("mar");

  const handleChange = (e) => {
    dispatch(
      addlanguage({
        ...reduxLang,
        lng: e?.target?.value,
      })
    );
    setLanguage(e?.target?.value);
  };
  return (
    <>
      {/* <FormControl sx={{ width: 90 }}>
        <Select value={language} onChange={handleChange} size="small">
          <MenuItem value="mar">मराठी</MenuItem>
          <MenuItem value="eng">English</MenuItem>
        </Select>
      </FormControl> */}

      <FormControl
        sx={{
          width: 90,
          backgroundColor: "transparent", // Keep the background of FormControl transparent
          "& .MuiOutlinedInput-root": {
            borderColor: "white", // White border color for the FormControl
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // White border color for the Select field
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // White border color on hover
          },
          ".MuiSvgIcon-root": {
            color: "white", // Dropdown arrow color
          },
        }}
      >
        <Select
          value={language}
          onChange={handleChange}
          size="small"
          sx={{
            color: "black", // Text color for the Select
            backgroundColor: "white", // Transparent background for the Select field
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // White border color for the Select field
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "black", // White border color on hover
            },
            ".MuiSvgIcon-root": {
              color: "black", // Dropdown arrow color
            },
          }}
        >
          <MenuItem value="mar" sx={{ color: "black" }}>
            मराठी
          </MenuItem>
          <MenuItem value="eng" sx={{ color: "black" }}>
            English
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default LanguageSelector;
