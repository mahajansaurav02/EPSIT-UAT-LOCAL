import React, { useEffect, useState } from "react";
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
  isEdit,
  hasSignature,
  setIsIndian,
  indiaAddress,
  setIndiaAdress,
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
  isIndian,
  responseData,
  isMobileCompulsary,
  setIsMobileNoVerified,
}) => {
  const [showSameAddFields, setShowSameAddFields] = useState(false);
  const [sameAddd, setSameAdd] = useState("no");
  const [selectedUserAdd, setSelectedUserAdd] = useState("");
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [selectedIndAdd, setSelectedIndAdd] = useState({});
  const [selectedForAdd, setSelectedForAdd] = useState({});

  const handleRadioChange = (e) => {
    setIsIndian(e?.target?.value);
  };
  const handleSameAddress = (e) => {
    const val = e?.target?.value;
    setSameAdd(val);
    if (val == "no") {
      setSelectedUserAdd("");
      setIsUserSelected(false);
    }
  };
  const handleSelectedUser = (e) => {
    const user = e?.target?.value;
    const obj = responseData.find((o) => o?.fullNameInMarathi == user);
    setSelectedUserAdd(user);
    setIsUserSelected(true);
    setIsIndian(obj?.address?.addressType == "INDIA" ? "india" : "foreign");
    if (obj?.address?.addressType == "INDIA") {
      setSelectedIndAdd(obj?.address?.indiaAddress);
    } else {
      setSelectedForAdd(obj?.address?.foreignAddress);
    }
  };
  useEffect(() => {
    if (responseData.length > 0) {
      setShowSameAddFields(true);
    }
  }, [responseData]);

  useEffect(() => {
    setIsIndian(isIndian);
  }, [isEdit]);
  return (
    <>
      <Grid container>
        <Grid item md={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item md={12}>
              <h4 className="heading">
                {type == "kherediDenar" && "खरेदी देणाऱ्याचा पत्ता"}
                {type == "kherediGhenar" && "खरेदी घेणाऱ्याचा पत्ता"}
                {type == "bakshishPatraDenar" && "बक्षीसपत्र देणाऱ्याचा पत्ता"}
                {type == "bakshishPatraGhenar" && "बक्षीसपत्र घेणाऱ्याचा पत्ता"}
                {type == "mryutuPatraDenar" &&
                  "मृत्यूपत्र / इच्छापत्र करून देणाराचा पत्ता"}
                {type == "mryutuPatraGhenar" &&
                  "मृत्यूपत्र / इच्छापत्र लाभार्थीचा पत्ता"}
                {type == "bhadePattaDenar" && "भाडेपट्टा देणाराचा पत्ता"}
                {type == "bhadePattaGhenar" && "भाडेपट्टा घेणाराचा पत्ता"}
                {type == "gahankhatTaranBojaDakhalNondDenar" &&
                  "गहाणखत / तारण / बोजा देणाराचा पत्ता"}
                {type == "gahankhatTaranBojaDakhalNondGhenar" &&
                  "गहाणखत / तारण / बोजा घेणाराचा पत्ता"}
                {type == "gahankhatTaranBojaKamiKarneNondDenar" &&
                  "गहाणखत / तारण / बोजा बँक / संस्था पत्ता"}
                {type == "gahankhatTaranBojaKamiKarneNondGhenar" &&
                  "गहाणखत / तारण / बोजा धारकाचा पत्ता"}
                {type == "hakksodDenar" && "हक्कसोड देणाऱ्याचा पत्ता"}
                {type == "hakksodGhenar" && "हक्कसोड घेणाऱ्याचा पत्ता"}

                {type == "chukDurusti" && "चूकदुरुस्ती करणाऱ्याचा पत्ता"}
                {type == "vatniPatraDenar" && "वाटणीपत्र देणाऱ्याचा पत्ता"}
                {type == "vatniPatraGhenar" && "वाटणीपत्र घेणाऱ्याचा पत्ता"}
              </h4>
            </Grid>
            {/* {showSameAddFields && (
              <Grid item md={3}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography variant="h6" fontSize="14px" fontWeight={600}>
                      पत्ता सारखा आहे का ?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      row
                      value={sameAddd}
                      onChange={handleSameAddress}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="होय"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="नाही"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {sameAddd == "yes" && showSameAddFields && (
              <Grid item md={3}>
                <Select
                  className="textfield"
                  value={selectedUserAdd}
                  onChange={handleSelectedUser}
                  fullWidth
                  size="small"
                >
                  {Array.isArray(responseData) &&
                    responseData.map((val, i) => {
                      return (
                        <MenuItem value={val?.fullNameInMarathi} key={i}>
                          {val?.fullNameInMarathi}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            )} */}
          </Grid>
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
              hasSignature={hasSignature}
              indiaAddress={isUserSelected ? selectedIndAdd : indiaAddress}
              setIndiaAdress={setIndiaAdress}
              setIsValid={setIsValid}
              isReset={isReset}
              isMobileCompulsary={isMobileCompulsary}
              isEdit={isUserSelected ? true : isEdit}
              setIsMobileNoVerified={setIsMobileNoVerified}
            />
          ) : (
            <UserAddressForeign
              foraighnAddress={
                isUserSelected ? selectedForAdd : foraighnAddress
              }
              setForaighnAddress={setForaighnAddress}
              setIsValid={setIsValid}
              isReset={isReset}
              isEdit={isUserSelected ? true : isEdit}
            />
          )}
        </Grid>
        {/* <Grid item md={12}>
          {isIndian == "india" ? (
            <UserAddressMaharashtra
              hasSignature={hasSignature}
              indiaAddress={indiaAddress}
              setIndiaAdress={setIndiaAdress}
              setIsValid={setIsValid}
              isReset={isReset}
              isMobileCompulsary={isMobileCompulsary}
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
        </Grid> */}
      </Grid>
    </>
  );
};

export default UserAddress;
