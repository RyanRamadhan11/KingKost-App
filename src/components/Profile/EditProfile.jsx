import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../store/axiosInterceptor';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaGenderless, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditProfile() {
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
        axios.get(`/customer/user/${userId}`, {
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

        axios.put(`/customer/v1`, formData, {
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
                    navigate('/profile'); // Redirect ke halaman profile setelah berhasil
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className='w-20 mb-3'>
                        <Link to="/profile" className="btn btn-outline-secondary" style={{ borderRadius: '10px' }}>
                            <i className="fas fa-arrow-left"> Back </i>
                        </Link>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Edit Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">
                                        <FaUser className="me-2" />
                                        Full Name:
                                    </label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" />
                                    {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <FaEnvelope className="me-2" />
                                        Email:
                                    </label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="genderTypeId" className="form-label">
                                        <FaGenderless className="me-2" />
                                        Gender:
                                    </label>
                                    <select
                                        id="genderTypeId"
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
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        <FaMapMarkerAlt className="me-2" />
                                        Address:
                                    </label>
                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        <FaPhone className="me-2" />
                                        Phone Number:
                                    </label>
                                    <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} 
                                    onChange={handleChangePhoneNumber} className="form-control" />
                                    {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        <FaUser className="me-2" />
                                        Username:
                                    </label>
                                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control" />
                                    {errors.username && <div className="text-danger">{errors.username}</div>}
                                </div>
                                <div className="mb-3">
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
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-secondary" style={{ borderRadius: '10px' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
