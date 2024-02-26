import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function UpdateCustomer() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [customerData, setCustomerData] = useState({
        id: "",
        fullName: "",
        genderTypeId: "",
        email: "",
        address: "",
        phoneNumber: "",
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        genderTypeId: "",
        email: "",
        address: "",
        phoneNumber: "",
        username: "",
        password: "",
    });

    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordIndicator, setPasswordIndicator] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [genderTypes, setGenderTypes] = useState([]);

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        axios.get(`/customer/v1/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCustomerData(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });

        axios.get('/gender/v1')
            .then(response => {
                setGenderTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching gender types:', error);
            });
    }, [id]);

    const handleShowPass = () => {
        let input = document.getElementById("password");
        if (input.type === "password") input.type = "text";
        else input.type = "password";
    };

    const validatePassword = (password) => {
        return /(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{8,}/.test(password);
    }

    const handleChangePassword = (e) => {
        const newPassword = e.target.value;
        setCustomerData({ ...customerData, password: newPassword });

        if (validatePassword(newPassword)) {
            setPasswordMatch(true);
            setPasswordIndicator("Password is valid");
        } else {
            setPasswordMatch(false);
            setPasswordIndicator("Password must contain at least 8 characters, including at least one number, one letter, and one symbol");
        }
    };

    const validateForm = () => {
        const validationErrors = {
            fullName: customerData.fullName.trim() === "" ? "Full Name is required" : "",
            genderTypeId: customerData.genderTypeId === "" ? "Gender is required" : "",
            email: !/^\S+@\S+\.\S+$/.test(customerData.email) ? "Please enter a valid email address" : "",
            address: customerData.address.trim() === "" ? "Address is required" : "",
            phoneNumber: !/^\d+$/.test(customerData.phoneNumber) ? "Phone number must contain only numbers" : "",
            username: customerData.username.trim() === "" ? "Username is required" : "",
            password: customerData.password.trim() === "" ? "Password is required" : "",
        };
    
        // Check if genderTypeId exists in genderTypes
        const selectedGender = genderTypes.find(gender => gender.id === customerData.genderTypeId);
        if (!selectedGender) {
            validationErrors.genderTypeId = "Invalid gender selected";
        }
    
        if (customerData.username.includes(" ")) {
            validationErrors.username = "Username cannot contain spaces";
        }
    
        setErrors(validationErrors);
    
        const isFormValid = Object.values(validationErrors).every(error => error === "");
    
        return isFormValid;
    };
    

    const handleUpdateCustomer = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        axios.put(`/customer/v1`, customerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Customer berhasil diubah:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Customer Updated Succesfully',
                    text: 'Customer berhasil diperbarui!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/customer'); // Redirect ke halaman profile setelah berhasil
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Customer Failed',
                    text: 'An error occurred during update Customer. Please try again later.',
                    confirmButtonText: 'OK'
                });
            });
    };

    const handleResetForm = () => {
        setCustomerData({
            id: "",
            fullName: "",
            genderTypeId: "",
            email: "",
            address: "",
            phoneNumber: "",
            username: "",
            password: "",
        });
        setErrors({
            fullName: "",
            genderTypeId: "",
            email: "",
            address: "",
            phoneNumber: "",
            username: "",
            password: "",
        });
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/customer" style={{ textDecoration: "none", color: "black" }}>Customer</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Update Customer</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} title="Kembali" onClick={() => navigate("/customer")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Update Customer</h3>
                            <form className="row g-3" onSubmit={handleUpdateCustomer}>
                                <div className="col-6">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                        value={customerData.fullName}
                                        onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                                        style={{ borderColor: 'red'}} 
                                    />

                                    <div className="invalid-feedback">{errors.fullName}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="genderTypeId" className="form-label">Gender</label>
                                    <select
                                        id="genderTypeId"
                                        style={{ borderColor: 'black' }}
                                        className={`form-select ${errors.genderTypeId ? 'is-invalid' : ''}`}
                                        value={customerData.genderTypeId}
                                        onChange={(e) => setCustomerData({ ...customerData, genderTypeId: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        {genderTypes
                                            .filter(gender => gender.name === 'MALE' || gender.name === 'FEMALE')
                                            .map(gender => (
                                                <option key={gender.id} value={gender.id}>{gender.name}</option>
                                            ))}
                                    </select>

                                    <div className="invalid-feedback">{errors.genderTypeId}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            onChange={handleChangePassword}
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            value={customerData.password}
                                        />
                                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                    <div className={passwordMatch ? "text-success" : "text-danger"}>{passwordIndicator}</div>
                                    <div className="invalid-feedback">{errors.password}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        value={customerData.username}
                                        onChange={(e) => setCustomerData({ ...customerData, username: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.username}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        value={customerData.phoneNumber}
                                        onChange={(e) => {
                                            let phoneNumber = e.target.value;
                                            // Hapus semua karakter non-digit
                                            phoneNumber = phoneNumber.replace(/\D/g, '');
                                            // Pastikan nomor telepon dimulai dengan "62"
                                            if (!phoneNumber.startsWith("62")) {
                                                phoneNumber = "62" + phoneNumber;
                                            }
                                            // Update state customerData dengan nomor telepon yang sudah diformat
                                            setCustomerData({ ...customerData, phoneNumber });
                                        }}
                                    />

                                    <div className="invalid-feedback">{errors.phoneNumber}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={customerData.email}
                                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.email}</div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea
                                        type="text"
                                        style={{ borderColor: 'black'}} 
                                        id="address"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        value={customerData.address}
                                        onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.address}</div>
                                </div>
                                <div className="text-center" style={{paddingTop: '30px'}}>
                                    <button type="submit" className="btn btn-success me-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>Update Customer</button>
                                    <button type="button" className="btn btn-dark" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} onClick={handleResetForm}>Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UpdateCustomer;
