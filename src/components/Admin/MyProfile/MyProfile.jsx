import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../store/axiosInterceptor';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGenderless, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2';
import defaultUserImg from '../../../assets/img/def.webp';
import { Card } from 'react-bootstrap';

function MyProfile() {
    const [isLoading, setIsLoading] = useState(true);
    const [apiUserData, setApiUserData] = useState(null);
    const [genders, setGenders] = useState([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [imageUploaded, setImageUploaded] = useState(false); // State untuk menandai bahwa gambar telah diunggah
    const [isUploading, setIsUploading] = useState(false); // State untuk menandai apakah sedang dalam proses upload

    const userId = useSelector((state) => state.authentication.userId);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataResponse = await axios.get(`/seller/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const matchedUser = userDataResponse.data.data;
                setApiUserData(matchedUser);
                const completedFields = Object.values(matchedUser).filter(value => value !== null && value !== '').length;
                const totalFields = Object.keys(matchedUser).length;
                const completionPercentage = (completedFields / totalFields) * 100;
                setProfileCompletion(completionPercentage);

                const gendersResponse = await axios.get('/gender/v1');
                setGenders(gendersResponse.data);

                await new Promise(resolve => setTimeout(resolve, 500));

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId, imageUploaded]); // Tambahkan imageUploaded ke dependencies agar useEffect dipanggil saat imageUploaded berubah

    const handleEditProfile = () => {
        navigate(`/edit-myProfile/${userId}`);
    };

    const handleImageClick = () => {
        Swal.fire({
            title: "Upload Image",
            text: "Please upload an image",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Upload",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (event) => handleFileInputChange(event, apiUserData.id);
                input.click();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log("Upload canceled");
            }
        });
    };
    
    const handleFileInputChange = async (event, userId) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setIsUploading(true); // Set isUploading to true when upload starts
                const formData = new FormData();
                formData.append("file", file);
    
                // Post data ke endpoint yang ditentukan
                await axios.post(`/seller/v1/upload/${userId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                });

                
    
                // Menampilkan pesan berhasil
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Upload Image Successful!',
                    showConfirmButton: true,
                    timer: 2000
                });
    
                // Menandai bahwa gambar telah diunggah
                setImageUploaded(prevState => !prevState);
            } catch (error) {
                console.error("Error uploading image:", error);
                // Menampilkan pesan kesalahan
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to upload image. Please try again later.',
                    showConfirmButton: true
                });
            } finally {
                setIsUploading(false); // Set isUploading to false when upload finishes (either success or failure)
            }
        }
    };
    
    

    return (
        <div className="container mt-5">
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-12 ">
                        <Card className="shadow-lg p-5" style={{borderRadius: '20px'}}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title">Profil Pengguna</h5>
                                    <button onClick={handleEditProfile} className="btn btn-secondary" style={{ borderRadius: '10px' }}>Edit Profile</button>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="me-3 position-relative">
                                        <img
                                            src={apiUserData.url ? apiUserData.url : defaultUserImg}
                                            className="rounded-circle border"
                                            alt="Avatar"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={handleImageClick}
                                        />
                                        <button className="btn btn-light position-absolute bottom-0 start-0" onClick={handleImageClick} style={{ borderRadius: '50%', padding: '10px' }}>
                                            <FaUpload />
                                        </button>
                                    </div>
                                    <div className='m-4'>
                                        <h5 className="card-text mb-2">FullName : {apiUserData.fullName}</h5>
                                        <p className="mb-2"><FaEnvelope className="me-2" />{apiUserData.email}</p>
                                        <p className="mb-2"><FaGenderless className="me-2" />{genders.find(gender => gender.id === apiUserData.genderTypeId.id)?.name}</p>
                                        <p className="mb-2"><FaPhone className="me-2" />{apiUserData.phoneNumber}</p>
                                        <p className="mb-2"><FaMapMarkerAlt className="me-2" />{apiUserData.address}</p>
                                    </div>
                                </div>
                                <div className="progress m-4">
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${profileCompletion}%` }} aria-valuenow={profileCompletion} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <p className="mt-2 text-center">Kelengkapan Profil: {profileCompletion.toFixed(2)}%</p>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}
            {isUploading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center opacity-75">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyProfile;
