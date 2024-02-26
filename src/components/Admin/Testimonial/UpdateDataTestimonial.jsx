import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function UpdateDataTestimonial() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const [reviewData, setReviewData] = useState({
        id: "",
        message: "",
        customerId: "",
    });

    const [errors, setErrors] = useState({
        id: "",
        message: "",
        customerId: "",
    });

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get(`/review/v1/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setReviewData(response.data);
            })
            .catch(error => {
                console.error('Error fetching review data:', error);
            });

        axios.get('/customer/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            });
    }, [id]);

    const validateForm = () => {
        const validationErrors = {
            message: reviewData.message.trim() === "" ? "Message is required" : "",
            customerId: reviewData.customerId === "" ? "Customer is required" : "",
        };

        setErrors(validationErrors);

        const isFormValid = Object.values(validationErrors).every(error => error === "");

        return isFormValid;
    };

    const handleUpdateReview = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        axios.put(`/review/v1`, reviewData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log('Review berhasil diubah:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Review Updated Succesfully',
                    text: 'Review berhasil diperbarui!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dataTestimoni'); 
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Review Failed',
                    text: 'An error occurred during update review. Please try again later.',
                    confirmButtonText: 'OK'
                });
            });
    };

    const handleResetForm = () => {
        setReviewData({
            id: "",
            message: "",
            customerId: "",
        });
        setErrors({
            message: "",
            customerId: "",
        });
    };

    return (
        <section className="section">
            <h2 style={{ margin: "30px 0px 10px 10px" }}>Dashboard</h2>
            <nav>
                <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                    <li className="breadcrumb-item"><Link to="/customer" style={{ textDecoration: "none", color: "black" }}>Customer</Link></li>
                    <li className="mx-2">/</li>
                    <li className="breadcrumb-item active">Form Update Review</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card p-3" style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                        <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                            <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} title="Kembali" onClick={() => navigate("/dataTestimoni")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </button>
                        </div>
                        <div className="card-body p-5">
                            <h3 className="card-title text-center mb-5">Form Update Review</h3>
                            <form className="row g-3" onSubmit={handleUpdateReview}>
                                <div className="col-12">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <input
                                        type="text"
                                        id="message"
                                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        value={reviewData.message}
                                        onChange={(e) => setReviewData({ ...reviewData, message: e.target.value })}
                                    />
                                    <div className="invalid-feedback">{errors.message}</div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="customerId" className="form-label">Customer</label>
                                    <select
                                        id="customerId"
                                        style={{ borderColor: 'black'}} 
                                        className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                                        value={reviewData.customerId}
                                        onChange={(e) => setReviewData({ ...reviewData, customerId: e.target.value })}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.fullName}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.customerId}</div>
                                </div>
                                <div className="text-center" style={{paddingTop: '30px'}}>
                                    <button type="submit" className="btn btn-success me-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>Update Review</button>
                                    <button type="button" className="btn btn-dark" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}} onClick={handleResetForm}>Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UpdateDataTestimonial;
