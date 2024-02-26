import React, { useState, useEffect } from 'react';
import axios from '../../store/axiosInterceptor';
import DefaultImage from '../../assets/img/DefaultImage.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

function Kosan() {
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [subdistrictOptions, setSubdistrictOptions] = useState([]);

  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [subdistrictId, setSubdistrictId] = useState('');

  const [genderFilter, setGenderFilter] = useState('');

  const [kosanData, setKosanData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState(null); 

  const tokenString = localStorage.getItem('userLogin');
  const token = tokenString ? JSON.parse(tokenString).token : null;

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLogin = JSON.parse(localStorage.getItem('userLogin'));
        const responseCustomer = await axios.get(`/customer/user/${responseLogin.userId}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
        });
        setCustomerId(responseCustomer.data.data.id);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchData();
  }, []);

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
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(`/kost?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      const { data } = response.data;
      setKosanData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const filteredKosans = kosanData.filter(kosan =>
    (genderFilter === '' || kosan.genderType.name.toLowerCase().includes(genderFilter.toLowerCase())) &&
    (provinceId === '' || kosan.province.id === provinceId) &&
    (cityId === '' || kosan.city.id === cityId) &&
    (subdistrictId === '' || kosan.subdistrict.id === subdistrictId)
  );

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setProvinceId(provinceId);
    setCityId(""); // Reset city selection when province changes
    setSubdistrictId(""); // Reset subdistrict selection when province changes
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setCityId(cityId);
    setSubdistrictId(""); // Reset subdistrict selection when city changes
  };

  const handleSubdistrictChange = (e) => {
    setSubdistrictId(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage >= 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleButtonClick = (kosan) => {
    if (kosan.currentBookingStatus === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have already booked this boarding house and it is in the pending/process stage.',
    });
    
    } else {
    
      navigate(`/kost/id?kostId=${kosan.id}&customerId=${customerId}`);
    }
  };
  

  return (
    <div className="container" style={{ paddingTop: '5em', paddingBottom: '10em' }}>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          {/* Filter section */}
          <div className="mb-4">
            <div className="row">
              <div className="col">
                <select
                  className="form-select"
                  value={provinceId}
                  onChange={handleProvinceChange}
                >
                  <option value="">Select Province</option>
                  {provinceOptions.map(province => (
                    <option key={province.id} value={province.id}>{province.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={cityId}
                  onChange={handleCityChange}
                  disabled={!provinceId}
                >
                  <option value="">Select City</option>
                  {cityOptions.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={subdistrictId}
                  onChange={handleSubdistrictChange}
                  disabled={!cityId}
                >
                  <option value="">Select Subdistrict</option>
                  {subdistrictOptions.map(subdistrict => (
                    <option key={subdistrict.id} value={subdistrict.id}>{subdistrict.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={handleGenderChange}
                  style={{ borderRadius: '15px 0 0 15px', minWidth: '80px' }}
                >
                  <option value="">Select By Type</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
          {/* Kosan cards */}
          <div className="row g-4 justify-content-center mt-4">
            {filteredKosans.map((kosan, index) => (
              <div key={kosan.id} className="col-lg-4 col-md-6">
                <div className="card">
                  {/* <Link to={`/kost/id?kostId=${kosan.id}&customerId=${customerId}`} style={{ textDecoration: 'none', color: 'inherit' }}> */}
                  <div className="overflow-hidden" style={{ height: '200px' }}>
                    <Carousel>
                      {kosan.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={image.url}
                            alt={image.fileName}
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        </Carousel.Item>
                      ))}
                      {/* If there are less than 5 images, fill the remaining slides with default image */}
                      {/* {kosan.images.length < 5 &&
                        Array.from({ length: 5 - kosan.images.length }).map((_, index) => (
                          <Carousel.Item key={kosan.images.length + index + 1}>
                            <img
                              className="d-block w-100"
                              src={DefaultImage}
                              alt="Placeholder"
                              style={{ height: '100%', objectFit: 'cover' }}
                            />
                          </Carousel.Item>
                        ))} */}
                    </Carousel>
                  </div>
                    <div className="card-body">
                      <div className="d-flex border-bottom">
                        <small className="flex-fill text-center border-end py-2">
                          <i className="fa fa-map-marker-alt text-primary me-2"></i>
                          {kosan.city.name}
                        </small>
                        <small className="flex-fill text-center border-end py-2">
                          <i className="fa fa-calendar-alt text-primary me-2"></i>
                          Available Rooms: {kosan.availableRoom}
                        </small>
                        <small className="flex-fill text-center py-2">
                          <i className="fa fa-solid fa-venus-mars text-primary me-2"></i>
                          Gender Kosan: {kosan.genderType.name}
                        </small>
                      </div>
                      <div className="text-center p-4">
                        <h4 className="mb-2">{formatRupiah(kosan.kostPrice.price)}/month</h4>
                        <p className='mb-2'>{kosan.name}</p>
                        <label className='mb-3'>Seller: {kosan.seller.fullName}</label>
                        <div className="">
                          {Array.from({ length: kosan.rating }, (_, index) => (
                            <small key={index} className="fa fa-star text-primary"></small>
                          ))}
                        </div>
                        <p>{kosan.description}</p>
                        <div>
                          <p className='mb-2 text-dark'>Address: {kosan.subdistrict.name}, {kosan.city.name}, {kosan.province.name}</p>
                          <div>
                            <p className='mb-4'>
                              <i className={`fa fa-wifi ${kosan.isWifi ? 'text-success' : 'text-danger'}`}></i> WiFi: {kosan.isWifi ? 'Yes' : 'No'} |
                              <i className={`ps-1 fa fa-thermometer-three-quarters ${kosan.isAc ? 'text-success' : 'text-danger'}`}></i> AC: {kosan.isAc ? 'Yes' : 'No'} |
                              <i className={`ps-1 fa fa-car ${kosan.isParking ? 'text-success' : 'text-danger'}`}></i> Park: {kosan.isParking ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                        <div>
                        <button className='btn btn-secondary' onClick={() => handleButtonClick(kosan)}>View Detail</button>
                        </div>
                      </div>
                    </div>
                  {/* </Link> */}
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <nav className='mt-5'>
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
        </>
      )}
    </div>
  );
}

export default Kosan;
