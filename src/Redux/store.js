import { configureStore } from "@reduxjs/toolkit";
import LanguageReducer from "./slices/LanguageSlice";
import ApplicationTypeReducer from "./slices/HomeSlices/ApplicationTypeSlice";

const store = configureStore({
  reducer: {
    language: LanguageReducer,
    applicationType: ApplicationTypeReducer,
  },
});

export default store;
