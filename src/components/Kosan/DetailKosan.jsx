import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../store/axiosInterceptor';
import Swal from "sweetalert2";
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DetailKosan() {
    const { kostId } = useParams(); // Mendapatkan nilai kostId dari URL

    const [kosanData, setKosanData] = useState({});
    const [startDate, setStartDate] = useState('');
    const [months, setMonths] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const userId = useSelector((state) => state.authentication.userId);
    const navigate = useNavigate();

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mendapatkan customerId dari Redux
                const userDataResponse = await axios.get(`/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const matchedUser = userDataResponse.data.data;
                const customerId = matchedUser.id;

                // Mendapatkan kostId dari URL
                const searchParams = new URLSearchParams(window.location.search);
                const kostId = searchParams.get('kostId');

                // Mengambil data kosan menggunakan kostId dan customerId
                const responseKosan = await axios.get(`/kost/id`, {
                    params: {
                        kostId: kostId,
                        customerId: customerId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const kosan = responseKosan.data.data;

                setKosanData(kosan);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You have already booked this boarding house and it is in the pending/process stage.',
                });
                
                // Redirect ke halaman /kosan
                navigate(`/kosan`);
            }
        };

        fetchData();
    }, [userId, navigate]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleCalculateCost = () => {
        // Periksa apakah kosanData memiliki properti kostPrice
        if (kosanData && kosanData.kostPrice) {
            const pricePerMonth = kosanData.kostPrice.price;
            const total = pricePerMonth * months;
            setTotalCost(total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }));
        } else {
            console.error('Error: Unable to calculate cost. kosanData.kostPrice is undefined.');
            // Tampilkan pesan kesalahan kepada pengguna
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while calculating the cost. Please try again later.',
            });
            
        }
    };

    if (!kosanData) {
        return <div>Data Kosong</div>;
    }

    return (
        <div className="container">
            <div className="row my-3">
                <div className="col-md-6">
                    <div key={kosanData.id} className="card shadow px-3" style={{ borderRadius: '15px' }}>
                        <div className="card-body">
                            {kosanData.images && kosanData.images.length > 1 ? (
                                <Carousel>
                                    {kosanData.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img
                                                className="d-block w-100 h-50"
                                                src={image.url}
                                                alt={image.alt}
                                                style={{ borderRadius: '15px' }}
                                            />
                                            <Carousel.Caption>
                                                <h3>{image.caption}</h3>
                                                <p>{image.description}</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    className="d-block w-100 h-50"
                                    src={kosanData.images && kosanData.images[0].url}
                                    alt={kosanData.images && kosanData.images[0].alt}
                                    style={{ borderRadius: '15px' }}
                                />
                            )}
                            <div className="col-md-12">
                                <div className="detail-header">
                                    <div className="detail-header-info mt-3">
                                        <h4 className="detail-title" style={{ fontFamily: 'sans-serif' }}>{kosanData.name}</h4>
                                        <p className='mb-2'> {kosanData.description} </p>

                                        <label className="detail-address text-dark">{kosanData.province && kosanData.province.name} || {kosanData.city && kosanData.city.name}</label>
                                        <p className="detail-title">{kosanData.subdistrict && kosanData.subdistrict.name}</p>

                                        <div className="detail-features row">
                                            <div className="col-md-4">
                                                <div className="detail-feature ms-2">
                                                    <i className="fas fa-bed text-primary"></i>
                                                    <span className='ms-2'>Available : {kosanData.availableRoom} Room</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="detail-feature">
                                                    <i className="fas fa-user-friends text-primary"></i>
                                                    <span className='ms-2'>{kosanData.genderType && kosanData.genderType.name}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-price my-3">
                                            <i className="fas fa-solid fa-tag text-danger"></i>
                                            <span className='ms-2'> {kosanData.kostPrice && kosanData.kostPrice.price.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR'
                                            })}/month</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-amenities">
                                    <h5>Fasilitas</h5>
                                    <ul className="list-unstyled">
                                        <li>
                                            <i className={`fas fa-wifi me-2 ${kosanData.isWifi ? 'text-primary' : 'text-danger'}`}></i>
                                            {kosanData.isWifi ? 'WiFi' : 'No WiFi'}
                                        </li>
                                        <li className='ms-1'>
                                            <i className={`fas fa-snowflake me-2 ${kosanData.isAc ? 'text-primary' : 'text-danger'}`}></i>
                                            {kosanData.isAc ? 'AC' : 'No AC'}
                                        </li>
                                        <li className='ms-1'>
                                            <i className={`fas fa-parking me-2 ${kosanData.isParking ? 'text-primary' : 'text-danger'}`}></i>
                                            {kosanData.isParking ? 'Parking' : 'No Parking'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-3" style={{ borderRadius: '15px' }}>
                        <div className="card-body shadow">
                            <h5 className="card-title">Simulasi Penghitungan Biaya</h5>
                            <div className="mb-3">
                                <label htmlFor="startDate" className="form-label">Tanggal Mulai Kos</label>
                                <input type="date" className="form-control" id="startDate"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={startDate}
                                    onChange={handleStartDateChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="months" className="form-label">Bulan Kos</label>
                                <input type="number" className="form-control" id="months" min="0" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} />
                            </div>
                            <button className="btn btn-primary" onClick={handleCalculateCost}
                                style={{
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    color: 'white'
                                }}>Hitung Biaya
                            </button>
                            <div className="mt-3">
                                <h5>Total Biaya: <span id="totalCost">{totalCost}/Month</span></h5>
                            </div>
                            <Link to={`https://wa.me/${kosanData.seller && kosanData.seller.phoneNumber}`} target='_blank'
                                className="btn btn-success mt-3 me-3"
                                style={{ borderRadius: '10px', textDecoration: 'none', color: 'white' }}>
                                <i className="fas fa-comment"></i> Chat Pemilik Kos
                            </Link>
                            {kosanData.currentBookingStatus === 0 ? (
                                <button className="btn btn-danger mt-3"
                                    style={{ borderRadius: '10px', textDecoration: 'none', color: 'white' }}
                                    onClick={() => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: 'Kosan ini sudah pernah Anda booking dan dalam tahap pending/proses.',
                                        });
                                    }}>
                                    Book Now
                                </button>
                            ) : (
                                <Link to={`/booking/${kosanData.id}`} className="btn btn-danger mt-3"
                                    style={{ borderRadius: '10px', textDecoration: 'none', color: 'white' }}>
                                    Book Now
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="detail-contact pb-5">
                        <div className="card shadow" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <h5 className="card-title">Hubungi Penyewa/Seller Kosan</h5>
                                <div className="contact-info d-flex align-items-center">
                                    <div className="contact-detail flex-grow-1">
                                        <span>{kosanData.seller && kosanData.seller.fullName}</span>
                                        <p className='pt-2'>
                                            <i className="bi bi-geo-alt-fill"></i> {kosanData.seller && kosanData.seller.address}<br />
                                            <i className="bi bi-envelope-fill"></i> {kosanData.seller && kosanData.seller.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailKosan;
