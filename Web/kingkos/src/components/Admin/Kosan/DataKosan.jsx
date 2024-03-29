import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../store/axiosInterceptor';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultImage from '../../../assets/img/DefaultImage.jpg';
import { BsSearch } from 'react-icons/bs';

function DataKosan() {
    const [kosanData, setKosanData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const userId = useSelector((state) => state.authentication.userId);
    const userRole = useSelector((state) => state.authentication.role);
    const navigate = useNavigate();

    const [imageUploaded, setImageUploaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [subdistrictOptions, setSubdistrictOptions] = useState([]);

    const [provinceId, setProvinceId] = useState('');
    const [cityId, setCityId] = useState('');
    const [subdistrictId, setSubdistrictId] = useState('');

    const role = useSelector((state) => state.authentication.role);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        axios.get('/province', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setProvinceOptions(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching province options:', error);
            });

    }, []);

    useEffect(() => {
        if (provinceId) {
            axios.get(`/city?province_id=${provinceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })
                .then(response => {
                    setCityOptions(response.data.data);
                    setCityId("");
                })
                .catch(error => {
                    console.error('Error fetching city options:', error);
                });
        }
    }, [provinceId]);

    useEffect(() => {
        if (cityId) {
            axios.get(`/subdistrict?city_id=${cityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })
                .then(response => {
                    setSubdistrictOptions(response.data.data);
                    setSubdistrictId("");
                })
                .catch(error => {
                    console.error('Error fetching subdistrict options:', error);
                });
        }
    }, [cityId]);

    useEffect(() => {
        fetchData();
    }, [currentPage, imageUploaded]);

    const fetchData = async () => {
        try {
            let response;
            if (userRole === "ROLE_SELLER") {
                const userDataResponse = await axios.get(`/seller/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const matchedUser = userDataResponse.data.data;
                const sellerId = matchedUser.id;
                response = await axios.get(`/kost?sellerId=${sellerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (userRole === "ROLE_ADMIN") {
                response = await axios.get(`/kost?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            const { data } = response.data;
            setKosanData(data);
        } catch (error) {
            console.error('Error fetching kosan data:', error);
        }
    };

    const handleUpdate = (kosanId) => {
        navigate(`/updateDataKosan/${kosanId}`);
    };

    const handleDelete = (kosanId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this kosan data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/kost/${kosanId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    })
                    .then(response => {
                        setKosanData(kosanData.filter(kosan => kosan.id !== kosanId));
                        console.log('Kosan deleted successfully');
                    })
                    .catch(error => {
                        console.error('Error deleting kosan:', error);
                    });
                Swal.fire(
                    'Deleted!',
                    'Your kosan data has been deleted.',
                    'success'
                );
            }
        });
    };

    const handlePrevPage = () => {
        if (currentPage >= 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleImageClick = (kosanId) => {
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
                input.onchange = (event) => handleFileInputChange(event, kosanId);
                input.click();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log("Upload canceled");
            }
        });
    };
    
    const handleFileInputChange = async (event, kosanId) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append("fileImages", file);
                formData.append("kostId", kosanId);
                await axios.post(`/kost/image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                });
               
        
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Upload Image Kosan Successful!',
                    showConfirmButton: true,
                    timer: 2000
                });
        
                setImageUploaded(prevState => !prevState);
                setIsUploading(false);
            }  catch (error) {
                console.error("Error uploading image:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to upload image. Please try again later.',
                    showConfirmButton: true
                });
                setIsUploading(false);
            }
        }
    };

    const filteredKosans = kosanData.filter(kosan =>
        (kosan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         kosan.seller.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (searchGender === '' || kosan.genderType.name.toLowerCase().includes(searchGender.toLowerCase())) &&
        (provinceId === '' || kosan.province.id === provinceId) &&
        (cityId === '' || kosan.city.id === cityId) &&
        (subdistrictId === '' || kosan.subdistrict.id === subdistrictId)
    );
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGenderChange = (e) => {
        setSearchGender(e.target.value);
    };

    const handleProvinceChange = (e) => {
        setProvinceId(e.target.value);
    };

    const handleCityChange = (e) => {
        setCityId(e.target.value);
    };

    const handleSubdistrictChange = (e) => {
        setSubdistrictId(e.target.value);
    };
    
    return (
        <div className="container-fluid mt-5">
            <div className="card mb-4 p-3">
                <h2 style={{ margin: "10px 0px 10px 10px" }}>Kosan List</h2>
                <nav>
                    <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                        <li className="breadcrumb-item"><Link style={{ textDecoration: "none", color: "black" }} to="/customer">Data Master</Link></li>
                        <li className="mx-2">/</li>
                        <li className="breadcrumb-item active">Kosan</li>
                    </ol>
                </nav>
                <div className="card-header fw-bold">
                    <i className="fa fa-home" style={{ marginRight: "10px" }}></i>
                    DATA KOSAN
                </div>
                <div className="mt-4" style={{ width: "550px", marginLeft: "18px" }}>
                    <Link to="/addDataKosan" className="btn btn-success" style={{borderRadius: '10px'}}>Add Kosan</Link>
                </div>
                <div className="mt-4" style={{ width: "550px", marginLeft: "18px" }}>
                </div>
                
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-4 mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Kost Name or Seller Name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    style={{ borderRadius: '15px 0 0 15px' }}
                                />
                                <button className="btn btn-primary" type="button" style={{ borderRadius: '0 15px 15px 0' }}>
                                    <BsSearch color='white' />
                                </button>
                            </div>
                        </div>
                        <div className="col-md-2 mb-4">
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleGenderChange}
                                    style={{ borderRadius: '15px 0 0 15px', minWidth: '80px' }}
                                >
                                    <option value="">Search By Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2 mb-4">
                            <div className="input-group">
                                <select className="form-select" value={provinceId} onChange={handleProvinceChange}>
                                    <option value="">Select Province</option>
                                    {provinceOptions.map(province => (
                                        <option key={province.id} value={province.id}>{province.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2 mb-4">
                            <div className="input-group">
                                <select className="form-select" value={cityId} onChange={handleCityChange}>
                                    <option value="">Select City</option>
                                    {cityOptions.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-md-2 mb-4">
                            <div className="input-group">
                                <select className="form-select" value={subdistrictId} onChange={handleSubdistrictChange}>
                                    <option value="">Select Subdistrict</option>
                                    {subdistrictOptions.map(subdistrict => (
                                        <option key={subdistrict.id} value={subdistrict.id}>{subdistrict.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped table-bordered">
                        <thead >
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Available Room</th>
                                <th>WiFi</th>
                                <th>AC</th>
                                <th>Parking</th>
                                <th>Type Kos</th>
                                <th>Seller</th>
                                <th>Province</th>
                                <th>City</th>
                                <th>Subdistrict</th>
                                <th>Images</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKosans.map((kosan, index) => (
                                <tr key={kosan.id} >
                                    <td>{index + 1}</td>
                                    <td>{kosan.name}</td>
                                    <td>{kosan.description}</td>
                                    <td>{kosan.kostPrice.price}</td>
                                    <td>{kosan.availableRoom}</td>
                                    <td>{kosan.isWifi ? 'Yes' : 'No'}</td>
                                    <td>{kosan.isAc ? 'Yes' : 'No'}</td>
                                    <td>{kosan.isParking ? 'Yes' : 'No'}</td>
                                    <td>{kosan.genderType.name}</td>
                                    <td>{kosan.seller.fullName}</td>
                                    <td>{kosan.province.name}</td>
                                    <td>{kosan.city.name}</td>
                                    <td>{kosan.subdistrict.name}</td>
                                    <td>
                                        <img
                                            className="img-fluid"
                                            src={kosan.images.length > 0 ? kosan.images[0].url : defaultImage}
                                            alt={kosan.images.length > 0 ? kosan.images[0].fileName : 'Placeholder'}
                                            style={{ height: '70%', width: '70%', borderRadius: '10px', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(kosan.id)}
                                        />
                                    </td>
                                    <td style={{ display: 'flex'}} className='py-5'>
                                        {role === 'ROLE_SELLER' && (
                                        <button className="btn btn-secondary me-2" onClick={() => handleUpdate(kosan.id)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        )}
                                        <button className="btn btn-danger" onClick={() => handleDelete(kosan.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={handlePrevPage}>Previous</button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">{currentPage}</span>
                            </li>
                            <li className="page-item">
                                <button className="page-link" onClick={handleNextPage}>Next</button>
                            </li>
                        </ul>
                    </nav>
                    {isUploading && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white opacity-75">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataKosan;
