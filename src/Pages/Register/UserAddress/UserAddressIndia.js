import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { errorToast, successToast, Toast } from "../../../ui/Toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  buildingNameValidationSchema,
  landmarkValidationSchema,
  pincodeValidationSchema,
  plotNoValidationSchema,
  postofficeValidationSchema,
} from "../../../Validations/yupValidations";
import RegistrationInstance from "../../../Instance/RegisterInstance";
import URLS from "../../../URLs/url";

const UserAddressIndia = ({ indiaAddress, setIndiaAdress, setIsValid }) => {
  const { sendRequest } = RegistrationInstance();
  const [indAddress, setIndAddress] = useState({
    plotNo: "",
    building: "",
    mainRoad: "",
    impSymbol: "",
    area: "",
    pincode: "",
    postOfficeName: "",
    city: "",
    taluka: "",
    district: "",
    state: "",
    addressProofName: "",
    addressProofSrc: "",
  });
  const [postOffice, setPostOffice] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [addressProofError, setAddressProofError] = useState("");

  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        // plotNo: plotNoValidationSchema,
        // building: buildingNameValidationSchema,
        // pincode: pincodeValidationSchema,
        // postOffice: postofficeValidationSchema,
        // landmark: landmarkValidationSchema,
      })
    ),
  });

  const handleBlur = async (name) => {
    await trigger(name);
  };

  const handleIndiaAddressDetails = (e) => {
    const { name, value } = e?.target;
    // setIndAddress({ ...indAddress, [name]: value });
    // setIndiaAdress({ ...indiaAddress, [name]: value });

    // const filteredValue = value.replace(/[^a-zA-Z0-9\s,]/g, "").slice(0, 100);

    const filteredValue = value
      .replace(/[^\u0900-\u097Fa-zA-Z0-9\s,]/g, "") // Removes symbols, emojis, etc.
      .replace(/[०-९]/g, "") // Removes Marathi (Devanagari) digits
      .slice(0, 100);

    setIndAddress({ ...indAddress, [name]: filteredValue });
    setIndiaAdress({ ...indiaAddress, [name]: filteredValue });
  };

  const handleChangePost = (e) => {
    const selectedPostOffice = e?.target?.value;
    const obj = postOffice.find((u) => u.Name == selectedPostOffice);
    setSelectedPost(obj);
    setIndAddress({
      ...indAddress,
      postOfficeName: obj?.Name,
      city: obj?.Name,
      taluka: obj?.Block,
      district: obj?.District,
      state: obj?.State,
    });
    setIndiaAdress({
      ...indiaAddress,
      postOfficeName: obj?.Name,
      city: obj?.Name,
      taluka: obj?.Block,
      district: obj?.District,
      state: obj?.State,
    });
  };

  const handlePincodeChange = (event) => {
    // const { value } = event.target;
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, "");
    if (input.length > 6) {
      input = input.slice(0, 6);
    }
    setIndAddress({ ...indAddress, pincode: input });
    setIndiaAdress({ ...indiaAddress, pincode: input });

    if (input.length === 6) {
      axios
        .get(`https://api.postalpincode.in/pincode/${input}`)
        .then((res) => {
          if (res?.data[0].Status == "Success") {
            setPostOffice(res?.data[0]?.PostOffice);
            setShowPostDropdown(true);
            successToast("Post Office Fetched !!");
          } else {
            setShowPostDropdown(false);
            errorToast("Invalid Post Office");
          }
        })
        .catch((err) => {
          console.error(err);
          sendRequest(
            `${URLS?.BaseURL}/EPCISAPIS/GetPincode`,
            "POST",
            input,
            (res) => {
              if (res?.Code == "1") {
                successToast(res?.Message);
                setPostOffice(res?.ResponseData);
                setShowPostDropdown(true);
              } else {
                errorToast(res?.Message);
              }
            },
            (err) => {
              errorToast(err?.data?.message);
            }
          );
        });
    } else {
      setPostOffice([]);
      setSelectedPost({});
      setShowPostDropdown(false);
    }

    // if (input.length === 6) {
    //   sendRequest(
    //     `${URLS?.BaseURL}/EPCISAPIS/GetPincode`,
    //     "POST",
    //     input,
    //     (res) => {
    //       if (res?.Code == "1") {
    //         successToast(res?.Message);
    //         setPostOffice(res?.ResponseData);
    //         setShowPostDropdown(true);
    //       } else {
    //         errorToast(res?.Message);
    //       }
    //     },
    //     (err) => {
    //       errorToast(err?.data?.message);
    //     }
    //   );
    // } else {
    //   setPostOffice([]);
    //   setSelectedPost({});
    //   setShowPostDropdown(false);
    // }
  };

  const handleAddressProofFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setAddressProofError("पत्त्याचा पुराव्याची साइज 256kb च्या वर आहे");
        setIndAddress({
          ...indAddress,
          addressProofName: "",
          addressProofSrc: "",
        });
        setIndiaAdress({
          ...indiaAddress,
          addressProofName: "",
          addressProofSrc: "",
        });
      } else {
        setAddressProofError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setIndAddress({
            ...indAddress,
            addressProofSrc: reader.result,
            addressProofName: file.name,
          });
          setIndiaAdress({
            ...indiaAddress,
            addressProofSrc: reader.result,
            addressProofName: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setAddressProofError("");
      setIndAddress({
        ...indAddress,
        addressProofName: "",
        addressProofSrc: "",
      });
      setIndiaAdress({
        ...indiaAddress,
        addressProofName: "",
        addressProofSrc: "",
      });
    }
  };

  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserIndAddress: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      <Grid item md={12}>
        <Grid container spacing={2}>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>सदनिका / घर /प्लॉट नं. </b>
            </InputLabel>
            <TextField
              className="textfield"
              fullWidth
              size="small"
              value={indAddress?.plotNo}
              name="plotNo"
              placeholder="कृष्णकुंज"
              onChange={handleIndiaAddressDetails}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>इमारत / सोसायटी क्रमांक किंवा नाव </b>
            </InputLabel>
            <TextField
              className="textfield"
              fullWidth
              value={indAddress?.building}
              name="building"
              placeholder="इमारत"
              onChange={handleIndiaAddressDetails}
              size="small"
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>मुख्य रस्ता</b>
            </InputLabel>
            <TextField
              className="textfield"
              fullWidth
              value={indAddress?.mainRoad}
              name="mainRoad"
              placeholder="डी. पी. रोड  "
              onChange={(e) => handleIndiaAddressDetails(e)}
              size="small"
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>महत्त्वाची खूण </b>
            </InputLabel>
            <TextField
              className="textfield"
              fullWidth
              value={indiaAddress?.impSymbol}
              name="impSymbol"
              placeholder="न्यू इंग्लिश स्कूल बावधन"
              size="small"
              onChange={handleIndiaAddressDetails}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>परिसर / गावाचे नाव / वाडी</b>
            </InputLabel>
            <TextField
              className="textfield"
              fullWidth
              value={indAddress?.area}
              name="area"
              placeholder="न्यू इंग्लिश स्कूल बावधन"
              onChange={(e) => handleIndiaAddressDetails(e)}
              size="small"
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item md={3}>
            <InputLabel className="inputlabel">
              <b>पिन कोड </b>
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="pincode"
              type="number"
              className="textfield"
              value={indAddress?.pincode}
              onChange={handlePincodeChange}
            />
            <FormHelperText>
              अंक मराठी मध्ये नसावे. Please use english numbers.
            </FormHelperText>
            {/* <p    
              style={{     
                color: "#003366",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 400,
              }}
              onClick={() => console.log("Demographic called")}
            >
              Get Demographic Data
            </p> */}
          </Grid>
          {showPostDropdown && (
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>पोस्टऑफिस नाव </b>
              </InputLabel>
              <Select
                fullWidth
                className="textfield"
                size="small"
                value={indiaAddress?.postOffice}
                onChange={handleChangePost}
              >
                {Array.isArray(postOffice) &&
                  postOffice.map((val, i) => {
                    return (
                      <MenuItem key={i} value={val?.Name}>
                        {val?.Name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Grid>
          )}
        </Grid>
      </Grid>

      {selectedPost.Name && (
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>गाव/पेठ</b>
              </InputLabel>
              <TextField
                fullWidth
                value={selectedPost?.Name}
                className="textfieldDisabled"
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>तालुका</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={selectedPost?.Block}
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>जिल्हा</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={selectedPost?.District}
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>राज्य</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={selectedPost?.State}
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>पत्त्याचा पुरावा </b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                disabled
                value={indAddress?.addressProofName}
                name="area"
                size="small"
                error={addressProofError}
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
                          accept=".jpg,.jpeg,.png"
                          hidden
                          onChange={handleAddressProofFileChange}
                        />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              {addressProofError ? (
                <p style={{ color: "red", fontSize: "13px", marginTop: 3 }}>
                  {addressProofError}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: 3,
                  }}
                >
                  पत्त्याचा पुराव्याची साइज जास्तीत जास्त 256kb असावी व ती
                  JPG,JPEG,PNG स्वरूपात असावी.
                </p>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default UserAddressIndia;
