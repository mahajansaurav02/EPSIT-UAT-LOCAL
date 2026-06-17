import React, { useState } from "react";
import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import UserAddressMaharashtra from "./UserAddressMaharashtra";
import UserAddressForeign from "./UserAddressForeign";

const UserAddress = ({
  isEdit,
  isIndian,
  isReset,
  setIsIndian,
  indiaAddress,
  setIndiaAdress, 
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
}) => {
  const handleRadioChange = (e) => {
    setIsIndian(e?.target?.value);
  };
  return (
    <>
      <Grid container>
        <Grid item md={12}>
          <h4 className="heading">पत्ता</h4>
        </Grid>
        <Grid item md={12}>
          <RadioGroup row value={isIndian} onChange={handleRadioChange}>
            <FormControlLabel
              value="india"
              control={<Radio />}
              label="भारतीय"
            />
            <FormControlLabel
              value="foreign"
              control={<Radio />}
              label="परदेशात"
            />
          </RadioGroup>
        </Grid>
        <Grid item md={12}>
          {isIndian == "india" ? (
            <UserAddressMaharashtra
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              setIsValid={setIsValid}
              isReset={isReset}
              isEdit={isEdit}
            />
          ) : (
            <UserAddressForeign
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              isReset={isReset}
              isEdit={isEdit}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddress;
