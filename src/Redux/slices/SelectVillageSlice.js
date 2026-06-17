import { createSlice } from "@reduxjs/toolkit";

const SelectVillageSlice = createSlice({
  name: "selectVillage",
  initialState: {
    district: "",
    taluka: "",
    village: "",
  },
  reducers: {
    addDetails: (state, { payload }) => {
      return { ...payload };
    },
  },
});
export const { addDetails } = SelectVillageSlice?.actions;

export const selectVillage = (state) => state?.selectVillage;

export default SelectVillageSlice.reducer;
