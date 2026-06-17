import React, { useEffect, useState } from "react";
import {
  Alert,
  Chip,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserLogin from "./UserLogin";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../Redux/slices/LanguageSlice";
import Header from "../../ui/Header";
import InfoIcon from "@mui/icons-material/Info";
import FAQChatBotTrial from "../../ui/ChatBot/FaqChatBotTrial";
import FaqChatbot from "../../ui/ChatbotDemo/FaqChatBot";
import FAQChatbot from "../../ui/ChatBot/FaqChatBot";

const loginLangage = {
  marathi: [
    "साईन ईन",
    "लॉगिन करण्याचा प्रकार :",
    "मोबाइल नंबर",
    "ईमेल",
    "तुमच्या नोंदणीकृत खात्यात साईन ईन करण्यासाठी तुमचा मोबाईल नंबर ऐंटर करा.",
    "ईप्सित यूजर आयडी",
    "तुमचा मोबाइल नं. टाका",
    "ईप्सित यूजर ईमेल आयडी",
    "तुमचा ईमेल आयडी टाका",
    "ओटीपी",
    "६ अंकी ओटीपी टाका",
    "ओटीपी मिळवा",
    "लॉगिन",
    "खाते नाही ?",
    "खाते बनवा",
    "आपले भारतात वास्तव्य आहे का?",
    "होय",
    "नाही",
    "ओटीपी पाठवत आहे",
  ],
  english: [
    "Sign In",
    "Login Type :",
    "Mobile Number",
    "Email",
    "Enter your mobile number to sign into your registered account.",
    "EPSIT User ID",
    "Enter your mobile No.",
    "EPSIT User Email ID",
    "Enter your email ID",
    "OTP",
    "Enter 6 digit OTP",
    "GET OTP",
    "LOG IN",
    "Don't have an account ?",
    "Create Account",
    "Do you live in India?",
    "Yes",
    "No",
    "Sending...",
  ],
};

const Login = () => {
  const reduxLang = useSelector(selectLanguage);
  const [lang, setlang] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setlang(reduxLang?.lng);
  }, [reduxLang]);
  return (
    <>
      <Header showSignInBtn={false} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: "url('/images/Dji_drone.jpg')",
          backgroundSize: "cover",
          height: "100%",
          position: "relative",
        }}
      >
        {/* <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <FAQChatBotTrial />
        </div> */}
        {/* <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <FAQChatbot />
        </div> */}
        {/* <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <FaqChatbot />
        </div> */}
        {/* ------------------------EPSIT Login------------------*/}
        <Grid item md={5} zIndex={2} mt={10}>
          <Paper elevation={2} sx={{ borderRadius: 5, pt: 2, mb: 2, pb: 2 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item md={12}>
                <img
                  src="/images/epsit.png"
                  alt="GovtMaha_logo"
                  width={160}
                  height={70}
                />
              </Grid>
              <Grid item md={12} px={2}>
                <div>
                  ईप्सित आज्ञावली चा वापर करून मिळकत पत्रिकेवरील फेरफारसाठी
                  ऑनलाइन अर्ज करता येईल
                </div>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              position: "relative",
            }}
          >
            <Tooltip title="FAQ / युजर मॅन्युअल" arrow>
              {/* <IconButton
                sx={{ position: "absolute", top: 2, right: 2 }}
                // onClick={() =>
                //   window.open("./images/user_manual/user_manual.pdf", "_blank")
                // }
                onClick={() => navigate("/faq")}
              >
                <InfoIcon />
                </IconButton> */}
              <Chip
                label="FAQ / मदत"
                color="primary"
                variant="outlined"
                clickable
                onClick={() => navigate("/faq")}
                sx={{ position: "absolute", top: 10, right: 10 }}
                icon={<InfoIcon />}
              />
            </Tooltip>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              {/*------------------------------SignUp Area */}
              <Grid item md={12}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={0.5}
                >
                  <UserLogin loginLangage={loginLangage} />
                  <Grid item mt={1}>
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <span style={{ fontSize: "1.1em" }}>
                        {lang == "mar"
                          ? loginLangage?.marathi[13]
                          : loginLangage?.english[13]}
                      </span>
                      <Link
                        component="button"
                        onClick={() => navigate("/register")}
                        underline="none"
                        fontWeight={700}
                        fontSize="1.1em"
                      >
                        &nbsp;
                        {lang == "mar"
                          ? loginLangage?.marathi[14]
                          : loginLangage?.english[14]}
                      </Link>
                    </span>
                  </Grid>
                  <Grid item md={12} mt={3}>
                    <Grid container p={1} px={5} spacing={1}>
                      <Grid item md={12}>
                        <Alert severity="error">
                          अर्जदार यांनी स्वत:चे लॉगिन तयार करावे, इतरांचे लॉगिन
                          मधून अर्ज करता येणार नाही.
                        </Alert>
                      </Grid>
                      <Grid item md={12}>
                        <Alert severity="error">
                          अर्जाची स्थिति आपले लॉगिन मध्ये जाऊन आपणास पाहता येईल.
                        </Alert>
                      </Grid>
                      <Grid item md={12}>
                        <Alert severity="info">
                          रजिस्टर करताना स्वत:चा फोटो व स्वाक्षरी तसेच
                          पत्त्याबाबत पुरावा अपलोड करावा लागेल.
                        </Alert>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/*------------------------------Footer Area */}
              <Grid item marginTop={5} md={12} px={5}>
                {/* <div>Coyright © 2025 National Informatics Centre, Pune</div> */}
                <div style={{ fontSize: "14px" }}>
                  Coyright © 2025 Content of this website is owned, published
                  and managed by Revenue Department, Government of Maharashtra.
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
