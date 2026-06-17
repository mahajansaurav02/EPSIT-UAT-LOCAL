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
  Typography,
} from "@mui/material";
import styles from "../../../../ferfar.module.css";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";

const SattaPrakarMahiti = () => {
  const [isChange, setIsChange] = useState("");
  const [naBhu, setNaBhu] = useState("");
  const [sattaPrakar, setSattaPrakar] = useState("");
  const [newArea, setNewArea] = useState("");

  const handleNewArea = (e) => {
    setNewArea(e?.target?.value);
  };
  const handleSattaPrakar = (e) => {
    setSattaPrakar(e?.target?.value);
  };
  const handleNaBhu = (e) => {
    setNaBhu(e?.target?.value);
  };
  const handleSattaPrakarChange = (e) => {
    setIsChange(e?.target?.value);
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
              सत्ताप्रकार माहिती
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>न.भू.क्र. क्रमांक निवडा </b>
                  <span>*</span>
                </InputLabel>
                <Select
                  value={naBhu}
                  onChange={handleNaBhu}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="1">480/20/121/52</MenuItem>
                  <MenuItem value="2">480/20/121/53</MenuItem>
                </Select>
              </Grid>
              <Grid item md={4}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <InputLabel className={styles.inputlabel}>
                      <b>सत्ताप्रकारात बदल आहे का ? </b>
                    </InputLabel>
                    <RadioGroup
                      row
                      onChange={handleSattaPrakarChange}
                      value={isChange}
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
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>जुना सत्ताप्रकार</b>
                </InputLabel>
                <TextField fullWidth value="नगरपरिषद" size="small" disabled />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>नवीन सत्ताप्रकार</b>
                </InputLabel>
                <Select
                  value={sattaPrakar}
                  onChange={handleSattaPrakar}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="1">महाराष्ट्र सरकार</MenuItem>
                  <MenuItem value="2">नगरपरिषद</MenuItem>
                  <MenuItem value="3">ग्रामपंचायत</MenuItem>
                  <MenuItem value="4">
                    भारतीय राष्ट्रीय राजमार्ग प्राधिकरण (NHAI)
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>नवीन क्षेत्र (चौ.मी)</b>
                </InputLabel>
                <TextField
                  fullWidth
                  value={newArea}
                  size="small"
                  onChange={handleNewArea}
                />
              </Grid>
            </Grid>
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
              <Button variant="contained" endIcon={<SaveRoundedIcon />}>
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>सत्ताप्रकार माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>न.भू.क्र.</TableCell>
                <TableCell>सत्ताप्रकारात बदल आहे का ?</TableCell>
                <TableCell>जुना सत्ताप्रकर</TableCell>
                <TableCell>नवीन सत्ताप्रकर</TableCell>
                <TableCell>नवीन क्षेत्र(चौ.मी)</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>485/20/121/52</TableCell>
                <TableCell>होय</TableCell>
                <TableCell>नगरपरिषद</TableCell>
                <TableCell>महाराष्ट्र सरकार</TableCell>
                <TableCell>42</TableCell>
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

export default SattaPrakarMahiti;
