import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
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
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import styles from "../../../../ferfar.module.css";

const WaqfBoardTransfer = ({ setActiveStep }) => {
  const [waqfTransfer, setWaqfTransfer] = useState({
    permissionNo: "",
    permissionDate: "",
    addressProofName: "",
    addressProofSrc: "",
  });
  const [addressProofError, setAddressProofError] = useState("");

  const handleWaqfTransfer = (e) => {
    const { name, value } = e?.target;
    setWaqfTransfer({ ...waqfTransfer, [name]: value });
  };

  const handleAddressProofFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setAddressProofError("File should be less than 256 KB");
        setWaqfTransfer({
          ...waqfTransfer,
          addressProofName: "",
          addressProofSrc: "",
        });
      } else {
        setAddressProofError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setWaqfTransfer({
            ...waqfTransfer,
            addressProofSrc: reader.result,
            addressProofName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setAddressProofError("");
      setWaqfTransfer({
        ...waqfTransfer,
        addressProofName: "",
        addressProofSrc: "",
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
              वक्फ बोर्डाची हस्तांतरणाची परवानगी
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>परवानगी क्रमांक </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  name="permissionNo"
                  value={waqfTransfer?.permissionNo}
                  onChange={handleWaqfTransfer}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>परवानगी दिनांक </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="permissionDate"
                  value={waqfTransfer?.permissionDate}
                  onChange={handleWaqfTransfer}
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel className={styles.inputlabel}>
                  <b>परवानगी कागदपत्र </b>
                  <span>*</span>
                </InputLabel>
                <TextField
                  className={styles.textfield}
                  fullWidth
                  value={waqfTransfer?.addressProofName}
                  name="area"
                  error={addressProofError}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          variant="contained"
                          component="label"
                          startIcon={<CloudUploadRoundedIcon />}
                        >
                          अपलोड करा
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAddressProofFileChange}
                          />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {addressProofError && addressProofError}
                </FormHelperText>
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
          <h3 style={{ marginLeft: 20 }}>
            वक्फ बोर्डाची हस्तांतरणाची परवानगी माहिती तक्ता
          </h3>
          <Table>
            <TableHead style={{ backgroundColor: "#F4F4F4" }}>
              <TableRow>
                <TableCell>अ. क्र.</TableCell>
                <TableCell>परवानगी क्रमांक</TableCell>
                <TableCell>परवानगी दिनांक</TableCell>
                <TableCell>परवानगी कागदपत्र</TableCell>
                <TableCell>कृती करा</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2245</TableCell>
                <TableCell>25/08/2023</TableCell>
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

export default WaqfBoardTransfer;
