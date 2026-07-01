import React, { useEffect, useState } from "react";
import {
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TableContainer,
    Button,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
} from "@mui/material";
import AxiosInstance from "../../../../../../Instance/AxiosInstance";
import URLS from "../../../../../../URLs/url";
import { errorToast } from "../../../../../../ui/Toast";

const DenarGhenarTables = ({ applicationData }) => {
    const { sendRequest } = AxiosInstance();

    const applicationId = sessionStorage.getItem("applicationId");

    const [denarData, setDenarData] = useState([]);
    const [ghenarData, setGhenarData] = useState([]);
    const [denarCompleted, setDenarCompleted] = useState(false);
    const [ghenarCompleted, setGhenarCompleted] = useState(false);

    useEffect(() => {
        getDenarTable();
        getGhenarTable();
    }, [applicationId]);

    const getDenarTable = () => {
        sendRequest(
            `${URLS.BaseURL}/MutationAPIS/GetGenericNondForGiver`,
            "POST",
            applicationId,
            (res) => {
                if (res?.Code === "1") {
                    setDenarData(res.ResponseData);
                    setDenarCompleted(true);
                } else {
                    setDenarData([]);
                }
            },
            (err) => errorToast(err?.Message)
        );
    };

    const getGhenarTable = () => {
        sendRequest(
            `${URLS.BaseURL}/MutationAPIS/GetGenericNondTakerInfo`,
            "POST",
            applicationId,
            (res) => {
                if (res?.Code === "1") {
                    setGhenarData(res.ResponseData);
                    setGhenarCompleted(true);
                } else {
                    setGhenarData([]);
                }
            },
            (err) => errorToast(err?.Message)
        );
    };

    useEffect(() => {

        const completed =
            denarData.length > 0 &&
            ghenarData.length > 0;

        sessionStorage.setItem(
            "allowPoa",
            completed ? "yes" : "no"
        );

        window.dispatchEvent(new Event("storage"));

    }, [denarData, ghenarData]);

    return (
        <>
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
                                <TableCell>भरलेली माहिती</TableCell>
                                <TableCell>कृती करा</TableCell>
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
                                <TableCell>घेणाऱ्याचा पत्ता</TableCell>
                                <TableCell>उर्फ नाव</TableCell>
                                <TableCell>धारक प्रकार</TableCell>
                                <TableCell>स्त्री /पुरुष</TableCell>
                                <TableCell>अ.पा.क/ ए.कू.मॅ.</TableCell>
                                <TableCell>जन्म दिनांक</TableCell>
                                <TableCell>अ.पा.क</TableCell>
                                <TableCell>कृती करा</TableCell>
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
                                                {val?.userType == "व्यक्ती"
                                                    ? val?.dharak?.userdharak?.aapak
                                                    : "-"}
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

export default DenarGhenarTables;