import { createSlice } from "@reduxjs/toolkit";

const LanguageSlice = createSlice({
  name: "language",
  initialState: {
    lng: "mar",
  },
  reducers: {
    addlanguage: (state, { payload }) => {
      return { ...payload };
    },
  },
});
export const { addlanguage } = LanguageSlice?.actions;

export const selectLanguage = (state) => state?.language;

export default LanguageSlice.reducer;
