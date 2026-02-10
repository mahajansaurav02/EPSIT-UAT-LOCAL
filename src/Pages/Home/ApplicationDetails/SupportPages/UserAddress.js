import React, { useState } from "react";
import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import UserAddressIndia from "./UserAddressIndia";
import UserAddressForeign from "./UserAddressForeign";
import UserContactIndia from "./UserContactIndia";
import UserContactForeign from "./UserContactForeign";

const UserAddress = ({
  isEdit,
  isIndian,
  setIsIndian,
  indiaAddress,
  setIndiaAdress,
  foraighnAddress,
  setForaighnAddress,
  indiaContactDetails,
  setIndiaContactDetails,
  foreignContactDetails,
  setForeignContactDetails,
  setIsValid,
  isReset,
  isFirstUser,
}) => {
  const handleRadioChange = (e) => {
    setIsIndian(e?.target?.value);
  };
  return (
    <>
      <Grid container>
        <Grid item md={12} mb={2}>
          <h4 className="heading">अर्जदाराचा पत्ता</h4>
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
              disabled
            />
          </RadioGroup>
        </Grid>
        <Grid item md={12} mt={1}>
          {isIndian == "india" ? (
            <UserAddressIndia
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
      <Grid item md={12}>
        {isIndian == "india" ? (
          <UserContactIndia
            indiaContactDetails={indiaContactDetails}
            setIndiaContactDetails={setIndiaContactDetails}
            setIsValid={setIsValid}
            isReset={isReset}
            isEdit={isEdit}
            isFirstUser={isFirstUser}
          />
        ) : (
          <UserContactForeign
            foreignContactDetails={foreignContactDetails}
            setForeignContactDetails={setForeignContactDetails}
            setIsValid={setIsValid}
            isReset={isReset}
            isEdit={isEdit}
          />
        )}
      </Grid>
    </>
  );
};

export default UserAddress;
