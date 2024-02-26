import React, { useState, useEffect } from 'react';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddDataBooking() {
    const navigate = useNavigate();
    const role = useSelector((state) => state.authentication.role);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;
    
    const [newBooking, setNewBooking] = useState({
        kostId: "",
        customerId: "",
        monthTypeId: "",
        paymentTypeId: "",
    });

    const [kostOptions, setKostOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [monthTypeOptions, setMonthTypeOptions] = useState([]);
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch data for kost options
        axios.get('/kost', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setKostOptions(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching kost options:', error);
            });

        // Fetch data for customer options
        axios.get('/customer/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCustomerOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer options:', error);
            });

        // Fetch data for month type options
        axios.get('/month/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setMonthTypeOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching month type options:', error);
            });

        // Fetch data for payment type options
        axios.get('/payment/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setPaymentTypeOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching payment type options:', error);
            });
    }, []);

    const handleAddBooking = (e) => {
        e.preventDefault();

        setIsLoading(true);

        axios.post(`/transactions`, newBooking, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(() => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Add Booking Successful',
                    text: 'Your booking was successful!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dataBooking');
                });
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/booking" style={{ textDecoration: "none", color: "black" }}>Booking</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Add Booking</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} title="Kembali" onClick={() => navigate("/dataBooking")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Add Booking</h3>
                            <form className="row g-3" onSubmit={handleAddBooking}>
                                {/* Kost */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="kostId" className="form-label">Kost</label>
                                    <select
                                        style={{ borderColor: 'black' }}
                                        id="kostId"
                                        className="form-select"
                                        value={newBooking.kostId}
                                        onChange={(e) => setNewBooking({ ...newBooking, kostId: e.target.value })}
                                    >
                                        <option value="">Select Kost</option>
                                        {kostOptions.map(kost => (
                                            <option key={kost.id} value={kost.id}>{kost.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Customer */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="customerId" className="form-label">Customer</label>
                                    <select
                                        style={{ borderColor: 'black' }}
                                        id="customerId"
                                        className="form-select"
                                        value={newBooking.customerId}
                                        onChange={(e) => setNewBooking({ ...newBooking, customerId: e.target.value })}
                                    >
                                        <option value="">Select Customer</option>
                                        {customerOptions.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.fullName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Month Type */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="monthTypeId" className="form-label">Month Type</label>
                                    <select
                                        style={{ borderColor: 'black' }}
                                        id="monthTypeId"
                                        className="form-select"
                                        value={newBooking.monthTypeId}
                                        onChange={(e) => setNewBooking({ ...newBooking, monthTypeId: e.target.value })}
                                    >
                                        <option value="">Select Month Type</option>
                                        {monthTypeOptions.map(monthType => (
                                            <option key={monthType.id} value={monthType.id}>{monthType.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Payment Type */}
                                <div className="col-6 mb-2">
                                    <label htmlFor="paymentTypeId" className="form-label">Payment Type</label>
                                    <select
                                        style={{ borderColor: 'black' }}
                                        id="paymentTypeId"
                                        className="form-select"
                                        value={newBooking.paymentTypeId}
                                        onChange={(e) => setNewBooking({ ...newBooking, paymentTypeId: e.target.value })}
                                    >
                                        <option value="">Select Payment Type</option>
                                        {paymentTypeOptions.map(paymentType => (
                                            <option key={paymentType.id} value={paymentType.id}>{paymentType.name}</option>
                                        ))}
                                    </select>
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

export default AddDataBooking;
