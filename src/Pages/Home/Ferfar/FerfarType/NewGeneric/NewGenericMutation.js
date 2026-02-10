import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepButton,
  Stepper,
  TextField,
} from "@mui/material";
import Denar from "./CommonFiles/Denar";
import Ghenar from "./CommonFiles/Ghenar";
import Pairing from "./CommonFiles/Pairing";
import BojaKamiKarne from "./DiffFilesAccToMutation/BojaKamiKarne";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { nabhuValidationSchema } from "../../../../../Validations/yupValidations";
import Hibanama from "./DiffFilesAccToMutation/Hibanama";
import TabaPavti from "./DiffFilesAccToMutation/TabaPavti";
import DeedmedConveyence from "./DiffFilesAccToMutation/DeedmedConveyence";

const NewGenericMutation = ({ applicationData }) => {
  const applicationId = sessionStorage.getItem("applicationId");
  const [naBhu, setNaBhu] = useState("");
  const [lrPropertyUID, setLrPropertyUID] = useState("");
  const [milkat, setMilkat] = useState("land");
  const [namud, setNamud] = useState("");
  const [subPropNo, setSubPropNo] = useState("");
  const [actualArea, setActualArea] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [obj, setObj] = useState({});

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const {
    control,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        nabhu: nabhuValidationSchema,
      })
    ),
    defaultValues: {
      nabhu: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleNaBhuNo = (e) => {
    const code = e?.target?.value;
    setNaBhu(e?.target?.value);
    const obj = applicationData?.nabhDTL.find((o) => o?.naBhu == code);
    setObj(obj);
    setLrPropertyUID(obj?.lrPropertyUID);
    setMilkat(obj?.milkat);
    setNamud(obj?.namud);
    setSubPropNo(obj?.sub_property_no);
    setActualArea(obj?.cityServeyAreaInSqm);
  };

  const steps = ["देणार", "घेणार"];
  return (
    <>
      <Grid item md={12}>
        {applicationData?.mutation_type_code == "07" && <BojaKamiKarne />}
        {applicationData?.mutation_type_code == "23" && <Hibanama />}
        {applicationData?.mutation_type_code == "18" && <TabaPavti />}
        {applicationData?.mutation_type_code == "24" && <DeedmedConveyence />}
      </Grid>

      <Grid item md={12}>
        <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
          <Grid container spacing={1}>
            <Grid item md={12}>
              <h4 className="heading">फेरफारसाठी न. भू. क्र. निवडा</h4>
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <Controller
                    name="nabhu"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>अर्जामधील न.भू.क्र. निवडा </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          className="textfield"
                          size="small"
                          value={naBhu}
                          error={errors.nabhu}
                          {...field}
                          onBlur={() => handleBlur("nabhu")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleNaBhuNo(e);
                          }}
                        >
                          {Array.isArray(applicationData?.nabhDTL) &&
                            applicationData?.nabhDTL.map((val, i) => {
                              return (
                                <MenuItem
                                  value={val?.naBhu}
                                  key={val?.naBhu + i}
                                >
                                  {val?.naBhu}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.nabhu && errors.nabhu.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>LR-Property UID</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={lrPropertyUID}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>फेरफारासाठी मिळकत </b>
                  </InputLabel>
                  <RadioGroup row value={milkat}>
                    <FormControlLabel
                      value="land"
                      control={<Radio />}
                      label="जमीन ( NA प्लॉट )"
                      disabled
                    />
                    <FormControlLabel
                      value="flat"
                      control={<Radio />}
                      label="अपार्टमेंट"
                      disabled
                    />
                  </RadioGroup>
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>अर्जामध्ये नमूद मिळकत</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={namud}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel className="inputlabel">
                    <b>क्षेत्र (चौ.मी.)</b>
                  </InputLabel>
                  <TextField
                    fullWidth
                    className="textfieldDisabled"
                    value={actualArea}
                    size="small"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>

            {!naBhu == "" && (
              <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
                <Grid item md={12}>
                  <Box sx={{ width: "100%" }}>
                    <Stepper activeStep={activeStep} sx={{ px: "400px" }}>
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepButton
                            color="inherit"
                            onClick={handleStep(index)}
                          >
                            {label}
                          </StepButton>
                        </Step>
                      ))}
                    </Stepper>
                    <div style={{ marginTop: 10 }}>
                      <React.Fragment>
                        {activeStep == 0 && (
                          <Denar
                            setActiveStep={setActiveStep}
                            applicationData={applicationData}
                            obj={obj}
                          />
                        )}
                        {activeStep == 1 && (
                          <Ghenar
                            applicationData={applicationData}
                            setActiveStep={setActiveStep}
                          />
                        )}
                      </React.Fragment>
                    </div>
                  </Box>
                </Grid>
              </Paper>
            )}
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default NewGenericMutation;
