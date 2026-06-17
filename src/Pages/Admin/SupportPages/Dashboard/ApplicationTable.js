import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { errorToast } from "../../../../ui/Toast";
import AxiosInstance from "../../../../Instance/AxiosInstance";
import URLS from "../../../../URLs/url";

const ApplicationTable = ({ tableData, dates }) => {
  const { sendRequest } = AxiosInstance();
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

  const handleExcelDownload = (id) => {
    sendRequest(
      `${URLS?.BaseURL}/EPCISAPIS/exportStatusWiseExcel`,
      "POST",
      {
        fromDate: dates?.fromDate,
        toDate: dates?.toDate,
        region_code: dates?.division.toString(),
        district_code: dates?.district.toString(),
        office_code: dates?.taluka,
        statusId: id,
      },
      (res) => {
        const byteCharacters = atob(res.FileContents);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: res.ContentType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = res.FileDownloadName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  return (
    <TableContainer component={Paper} elevation={5} sx={{ mt: 3, p: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell style={tableCellStyle} rowSpan={2}>
              Partially Submitted / Pending in Citizen Login
            </TableCell> */}
            {/* <TableCell style={tableCellStyle} rowSpan={2}>
              Inward Number Error
            </TableCell> */}

            <TableCell style={tableCellStyle} colSpan={5}>
              Application submitted
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Inward Number Error</span>
                <Tooltip title="Download Inward No. Error Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("15")}
                    disabled={tableData?.Inward_Number_Error === 0}
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>

            <TableCell style={tableCellStyle} rowSpan={2}>
              Total
            </TableCell>
          </TableRow>

          <TableRow>
            {/* <TableCell style={tableCellStyle}>
            Application Submitted to EPCIS (In-Progress)
            </TableCell>
            <TableCell style={tableCellStyle}>Truti Patra Generated</TableCell>
            <TableCell style={tableCellStyle}>Notice 9 Generated</TableCell>
            <TableCell style={tableCellStyle}>Application Rejected</TableCell>
            <TableCell style={tableCellStyle}>Nikali Patra Generated</TableCell> */}
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Application Submitted to EPCIS (In-Progress)</span>
                <Tooltip title="Download Application Submitted to EPCIS (In-Progress) Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("10")}
                    disabled={
                      tableData?.Application_is_submitted_to_EPCIS === 0
                    }
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Truti Patra Generated</span>
                <Tooltip title="Download Truti Patra Genarated Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("11")}
                    disabled={tableData?.Truti_Patra_is_generated === 0}
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Notice 9 Generated</span>
                <Tooltip title="Download Notice 9 Genarated Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("14")}
                    disabled={tableData?.Notice_9_is_generated === 0}
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Application Rejected</span>
                <Tooltip title="Download Application Rejected Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("12")}
                    disabled={tableData?.Application_is_rejected === 0}
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell style={tableCellStyle} rowSpan={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span>Nikali Patra Generated</span>
                <Tooltip title="Download Nikali Patra Genarated Excel">
                  <IconButton
                    color="info"
                    onClick={() => handleExcelDownload("13")}
                    disabled={tableData?.Nikali_Patra_is_generated === 0}
                  >
                    <DownloadRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
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

export default ApplicationTable;
