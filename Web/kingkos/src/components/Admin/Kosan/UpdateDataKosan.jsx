import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../../store/axiosInterceptor';
import { useSelector } from 'react-redux';

function UpdateDataKosan() {
    const navigate = useNavigate();
    const { id } = useParams();

    const role = useSelector((state) => state.authentication.role);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const [kosanData, setKosanData] = useState({
        id: "",
        name: "",
        description: "",
        availableRoom: 0,
        isWifi: false,
        isAc: false,
        isParking: false,
        price: 0,
        genderId: "",
        sellerId: "",
        provinceId: "",
        cityId: "",
        subdistrictId: "",
        createdAt: new Date().toISOString(),
        image: [{
            id: "",
            url: "",
            kost_id: "",
            isActive: true
        }]
    });

    const [genderOptions, setGenderOptions] = useState([]);
    const [sellerOptions, setSellerOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [subdistrictOptions, setSubdistrictOptions] = useState([]);

    useEffect(() => {
        axios.get(`/kost/id?kostId=${id}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                const { id, name, description, availableRoom, isWifi, isAc, isParking, kostPrice, genderType, seller, province, city, images, createdAt } = response.data.data;

                setKosanData({
                    id,
                    name,
                    description,
                    availableRoom,
                    isWifi,
                    isAc,
                    isParking,
                    price: kostPrice.price,
                    genderId: genderType.id,
                    sellerId: seller.id,
                    provinceId: province.id,
                    cityId: city.id,
                    subdistrictId: city.id, // Adjust according to your data structure
                    createdAt,
                    listImage: images.map(img => ({
                        id: img.id,
                        url: img.url,
                        kost_id: id,
                        isActive: img.isActive
                    }))
                });
            })
            .catch(error => {
                console.error('Error fetching kosan data:', error);
            });

        axios.get('/gender/v1')
            .then(response => {
                setGenderOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching gender options:', error);
            });

        if (role === "ROLE_ADMIN") {
            axios.get(`/seller/v1` , {
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
    
        axios.get('/province' , {
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

    }, [id]);

    const handleProvinceChange = (provinceId) => {
        // Fetch data for city options based on selected province
        axios.get(`/city?province_id=${provinceId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCityOptions(response.data.data);
                // Set provinceId to the selected value and reset cityId when province changes
                setKosanData({ ...kosanData, provinceId: provinceId, cityId: "", subdistrictId: "" });
            })
            .catch(error => {
                console.error('Error fetching city options:', error);
            });
    };
    
    const handleCityChange = (cityId) => {
        // Fetch data for subdistrict options based on selected city
        axios.get(`/subdistrict?city_id=${cityId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setSubdistrictOptions(response.data.data);
                // Set cityId to the selected value and reset subdistrictId when city changes
                setKosanData({ ...kosanData, cityId: cityId, subdistrictId: "" });
            })
            .catch(error => {
                console.error('Error fetching subdistrict options:', error);
            });
    };

    const handleUpdateKosan = (e) => {
        e.preventDefault();
        axios.put(`/kost`, kosanData , {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Kosan berhasil diubah:', response.data.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Kost Updated Successfully',
                    text: 'Kost berhasil diperbarui!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dataKosan');
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Kosan Failed',
                    text: 'An error occurred during update Kosan. Please try again later.',
                    confirmButtonText: 'OK'
                });
            });
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/dataKosan" style={{ textDecoration: "none", color: "black" }}>Kosan</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Update Data Kosan</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} title="Kembali" onClick={() => navigate("/dataKosan")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Update Kosan</h3>
                            <form className="row g-3" onSubmit={handleUpdateKosan}>

                                {/* Form fields */}
                                <div className="col-6">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={kosanData.name}
                                        onChange={(e) => setKosanData({ ...kosanData, name: e.target.value })}
                                    />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.description}
                                        onChange={(e) => setKosanData({ ...kosanData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="availableRoom" className="form-label">Available Room</label>
                                    <input
                                        type="number"
                                        id="availableRoom"
                                        className="form-control"
                                        value={kosanData.availableRoom}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/, ''); // Hanya menerima digit/angka
                                            setKosanData({ ...kosanData, availableRoom: value })
                                        }}
                                    />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="isWifi" className="form-label">WiFi</label>
                                    <select
                                        id="isWifi"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.isWifi.toString()}
                                        onChange={(e) => setKosanData({ ...kosanData, isWifi: e.target.value === "true" })}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="isAc" className="form-label">AC</label>
                                    <select
                                        id="isAc"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.isAc.toString()}
                                        onChange={(e) => setKosanData({ ...kosanData, isAc: e.target.value === "true" })}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="isParking" className="form-label">Parking</label>
                                    <select
                                        id="isParking"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.isParking.toString()}
                                        onChange={(e) => setKosanData({ ...kosanData, isParking: e.target.value === "true" })}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        className="form-control"
                                        value={kosanData.price}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/, ''); // Hanya menerima digit/angka
                                            setKosanData({ ...kosanData, price: value })
                                        }}
                                    />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="genderId" className="form-label">Type Kos</label>
                                    <select
                                        id="genderId"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.genderId}
                                        onChange={(e) => setKosanData({ ...kosanData, genderId: e.target.value })}
                                    >
                                        {genderOptions.map(gender => (
                                            <option key={gender.id} value={gender.id}>{gender.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {role === "ROLE_ADMIN" && (
                                <div className="col-6">
                                    <label htmlFor="sellerId" className="form-label">Seller ID</label>
                                    <select
                                        id="sellerId"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.sellerId}
                                        onChange={(e) => setKosanData({ ...kosanData, sellerId: e.target.value })}
                                    >
                                        {sellerOptions.map(seller => (
                                            <option key={seller.id} value={seller.id}>{seller.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                                 )}

                                <div className="col-6">
                                    <label htmlFor="provinceId" className="form-label">Province</label>
                                    <select
                                        id="provinceId"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.provinceId}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        name="provinceId"
                                    >
                                        <option value="">Select Province</option>
                                        {provinceOptions.map(province => (
                                            <option key={province.id} value={province.id}>{province.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="cityId" className="form-label">City</label>
                                    <select
                                        id="cityId"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.cityId}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                        name="cityId"
                                    >
                                        <option value="">Select City</option>
                                        {cityOptions.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="subdistrictId" className="form-label">Subdistrict</label>
                                    <select
                                        id="subdistrictId"
                                        className="form-select"
                                        style={{ borderColor: 'black'}} 
                                        value={kosanData.subdistrictId}
                                        onChange={(e) => setKosanData({ ...kosanData, subdistrictId: e.target.value })}
                                        name="subdistrictId"
                                    >
                                        <option value="">Select Subdistrict</option>
                                        {subdistrictOptions.map(subdistrict => (
                                            <option key={subdistrict.id} value={subdistrict.id}>{subdistrict.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* <div className="col-12">
                                    <label htmlFor="createdAt" className="form-label">Created At</label>
                                    <input
                                        type="text"
                                        id="createdAt"
                                        className="form-control"
                                        value={kosanData.createdAt}
                                        readOnly // Read-only input
                                    />
                                </div> */}

                                {/* Form fields for images */}
                                {/* {kosanData.image.map((image, index) => (
                                    <div key={index} className="row">
                                        <div className="col-6">
                                            <label htmlFor={`imageId-${index}`} className="form-label">Image ID</label>
                                            <input
                                                type="text"
                                                id={`imageId-${index}`}
                                                className="form-control"
                                                value={image.id}
                                                onChange={(e) => setKosanData(prevData => {
                                                    const updatedImages = [...prevData.image];
                                                    updatedImages[index].id = e.target.value;
                                                    return { ...prevData, image: updatedImages };
                                                })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor={`imageUrl-${index}`} className="form-label">Image URL</label>
                                            <input
                                                type="text"
                                                id={`imageUrl-${index}`}
                                                className="form-control"
                                                style={{ borderColor: 'black'}} 
                                                value={image.url}
                                                onChange={(e) => setKosanData(prevData => {
                                                    const updatedImages = [...prevData.image];
                                                    updatedImages[index].url = e.target.value;
                                                    return { ...prevData, image: updatedImages };
                                                })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor={`imageKostId-${index}`} className="form-label">Kost ID</label>
                                            <input
                                                type="text"
                                                id={`imageKostId-${index}`}
                                                style={{ borderColor: 'black'}} 
                                                className="form-control"
                                                value={image.kost_id}
                                                onChange={(e) => setKosanData(prevData => {
                                                    const updatedImages = [...prevData.image];
                                                    updatedImages[index].kost_id = e.target.value;
                                                    return { ...prevData, image: updatedImages };
                                                })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor={`isActive-${index}`} className="form-label">Is Active</label>
                                            <select
                                                id={`isActive-${index}`}
                                                style={{ borderColor: 'black'}} 
                                                className="form-select"
                                                value={image.isActive.toString()}
                                                onChange={(e) => setKosanData(prevData => {
                                                    const updatedImages = [...prevData.image];
                                                    updatedImages[index].isActive = e.target.value === "true";
                                                    return { ...prevData, image: updatedImages };
                                                })}
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                    </div>
                                ))} */}

                                <div className="text-center" style={{ paddingTop: '30px' }}>
                                    <button type="submit" className="btn btn-success me-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>Update Kosan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UpdateDataKosan;
