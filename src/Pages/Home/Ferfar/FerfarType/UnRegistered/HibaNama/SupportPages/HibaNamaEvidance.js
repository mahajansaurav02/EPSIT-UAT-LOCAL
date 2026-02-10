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
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import styles from "../../../../ferfar.module.css";
import UserAddress from "../../SupportPages/UserAddress";

const HibaNamaEvidance = () => {
  const [userType, setUserType] = useState("self");
  const [suffix, setSuffix] = useState("shree");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    othername: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [photo, setPhoto] = useState({
    passportName: "",
    passportSrc: "",
  });
  const [passportError, setPassportError] = useState("");

  const handleCompanyDetails = (e) => {
    setCompanyName(e?.target?.value);
  };
  const handleSuffix = (e) => {
    setSuffix(e?.target?.value);
  };
  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
  };
  const handlePassportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setPassportError("File should be less than 256 KB");
        setPhoto({
          ...photo,
          passportName: "",
          passportSrc: "",
        });
      } else {
        setPassportError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto({
            ...photo,
            passportSrc: reader.result,
            passportName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPassportError("");
      setPhoto({
        ...photo,
        passportName: "",
        passportSrc: "",
      });
    }
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
              हिबानामा साक्षीदार माहिती
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={10}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Grid container spacing={2}>
                      <Grid item md={3}>
                        <InputLabel className={styles.inputlabel}>
                          <b>हिबानामा साक्षीदारा प्रकार </b>
                          <span>*</span>
                        </InputLabel>
                        <Select
                          value={userType}
                          onChange={handleChangeUserType}
                          fullWidth
                          size="small"
                        >
                          <MenuItem value="self">व्यक्ती</MenuItem>
                          <MenuItem value="company">कंपनी</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                  {userType == "self" ? (
                    <Grid item md={12}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="end"
                      >
                        <Grid item md={2}>
                          <Select
                            value={suffix}
                            onChange={handleSuffix}
                            fullWidth
                            size="small"
                          >
                            <MenuItem value="shree">श्री</MenuItem>
                            <MenuItem value="smt">श्रीमती</MenuItem>
                            <MenuItem value="ku">कु</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item md={3}>
                          <TextField
                            fullWidth
                            value={userDetails?.firstName}
                            name="firstName"
                            placeholder="पाहिले नाव"
                            onChange={(e) => handleUserDetails(e)}
                            size="small"
                          />
                        </Grid>
                        <Grid item md={3}>
                          <TextField
                            fullWidth
                            value={userDetails?.middleName}
                            name="middleName"
                            placeholder="मधले नाव"
                            onChange={(e) => handleUserDetails(e)}
                            size="small"
                          />
                        </Grid>
                        <Grid item md={3}>
                          <TextField
                            fullWidth
                            value={userDetails?.lastName}
                            name="lastName"
                            placeholder="आडनाव"
                            onChange={(e) => handleUserDetails(e)}
                            size="small"
                          />
                        </Grid>
                      </Grid>

                      <Grid item md={3} mt={2}>
                        <InputLabel className={styles.inputlabel}>
                          <b>उर्फ नाव </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          value={userDetails?.othername}
                          name="othername"
                          placeholder="उर्फ नाव"
                          onChange={(e) => handleUserDetails(e)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item md={8}>
                      <TextField
                        fullWidth
                        value={companyName}
                        name="companyName"
                        placeholder="इंफोटेक प्रायवेट लिमिटेड"
                        onChange={(e) => handleCompanyDetails(e)}
                        size="small"
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                md={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <InputLabel className={styles.inputlabel}>
                  <b>फोटोग्राफ </b>
                  <span>*</span>
                </InputLabel>
                <img
                  src={
                    photo?.passportSrc
                      ? photo?.passportSrc
                      : "/images/user-placeholder.png"
                  }
                  width="160px"
                  height="160px"
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadRoundedIcon />}
                  fullWidth
                >
                  पासपोर्ट फोटो
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePassportFileChange}
                  />
                </Button>
                {passportError && (
                  <div style={{ color: "red" }}>{passportError}</div>
                )}
                <a
                  href="https://www.ilovepdf.com/"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    fontSize: "13px",
                    marginTop: 3,
                  }}
                >
                  To resize photo click here
                </a>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <UserAddress type="hibanamaEvidance" />
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
                // onClick={() => setActiveStep(2)}
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>
            वक्फ बोर्डाची हस्तांतरणाची परवानगी माहिती तक्ता
          </h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>हिबानामा साक्षीदार पहिले नाव</TableCell>
                <TableCell>हिबानामा साक्षीदार मधले नाव</TableCell>
                <TableCell>हिबानामा साक्षीदार आड नाव</TableCell>
                <TableCell>उर्फ नाव</TableCell>
                <TableCell>हिबानामा साक्षीदाराचा पत्ता</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>राहुल</TableCell>
                <TableCell>हर्षल</TableCell>
                <TableCell>काळे</TableCell>
                <TableCell>राहुल</TableCell>
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

export default HibaNamaEvidance;
