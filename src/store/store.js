// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authenticationReducer from "./authSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    authentication: authenticationReducer,
  },
});

export default store;
