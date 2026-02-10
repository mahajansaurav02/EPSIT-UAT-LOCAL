import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import styles from "../../../../ferfar.module.css";

const UserDharak = () => {
  const [aapak, setAapak] = useState("");
  const [gender, setGender] = useState("");
  const [khataType, setKhataType] = useState("");
  const [holderType, setHolderType] = useState("");
  const [relation, setRelation] = useState("");

  const handleAapak = (e) => {
    setAapak(e?.target?.value);
  };
  const handleGenderType = (e) => {
    setGender(e?.target?.value);
  };
  const handleKhataType = (e) => {
    setKhataType(e?.target?.value);
  };
  const handleHolderType = (e) => {
    setHolderType(e?.target?.value);
  };
  const handleRelation = (e) => {
    setRelation(e?.target?.value);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>उर्फ नाव</b>
          </InputLabel>
          <TextField
            fullWidth
            // value={foraighnAddress?.email}
            placeholder="उर्फ नाव लिहा"
            name="email"
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
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
            <b>धारकाशी नाते </b>
            <span>*</span>
          </InputLabel>
          <Select
            value={relation}
            onChange={handleRelation}
            fullWidth
            size="small"
          >
            <MenuItem value="husbund">पती</MenuItem>
            <MenuItem value="wife">पत्नी</MenuItem>
            <MenuItem value="son">मुलगा</MenuItem>
            <MenuItem value="daughter">मुलगी</MenuItem>
            <MenuItem value="sun">सून</MenuItem>
            <MenuItem value="nat">नात</MenuItem>
            <MenuItem value="naatu">नातू</MenuItem>
            <MenuItem value="aai">आई</MenuItem>
            <MenuItem value="vadil">वडील</MenuItem>
            <MenuItem value="chulta">चुलता</MenuItem>
            <MenuItem value="chulti">चुलती</MenuItem>
            <MenuItem value="putnya">पुतण्या</MenuItem>
            <MenuItem value="putni">पुतणी</MenuItem>
            <MenuItem value="bahin">बहीण</MenuItem>
            <MenuItem value="bhau">भाऊ</MenuItem>
            <MenuItem value="bhacha">भाचा</MenuItem>
            <MenuItem value="chachi">भाची</MenuItem>
            <MenuItem value="ajiba">आजोबा</MenuItem>
            <MenuItem value="ajji">आज्जी</MenuItem>
            <MenuItem value="kaka">काका</MenuItem>
            <MenuItem value="kaku">काकू</MenuItem>
          </Select>
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>खाते प्रकार </b>
            <span>*</span>
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
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>लिंग निवडा </b>
            <span>*</span>
          </InputLabel>
          <Select
            value={gender}
            onChange={handleGenderType}
            fullWidth
            size="small"
          >
            <MenuItem value="female">स्त्री</MenuItem>
            <MenuItem value="male">पुरुष</MenuItem>
            <MenuItem value="other">इतर</MenuItem>
          </Select>
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>अज्ञान पालन कर्ता / एकत्र कुटुंब मॅनेजर </b>
            <span>*</span>
          </InputLabel>
          <Select value={aapak} onChange={handleAapak} fullWidth size="small">
            <MenuItem value="aapak-1">अज्ञान पालन कर्ता- 1</MenuItem>
            <MenuItem value="aapak-2">अज्ञान पालन कर्ता- 2</MenuItem>
          </Select>
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>अज्ञान पालन कर्ता</b>
          </InputLabel>
          <TextField
            fullWidth
            // value={foraighnAddress?.email}
            placeholder="अज्ञान पालन कर्ता"
            name="email"
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>जन्म दिनांक </b>
            <span>*</span>
          </InputLabel>
          <TextField
            type="date"
            fullWidth
            placeholder="23/05/1986"
            name="email"
            // value={foraighnAddress?.email}
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>नावे क्षेत्र (चौ.मी.)</b>
          </InputLabel>
          <TextField fullWidth size="small" placeholder="क्षेत्र" />
        </Grid>
        <Grid item md={4}>
          <InputLabel className={styles.inputlabel}>
            <b>हिबानामा नुसार क्षेत्र (चौ.मी.)</b>
          </InputLabel>
          <TextField fullWidth size="small" placeholder="क्षेत्र" />
        </Grid>
      </Grid>
      <Grid container mt={1}>
        <Grid item md={4}>
          <InputLabel>
            <div>
              <b style={{ fontSize: "14px" }}>आईचे नाव</b>
            </div>
            <span style={{ fontSize: "small" }}>
              जन्म दिनांक १ मे २०२४ नंतर असेल तर आईचे नाव आवश्यक
            </span>
          </InputLabel>
          <TextField
            fullWidth
            placeholder="आईचे नाव"
            name="motherName"
            // value={foraighnAddress?.email}
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            placeholder="Mother Name"
            name="motherName"
            // value={foraighnAddress?.email}
            // onChange={(e) => handleForeignAddressDetails(e)}
            size="small"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserDharak;
