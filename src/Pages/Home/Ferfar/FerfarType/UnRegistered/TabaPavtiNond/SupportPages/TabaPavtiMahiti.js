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
import styles from "../../../../ferfar.module.css";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";

const TabaPavtiMahiti = ({ setActiveStep }) => {
  const [suffix, setSuffix] = useState("shree");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    pavtiNo: "",
    pavtiDate: "",
    remarks: "",
  });

  const handleSuffix = (e) => {
    setSuffix(e?.target?.value);
    // setUserNoMhProp({ ...userNoMhProp, suffix: e?.target?.value });
  };

  const handleUserDetails = (e) => {
    const { name, value } = e?.target;
    setUserDetails({ ...userDetails, [name]: value });
    // setUserNoMhProp({ ...userNoMhProp, [name]: value });
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
              ताबा पावती माहिती
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container justifyContent="space-between" alignItems="end">
              <Grid item md={2}>
                <InputLabel className={styles.inputlabel}>
                  <b>ताबा पावती घेणार प्रतिनिधी </b>
                  <span>*</span>
                </InputLabel>
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
          </Grid>

          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>ताबापावती क्रं. </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  fullWidth
                  value={userDetails?.pavtiNo}
                  name="pavtiNo"
                  onChange={(e) => handleUserDetails(e)}
                  size="small"
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>ताबापावती दि. </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  fullWidth
                  type="date"
                  value={userDetails?.pavtiDate}
                  name="pavtiDate"
                  onChange={(e) => handleUserDetails(e)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={6}>
            <InputLabel className={styles.inputlabel}>
              <b>शेरा </b>
            </InputLabel>
            <TextField
              fullWidth
              value={userDetails?.remarks}
              name="remarks"
              multiline
              rows={3}
              onChange={(e) => handleUserDetails(e)}
              size="small"
            />
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
                onClick={() => setActiveStep(3)}
              >
                जतन करा
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item md={12} mt={3}>
        <TableContainer component={Paper} elevation={5}>
          <h3 style={{ marginLeft: 20 }}>ताबा पावती माहिती तक्ता</h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>पहिले नाव</TableCell>
                <TableCell>मधले नाव</TableCell>
                <TableCell>आड नाव</TableCell>
                <TableCell>ताबापावती क्रं.</TableCell>
                <TableCell>ताबापावती दि.</TableCell>
                <TableCell>शेरा</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>224564</TableCell>
                <TableCell>22/04/2024</TableCell>
                <TableCell>-</TableCell>
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

export default TabaPavtiMahiti;
