import * as yup from "yup";

export const mobileValidationSchema = yup
  .string()
  .trim()
  .required("मोबाइल नंबर टाकणे गरजेचे आहे")
  .max(10, "कमीत कमी १० अंक टाका")
  // .max(13, "जास्तीत जास्त १३ अंक टाकू शकता")
  .matches(
    /^[6-9]\d{9}$/,
    "अमान्य मोबाइल नं.(नंबरची सुरुवात 6, 7, 8, 9 ने असावी, फक्त १० अंकी असावा)"
  );

export const emailValidationSchema = yup
  .string()
  .required("ईमेल गरजचे आहे")
  .email("अमान्य ईमेल")
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "अमान्य ईमेल");

export const otpValidationSchema = yup
  .string()
  .required("ओ. टी. पी. टाका")
  .length(6, "ओ. टी. पी. ६ अंकांचा असावा");

export const mobileValidationSchemaNotCompulsary = yup
  .string()
  .trim()
  .max(10, "कमीत कमी १० अंक टाका")
  .matches(
    /^[6-9]\d{9}$/,
    "अमान्य मोबाइल नं.(नंबरची सुरुवात 6, 7, 8, 9 ने असावी, फक्त १० अंकी असावा)"
  );

//-----------------------------------------------------------------------------

export const simpletextfieldValidationSchema = yup
  .string()
  .required("This field is required");
export const suffixMarathiValidationSchema = yup
  .string()
  .required("उपसर्ग निवडा");
export const firstNameMarathiValidationSchema = yup
  .string()
  .required("कृपया पहिले नाव टाका");
export const middleNameMarathiValidationSchema = yup
  .string()
  .required("कृपया मधले नाव टाका");
export const lastNameMarathiValidationSchema = yup
  .string()
  .required("कृपया आडनाव नाव टाका");
export const firstNameEnglishValidationSchema = yup
  .string()
  .required("First Name is Required");
export const middleNameEnglishValidationSchema = yup
  .string()
  .required("Middle Name is Required");
export const lastNameEnglishValidationSchema = yup
  .string()
  .required("Last Name is Required");
export const companyNamemarathiValidationSchema = yup
  .string()
  .required("कृपया संस्थेचे नाव टाका");
export const companyNameEnglishValidationSchema = yup
  .string()
  .required("Institution Name is Required");

//------------------------------------------------------------------------------

export const ulpinValidationSchema = yup
  .string()
  .trim()
  .required("ULPIN टाकणे गरजेचे आहे")
  .matches(/^\d{11}$/, "11 अंक असणे गरजचे आहे");
// .matches(/^[1-9]\d{10}$/, "11 अंक असणे गरजचे आहे आणि 0 पासून सुरुवात नको");

export const genderValidationSchema = yup.string().required("लिंग निवडा");
export const khateTypeValidationSchema = yup
  .string()
  .required("खाते प्रकार निवडा");
export const holderTypeValidationSchema = yup
  .string()
  .required("धारक प्रकार निवडा");
export const aapakDropdownValidationSchema = yup
  .string()
  .required("अज्ञान पालन कर्ता / एकत्र कुटुंब मॅनेजर निवडा");
export const aapakValidationSchema = yup
  .string()
  .required("अज्ञान पालन कर्ता टाका");
export const thresholdDateOfDOB = new Date("2024-05-01");

export const nabhuValidationSchema = yup
  .string()
  .required("नगर भुमापण क्रमांक निवडा");
export const namudValidationSchema = yup
  .string()
  .required("अर्जामध्ये नमूद मिळकत निवडा");
export const khataNoValidationSchema = yup
  .string()
  .required("खाता क्रमांक निवडा");

//--------------------------------Address------------------------

export const districtValidationSchema = yup.string().required("जिल्हा निवडा");
export const talukaValidationSchema = yup.string().required("तालुका निवडा");

export const addressValidationSchema = yup
  .string()
  .required("पत्ता टाकणे गरजेचे आहे");

export const plotNoValidationSchema = yup
  .string()
  .required("सदनिका / घर /प्लॉट नं. टाकणे गरजेचे आहे");

export const buildingNameValidationSchema = yup
  .string()
  .required("Building / Society Name is required");

export const landmarkValidationSchema = yup
  .string()
  .required("महत्त्वाची खूण टाकणे गरजेचे आहे");

export const pincodeValidationSchema = yup
  .string()
  .required("पिनकोड टाकणे गरजेचे आहे")
  .min(6, "पिनकोड ६ अंकांचा असावा");

export const postofficeValidationSchema = yup
  .string()
  .required("पोस्टऑफिस निवडा");
