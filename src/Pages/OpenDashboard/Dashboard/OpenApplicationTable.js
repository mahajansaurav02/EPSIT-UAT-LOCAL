import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

const OpenApplicationTable = ({ tableData }) => {
  const tableCellStyle = {
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#F4F4F4",
    border: "1px solid #000000",
  };
  const tableCellStyleInBody = {
    textAlign: "center",
    border: "1px solid #000000",
  };
  const tableCellStyleInFooter = {
    textAlign: "center",
    border: "1px solid #000000",
    fontWeight: 700,
    color: "#2a1010",
    fontSize: "1.2em",
  };
  return (
    <TableContainer component={Paper} elevation={5} sx={{ mt: 3, p: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell style={tableCellStyle} rowSpan={2}>
              Partially Submitted / Pending in Citizen Login
            </TableCell> */}
            <TableCell style={tableCellStyle} colSpan={5}>
              Application submitted
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              Inward Number Error
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              Total
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={tableCellStyle}>
              Application Submitted to EPCIS (In-Progress)
            </TableCell>
            <TableCell style={tableCellStyle}>Truti Patra Generated</TableCell>
            <TableCell style={tableCellStyle}>Notice 9 Generated</TableCell>
            <TableCell style={tableCellStyle}>Application Rejected</TableCell>
            <TableCell style={tableCellStyle}>Nikali Patra Generated</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            {/* <TableCell style={tableCellStyleInBody}>
              {tableData?.Partially_Submitted_Pending}
            </TableCell> */}
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Application_is_submitted_to_EPCIS}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Truti_Patra_is_generated}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Notice_9_is_generated}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Application_is_rejected}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Nikali_Patra_is_generated}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.Inward_Number_Error}
            </TableCell>
            <TableCell style={tableCellStyleInBody}>
              {tableData?.total - tableData?.Partially_Submitted_Pending}
            </TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            {/* <TableCell style={tableCellStyleInFooter}>
              {tableData?.Partially_Submitted_Pending}
            </TableCell> */}
            <TableCell style={tableCellStyleInFooter} colSpan={5}>
              {tableData?.Application_is_submitted_to_EPCIS +
                tableData?.Notice_9_is_generated +
                tableData?.Truti_Patra_is_generated +
                tableData?.Application_is_rejected +
                tableData?.Nikali_Patra_is_generated}
            </TableCell>
            <TableCell style={tableCellStyleInFooter}>
              {tableData?.Inward_Number_Error}
            </TableCell>
            <TableCell style={tableCellStyleInFooter}>
              {tableData?.total - tableData?.Partially_Submitted_Pending}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OpenApplicationTable;
