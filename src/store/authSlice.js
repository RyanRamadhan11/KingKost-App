// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: {
    isAuthenticated: false,
    userId: "",
    username: "",
    password: "",
    email: "",
    role: "",
    token: "",
    active: "",
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setAuthUserId: (state, action) => {
      state.userId = action.payload;
    },
    setAuthUsername: (state, action) => {
      state.username = action.payload;
    },
    setAuthPassword: (state, action) => {
      state.password = action.payload;
    },
    setAuthEmail: (state, action) => {
      state.email = action.payload;
    },
    setAuthRole: (state, action) => {
      state.role = action.payload;
    },
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    setAuthActive: (state, action) => {
      state.active = action.payload;
    }
  },
});


export const {
  setAuthenticated,
  setAuthUserId,
  setAuthUsername,
  setAuthEmail,
  setAuthRole,
  setAuthPassword,
  setAuthToken,
  setAuthActive,
} = authSlice.actions;


export default authSlice.reducer;
