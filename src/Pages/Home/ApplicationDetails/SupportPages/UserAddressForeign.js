import {
  Grid,
  InputLabel,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addressValidationSchema } from "../../../../Validations/yupValidations";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { filterOnlyLettersNumbersCommaDotAndSpaces } from "../../../../Validations/utils";

const UserAddressForeign = ({
  foraighnAddress,
  setForaighnAddress,
  setIsValid,
  isEdit,
  isReset,
}) => {
  const [editFields, setEditFields] = useState(false);

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        addressNri: addressValidationSchema,
      })
    ),
    defaultValues: { addressNri: "" },
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleReset = () => {
    setEditFields(false);
    reset();
  };

  const handleForeignAdd = (e) => {
    setForaighnAddress(e?.target?.value);
  };

  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      setValue("addressNri", foraighnAddress);
    }
  }, [isEdit]);

  useEffect(() => {
    // if (isReset) {
    handleReset();
    // }
  }, [isReset]);

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserForeignAdd: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      {editFields && (
        <Grid item md={12} mt={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            अर्जदाराच्या पत्त्यात बदल करा
          </Button>
        </Grid>
      )}

      <Grid item md={12} mt={1}>
        {editFields ? (
          <Grid item md={6}>
            <TextField
              fullWidth
              value={foraighnAddress}
              className="textfieldDisabled"
              disabled
              multiline
              rows={3}
              size="small"
            />
          </Grid>
        ) : (
          <Grid item md={6}>
            <Controller
              name="addressNri"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel className="inputlabel">
                    <b>पत्ता </b>
                    <span>*</span>
                  </InputLabel>
                  <TextField
                    className="textfield"
                    fullWidth
                    value={foraighnAddress}
                    error={errors.addressNri}
                    {...field}
                    multiline
                    rows={3}
                    name="address"
                    placeholder="282 Elm Drive, New York, NY"
                    // onChange={(e) => {
                    //   field.onChange(e);
                    //   handleForeignAdd(e);
                    // }}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      const filteredValue =
                        filterOnlyLettersNumbersCommaDotAndSpaces(value);
                      field.onChange(filteredValue);
                      handleForeignAdd({
                        target: { name, value: filteredValue },
                      });
                    }}
                    onBlur={() => handleBlur("addressNri")}
                    size="small"
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.addressNri && errors.addressNri.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default UserAddressForeign;
