import React, { useState, useEffect } from 'react';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddDataKosan() {
    const navigate = useNavigate();
    const role = useSelector((state) => state.authentication.role);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;
    const [newKosan, setNewKosan] = useState({
        name: "",
        description: "",
        price: "",
        availableRoom: "",
        images: [], // Ubah image menjadi images
        sellerId: "",
        isWifi: false,
        isAc: false,
        isParking: false,
        genderId: "",
        provinceId: "",
        cityId: "",
        subdistrictId: "",
    });

    const [sellerOptions, setSellerOptions] = useState([]);
    const [genderOptions, setGenderOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [subdistrictOptions, setSubdistrictOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // State untuk menandai apakah sedang dalam proses pengiriman data

    const userId = useSelector((state) => state.authentication.userId);

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
        availableRoom: "",
        images: "", // Ubah image menjadi images
        sellerId: "",
        isWifi: "",
        isAc: "",
        isParking: "",
        genderId: "",
        provinceId: "",
        cityId: "",
        subdistrictId: "",
    });
    
    const validateForm = () => {
        const validationErrors = {
            name: newKosan.name.trim() === "" ? "Name is required" : "",
            description: newKosan.description.trim() === "" ? "Description is required" : "",
            price: newKosan.price.trim() === "" ? "Price is required" : isNaN(newKosan.price) ? "Price must be a number" : "",
            availableRoom: newKosan.availableRoom.trim() === "" ? "Available room is required" : isNaN(newKosan.availableRoom) ? "Available room must be a number" : "",
            images: newKosan.images.length === 0 ? "Images is required" : "", // Ubah image menjadi images
            sellerId: newKosan.sellerId === "" ? "Seller is required" : "",
            isWifi: newKosan.isWifi === "" ? "Wi-Fi option is required" : "",
            isAc: newKosan.isAc === "" ? "Air Conditioner (AC) option is required" : "",
            isParking: newKosan.isParking === "" ? "Parking option is required" : "",
            genderId: newKosan.genderId === "" ? "Gender is required" : "",
            provinceId: newKosan.provinceId === "" ? "Province is required" : "",
            cityId: newKosan.cityId === "" ? "City is required" : "",
            subdistrictId: newKosan.subdistrictId === "" ? "Subdistrict is required" : "",
        };
    
        setErrors(validationErrors);
    
        const isFormValid = Object.values(validationErrors).every(error => error === "");
    
        return isFormValid;
    };
    
    
    useEffect(() => {
        // If the user is ROLE_ADMIN, fetch seller options
        if (role === "ROLE_ADMIN") {
            axios.get(`/seller/v1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })
                .then(response => {
                    setSellerOptions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching seller options:', error);
                });
        }

        if (role === "ROLE_SELLER") {
            // Fetch data for seller options
            axios.get(`/seller/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })
                .then(response => {
                    const matchedUser = response.data.data;
                    const sellerId = matchedUser.id;

                    //biar tidak usah isidi form input
                    setNewKosan(prevState => ({
                        ...prevState,
                        sellerId: sellerId
                    }));
                })
                .catch(error => {
                    console.error('Error fetching seller options:', error);
                });
        }


        // Fetch data for gender options
        axios.get('/gender/v1')
            .then(response => {
                setGenderOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching gender options:', error);
            });

        // Fetch data for province options
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

    const handleProvinceChange = (provinceId) => {
        // Fetch data for city options based on selected province
        axios.get(`/city?province_id=${provinceId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCityOptions(response.data.data);
                // Set provinceId to the selected value
                setNewKosan({ ...newKosan, provinceId: provinceId, cityId: "" }); // Reset cityId when province changes
            })
            .catch(error => {
                console.error('Error fetching city options:', error);
            });
    };

    const handleCityChange = (cityId) => {
        // Fetch data for subdistrict options based on selected city
        axios.get(`/subdistrict?city_id=${cityId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setSubdistrictOptions(response.data.data);
                // Set cityId to the selected value
                setNewKosan({ ...newKosan, cityId: cityId });
            })
            .catch(error => {
                console.error('Error fetching subdistrict options:', error);
            });
    };

    const handleAddKosan = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true); // Set isLoading to true when submitting the form

        const formData = new FormData();
        formData.append('name', newKosan.name);
        formData.append('description', newKosan.description);
        formData.append('price', newKosan.price);
        formData.append('availableRoom', newKosan.availableRoom);
        for (let i = 0; i < newKosan.images.length; i++) { // Ubah image menjadi images
            formData.append('image', newKosan.images[i]);
        }
        formData.append('seller_id', newKosan.sellerId);
        formData.append('isWifi', newKosan.isWifi);
        formData.append('isAc', newKosan.isAc);
        formData.append('isParking', newKosan.isParking);
        formData.append('genderId', newKosan.genderId);
        formData.append('provinceId', newKosan.provinceId);
        formData.append('cityId', newKosan.cityId);
        formData.append('subdistrictId', newKosan.subdistrictId);

        axios.post(`/kost`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        
        .then(() => {
            setIsLoading(false); // Set isLoading to false when the request is successful
            Swal.fire({
              icon: 'success',
              title: 'Add Kosan Successful',
              text: 'Your kosan adding was successful!',
              confirmButtonText: 'OK'
            }).then(() => {
              // Redirect to dataKosan page after successful addition
              navigate('/dataKosan');
            });
          })
        .catch(err => {
            setIsLoading(false); // Set isLoading to false if there's an error
            console.error(err);
            
        });
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/kosan" style={{ textDecoration: "none", color: "black" }}>Kosan</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Input Kosan</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} title="Kembali" onClick={() => navigate("/datakosan")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Add Customer</h3>
                            <form className="row g-3" onSubmit={handleAddKosan}>
                                {/* Name */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={newKosan.name}
                                        onChange={(e) => setNewKosan({ ...newKosan, name: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.name}</div>
                                </div>

                                <div className="col-6 mb-2">
                                    <label htmlFor="image" className="form-label">Images</label>
                                    <input
                                        type="file"
                                        id="image"
                                        className={`form-control ${errors.images ? 'is-invalid' : ''}`}
                                        onChange={(e) => setNewKosan({ ...newKosan, images: e.target.files })}
                                        multiple
                                    />
                                    <div className="invalid-feedback">{errors.images}</div>
                                </div>


                                {/* Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        value={newKosan.description}
                                        onChange={(e) => setNewKosan({ ...newKosan, description: e.target.value })}
                                    ></textarea>
                                    <div className="invalid-feedback">{errors.description}</div>
                                </div>

                                {/* Price */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="text"
                                        style={{ borderColor: 'black'}} 
                                        id="price"
                                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                        value={newKosan.price}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/, ''); // Hanya menerima digit/angka
                                            setNewKosan({ ...newKosan, price: value });
                                        }}
                                    />
                                    <div className="invalid-feedback">{errors.price}</div>
                                </div>

                                {/* Available Room */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="availableRoom" className="form-label">Available Room</label>
                                    <input
                                        type="text"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-control ${errors.availableRoom ? 'is-invalid' : ''}`}
                                        value={newKosan.availableRoom}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/, ''); // Hanya menerima digit/angka
                                            setNewKosan({ ...newKosan, availableRoom: value })
                                        }}
                                    />
                                    <div className="invalid-feedback">{errors.availableRoom}</div>
                                </div>

                                {/* Seller field for ROLE_ADMIN */}
                                {role === "ROLE_ADMIN" && (
                                    <div className="col-6 mb-2">
                                        <label htmlFor="sellerId" className="form-label">Seller</label>
                                        <select
                                            style={{ borderColor: 'black'}} 
                                            id="sellerId"
                                            className={`form-select ${errors.sellerId ? 'is-invalid' : ''}`}
                                            value={newKosan.sellerId}
                                            onChange={(e) => setNewKosan({ ...newKosan, sellerId: e.target.value })}
                                        >
                                            <option value="">Select seller</option>
                                            {sellerOptions.map(seller => (
                                                <option key={seller.id} value={seller.id}>{seller.fullName}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">{errors.sellerId}</div>
                                    </div>
                                )}

                                {/* isWifi */}
                                <div className="col-6 mb-2">
                                    <label className="form-label">Wi-Fi</label>
                                    <select
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.isWifi ? 'is-invalid' : ''}`}
                                        value={newKosan.isWifi}
                                        onChange={(e) => setNewKosan({ ...newKosan, isWifi: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    <div className="invalid-feedback">{errors.isWifi}</div>
                                </div>

                                {/* isAc */}
                                <div className="col-6 mb-2">
                                    <label className="form-label">Air Conditioner (AC)</label>
                                    <select
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.isAc ? 'is-invalid' : ''}`}
                                        value={newKosan.isAc}
                                        onChange={(e) => setNewKosan({ ...newKosan, isAc: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    <div className="invalid-feedback">{errors.isAc}</div>
                                </div>

                                {/* isParking */}
                                <div className="col-6 mb-2">
                                    <label className="form-label">Parking</label>
                                    <select
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.isParking ? 'is-invalid' : ''}`}
                                        value={newKosan.isParking}
                                        onChange={(e) => setNewKosan({ ...newKosan, isParking: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    <div className="invalid-feedback">{errors.isParking}</div>
                                </div>

                                {/* Gender */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="genderId" className="form-label">Type Kos</label>
                                    <select
                                        style={{ borderColor: 'black'}} 
                                        id="genderId"
                                        className={`form-select ${errors.genderId ? 'is-invalid' : ''}`}
                                        value={newKosan.genderId}
                                        onChange={(e) => setNewKosan({ ...newKosan, genderId: e.target.value })}
                                    >
                                        <option value="">Select Type</option>
                                        {genderOptions.map(gender => (
                                            <option key={gender.id} value={gender.id}>{gender.name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.genderId}</div>
                                </div>

                                {/* Province */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="provinceId" className="form-label">Province</label>
                                    <select
                                        style={{ borderColor: 'black'}} 
                                        id="provinceId"
                                        className={`form-select ${errors.provinceId ? 'is-invalid' : ''}`}
                                        value={newKosan.provinceId}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                    >
                                        <option value="">Select province</option>
                                        {provinceOptions.map(province => (
                                            <option key={province.id} value={province.id}>{province.name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.provinceId}</div>
                                </div>

                                {/* City */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="cityId" className="form-label">City</label>
                                    <select
                                        id="cityId"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.cityId ? 'is-invalid' : ''}`}
                                        value={newKosan.cityId}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                    >
                                        <option value="">Select city</option>
                                        {cityOptions.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.cityId}</div>
                                </div>

                                {/* Subdistrict */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="subdistrictId" className="form-label">Subdistrict</label>
                                    <select
                                        id="subdistrictId"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.subdistrictId ? 'is-invalid' : ''}`}
                                        value={newKosan.subdistrictId}
                                        onChange={(e) => setNewKosan({ ...newKosan, subdistrictId: e.target.value })}
                                    >
                                        <option value="">Select subdistrict</option>
                                        {subdistrictOptions.map(subdistrict => (
                                            <option key={subdistrict.id} value={subdistrict.id}>{subdistrict.name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.subdistrictId}</div>
                                </div>

                                {/* Submit button */}
                                <div className="text-center mt-4">
                                    {isLoading ? (
                                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center opacity-100">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddDataKosan;
