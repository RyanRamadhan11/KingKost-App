import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import React, { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { setAuthenticated, setAuthUserId, setAuthUsername, setAuthEmail, setAuthRole } from './store/authSlice';

import Home from "./pages/Home";
import PageAbout from "./pages/PageAbout";
import PageTestimonial from "./pages/PageTestimonial";
import PageTeam from "./pages/PageTeam";
// import Login from "./components/Login/Login";
import PageContact from "./pages/PageContact";
import PageTermsAndConditions from "./pages/PageTermsAndConditions";
import PageKosan from "./pages/PageKosan";
import PageBooking from "./pages/PageBooking";
import PageDetailKosan from "./pages/PageDetailKosan";
import PageProfile from "./pages/PageProfile";


import PageRegisterCustomer from "./pages/PageRegisterCustomer";
import PageSelectRegister from "./pages/PageSelectRegister";
import PageRegisterSeller from "./pages/PageRegisterSeller";
import PageEditProfile from "./pages/PageEditProfile";


import Login from "./components/Login/Login";
// import LoginCustomer from "./components/Login/LoginCustomer";
// import LoginSeller from "./components/Login/LoginSeller";
// import LoginAdmin from "./components/Login/LoginAdmin";
// import SelectLogin from "./components/Login/SelectLogin";
import PageDashboard from "./pages/Admin/PageDashboard/PageDashboard";
import PageCustomer from "./pages/Admin/PageCustomer/PageCustomer";
import PageAddCustomer from "./pages/Admin/PageCustomer/PageAddCustomer";
import PageUpdateCustomer from "./pages/Admin/PageCustomer/PageUpdateCustomer";
import PageDataKosan from "./pages/Admin/PageKosan/PageDataKosan";
import PageDataSeller from "./pages/Admin/PageSeller/PageDataSeller";
import PageAddSeller from "./pages/Admin/PageSeller/PageAddSeller";
import PageUpdateSeller from "./pages/Admin/PageSeller/PageUpdateSeller";
import PageDataTestimonial from "./pages/Admin/PageTestimonial/PageTestimonial";
import PageAddTestimonial from "./pages/Admin/PageTestimonial/PageAddTestimonial";
import PageUpdateTestimonial from "./pages/Admin/PageTestimonial/PageUpdateTestimonial";
import PageAddDataKosan from "./pages/Admin/PageKosan/PageAddDataKosan";
import PageUpdateDataKosan from "./pages/Admin/PageKosan/PageUpdateDataKosan";
import PageMyProfile from "./pages/Admin/PageMyProfile/PageMyProfile";
import PageEditMyProfile from "./pages/Admin/PageMyProfile/PageEditMyProfile";
import PageAddTestimonialCustomer from "./pages/PageAddTestimonialCustomer";

import PageSellectForgotPassword from "./pages/PageSellectForgotPassword.jsx";
import ForgotPasswordCustomer from "./components/ForgotPassword/ForgotPasswordCustomer.jsx";
import ForgotPasswordSeller from "./components/ForgotPassword/ForgotPasswordSeller.jsx";
import PageDataBooking from "./pages/Admin/PageBooking/PageDataBooking.jsx";
import PageAddDataBooking from "./pages/Admin/PageBooking/PageAddDataBooking.jsx";
import PageApproveBooking from "./pages/Admin/PageBooking/PageApproveBooking.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import PageTransactionCust from "./pages/PageTransactionCust.jsx";

function App() {
  
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentication.isAuthenticated);

  useEffect(() => {
    const initializeUserData = () => {
      const storedUserData = localStorage.getItem('userLogin');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        dispatch(setAuthenticated(true));
        dispatch(setAuthUserId(userData.userId));
        dispatch(setAuthUsername(userData.username));
        dispatch(setAuthEmail(userData.email));
        dispatch(setAuthRole(userData.role));
      }
    };

    initializeUserData();
  }, [dispatch]);

  // Logika redirect berdasarkan role
  const role = useSelector((state) => state.authentication.role);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? (
            // Jika pengguna sudah login
            role === "ROLE_SELLER" || role === "ROLE_ADMIN" ? (
              // Jika role adalah ROLE_SELLER atau ROLE_ADMIN, redirect ke Dashboard
              <Navigate to="/dashboard" replace />
            ) : role === "ROLE_CUSTOMER" ? (
              // Jika role adalah ROLE_CUSTOMER, redirect ke Home
              <Navigate to="/" replace />
            ) : (
              // Jika role tidak sesuai dengan yang diharapkan, tampilkan halaman Home
              <Home />
            )
          ) : (
            // Jika pengguna belum login, tampilkan halaman Login
            <Login />
          )}
        />

        {/* Page Customer */}
        <Route path="/register/customer" element={<PageRegisterCustomer />} />
        <Route path="/register/seller" element={<PageRegisterSeller />} />
        <Route path="/register" element={<PageSelectRegister />} />

        <Route path="forgot-password" element={<PageSellectForgotPassword/>}/>
        <Route path="/forgot-password/seller" element={<ForgotPasswordSeller/>}/>
        <Route path="/forgot-password/customer" element={<ForgotPasswordCustomer/>}/>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<PageAbout />} />
        <Route path="/testimonial" element={<PageTestimonial />} />
        <Route path="/team" element={<PageTeam />} />
        <Route path="/contact" element={<PageContact />} />
        <Route path="/TermsAndConditions" element={<PageTermsAndConditions />} />
        <Route path="/kosan" element={<PageKosan />} />

        {/* Page After Customer Login */}
        <Route path="/addTestimonial" 
              element={isLoggedIn ? ( <PageAddTestimonialCustomer />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/booking" element={isLoggedIn ? ( <PageBooking />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/profile" element={isLoggedIn ? ( <PageProfile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/edit-profile/:id" element={isLoggedIn ? ( <PageEditProfile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/addDataBooking" element={isLoggedIn ? ( <PageAddDataBooking />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/myBooking" element={isLoggedIn ? ( <PageTransactionCust/>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/kost/id" element={isLoggedIn ? ( <PageDetailKosan/>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
       
        <Route path="/booking/:id" element={isLoggedIn ? ( <PageBooking/>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Page Admin/Seller After Login */}
        <Route path="/dashboard" element={isLoggedIn ? (<PageDashboard />) : (<Navigate to="/login" replace />)} />

        <Route path="/customer" element={isLoggedIn ? (<PageCustomer />) : (<Navigate to="/login" replace />)} />
        <Route path="/addCustomer" element={isLoggedIn ? (<PageAddCustomer />) : (<Navigate to="/login" replace />)} />
        <Route path="/updateCustomer/:id" element={isLoggedIn ? (<PageUpdateCustomer />) : (<Navigate to="/login" replace />)} />

        <Route path="/datakosan" element={isLoggedIn ? (<PageDataKosan />) : (<Navigate to="/login" replace />)} />
        <Route path="/addDataKosan" element={isLoggedIn ? (<PageAddDataKosan />) : (<Navigate to="/login" replace />)} />
        <Route path="/updateDataKosan/:id" element={isLoggedIn ? (<PageUpdateDataKosan />) : (<Navigate to="/login" replace />)} />

        <Route path="/dataSeller" element={isLoggedIn ? (<PageDataSeller />) : (<Navigate to="/login" replace />)} />
        <Route path="/addDataSeller" element={isLoggedIn ? (<PageAddSeller />) : (<Navigate to="/login" replace />)} />
        <Route path="/updateSeller/:id" element={isLoggedIn ? (<PageUpdateSeller />) : (<Navigate to="/login" replace />)} />

        <Route path="/dataTestimoni" element={isLoggedIn ? (<PageDataTestimonial />) : (<Navigate to="/login" replace />)} />
        <Route path="/addDataTestimoni" element={isLoggedIn ? (<PageAddTestimonial />) : (<Navigate to="/login" replace />)} />
        <Route path="/updateDataTestimoni/:id" element={isLoggedIn ? (<PageUpdateTestimonial />) : (<Navigate to="/login" replace />)} />

        <Route path="/myProfile" element={isLoggedIn ? (<PageMyProfile />) : (<Navigate to="/login" replace />)} />
        <Route path="/edit-myProfile/:id" element={isLoggedIn ? (<PageEditMyProfile />) : (<Navigate to="/login" replace />)} />

        <Route path="/dataBooking" element={isLoggedIn ? (<PageDataBooking />) : (<Navigate to="/login" replace />)} />

        <Route path="/approveBooking/:id" element={isLoggedIn ? (<PageApproveBooking />) : (<Navigate to="/login" replace />)} />

        <Route path="/booking/:id" element={isLoggedIn ? (<PageBooking />) : (<Navigate to="/login" replace />)} />

        <Route path="/notFound" element={<PageNotFound />} />

      </Routes>
    </>
  );
}

export default App;