import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken, setAuthenticated } from "./authSlice";
import Swal from 'sweetalert2'; 

import { setAuthUserId, setAuthUsername, setAuthEmail, setAuthRole, setAuthActive } from "./authSlice";
import { useNavigate } from "react-router-dom";

const initialIsLoggedIn = localStorage.getItem("isLoggedIn") === "true" || false;

const initialUserData = JSON.parse(localStorage.getItem("userLogin")) || {};

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: initialUserData.id || "",
    username: initialUserData.username || "",
    email: initialUserData.email || "",
    role: initialUserData.role || "",
    token: initialUserData.token || "",
    isLoggedIn: initialIsLoggedIn,
    loading: false,
    error: null,   
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.id = "";
      state.username = "";
      state.email = "";
      state.role = "";
      state.token = "";
      state.isLoggedIn = false;
      localStorage.removeItem("userLogin");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const {
  setUsername,
  setId,
  setEmail,
  setRole,
  setToken,
  setLoggedIn,
  setLoading,
  setError,
  clearError,
  logout,
} = userSlice.actions;

export default userSlice.reducer;

export const selectLoading = (state) => state.user.loading;

export const loginUser = (username, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

      const response = await axios.post("http://43.218.87.110:8080/api/auth/login", {
        username,
        password,
      });

      console.log("ini reespon user")
      console.log(response);

      const user = response.data.data; 
  
      console.log(user.userId);
      console.log(user);
      console.log("ini Token")
      console.log(user.token);

      const token = user.token;

      if (user) {
        if (user.role === 'ROLE_SELLER') {
          const userResponse = await axios.get(`http://43.218.87.110:8080/seller/user/${user.userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
          const userData = userResponse.data.data;

          if (userData.active === true) {
            const { userId, username, email, role, active, token } = user;

            dispatch(setAuthUserId(userId));
            dispatch(setAuthUsername(username));
            dispatch(setAuthEmail(email));
            dispatch(setAuthRole(role));
            dispatch(setAuthToken(token));
            dispatch(setAuthenticated(true));
            dispatch(setAuthActive(active));

            localStorage.setItem("token", JSON.stringify(user.token));
            localStorage.setItem("userLogin", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            console.log("Login Successful!");
            console.log(user, "User Data");
            
          } else if (userData && userData.active === false) {
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              text: 'User is inactive. Please contact administrator.',
              confirmButtonText: 'OK'
            });
            console.log("Login failed: User is inactive");
          }
        } else {
          const { userId, username, email, role } = user;

          dispatch(setAuthUserId(userId));
          dispatch(setAuthUsername(username));
          dispatch(setAuthEmail(email));
          dispatch(setAuthRole(role));
          dispatch(setAuthenticated(true));

          localStorage.setItem("userLogin", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", true);
        }
      } else {
        dispatch(setError("Invalid credentials"));
      }
   
  } catch (error) {
    dispatch(setError("Error during login"));
    console.error("Error during login:", error);
  } finally {
    dispatch(setLoading(false));
  }
};
