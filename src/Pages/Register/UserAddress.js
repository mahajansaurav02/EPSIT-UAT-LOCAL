import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";
import UserAddressIndia from "./UserAddress/UserAddressIndia";
import UserAddressForeign from "./UserAddress/UserAddressForeign";
import UserContactIndia from "./UserAddress/UserContactIndia";
import UserContactForeign from "./UserAddress/UserContactForeign";

const UserAddress = ({
  setIsIndian,
  indiaAddress,
  setIndiaAdress,
  setForaighnAddress,
  indiaContactDetails,
  setIndiaContactDetails,
  foreignContactDetails,
  setForeignContactDetails,
  setIsValid,
  setIsMobileNoVerified,
  isMobileNoVerified,
}) => {
  const [radio, setRadio] = useState("india");

  const handleRadioChange = (e) => {
    setRadio(e?.target?.value);
    setIsIndian(e?.target?.value);
  };

  return (
    <>
      <Grid container>
        <Grid item md={12}>
          <h4 className="heading">संपर्क</h4>
        </Grid>
        <Grid item md={12}>
          <RadioGroup row value={radio} onChange={handleRadioChange}>
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
        <Grid item md={12}>
          {radio == "india" ? (
            <UserContactIndia
              indiaContactDetails={indiaContactDetails}
              setIndiaContactDetails={setIndiaContactDetails}
              setIsValid={setIsValid}
              setIsMobileNoVerified={setIsMobileNoVerified}
              isMobileNoVerified={isMobileNoVerified}
            />
          ) : (
            <UserContactForeign
              foreignContactDetails={foreignContactDetails}
              setForeignContactDetails={setForeignContactDetails}
              setIsValid={setIsValid}
            />
          )}
        </Grid>
        <Grid item md={12}>
          <h4 className="heading">पत्ता</h4>
        </Grid>
        <Grid item md={12}>
          {radio == "india" ? (
            <UserAddressIndia
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              setIsValid={setIsValid}
            />
          ) : (
            <UserAddressForeign
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddress;
