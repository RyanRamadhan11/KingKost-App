import React, { useState, useEffect } from 'react';
import axios from '../../store/axiosInterceptor.js';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import defaultUserImg from '../../assets/img/default-user.png';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGenderless, FaUpload, FaUser, FaWhatsapp, FaMoneyBill, FaVoicemail, FaFileMedicalAlt, FaAddressBook, FaMoneyBillAlt, FaCashRegister } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const BookingKost = () => {
    const [customers, setCustomers] = useState([]);
    const [kosans, setKosans] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [monthType, setMonthType] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [loading, setLoading] = useState(false); // State for loading screen
    const { id } = useParams();

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

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
                setCustomerName(responseCustomer.data.data.fullName);
                setCustomers([responseCustomer.data.data]); // Set customers as an array with a single object
                
                console.log("data customer nih:")
                console.log([responseCustomer.data.data])
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                // Mengambil data kosan menggunakan kostId dan customerId
                const responseKosan = await axios.get(`/kost/id`, {
                    params: {
                        kostId: id,
                        customerId: customerId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("data kosan nih:")
                console.log([responseKosan.data.data])
        
                setKosans([responseKosan.data.data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const responseMonth = await axios.get('/month/v1', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMonthType(responseMonth.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const responsePayment = await axios.get('/payment/v1', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPaymentType(responsePayment.data);
            } catch (error) {
                console.error('Error while fetching data', error);
            }
        };

        fetchData();
    }, [id, token, customerId]);


    const handleBooking = async () => {
        if (kosans.some(kosan => kosan.availableRoom < 1)) {
            Swal.fire({
                icon: 'error',
                title: 'Booking Error',
                text: 'No available rooms to book.',
            });
            return;
        }
    
        if (kosans.some(kosan => kosan.currentBookingStatus === 0)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You have already booked this boarding house and it is in the pending/process stage.',
            });
            return;
        }
    
        setLoading(true); // Set loading to true when booking process starts
        try {
            const response = await axios.post('/transactions', {
                kostId: id,
                customerId: customerId,
                paymentTypeId: selectedPayment, // Use paymentTypeId instead of paymentId
                monthTypeId: selectedMonth,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log('Booking successful:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Booking Successful',
                text: 'Your booking has been successfully placed!',
            }).then((result) => {
                // Redirect to seller's WhatsApp when the user clicks OK
                if (result.isConfirmed) {
                    const sellerPhoneNumber = kosans[0].seller.phoneNumber;
                    const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;
                    window.open(whatsappLink, '_blank');
                }
            });
        } catch (error) {
            console.error('Error booking kost:', error);
            Swal.fire({
                icon: 'error',
                title: 'Booking Error',
                text: 'There was an error while booking the kost. Please try again later.',
            });
        } finally {
            setLoading(false); // Set loading to false when booking process ends
        }
    };
    
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const monthText = {
        ONE_MONTH: '1 Month',
        TWO_MONTH: '2 Month',
        THREE_MONTH: '3 Month',
        FOUR_MONTH: '4 Month',
        FIVE_MONTH: '5 Month',
        SIX_MONTH: '6 Month',
        SEVEN_MONTH: '7 Month',
        EIGHT_MONTH: '8 Month',
        NINE_MONTH: '9 Month',
        TEN_MONTH: '10 Month',
        ELEVEN_MONTH: '11 Month',
        TWELVE_MONTH: '12 Month'
    };
    

    return (
        <div className="container-fluid mt-5">
            <div className="card mb-4 p-3">
                <h2 style={{ margin: "10px 0px 10px 10px", fontFamily: "Arial, sans-serif", textShadow: "1px 1px 1px #888" }}>Booking Kos</h2>
                <nav>
                    <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                        <li className="breadcrumb-item"><Link style={{ textDecoration: "none", color: "black", fontFamily: "Arial, sans-serif" }} to="/dataTestimoni">KOS</Link></li>
                        <li className="mx-2">/</li>
                        <li className="breadcrumb-item active">BOOKING KOS</li>
                    </ol>
                </nav>
                <div className="card-header fw-bold" style={{ fontFamily: "Arial, sans-serif", textShadow: "1px 1px 1px #888" }}>
                    <i className="fa fa-comments" style={{ marginRight: "10px" }}></i>
                    BOOKING KOS
                </div>

                <div className="booking-container p-5">
                    <div className='booking-card' style={{ width: '40%', height: '100%', fontFamily: "Arial, sans-serif", boxShadow: "2px 2px 5px #888", padding: "15px", margin: "10px" }}>
                        {kosans.map((kosan) => (
                            <div key={kosan.id} style={{ height: '100%' }}>
                                <img
                                    src={kosan.images.length > 0 ? kosan.images[0].url : defaultUserImg}
                                    alt={kosan.images.length > 0 ? kosan.images[0].fileName : 'Placeholder'}
                                    style={{ height: '100%', width: '100%', borderRadius: '25px', marginBottom: '10px' }}
                                    className='booking-card-img p-3'
                                />
                                <div className='booking-card ms-4' style={{ height: '100%' }}>
                                    
                                    <label className='fw-bold' style={{ color: 'black' }}>{kosan.name}</label>
                                    
                                    <label className='mx-4 mb-3' style={{ color: 'black' }} htmlFor="">|| <FaMoneyBill className='mb-1 ms-3 me-2' /> {formatRupiah(kosan.kostPrice.price)}</label>
                                    
                                    <p className="detail-address text-dark">{kosan.province.name} || {kosan.city.name} || {kosan.subdistrict.name}</p>
                                    <p className='pt-3'>{kosan.description}</p>
                                    <div className="detail-feature ms-2">
                                                    <i className="fas fa-bed text-primary"></i>
                                                    <span className='ms-2'>Available : {kosan.availableRoom} Room</span>
                                                </div>
                                    <p className='mt-3'>
                                        <i className={`fa fa-wifi ${kosan.isWifi ? 'text-success' : 'text-danger'}`}></i> WiFi: {kosan.isWifi ? 'Yes' : 'No'} |
                                        <i className={`ps-1 fa fa-thermometer-three-quarters ${kosan.isAc ? 'text-success' : 'text-danger'}`}></i> AC: {kosan.isAc ? 'Yes' : 'No'} |
                                        <i className={`ps-1 fa fa-car ${kosan.isParking ? 'text-success' : 'text-danger'}`}></i> Park: {kosan.isParking ? 'Yes' : 'No'}
                                    </p>

                                    <div>
                                        <label className='mb-2' htmlFor="">Seller Data:</label>
                                    </div>
                                    <div className='d-flex'>
                                        <p className=''><FaUser className='mb-1 me-2' />{kosan.seller.fullName}</p>
                                        <p className='ms-4'><FaWhatsapp className='mb-1 me-2' />{kosan.seller.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='booking-card p-4' style={{ width: '80%', height: '100%', fontFamily: "Arial, sans-serif", boxShadow: "2px 2px 5px #888", padding: "15px", margin: "10px" }}>
                        <div className="row">
                            <div className='col-md-5'>
                                {customers.map((customer) => (
                                    <div className='booking-card p-4' style={{ borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                                    <div key={customer.id}>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                className="img-fluid"
                                                src={customer.url ? customer.url : defaultUserImg}
                                                alt={customer.url ? customer.url : 'Placeholder Image'}
                                                style={{ height: '50px', width: '50px', borderRadius: '15px' }}
                                            />
                                            <div className='ps-3 d-flex flex-column'>
                                                <label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>{customer.fullName}</label>
                                                <label style={{ color: '#666' }}>{customer.email}</label>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className='p-4'>
                                        <p style={{ marginBottom: '5px' }}>
                                            <FaPhone /> <span style={{ marginLeft: '5px' }}>{customer.phoneNumber}</span>
                                        </p>
                                        <p style={{ marginBottom: '5px' }}>
                                            <FaMapMarkerAlt /> <span style={{ marginLeft: '5px' }}>{customer.address}</span>
                                        </p>
                                        <p style={{ marginBottom: '5px' }}>
                                            <FaGenderless /> <span style={{ marginLeft: '5px' }}>{customer.genderTypeId.name}</span>
                                        </p>
                                    </div>
                                </div>
                                ))}
                            </div>

                            <div className='booking-card p-4 col-md-7 d-flex'  style={{ borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                                <div>
                                    <p>Silahkan Pilih Berapa lama waktu Kos :</p>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        style={{ width: "70%", padding: "5px", borderRadius: "5px" }}
                                    >
                                        {monthType.map((month) => (
                                            <option key={month.id} value={month.id}>
                                                {monthText[month.name]}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div className='ps-5'>
                                    <p> Metode Pembayaran : </p>
                                    <ul className='mt-3'>
                                        {paymentType.map((paymentType) => (
                                        <li key={paymentType.id}>
                                            <input
                                            type="radio"
                                            name="payment"
                                            value={paymentType.id}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                        />
                                            {paymentType.name}
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className=' mt-3 d-flex justify-content-end booking-card p-2'  style={{ borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            <button 
                                className="booking-button" 
                                onClick={handleBooking} 
                                style={{ 
                                    fontFamily: "Arial, sans-serif", 
                                    padding: "10px 20px", 
                                    borderRadius: "5px", 
                                    color: "#fff", 
                                    border: "none", 
                                    cursor: "pointer" 
                                }}
                                disabled={loading} // Disable the button when loading is true
                            >
                                {loading ? 'Processing...' : 'Book Kost'} {/* Change button text to "Processing..." when loading is true */}
                            </button>
                        </div>


                    </div>
                </div>
            </div>
            
        </div>
 
    );
};

export default BookingKost;
