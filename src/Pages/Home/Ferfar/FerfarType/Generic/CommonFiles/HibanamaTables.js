import React, { useState } from "react";
import {
    Grid,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShowAddress from "./SupportPagesGhenar/ShowAddress";

const HibanamaTables = ({ applicationData, denarData, ghenarData }) => {
    const [open, setOpen] = useState(false);
    const [addVal, setAddVal] = useState({});

    const showAddress = (val) => {
        setOpen(true);
        setAddVal(val?.address);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };


    return (
        <>

            <Dialog onClose={handleDialogClose} open={open} maxWidth="md">
                <DialogTitle sx={{ m: 0, p: 3 }}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 4,
                            top: 4,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ShowAddress address={addVal} />
                </DialogContent>
            </Dialog>
            <Grid item md={12}>
                <TableContainer component={Paper} elevation={5}>
                    <h3 style={{ marginLeft: 20 }}>देणार माहिती तक्ता</h3>
                    <Table>
                        <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                            <TableRow>
                                <TableCell>अ. क्र.</TableCell>
                                <TableCell>
                                    जिल्हा / तालुका / न. भू. कार्यालय / गांव
                                </TableCell>
                                <TableCell>देणाराचे नाव</TableCell>
                                <TableCell>अर्जमधील न. भू. क्र.</TableCell>
                                <TableCell>Sub Property No.</TableCell>
                                <TableCell>फेरफारासाठी मिळकत</TableCell>
                                <TableCell>अर्जामध्ये नमूद मिळकत</TableCell>
                                <TableCell>LR-Property UID</TableCell>
                                <TableCell>मिळकत पत्रिके प्रमाणे क्षेत्र (चौ.मी.)</TableCell>
                                <TableCell>देणाऱ्याच्या नावे क्षेत्र (चौ.मी.)</TableCell>
                                <TableCell>फेरफारासाठी दिलेले क्षेत्र (चौ.मी.)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(denarData) &&
                                denarData.map((val, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                {applicationData?.district_name_in_marathi} /{" "}
                                                {applicationData?.taluka_name} /{" "}
                                                {applicationData?.village_name}
                                            </TableCell>
                                            <TableCell>
                                                {val?.first_name} {val?.middle_name} {val?.last_name}
                                            </TableCell>
                                            <TableCell>{val?.cts_number}</TableCell>
                                            <TableCell>{val?.subPropNo}</TableCell>
                                            <TableCell>
                                                {val?.milkat == "land"
                                                    ? "भूखंड / जमीन (प्लॉट)"
                                                    : "अपार्टमेंट"}
                                            </TableCell>
                                            <TableCell>{val?.namud}</TableCell>
                                            <TableCell>{val?.lrPropertyUID}</TableCell>
                                            <TableCell>{val?.actualArea}</TableCell>
                                            <TableCell>
                                                {val?.areaForMutation?.availableArea}
                                            </TableCell>
                                            <TableCell>
                                                {val?.areaForMutation?.mutationArea}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item md={12} mt={3}>
                <TableContainer component={Paper} elevation={5}>
                    <h3 style={{ marginLeft: 20 }}>घेणारा माहिती तक्ता</h3>
                    <Table>
                        <TableHead style={{ backgroundColor: "#F4F4F4" }}>
                            <TableRow>
                                <TableCell>अ. क्र.</TableCell>
                                <TableCell>जिल्हा / तालुका / न. भू. कार्यालय / गांव</TableCell>
                                <TableCell>घेणाराचा प्रकार</TableCell>
                                <TableCell>घेणाऱ्याचे नाव</TableCell>
                                <TableCell>उर्फ नाव</TableCell>
                                <TableCell>धारक प्रकार</TableCell>
                                <TableCell>स्त्री /पुरुष</TableCell>
                                <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                                <TableCell>जन्म दिनांक</TableCell>
                                <TableCell>घेणाऱ्याचा पत्ता</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(ghenarData) &&
                                ghenarData.map((val, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                {applicationData?.district_name_in_marathi} /{" "}
                                                {applicationData?.taluka_name} /{" "}
                                                {applicationData?.village_name}
                                            </TableCell>
                                            <TableCell>{val?.userType}</TableCell>
                                            <TableCell>{val?.fullNameInMarathi}</TableCell>
                                            <TableCell>
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.aliceName
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.holderType
                                                        ?.owner_status_description
                                                    : val?.dharak?.companydharak?.holderType
                                                        ?.owner_status_description}
                                            </TableCell>

                                            <TableCell>
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.gender?.gender_description
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.aapakDropdown
                                                        ?.apk_description
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.dob
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => showAddress(val)}
                                                >
                                                    पत्ता पहा
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
};

export default HibanamaTables;