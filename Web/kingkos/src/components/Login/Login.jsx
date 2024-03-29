
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, selectLoading } from "../../store/userSlice";
import { Link } from 'react-router-dom';
import Logo1 from '../../assets/img/logo_king.png';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaGenderless, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

import Swal from 'sweetalert2';
import { FaWhatsapp } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const validationErrors = {
      username: username.trim() === "" ? "Username is required" : "",
      password: password.trim() === "" ? "Password is required" : "",
    };

    setErrors(validationErrors);

    return Object.values(validationErrors).every(error => error === "");
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) {
        // Display error message if form is not valid
        return;
      }
  
      if (location.pathname.startsWith("/login")) {
        await dispatch(loginUser(username, password));

        // Ambil data user dari local storage setelah login berhasil
        const user = JSON.parse(localStorage.getItem("userLogin"));

        console.log(user);

        if (user || user.active) { // Memeriksa apakah status seller aktif setelah login berhasil
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Login successful!',
            showConfirmButton: false,
            timer: 1500 // Menutup alert setelah 1.5 detik
          });
        } else if (user && !user.active) { // Jika status seller tidak aktif
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Status seller belum aktif!',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error, if needed
      setErrors({ ...errors, general: "Invalid username or password" }); // Set error message for invalid login
    }
  };
  

  const onSuccess = (res) => {
    console.log("Successfully logged in, Current User: ", res.profileObj);
    navigate('/'); 
  }
  
  const onFailure = (res) => {
    console.log("Login Failed, Res : " + res)
  }

  return (
    <>
        <section className="nav" style={{ background: 'linear-gradient(to bottom, #a36903, #873f00)', padding: '4em' }}>
          <div className="container" style={{padding: '2em'}}>
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-12">
                <div className="card" style={{ borderRadius: '2rem'}}>
                  <div className="row container-fluid">
                    <div className="col-md-6 col-lg-6 d-none d-md-block py-5 px-5">
                      <img src={Logo1} alt="login form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem', paddingTop: '5em' }} />
                    </div>
                    <div className="col-md-6 col-lg-6 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        <form>
                          <div className='w-20 mb-3 d-flex justify-content-end'>
                             <Link to="https://wa.me/6281234567890" target="_blank" className="btn btn-success ms-2 mb-2" style={{ borderRadius: '15px' }}>
                                <FaWhatsapp style={{ marginRight: "5px" }} />Help
                              </Link>
                          </div>

                          <div className="d-flex justify-content-center align-items-center mb-3 pb-1">
                            <div>
                              <i className="fas fa-crown fa-2x mx-4 mb-1" style={{ color: 'black' }}></i>
                              <span className="h1 fw-bold mb-3">KingKos App</span>
                            </div>
                            
                          </div>


                          <h5 className="fw-normal mb-3 pb-3 text-center" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
                          <div className="mb-3">
                            <label htmlFor="inputUsername" className="form-label">
                              <FaUser className="me-2" />Username <label htmlFor="" style={{color: 'red'}}>*</label>
                            </label>
                            <input
                              type="text" 
                              className="form-control"
                              id="inputUsername"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)} 
                            />
                            {errors.username && <div className="text-danger">{errors.username}</div>}
                          </div>

                          <div className="mb-3">
                              <label htmlFor="password" className="form-label">
                                <FaLock className="me-2" />
                                Password <label htmlFor="" style={{color: 'red'}}>*</label>
                              </label>
                              <div className="input-group">
                                <input type={showPassword ? "text" : "password"} id="inputPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)}  className="form-control" />
                                  <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                  </span>
                              </div>
                              {errors.password && <div className="text-danger">{errors.password}</div>}
                          </div>

                          {errors.general && <div className="text-danger mb-4">{errors.general}</div>}

                          <div className="mb-3 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="rememberMe"
                              defaultChecked
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Remember me
                            </label>
                          </div>

                          <div className="mb-3">
                            <Link to="/forgot-password" className="text-decoration-none"
                                style={{color: 'blue'}}>
                                Forgot password?
                            </Link>
                          </div>

                          <button
                            type="button"
                            className="btn btn-warning btn-block mb-3 fw-bold"
                            style={{borderRadius: '10px'}}
                            onClick={handleLogin}
                          >
                            Sign in
                          </button>

                          <p className="pb-lg-2" style={{ color: '#393f81', paddingTop: '1em' }}>
                            Don't have an account ? 
                            <Link to="/register" className="mx-2" style={{color: 'blue'}}>
                              Register here
                            </Link>
                          </p>

                          <Link to="#!" className="small text-muted">Terms of use. </Link>
                          <Link to="#!" className="small text-muted">Privacy policy</Link>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default Login;
