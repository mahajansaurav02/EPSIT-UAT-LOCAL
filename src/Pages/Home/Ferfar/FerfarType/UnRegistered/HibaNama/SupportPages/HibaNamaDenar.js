import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import UserAddress from "../../SupportPages/UserAddress";
import styles from "../../../../ferfar.module.css";

const HibaNamaDenar = ({ setActiveStep }) => {
  const [naBhuNo, setNaBhuNo] = useState("");
  const [naBhuMilkat, setNaBhuMilkat] = useState("");
  const [userName, setUserName] = useState("");
  const [radio, setRadio] = useState("yes");

  const handleNaBhuNo = (e) => {
    setNaBhuNo(e?.target?.value);
  };
  const handleNaBhuMilkat = (e) => {
    setNaBhuMilkat(e?.target?.value);
  };
  const handleUserName = (e) => {
    setUserName(e?.target?.value);
  };
  const handleRadioChange = (e) => {
    setRadio(e?.target?.value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Paper elevation={5} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <h4 style={{ fontSize: "18px", fontWeight: 600 }}>
              हिबानामा देणार
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>अर्जामधील न.भू.क्र. </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  value={naBhuNo}
                  onChange={handleNaBhuNo}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="1">485/20/121/52</MenuItem>
                </Select>
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>LR-Property UID</b>
                </InputLabel>
                <TextField
                  fullWidth
                  value="47846587451"
                  name="mobile"
                  size="small"
                  disabled
                  // onChange={(e) => handleIndiaAddressDetails(e)}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>फेरफारासाठी मिळकत </b>
                  <span>*</span>
                </InputLabel>
                <RadioGroup row>
                  <FormControlLabel
                    value="land"
                    control={<Radio />}
                    label="जमीन ( NA प्लॉट )"
                  />
                  <FormControlLabel
                    value="flat"
                    control={<Radio />}
                    label="अपार्टमेंट"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>अर्जामध्ये नमूद मिळकत </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  value={naBhuMilkat}
                  onChange={handleNaBhuMilkat}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="1">CTS-Sampurna milkat</MenuItem>
                  <MenuItem value="2">Flat-Unit No.</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} mb={1}>
            <InputLabel className={styles.inputlabel}>
              <b>हिबानामा देणाराचे नाव </b>
              <span>*</span>
            </InputLabel>
            <Select
              value={userName}
              onChange={handleUserName}
              fullWidth
              size="small"
            >
              <MenuItem value="tushar">राहुल नानासाहेब शिंदे</MenuItem>
              <MenuItem value="yogesh">योगेश नानासाहेब शिंदे</MenuItem>
            </Select>
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between">
              <Grid item md={2}>
                <TextField fullWidth value="श्री" disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="राहुल" disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="नानासाहेब" disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="शिंदे" disabled size="small" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between">
              <Grid item md={2}>
                <TextField fullWidth value="Mr." disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="Rahul" disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="Nanasaheb" disabled size="small" />
              </Grid>
              <Grid item md={3}>
                <TextField fullWidth value="Shinde" disabled size="small" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>उर्फ नाव</b>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="राहुल"
                  // value={indAddress?.building}
                  // name="building"
                  // placeholder="इमारत"
                  // onChange={(e) => handleIndiaAddressDetails(e)}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>धारक प्रकार</b>
                </InputLabel>
                <TextField
                  value="Single Holder"
                  fullWidth
                  size="small"
                  disabled
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
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>पूर्ण क्षेत्र दिले आहे का ? </b>
                  <span>*</span>
                </InputLabel>
                <RadioGroup row onChange={handleRadioChange} defaultValue="yes">
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
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>नावे क्षेत्र (चौ.मी.)</b>
                </InputLabel>
                <TextField fullWidth size="small" value={40} disabled />
              </Grid>
              <Grid item md={4}>
                {radio == "yes" ? (
                  <>
                    <InputLabel className={styles.inputlabel}>
                      <b>हिबानामा मध्ये नमूद क्षेत्र (चौ.मी.)</b>
                    </InputLabel>
                    <TextField fullWidth size="small" value={40} disabled />
                  </>
                ) : (
                  <>
                    <InputLabel className={styles.inputlabel}>
                      <b>हिबानामा मध्ये नमूद क्षेत्र (चौ.मी.) </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField fullWidth size="small" value={40} />
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress type="hibanamaDenar" />
          </Grid>

          <Grid container justifyContent="end" px={2} mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<RotateRightRoundedIcon />}
                sx={{ mr: 2 }}
              >
                रीसेट करा
              </Button>
              <Button
                variant="contained"
                endIcon={<SaveRoundedIcon />}
                onClick={() => setActiveStep(1)}
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>हिबानामा देणार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                <TableCell>अर्जामधील न.भू.क्र.</TableCell>
                <TableCell>LR-Property UID</TableCell>
                <TableCell>फेरफरसाठी मिळकत</TableCell>
                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                <TableCell>हिबानामा देणाराचे नाव</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>नावे क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>हिबानामा मध्ये नमूद क्षेत्र (चौ.मी.)</TableCell>
                <TableCell>हिबानामा देणाराचा पत्ता</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>हवेली</TableCell>
                <TableCell>47846587451</TableCell>
                <TableCell>जमीन (NA प्लॉट)</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>राहुल नानासाहेब शिंदे</TableCell>
                <TableCell>राहुल</TableCell>
                <TableCell>40</TableCell>
                <TableCell>30</TableCell>
                <TableCell>
                  <Button variant="outlined">पत्ता पहा</Button>
                </TableCell>
                <TableCell>
                  {/* <IconButton>
                    <EditNoteOutlinedIcon />
                  </IconButton> */}
                  <IconButton>
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default HibaNamaDenar;
