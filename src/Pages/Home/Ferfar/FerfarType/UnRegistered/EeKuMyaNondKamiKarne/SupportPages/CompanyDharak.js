import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import styles from "../../../../ferfar.module.css";

const CompanyDharak = () => {
  const [aapak, setAapak] = useState("");
  const [khataType, setKhataType] = useState("");
  const [holderType, setHolderType] = useState("");

  const handleAapak = (e) => {
    setAapak(e?.target?.value);
  };
  const handleKhataType = (e) => {
    setKhataType(e?.target?.value);
  };
  const handleHolderType = (e) => {
    setHolderType(e?.target?.value);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>धारक प्रकार </b>
            <span>*</span>
          </InputLabel>
          <Select
            value={holderType}
            onChange={handleHolderType}
            fullWidth
            size="small"
          >
            <MenuItem value="single">Single Holder</MenuItem>
            <MenuItem value="common">Common Holder</MenuItem>
          </Select>
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>खाते प्रकार</b>
          </InputLabel>
          <Select
            value={khataType}
            onChange={handleKhataType}
            fullWidth
            size="small"
          >
            <MenuItem value="user">व्यक्ति</MenuItem>
            <MenuItem value="multiple">अनेक</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>अ.पा.क/ए.कू.मॅ.</b>
          </InputLabel>
          <Select value={aapak} onChange={handleAapak} fullWidth size="small">
            <MenuItem value="aapak-1">अ.पा.क/ए.कू.मॅ.- 1</MenuItem>
            <MenuItem value="aapak-2">अ.पा.क/ए.कू.मॅ.- 2</MenuItem>
          </Select>
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>अ.पा.क</b>
          </InputLabel>
          <TextField
            fullWidth
            // value={foraighnAddress?.email}
            placeholder="अ.पा.क"
            name="email"
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>खरेदी क्षेत्र (चौ.मी.)</b>
          </InputLabel>
          <TextField
            fullWidth
            // value={foraighnAddress?.email}
            placeholder="20"
            name="email"
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CompanyDharak;
