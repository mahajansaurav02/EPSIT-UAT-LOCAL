import { createSlice } from "@reduxjs/toolkit";

const ApplicationTypeSlice = createSlice({
  name: "applicationType",
  initialState: {
    district: {},
    office: {},
    applicationType: "नोंदणी कृत",
    mutationType: {},
    isMainPatra: "",
    isCourtDawa: "",
    isDastApplicable: "",
  },
  reducers: {
    addApplicationType: (state, { payload }) => {
      return { ...payload };
    },
  },
});
export const { addApplicationType } = ApplicationTypeSlice?.actions;

export const selectApplicationType = (state) => state?.applicationType;

export default ApplicationTypeSlice.reducer;
