import React, { useEffect, useState } from "react";
import { FormHelperText, Grid, InputLabel, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addressValidationSchema } from "../../../Validations/yupValidations";
import { filterOnlyLettersNumbersCommaDotAndSpaces } from "../../../Validations/utils";

const UserAddressForeign = ({ setForaighnAddress, setIsValid }) => {
  const [foraighnAdd, setForaighnAdd] = useState("");

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        // addressNri: addressValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleForeignAdd = (e) => {
    setForaighnAdd(e?.target?.value);
    setForaighnAddress(e?.target?.value);
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserForeignAdd: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid item md={6}>
          <InputLabel className="inputlabel">
            <b>पत्ता </b>
          </InputLabel>
          <TextField
            className="textfield"
            fullWidth
            value={foraighnAdd}
            multiline
            rows={3}
            name="address"
            placeholder="282 Elm Drive, New York, NY"
            // onChange={handleForeignAdd}
            onChange={(e) => {
              const { name, value } = e.target;
              const filteredValue =
                filterOnlyLettersNumbersCommaDotAndSpaces(value);
              handleForeignAdd({
                target: { name, value: filteredValue },
              });
            }}
            size="small"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddressForeign;
