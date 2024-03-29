// userSlice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthenticated } from "./authSlice";
import Swal from 'sweetalert2'; 

import {  setAuthUserId, setAuthUsername, setAuthEmail, setAuthRole, setAuthActive } from "./authSlice";
import { useNavigate } from "react-router-dom";

const initialIsLoggedIn =
localStorage.getItem("isLoggedIn") === "true" || false;

const initialUserData = JSON.parse(localStorage.getItem("userLogin")) || {};

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: initialUserData.id || "",
    username: initialUserData.username || "",
    email: initialUserData.email || "",
    role: initialUserData.role || "",
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

    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    console.log(response);

    const user = response.data.data; 

    console.log(user.userId);
    console.log(user);

    if (user) {
      if (user.role === 'ROLE_SELLER') {
        // Tambahkan permintaan GET untuk mendapatkan data pengguna dari endpoint seller/user/userId
        const userResponse = await axios.get(`http://localhost:8080/seller/user/${user.userId}`);
        const userData = userResponse.data.data;

        console.log(userData);

        // Periksa apakah status active pengguna adalah true atau false
        //disini yang bisa error itu petik untuk truenya harus pastikan responnya pake "" atau ngga 
        if (userData.active === true) {
          const { userId, username, email, role, active } = user;

          dispatch(setAuthUserId(userId));
          dispatch(setAuthUsername(username));
          dispatch(setAuthEmail(email));
          dispatch(setAuthRole(role));
          dispatch(setAuthenticated(true));
          dispatch(setAuthActive(active));

          console.log(user.token)
          console.log(user.active)
          console.log(user.username)
          console.log(user.userId)

          localStorage.setItem("userLogin", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", true);
          console.log("Login Successful!");
          console.log(user, "User Data");
        } else if (userData && userData.active === false) {
          // Jika status active adalah false, tampilkan SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'User is inactive. Please contact administrator.',
            confirmButtonText: 'OK'
          });

          console.log("Login failed: User is inactive");
        }
      } else {
        // Jika rolenya bukan ROLE_SELLER, maka langsung login
        const { userId, username, email, role } = user;

        dispatch(setAuthUserId(userId));
        dispatch(setAuthUsername(username));
        dispatch(setAuthEmail(email));
        dispatch(setAuthRole(role));
        dispatch(setAuthenticated(true));

        console.log(user.token)
        console.log(user.username)
        console.log(user.userId)

        localStorage.setItem("userLogin", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        console.log("Login Successful!");
        console.log(user, "User Data");
      }
    } else {
      dispatch(setError("Invalid credentials"));
      console.log("Login failed: Invalid credentials");

      const navigate = useNavigate();
      navigate('/login');
    }
  } catch (error) {
    dispatch(setError("Error during login"));
    console.error("Error during login:", error);

    const navigate = useNavigate();
    navigate('/login');
  } finally {
    dispatch(setLoading(false));
  }
};





// export const loginUserSeller = (username, password) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));

//     const response = await axios.post("http://localhost:8080/api/auth/login/seller", {
//       username,
//       password,
//     });

//     console.log(response);

//     const user = response.data.data; 

//     console.log(user);

//     if (user && user.active === "true") { // Memeriksa apakah user ada dan status aktif
//       const { userId, username, email, role, active } = user;

//       dispatch(setAuthUserId(userId));
//       dispatch(setAuthUsername(username));
//       dispatch(setAuthEmail(email));
//       dispatch(setAuthRole(role));
//       dispatch(setAuthActive(active));
//       dispatch(setAuthenticated(true));

//       console.log(user.token)
//       console.log(user.username)
//       console.log(user.userId)

//       localStorage.setItem("userLogin", JSON.stringify(user));
//       localStorage.setItem("isLoggedIn", true);
//       console.log("Login Successful!");
//       console.log(user, "User Data");

//     } else if (user && user.active === "false") { // Jika status seller tidak aktif
//       dispatch(setError("Status seller belum aktif"));
//       console.log("Login failed: Status seller belum aktif");

//       Swal.fire({
//         icon: 'error',
//         title: 'Login Failed',
//         text: 'Status seller belum aktif!',
//         confirmButtonText: 'OK'
//       });

//     } else {
//       dispatch(setError("Invalid credentials"));
//       console.log("Login failed: Invalid credentials");

//       const navigate = useNavigate();
//       navigate('/login');
//     }
//   } catch (error) {
//     dispatch(setError("Error during login"));
//     console.error("Error during login:", error);

//     const navigate = useNavigate();
//     navigate('/login');
//   } finally {
//     dispatch(setLoading(false));
//   }
// };


// export const loginUserAdmin = (username, password) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));

//     const response = await axios.post("http://localhost:8080/api/auth/login/admin", {
//       username,
//       password,
//     });

//     console.log(response);

//     const user = response.data.data; 

//     console.log(user);

//     if (user) {
//       const { userId, username, email, role } = user;

//       dispatch(setAuthUserId(userId));
//       dispatch(setAuthUsername(username));
//       dispatch(setAuthEmail(email));
//       dispatch(setAuthRole(role));
//       dispatch(setAuthenticated(true));

//       console.log(user.token)
//       console.log(user.username)
//       console.log(user.userId)

//       localStorage.setItem("userLogin", JSON.stringify(user));
//       localStorage.setItem("isLoggedIn", true);

//       console.log("Login Successful!");
//       console.log(user, "User Data");
   
//     } else {
//       dispatch(setError("Invalid credentials"));
//       console.log("Login failed: Invalid credentials");

//       const navigate = useNavigate();
//       navigate('/login');
//     }
//   } catch (error) {
//     dispatch(setError("Error during login"));
//     console.error("Error during login:", error);


//     const navigate = useNavigate();
//     navigate('/login');
//   } finally {
//     dispatch(setLoading(false));
//   }
// };