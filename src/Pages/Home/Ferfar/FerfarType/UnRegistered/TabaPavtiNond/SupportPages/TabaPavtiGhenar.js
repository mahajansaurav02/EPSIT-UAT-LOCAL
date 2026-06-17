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
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import UserNoMHProperty from "../../SupportPages/User/NoMHProperty/UserNoMHProperty";
import UserMHPropertyType712 from "../../SupportPages//User/MHProperty/UserMHPropertyType712";
import UserMHPropertyTypePropertyCard from "../../SupportPages//User/MHProperty/UserMHPropertyTypePropertyCard";
import UserMHPropertTypeULPIN from "../../SupportPages/User/MHProperty/UserMHPropertyTypeULPIN";
import CompanyNoMHProperty from "../../SupportPages//Company/NoMHProperty/CompanyNoMHProperty";
import CompanyMHPropertType712 from "../../SupportPages/Company/MHProperty/CompanyMHPropertyType712";
import CompanyMHPropertyTypePropertyCard from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypePropertyCard";
import CompanyMHPropertyTypeULPIN from "../../SupportPages/Company/MHProperty/CompanyMHPropertyTypeULPIN";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import UserAddress from "../../SupportPages/UserAddress";
import UserDharak from "./UserDharak";
import CompanyDharak from "./CompanyDharak";
import styles from "../../../../ferfar.module.css";

const TabaPavtiGhenar = ({ setActiveStep }) => {
  const [userType, setUserType] = useState("self");
  const [isMHProperty, setIsMHProperty] = useState("no");
  const [property, setProperty] = useState("712");
  const [photo, setPhoto] = useState({
    passportName: "",
    passportSrc: "",
  });
  const [passportError, setPassportError] = useState("");

  const handleChangeUserType = (e) => {
    setUserType(e?.target?.value);
  };
  const handleMHProperty = (e) => {
    setIsMHProperty(e?.target?.value);
  };
  const handleProperty = (e) => {
    setProperty(e?.target?.value);
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
              ताबा पावती घेणार
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
                          <b>ताबा पावती घेणाराचा प्रकार </b>
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
                      <Grid item md={4}>
                        <InputLabel className={styles.inputlabel}>
                          <b>आपण महाराष्ट्रातील मालमत्ता धारक आहात का ? </b>
                          <span>*</span>
                        </InputLabel>
                        <RadioGroup
                          row
                          value={isMHProperty}
                          onChange={handleMHProperty}
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
                      {isMHProperty == "yes" && (
                        <Grid item md={4}>
                          <InputLabel className={styles.inputlabel}>
                            <b>मालमत्ता प्रकार निवडा </b>
                            <span>*</span>
                          </InputLabel>
                          <RadioGroup
                            row
                            value={property}
                            onChange={handleProperty}
                          >
                            <FormControlLabel
                              value="712"
                              control={<Radio />}
                              label="7/12"
                            />
                            <FormControlLabel
                              value="propertyCard"
                              control={<Radio />}
                              label="Property Card"
                            />
                            <FormControlLabel
                              value="ulpin"
                              control={<Radio />}
                              label="ULPIN"
                            />
                          </RadioGroup>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  {userType == "self" ? (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <UserNoMHProperty
                          heading="ताबा पावती घेणाऱ्याची माहिती"
                          inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                        />
                      ) : (
                        <>
                          {property == "712" && (
                            <UserMHPropertyType712
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                          {property == "propertyCard" && (
                            <UserMHPropertyTypePropertyCard
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                          {property == "ulpin" && (
                            <UserMHPropertTypeULPIN
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                        </>
                      )}
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      {isMHProperty == "no" ? (
                        <CompanyNoMHProperty
                          heading="ताबा पावती घेणाऱ्याची माहिती"
                          inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                        />
                      ) : (
                        <>
                          {property == "712" && (
                            <CompanyMHPropertType712
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                          {property == "propertyCard" && (
                            <CompanyMHPropertyTypePropertyCard
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                          {property == "ulpin" && (
                            <CompanyMHPropertyTypeULPIN
                              heading="ताबा पावती घेणाऱ्याची माहिती"
                              inputlabel="ताबा पावती घेणाऱ्याचे नाव"
                            />
                          )}
                        </>
                      )}
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
            {userType == "self" ? <UserDharak /> : <CompanyDharak />}
          </Grid>

          <Grid item md={12}>
            <UserAddress type="tabaPavtiGhenar" />
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
                onClick={() => setActiveStep(2)}
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
            ताबा पावती घेणार( नवीन धारक) माहिती तक्ता
          </h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell rowSpan={2}>अ. क्र.</TableCell>
                <TableCell rowSpan={2}>
                  जिल्हा / तालुका / न. भू. कार्यालय / गांव
                </TableCell>
                <TableCell rowSpan={2}>ताबा पावती घेणाराचा प्रकार</TableCell>
                <TableCell colSpan={3}>ताबा पावती घेणाराचे नाव</TableCell>
                <TableCell rowSpan={2}>उर्फ नाव</TableCell>
                <TableCell rowSpan={2}>धारक प्रकार</TableCell>
                <TableCell rowSpan={2}>खाते प्रकार</TableCell>
                <TableCell rowSpan={2}>स्त्री /पुरुष</TableCell>
                <TableCell rowSpan={2}>अ.पा.क/ ए.कू.मॅ.</TableCell>
                <TableCell rowSpan={2}>जन्म दिनांक</TableCell>
                <TableCell rowSpan={2}>अ.पा.क</TableCell>
                <TableCell rowSpan={2}>नावे क्षेत्र (चौ.मी.)</TableCell>
                <TableCell rowSpan={2}>ताबा क्षेत्र (चौ.मी.)</TableCell>
                <TableCell rowSpan={2}>ताबा पावती घेणाऱ्याचा पत्ता</TableCell>
                <TableCell rowSpan={2}>कृती करा</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>पहिले नाव</TableCell>
                <TableCell>मधले नाव</TableCell>
                <TableCell>आडनाव</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>हवेली</TableCell>
                <TableCell>व्यक्ति</TableCell>
                <TableCell>तुषार</TableCell>
                <TableCell>नानासाहेब</TableCell>
                <TableCell>शिंदे</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Single Holder</TableCell>
                <TableCell>व्यक्ति</TableCell>
                <TableCell>पुरुष</TableCell>
                <TableCell>25/05/1986</TableCell>
                <TableCell>28/01/1887</TableCell>
                <TableCell>-</TableCell>
                <TableCell>40</TableCell>
                <TableCell>20</TableCell>
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

export default TabaPavtiGhenar;
