import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function UpdateSeller() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const [sellerData, setSellerData] = useState({
        id: "",
        fullName: "",
        genderTypeId: "",
        email: "",
        address: "",
        phoneNumber: "",
        username: "",
        password: "",
        active: true // Set default active value
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

    useEffect(() => {
        axios.get(`/seller/v1/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setSellerData(response.data);
            })
            .catch(error => {
                console.error('Error fetching seller data:', error);
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
        setSellerData({ ...sellerData, password: newPassword });

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
            fullName: sellerData.fullName.trim() === "" ? "Full Name is required" : "",
            genderTypeId: sellerData.genderTypeId === "" ? "Gender is required" : "",
            email: !/^\S+@\S+\.\S+$/.test(sellerData.email) ? "Please enter a valid email address" : "",
            address: sellerData.address.trim() === "" ? "Address is required" : "",
            phoneNumber: !/^\d+$/.test(sellerData.phoneNumber) ? "Phone number must contain only numbers" : "",
            username: sellerData.username.trim() === "" ? "Username is required" : "",
            password: sellerData.password.trim() === "" ? "Password is required" : "",
        };
    
        // Check if genderTypeId exists in genderTypes
        const selectedGender = genderTypes.find(gender => gender.id === sellerData.genderTypeId);
        if (!selectedGender) {
            validationErrors.genderTypeId = "Invalid gender selected";
        }
    
        if (sellerData.username.includes(" ")) {
            validationErrors.username = "Username cannot contain spaces";
        }
    
        setErrors(validationErrors);
    
        const isFormValid = Object.values(validationErrors).every(error => error === "");
    
        return isFormValid;
    };

    const handleUpdateSeller = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        axios.put(`/seller/v1`, sellerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Seller berhasil diubah:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Seller Updated Successfully',
                    text: 'Seller berhasil diperbarui!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dataSeller'); // Redirect ke halaman seller setelah berhasil
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Seller Failed',
                    text: 'An error occurred during update Seller. Please try again later.',
                    confirmButtonText: 'OK'
                });
            });
    };

    const handleResetForm = () => {
        setSellerData({
            id: "",
            fullName: "",
            genderTypeId: "",
            email: "",
            address: "",
            phoneNumber: "",
            username: "",
            password: "",
            active: true // Reset default active value
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
                    <li className="breadcrumb-item"><Link to="/seller" style={{ textDecoration: "none", color: "black" }}>Seller</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Update Seller</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} title="Kembali" onClick={() => navigate("/dataSeller")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Update Seller</h3>
                            <form className="row g-3" onSubmit={handleUpdateSeller}>
                                {/* <div className="col-6">
                                    <label htmlFor="id" className="form-label">ID</label>
                                    <input
                                        type="text"
                                        id="id"
                                        className="form-control"
                                        value={sellerData.id}
                                        disabled
                                    />
                                </div> */}
                                <div className="col-6">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                        value={sellerData.fullName}
                                        onChange={(e) => setSellerData({ ...sellerData, fullName: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.fullName}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="genderTypeId" className="form-label">Gender</label>
                                    <select
                                        id="genderTypeId"
                                        style={{ borderColor: 'black' }}
                                        className={`form-select ${errors.genderTypeId ? 'is-invalid' : ''}`}
                                        value={sellerData.genderTypeId}
                                        onChange={(e) => setSellerData({ ...sellerData, genderTypeId: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        {genderTypes
                                            .filter(gender => gender.name === 'MALE' || gender.name === 'FEMALE')
                                            .map(gender => (
                                                <option key={gender.id} value={gender.id}>
                                                    {gender.name}
                                                </option>
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
                                            value={sellerData.password}
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
                                        value={sellerData.username}
                                        onChange={(e) => setSellerData({ ...sellerData, username: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.username}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        value={sellerData.address}
                                        onChange={(e) => setSellerData({ ...sellerData, address: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.address}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        value={sellerData.phoneNumber.startsWith("62") ? sellerData.phoneNumber : `62${sellerData.phoneNumber}`} // Menambahkan "62" di depan nomor jika belum ada
                                        onChange={(e) => setSellerData({ ...sellerData, phoneNumber: e.target.value.startsWith("62") ? e.target.value : `62${e.target.value}` })} // Menambahkan "62" di depan nomor jika belum ada saat memperbarui nilai nomor telepon
                                    />

                                    <div className="invalid-feedback">{errors.phoneNumber}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="active" className="form-label">Active</label>
                                    <select
                                        id="active"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.active ? 'is-invalid' : ''}`}
                                        value={sellerData.active.toString()} // Convert boolean value to string
                                        onChange={(e) => setSellerData({ ...sellerData, active: e.target.value === "true" })}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                    <div className="invalid-feedback">{errors.active}</div>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={sellerData.email}
                                        onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.email}</div>
                                </div>
                                <div className="text-center" style={{paddingTop: '30px'}}>
                                    <button type="submit" className="btn btn-success me-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>Update Seller</button>
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

export default UpdateSeller;
