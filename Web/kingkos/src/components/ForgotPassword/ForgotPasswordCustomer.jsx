import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo1 from '../../assets/img/logo_king.png';
import Swal from 'sweetalert2';

function ForgotPasswordCustomer() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        email: "",
    });
    const [emailMatch, setEmailMatch] = useState(false);
    const [emailIndicator, setEmailIndicator] = useState("");
    const [loading, setLoading] = useState(false); // State untuk menangani status loading

    const validateEmail = (email) => {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        const validationErrors = {
            email: !validateEmail(email) ? "Please enter a valid email address" : "",
        };

        setErrors(validationErrors);

        const isFormValid = Object.values(validationErrors).every(error => error === "");

        return isFormValid;
    };

    const handleForgotPassword = async () => {
        try {
            if (!validateForm()) {
                return;
            }

            setLoading(true); // Atur loading menjadi true saat memulai proses
            const response = await axios.post('http://43.218.87.110:8080/reset/request-customer', {
                email: email
            });

            setLoading(false); // Atur loading kembali menjadi false setelah mendapat respons
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message,
            });
        } catch (error) {
            setLoading(false); // Atur loading kembali menjadi false jika terjadi kesalahan
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to send reset password request.',
            });
            console.error('Error sending reset password request:', error);
        }
    };

    const handleChangeEmail = (e) => {
        const setEmailValue = e.target.value;

        setEmail(setEmailValue);

        if (validateEmail(setEmailValue)) {
            setEmailMatch(true);
            setEmailIndicator("Email is valid");
        } else {
            setEmailMatch(false);
            setEmailIndicator("Email must be in the format example@example.com");
        }
    };

    return (
        <>
            <section className="nav"
                style={{ background: 'linear-gradient(to bottom, #a36903, #873f00)', padding: '5em' }}>
                <div className="container" style={{ padding: '2em' }}>
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-12">
                            <div className="card" style={{ borderRadius: '2rem' }}>
                                <div className="row container-fluid">
                                    <div className="col-md-6 col-lg-6 d-none d-md-block py-5 px-5">
                                        <img src={Logo1} alt="login form" className="img-fluid"
                                            style={{ borderRadius: '1rem 0 0 1rem', paddingTop: '5em' }} />
                                    </div>
                                    <div className="col-md-6 col-lg-6 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">
                                            <div className="container mt-5">
                                                <div className="row justify-content-center">
                                                    <div className="col-md-12">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <Link to="/login" className="btn btn-outline-primary"
                                                                    style={{ borderRadius: '10px' }}>
                                                                    <i className="fas fa-arrow-left"> Back </i>
                                                                </Link>
                                                                <h2 className="m-2">Forgot Password</h2>
                                                                <form>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="email" className="form-label">Email
                                                                            address</label>
                                                                        <input
                                                                            type="email"
                                                                            className={`form-control ${errors.email && 'is-invalid'}`}
                                                                            id="email"
                                                                            value={email}
                                                                            onChange={handleChangeEmail}
                                                                        />
                                                                        <div className={emailMatch ? "text-success mt-2" : "text-danger mt-2"}>{emailIndicator}</div>
                                                                        <div className="invalid-feedback mt-2">{errors.email}</div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary fw-bold"
                                                                        onClick={handleForgotPassword}
                                                                        disabled={!email || !validateEmail(email) || loading}
                                                                    >
                                                                        {loading ? 'Loading...' : 'Send Reset Link'}
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

export default ForgotPasswordCustomer;
