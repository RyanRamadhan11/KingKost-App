import React, { useEffect, useState } from 'react';
import axios from '../../store/axiosInterceptor';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaUser, FaWhatsapp, FaMoneyBill, FaAddressBook, FaMoneyBillAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading status
    const userId = useSelector((state) => state.authentication.userId);
    const [transactionDate, setTransactionDate] = useState(new Date());
    
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userDataResponse = await axios.get(`/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const matchedUser = userDataResponse.data.data;
                const customerId = matchedUser.id;
                const response = await axios.get(`/transactions?customerId=${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTransactions(response.data.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [userId]);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const handleCancel = async (transactionId) => {
        try {
            setLoading(true); // Set loading to true when cancellation process starts

            const responseLogin = JSON.parse(localStorage.getItem('userLogin'));
            const responseCustomer = await axios.get(`/customer/user/${responseLogin.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
            const customerId = responseCustomer.data.data.id;

            await axios.post(
                `/transactions/cancel?transactionId=${transactionId}&customerId=${customerId}`, null,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
              
            // Refresh transaction history after cancellation
            const response = await axios.get(`/transactions?customerId=${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data.data);

            setLoading(false); // Set loading to false after cancellation process is completed
            // Display success alert
            Swal.fire({
                icon: 'success',
                title: 'Cancel Booking Successful',
                text: 'Your booking has been successfully cancelled!',
            });
        } catch (error) {
            setLoading(false); // Set loading to false if there's an error during cancellation process
            console.error('Error cancelling booking kos:', error);
            // Display error alert
            Swal.fire({
                icon: 'error',
                title: 'Booking Error',
                text: 'There was an error while cancel booking kost. Please try again later.',
            });
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mt-5 mb-4">Transaction History</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="col-md-4">
                        <Card className="shadow rounded h-100">
                            <Card.Body>
                                <img src={transaction.kost.images[0].url} alt="Kost Image" className="img-fluid rounded mb-3" />
                                <h5 className="card-title">{transaction.kost.name}</h5>
                                <p className="mb-3">{formatRupiah(transaction.kost.kostPrice.price)} <FaMoneyBillAlt className='mb-1'/>  </p>
                                <p className="card-text mb-3">{transaction.kost.description}</p>
                                <span>Seller Name : </span>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <p className="mb-0"><FaUser /> {transaction.kost.seller.fullName}</p>
                                    <Link to={`https://wa.me/${transaction.kost.seller.phoneNumber}`} target="_blank" className="btn btn-success btn-sm" style={{borderRadius: '10px'}}><FaWhatsapp /> Chat Seller</Link>
                                </div>
                                <hr />
                                <span>Data Customer : </span>
                                <p className="mb-0"><FaEnvelope /> {transaction.customer.email}</p>
                                <p className="mb-0"><FaPhone /> {transaction.customer.phoneNumber}</p>
                                <p className="mb-0"><FaAddressBook /> {transaction.customer.address}</p>
                                <hr />
                                <span>Data Booking : </span>
                                <p className='mt-2'> Payment Type : <FaMoneyBillAlt className='ms-2'/> {transaction.paymentType.name}</p>
                                <p className='mt-2'> Stay For : {transaction.monthType.name}</p>
                                <div className="mb-3">
                                    <p className='me-2'>Transaction Date :
                                        <DatePicker className='ms-2 form-control form-control-sm' selected={transactionDate} onChange={date => setTransactionDate(date)} dateFormat="dd/MM/yyyy" />
                                    </p>
                                </div>
                                    <p>Status Booking: 
                                        <span className={`badge ${
                                            transaction.aprStatus === 0 ? 'bg-info' :
                                            transaction.aprStatus === 1 ? 'bg-danger' :
                                            transaction.aprStatus === 2 ? 'bg-warning' :
                                            transaction.aprStatus === 3 ? 'bg-success' : 'bg-danger'}`}
                                            style={{ padding: '10px', fontSize: '12px', borderRadius: '10px', marginLeft: '1rem' }}>
                                            {transaction.aprStatus === 0 ? 'Pending' :
                                            transaction.aprStatus === 1 ? 'Cancel' :
                                            transaction.aprStatus === 2 ? 'Reject' :
                                            transaction.aprStatus === 3 ? 'Approve' : 'Unknown'}
                                        </span>
                                    </p>
                                {transaction.aprStatus === 0 && (
                                <div className='mt-3 d-flex justify-content-end'>
                                    <button 
                                        className="btn btn-danger btn-sm text-white fw-bold" 
                                        style={{borderRadius: '10px'}} 
                                        onClick={() => handleCancel(transaction.id)} 
                                        disabled={loading} // Disable the button when loading is true
                                    >
                                        {loading ? 'Processing...' : 'Cancel Booking'} {/* Change button text to "Processing..." when loading is true */}
                                    </button>
                                </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
