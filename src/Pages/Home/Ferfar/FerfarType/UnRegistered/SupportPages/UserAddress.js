import React, { useState } from "react";
import {
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import UserAddressMaharashtra from "./UserAddressMaharashtra";
import UserAddressForeign from "./UserAddressForeign";

const UserAddress = ({
  type,
  isReset,
  hasSignature,
  setIsIndian,
  indiaAddress,
  setIndiaAdress,
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
  isMobileCompulsary,
  setIsMobileNoVerified,
}) => {
  const [radio, setRadio] = useState("india");
  const [sameAddd, setSameAdd] = useState("no");
  const [selectedUserAdd, setSelectedUserAdd] = useState("");

  const handleRadioChange = (e) => {
    setRadio(e?.target?.value);
    setIsIndian(e?.target?.value);
  };
  const handleSameAddress = (e) => {
    setSameAdd(e?.target?.value);
  };
  const handleSelectedUser = (e) => {
    setSelectedUserAdd(e?.target?.value);
  };
  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item md={12} xs={12}>
              <h4 className="heading">
                {type == "mayatDharak" && "मयत धारकाचा पत्ता"}
                {type == "varas" && "वारसाचा पत्ता"}
                {type == "mryutuPatraDenar" &&
                  "मृत्यूपत्र / इच्छापत्र करून देणाराचा पत्ता"}

                {type == "tabaPavtiDenar" && "ताबा पावती देणाराचा पत्ता"}
                {type == "tabaPavtiGhenar" && "ताबा पावती घेणाराचा पत्ता"}
                {type == "eeKuMya" && "ए.कू.मॅ. चा पत्ता"}
                {type == "eKuMyaDharakachivarasNond" && "सहधारकाचा पत्ता"}
                {type == "hibanamaDenar" && "हिबानामा देणाराचा पत्ता"}
                {type == "hibanamaGhenar" && "हिबानामा घेणाराचा पत्ता"}
                {type == "hibanamaEvidance" && "हिबानामा साक्षीदाराचा पत्ता"}

                {type == "navatBadal" && "नावातील बदल धारकाचा पत्ता"}
                {type == "aapakNondKamiKarne" && "अ. पा. क. धारकाचा पत्ता"}
                {type == "dharnaDhikarNond" && "धारकाचा पत्ता"}
              </h4>
            </Grid>
          </Grid>
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
            />
          </RadioGroup>
        </Grid>
        <Grid item md={12}>
          {radio == "india" ? (
            <UserAddressMaharashtra
              hasSignature={hasSignature}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              setIsValid={setIsValid}
              isReset={isReset}
              isMobileCompulsary={isMobileCompulsary}
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          ) : (
            <UserAddressForeign
              foraighnAddress={foraighnAddress}
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              isReset={isReset}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddress;
