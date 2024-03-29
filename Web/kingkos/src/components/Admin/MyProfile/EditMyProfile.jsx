import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../store/axiosInterceptor';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaGenderless, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditMyProfile() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        genderTypeId: '',
        address: '',
        phoneNumber: '',
        username: '',
        password: ''
    });

    const [genders, setGenders] = useState([]);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const [errors, setErrors] = useState({
        fullName: "",
        genderTypeId: "",
        email: "",
        address: "",
        phoneNumber: "",
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const userId = useSelector((state) => state.authentication.userId);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data and set form data
        axios.get(`/seller/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                const userData = response.data.data;
                setFormData(userData);

                // Fetch genders after setting form data
                axios.get('/gender/v1')
                    .then(response => {
                        setGenders(response.data);

                        // Find selected gender and set genderTypeId in formData
                        const selectedGender = response.data.find(gender => gender.id === userData.genderTypeId);
                        if (selectedGender) {
                            setFormData(prevState => ({
                                ...prevState,
                                genderTypeId: selectedGender.id
                            }));
                        }
                    })
                    .catch(error => console.error('Error fetching gender data:', error));
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePhoneNumber = (e) => {
        let { name, value } = e.target;
    
    // Jika field yang diubah adalah phoneNumber, format nomor telepon dengan awalan "62"
    if (name === 'phoneNumber') {
        // Hapus semua karakter non-digit
        value = value.replace(/\D/g, '');
        // Pastikan nomor telepon dimulai dengan "62"
        if (!value.startsWith("62")) {
            value = "62" + value;
        }
    }

    // Update state formData dengan nilai yang baru
    setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        axios.put(`/seller/v1`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Profil berhasil diubah:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Profil berhasil diperbarui!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/myProfile'); // Redirect ke halaman profile setelah berhasil
                });
            })
            .catch(error => {
                console.error('Gagal mengubah profil:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengubah profil. Silakan coba lagi.',
                    confirmButtonText: 'OK'
                });
            });
    };

    const validateForm = () => {
        const validationErrors = {
            fullName: formData.fullName.trim() === "" ? "Full Name is required" : "",
            genderTypeId: formData.genderTypeId === "" ? "Gender is required" : "",
            email: !/^\S+@\S+\.\S+$/.test(formData.email) ? "Please enter a valid email address" : "",
            phoneNumber: !/^\d+$/.test(formData.phoneNumber) ? "Phone number must contain only numbers" : "",
            username: formData.username.trim() === "" ? "Username is required" : "",
            password: formData.password.trim() === "" ? "Password is required" : "",
        };

        // Validate username does not contain spaces
        if (formData.username.includes(" ")) {
            validationErrors.username = "Username cannot contain spaces";
        }

        // Set errors state with validationErrors object
        setErrors(validationErrors);

        // Check if all fields are valid
        const isFormValid = Object.values(validationErrors).every(error => error === "");

        return isFormValid;
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/customer" style={{ textDecoration: "none", color: "black" }}>My Profile</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Edit My Profile</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} title="Kembali" onClick={() => navigate("/myProfile")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Edit My Profile</h3>
                            <form onSubmit={handleSubmit} className='row g-3'>
                                <div className="col-6 mb-3">
                                    <label htmlFor="fullName" className="form-label">
                                        <FaUser className="me-2" />
                                        Full Name:
                                    </label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" />
                                    {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <FaEnvelope className="me-2" />
                                        Email:
                                    </label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="genderTypeId" className="form-label">
                                        <FaGenderless className="me-2" />
                                        Gender:
                                    </label>
                                    <select
                                        id="genderTypeId"
                                        style={{ borderColor: 'black' }}
                                        name="genderTypeId"
                                        value={formData.genderTypeId}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Gender</option>
                                        {genders
                                            .filter(gender => gender.name === 'MALE' || gender.name === 'FEMALE')
                                            .map(gender => (
                                                <option key={gender.id} value={gender.id}>
                                                    {gender.name}
                                                </option>
                                            ))}
                                    </select>

                                    {errors.genderTypeId && <div className="text-danger">{errors.genderTypeId}</div>}
                                </div>
                                
                                <div className="col-6 mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        <FaPhone className="me-2" />
                                        Phone Number:
                                    </label>
                                    <input type="text" id="phoneNumber" name="phoneNumber" 
                                    value={formData.phoneNumber} onChange={handleChangePhoneNumber} className="form-control" />
                                    {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                                </div>
                                
                                <div className="col-6 mb-3">
                                    <label htmlFor="username" className="form-label">
                                        <FaUser className="me-2" />
                                        Username:
                                    </label>
                                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control" />
                                    {errors.username && <div className="text-danger">{errors.username}</div>}
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="password" className="form-label">
                                        <FaLock className="me-2" />
                                        Password:
                                    </label>
                                    <div className="input-group">
                                        <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
                                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="col-12 mb-4">
                                    <label htmlFor="address" className="form-label">
                                        <FaMapMarkerAlt className="me-2" />
                                        Address:
                                    </label>
                                    <textarea style={{borderColor: 'black'}} type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-secondary" style={{ borderRadius: '10px' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditMyProfile;
