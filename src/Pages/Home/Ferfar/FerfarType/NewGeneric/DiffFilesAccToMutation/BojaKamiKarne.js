import {
  Box,
  Button,
  Checkbox,
  Grid,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import { useState } from "react";

const BojaKamiKarne = () => {
  const { sendRequest } = AxiosInstance();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");

  const [userDataArr, setUserDataArr] = useState([
    {
      entryDate: "22/10/2025",
      mutationNo: 12,
      mutationDate: "12/11/2025",
      entryDetails:
        "Details of mutation taken on this property card shown here",
      regDoc: "Haveli 26 23/2020,24/01/2020",
      signAuthority: "CTSO Pune 1",
    },
    {
      entryDate: "11/10/2025",
      mutationNo: 11,
      mutationDate: "1/11/2025",
      entryDetails:
        "Details of mutation taken on this property card shown here",
      regDoc: "Haveli 28 23/2020,24/01/2020",
      signAuthority: "CTSO Pune 1",
    },
    {
      entryDate: "22/08/2025",
      mutationNo: 10,
      mutationDate: "12/09/2025",
      entryDetails:
        "Details of mutation taken on this property card shown here",
      regDoc: "Haveli 22 23/2020,24/01/2020",
      signAuthority: "CTSO Pune 1",
    },
  ]);
  return (
    <>
      <Paper elevation={5} sx={{ p: 2, mt: 2 }} className="papermain">
        <Grid container spacing={1}>
          <Grid item md={12}>
            <h4 className="heading">
              गहाण खतानुसार तारण परत/ बोजा कमी करणे नोंद
            </h4>
          </Grid>
          <Grid item md={12}>
            <Grid container spacing={2}>
              <Grid item md={2}>
                <InputLabel className="inputlabel">
                  <b>Search By Entry Date</b>
                </InputLabel>
                <TextField
                  fullWidth
                  type="date"
                  className="textfield"
                  value={selectedDate}
                  onFocus={(event) => {
                    event.target.showPicker();
                  }}
                  inputProps={{
                    max: today,
                    min: "1900-01-01",
                  }}
                  onChange={(e) => setSelectedDate(e?.target?.value)}
                  size="small"
                />
              </Grid>
              <Grid item md={2}>
                <InputLabel className="inputlabel">&nbsp;</InputLabel>
                <Button>Search Entry</Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12}>
            <Paper elevation={5}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell>
                        <b>Sr No</b>
                      </TableCell>
                      <TableCell>
                        <b>Entry Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Mutation Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Mutation Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Entry Details</b>
                      </TableCell>
                      <TableCell>
                        <b>Register Document</b>
                      </TableCell>
                      <TableCell>
                        <b>Signing Authority</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDataArr.map((row, i) => {
                      // const uniqueKey = `${row.mutation_srno}-${row.owner_number}`;
                      // const isChecked = selectedRows.includes(uniqueKey);
                      return (
                        <TableRow key={i}>
                          <TableCell padding="checkbox">
                            <Checkbox
                            // checked={isChecked}
                            // onChange={() =>
                            //   handleSelectRow(
                            //     row.mutation_srno,
                            //     row.owner_number
                            //   )
                            // }
                            />
                          </TableCell>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{row.entryDate}</TableCell>
                          <TableCell>{row.mutationNo}</TableCell>
                          <TableCell>{row.mutationDate}</TableCell>
                          <TableCell>{row.entryDetails}</TableCell>
                          <TableCell>{row.regDoc}</TableCell>
                          <TableCell>{row.signAuthority}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  mr: 2,
                  pb: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handleSelected}
                >
                  जतन करा
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default BojaKamiKarne;
