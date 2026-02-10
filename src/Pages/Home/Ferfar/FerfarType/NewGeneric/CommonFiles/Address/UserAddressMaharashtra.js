import { useEffect, useState } from "react";
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
import URLS from "../../../../../../../URLs/url";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { errorToast, successToast } from "../../../../../../../ui/Toast";
import {
  landmarkValidationSchema,
  mobileValidationSchema,
  pincodeValidationSchema,
  plotNoValidationSchema,
  postofficeValidationSchema,
} from "../../../../../../../Validations/yupValidations";
import VerifyOtpInstance from "../../../../../../../Instance/VerifyOtpInstance";
import RegistrationInstance from "../../../../../../../Instance/RegisterInstance";

const UserAddressMaharashtra = ({
  hasSignature,
  indiaAddress,
  setIndiaAdress,
  setIsValid,
  isReset,
  isMobileCompulsary,
  isEdit,
  setIsMobileNoVerified,
}) => {
  const { sendRequestVerify } = VerifyOtpInstance();
  const { sendRequest } = RegistrationInstance();
  const [editFields, setEditFields] = useState(false);
  const [postOffice, setPostOffice] = useState([]);
  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [showPostFields, setShowPostFields] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [addressProofError, setAddressProofError] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const {
    control,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        plotNo: plotNoValidationSchema,
        impSymbol: landmarkValidationSchema,
        mobile: isMobileCompulsary
          ? mobileValidationSchema
          : yup.string().notRequired(),
        pincode: pincodeValidationSchema,
        postOffice: postofficeValidationSchema,
      })
    ),
    defaultValues: {
      plotNo: "",
      impSymbol: "",
      mobile: "",
      pincode: "",
      postOffice: "",
    },
  });
  const handleBlur = async (name) => {
    await trigger(name);
  };
  const handleIndiaAddressDetails = (e) => {
    const { name, value } = e?.target;
    const filteredValue = value
      .replace(/[^\u0900-\u097Fa-zA-Z0-9\s,]/g, "")
      .replace(/[०-९]/g, "")
      .slice(0, 100);
    setIndiaAdress({ ...indiaAddress, [name]: filteredValue });
  };

  const sendMobileOtp = () => {
    sendRequestVerify(
      `${URLS?.BaseURL}/ApplicationAPIS/RequestOTPForApp`,
      "POST",
      indiaAddress?.mobile,
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
        } else {
          console.error(res?.Message);
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleMobileOTP = (e) => {
    setMobileOTP(e?.target?.value);
  };
  const verifyMobileOtp = () => {
    sendRequestVerify(
      `${URLS?.BaseURL}/ApplicationAPIS/VerifyOTPForApp`,
      "POST",
      {
        mobileno: indiaAddress?.mobile,
        otp: parseInt(mobileOTP),
      },
      (res) => {
        if (res?.Code == "1") {
          successToast(res?.Message);
          setIsMobileVerified(true);
          setIsMobileNoVerified(true);
        } else {
          console.error(res?.Message);
          errorToast(res?.Message);
        }
      },
      (err) => {
        errorToast(err?.Message);
      }
    );
  };
  const handleChangePost = (e) => {
    const selectedPostOffice = e?.target?.value;
    const obj = postOffice.find((u) => u.Name == selectedPostOffice);
    setSelectedPost(obj);
    setShowPostFields(true);
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
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, "");
    if (input.length > 6) {
      input = input.slice(0, 6);
    }
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
            errorToast("Invalid Post Office");
            setShowPostDropdown(false);
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
      setShowPostFields(false);
    }
  };
  const handleAddressProofFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 256 * 1024) {
        // 256 KB = 256 * 1024 bytes
        setAddressProofError("पत्त्याचा पुराव्याची साइज 256kb च्या वर आहे");
        setIndiaAdress({
          ...indiaAddress,
          addressProofName: "",
          addressProofSrc: "",
        });
      } else {
        setAddressProofError("");
        const reader = new FileReader();
        reader.onloadend = () => {
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
      setIndiaAdress({
        ...indiaAddress,
        addressProofName: "",
        addressProofSrc: "",
      });
    }
  };
  const handleReset = () => {
    reset();
    setEditFields(false);
    setShowPostDropdown(false);
    setShowPostFields(false);
    setPostOffice([]);
    setSelectedPost({});
    setMobileOTP("");

    setIndiaAdress({
      plotNo: "",
      building: "",
      mainRoad: "",
      impSymbol: "",
      area: "",
      mobile: "",
      mobileOTP: "yes",
      pincode: "",
      postOfficeName: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      addressProofName: "",
      addressProofSrc: "",
      signatureName: "",
      signatureSrc: "",
    });
  };
  useEffect(() => {
    if (isEdit) {
      setEditFields(true);
      // setShowPostFields(true);
      setValue("plotNo", indiaAddress?.plotNo);
      setValue("impSymbol", indiaAddress?.impSymbol);
      setValue("pincode", indiaAddress?.pincode);
      setValue("postOffice", indiaAddress?.postOfficeName);
      setValue("mobile", indiaAddress?.mobile);
    }
  }, [isEdit]);
  useEffect(() => {
    handleReset();
  }, [isReset]);
  useEffect(() => {
    setIsValid((prev) => ({
      ...prev,
      triggerUserIndAdd: trigger,
    }));
  }, [trigger, setIsValid]);
  return (
    <>
      {editFields && (
        <Grid item md={12} mt={1} mb={1}>
          <Button
            onClick={handleReset}
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
          >
            पत्त्यात बदल करा
          </Button>
        </Grid>
      )}

      <Grid item md={12}>
        {editFields ? (
          <Grid container spacing={2}>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>सदनिका / घर /प्लॉट नं. </b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                disabled
                fullWidth
                value={indiaAddress?.plotNo}
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>इमारत / सोसायटी क्रमांक किंवा नाव </b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                disabled
                fullWidth
                value={indiaAddress?.building}
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>मुख्य रस्ता</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                disabled
                fullWidth
                value={indiaAddress?.mainRoad}
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>महत्त्वाची खूण </b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                disabled
                fullWidth
                size="small"
                value={indiaAddress?.impSymbol}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={3}>
              <Controller
                name="plotNo"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>सदनिका / घर /प्लॉट नं. </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      size="small"
                      fullWidth
                      name="plotNo"
                      value={indiaAddress?.plotNo}
                      placeholder="कृष्णकुंज"
                      error={errors.plotNo}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   handleIndiaAddressDetails(e);
                      // }}
                      onChange={(e) => {
                        // const filteredValue = e.target.value
                        //   .replace(/[^a-zA-Z0-9\s,]/g, "")
                        //   .slice(0, 100);
                        const filteredValue = e.target.value
                          .replace(/[^\u0900-\u097Fa-zA-Z0-9\s,]/g, "")
                          .replace(/[०-९]/g, "")
                          .slice(0, 100);
                        handleIndiaAddressDetails({
                          target: { name: e.target.name, value: filteredValue },
                        });
                        field.onChange(filteredValue);
                      }}
                      onBlur={() => handleBlur("plotNo")}
                      inputProps={{ maxLength: 100 }}
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.plotNo && errors.plotNo.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel className="inputlabel">
                <b>इमारत (बिल्डिंग)/सोसायटी क्रमांक किंवा नाव</b>
              </InputLabel>
              <TextField
                className="textfield"
                size="small"
                fullWidth
                name="building"
                value={indiaAddress?.building}
                placeholder="इमारत"
                onChange={handleIndiaAddressDetails}
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
                value={indiaAddress?.mainRoad}
                name="mainRoad"
                placeholder="डी. पी. रोड  "
                onChange={(e) => handleIndiaAddressDetails(e)}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item md={3}>
              <Controller
                name="impSymbol"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="inputlabel">
                      <b>महत्त्वाची खूण </b>
                      <span>*</span>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      fullWidth
                      value={indiaAddress?.impSymbol}
                      name="impSymbol"
                      placeholder="न्यू इंग्लिश स्कूल बावधन"
                      size="small"
                      error={errors.impSymbol}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   handleIndiaAddressDetails(e);
                      // }}
                      onChange={(e) => {
                        // const filteredValue = e.target.value
                        //   .replace(/[^a-zA-Z0-9\s,]/g, "")
                        //   .slice(0, 100);
                        const filteredValue = e.target.value
                          .replace(/[^\u0900-\u097Fa-zA-Z0-9\s,]/g, "")
                          .replace(/[०-९]/g, "")
                          .slice(0, 100);
                        handleIndiaAddressDetails({
                          target: { name: e.target.name, value: filteredValue },
                        });
                        field.onChange(filteredValue);
                      }}
                      onBlur={() => handleBlur("impSymbol")}
                      inputProps={{ maxLength: 100 }}
                    />
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.impSymbol && errors.impSymbol.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item md={12} mt={1}>
        <Grid container>
          <Grid item md={9}>
            {editFields ? (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>परिसर / गावाचे नाव / वाडी</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    value={indiaAddress?.area}
                    size="small"
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>मोबाईल</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    value={indiaAddress?.mobile}
                    size="small"
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>ओ. टी. पी</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    size="small"
                    value={indiaAddress?.mobileOTP}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>परिसर / गावाचे नाव / वाडी</b>
                  </InputLabel>
                  <TextField
                    className="textfield"
                    fullWidth
                    value={indiaAddress?.area}
                    name="area"
                    placeholder="न्यू इंग्लिश स्कूल बावधन"
                    onChange={(e) => handleIndiaAddressDetails(e)}
                    size="small"
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item md={4}>
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>मोबाईल </b>
                          {isMobileCompulsary ? <span>*</span> : <span></span>}
                        </InputLabel>
                        <TextField
                          className="textfield"
                          fullWidth
                          value={indiaAddress?.mobile}
                          disabled={isMobileVerified}
                          name="mobile"
                          type="number"
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            max: 9999999999,
                            onInput: (e) => {
                              if (e.target.value.length > 10) {
                                e.target.value = e.target.value.slice(0, 10);
                              }
                            },
                          }}
                          error={errors.mobile}
                          {...field}
                          onBlur={() => handleBlur("mobile")}
                          onChange={(e) => {
                            field.onChange(e);
                            handleIndiaAddressDetails(e);
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {isMobileCompulsary &&
                                  indiaAddress?.mobile.length > 9 && (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={sendMobileOtp}
                                      disabled={isMobileVerified}
                                    >
                                      ओ. टी. पी पाठवा
                                    </Button>
                                  )}
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.mobile && errors.mobile.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>
                {isMobileCompulsary && indiaAddress?.mobile.length > 9 && (
                  <Grid item md={4}>
                    <InputLabel className="inputlabel">
                      <b>ओ. टी. पी</b>
                    </InputLabel>
                    <TextField
                      className="textfield"
                      fullWidth
                      value={mobileOTP}
                      disabled={isMobileVerified}
                      name="mobileOTP"
                      size="small"
                      onChange={(e) => handleMobileOTP(e)}
                      type="number"
                      inputProps={{
                        maxLength: 6,
                        max: 999999,
                        onInput: (e) => {
                          if (e.target.value.length > 6) {
                            e.target.value = e.target.value.slice(0, 6);
                          }
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={verifyMobileOtp}
                              disabled={isMobileVerified}
                            >
                              पडताळणी करा
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            )}

            {editFields ? (
              <Grid container spacing={2} mt={1}>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>पिन कोड</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    value={indiaAddress?.pincode}
                    size="small"
                  />
                </Grid>
                <Grid item md={4}>
                  <InputLabel className="inputlabel">
                    <b>पोस्टऑफिस नाव</b>
                  </InputLabel>
                  <TextField
                    className="textfieldDisabled"
                    disabled
                    fullWidth
                    size="small"
                    value={indiaAddress?.postOfficeName}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} mt={1}>
                <Grid item md={4}>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputLabel className="inputlabel">
                          <b>पिन कोड </b>
                          <span>*</span>
                        </InputLabel>
                        <TextField
                          fullWidth
                          size="small"
                          name="pincode"
                          type="number"
                          className="textfield"
                          value={indiaAddress?.pincode}
                          {...field}
                          error={errors.pincode}
                          inputProps={{
                            maxLength: 6,
                            max: 999999,
                            onInput: (e) => {
                              if (e.target.value.length > 6) {
                                e.target.value = e.target.value.slice(0, 6);
                              }
                            },
                          }}
                          onBlur={() => handleBlur("pincode")}
                          onChange={(e) => {
                            field.onChange(e);
                            handlePincodeChange(e);
                          }}
                        />
                        <FormHelperText>
                          अंक मराठी मध्ये नसावे. Please use english numbers.
                        </FormHelperText>

                        <FormHelperText sx={{ color: "red" }}>
                          {errors.pincode && errors.pincode.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Grid>

                {showPostDropdown && (
                  <Grid item md={4}>
                    <Controller
                      name="postOffice"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel className="inputlabel">
                            <b>पोस्टऑफिस नाव </b>
                            <span>*</span>
                          </InputLabel>
                          <Select
                            fullWidth
                            className="textfield"
                            size="small"
                            value={indiaAddress?.postOffice}
                            error={errors.postOffice}
                            {...field}
                            onBlur={() => handleBlur("postOffice")}
                            onChange={(e) => {
                              field.onChange(e);
                              handleChangePost(e);
                            }}
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
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.postOffice && errors.postOffice.message}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {showPostFields && (
        <Grid item md={12} mt={2}>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <InputLabel>
                <b>गाव/पेठ</b>
              </InputLabel>
              <TextField
                className="textfieldDisabled"
                fullWidth
                value={selectedPost?.Name}
                disabled
                size="small"
              />
            </Grid>
            <Grid item md={3}>
              <InputLabel>
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
              <InputLabel>
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
              <InputLabel>
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
                value={indiaAddress?.addressProofName}
                name="area"
                error={addressProofError}
                disabled
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
                          // accept="image/*"
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

export default UserAddressMaharashtra;
