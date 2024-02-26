import React, { useState, useEffect } from 'react';
import axios from '../../../store/axiosInterceptor';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ApproveBooking() {
    const { id } = useParams(); // Mengambil transactionId dari URL
    const navigate = useNavigate();
    const userId = useSelector((state) => state.authentication.userId);
    const [isLoading, setIsLoading] = useState(false);
    const [approveValue, setApproveValue] = useState('');
    const [sellerId, setSellerId] = useState('');

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        // Mengambil sellerId dari API
        axios.get(`/seller/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                const matchedUser = response.data.data;
                const sellerId = matchedUser.id;
                setSellerId(sellerId);
            })
            .catch(error => {
                console.error('Error fetching seller data:', error);
            });
    }, [userId]);


    const handleApproveBooking = (e) => {
        e.preventDefault();
    
        setIsLoading(true);
    
        axios.post(`/approv?transactionId=${id}&approv=${approveValue}&sellerId=${sellerId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                setIsLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Approve Successful',
                    text: 'Booking has been approved successfully!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dataBooking'); // Redirect ke halaman dataBooking setelah approve berhasil
                });
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Error approving booking:', error);
            });
    };
    
    return (
        <section className="section">
            {/* Konten form approve booking */}
            <div className="card p-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <div className="mt-4 ps-3" style={{ width: "550px", marginLeft: "18px" }}>
                    <button className="btn btn-warning btn-sm fw-bold" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }} title="Kembali" onClick={() => navigate("/dataBooking")}>
                        <i className="fa fa-arrow-circle-left"></i> Back
                    </button>
                </div>
                <div className="card-body p-5">
                    <h3 className="card-title text-center mb-5">Approve Booking Form</h3>
                    <form className="row g-3" onSubmit={handleApproveBooking}>
                        {/* Field untuk memilih status approve */}
                        <div className="col-12 mb-2">
                            <label htmlFor="approve" className="form-label">Approve Status</label>
                            <select
                                id="approve"
                                className="form-select"
                                value={approveValue}
                                onChange={(e) => setApproveValue(e.target.value)}
                            >
                                <option value="">Select Approve Status</option>
                                {/* <option value="0">Pending</option>
                                <option value="1">Cancel</option> */}
                                <option value="2">Reject</option>
                                <option value="3">Approved</option>
                            </select>
                        </div>

                        {/* Tombol Submit */}
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
        </section>
    )
}

export default ApproveBooking;
