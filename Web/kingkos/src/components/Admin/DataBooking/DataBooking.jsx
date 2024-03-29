import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../store/axiosInterceptor';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BsCheck, BsX, BsSearch } from 'react-icons/bs'; 
import { FaCheck, FaHamburger } from 'react-icons/fa';

function DataBooking() {
    const [bookingData, setBookingData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const userId = useSelector((state) => state.authentication.userId);
    const userRole = useSelector((state) => state.authentication.role);
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const role = useSelector((state) => state.authentication.role);

    const [searchTerm, setSearchTerm] = useState('');
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [subdistrictOptions, setSubdistrictOptions] = useState([]);

    const [provinceId, setProvinceId] = useState('');
    const [cityId, setCityId] = useState('');
    const [subdistrictId, setSubdistrictId] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

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
    }, [token]); // Perubahan token akan memicu pengambilan data provinsi baru

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
    }, [provinceId, token]); // Perubahan token atau provinceId akan memicu pengambilan data kota baru

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
    }, [cityId, token]); // Perubahan token atau cityId akan memicu pengambilan data kecamatan baru

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, provinceId, cityId, subdistrictId, searchStatus, token]); // Perubahan token akan memicu pengambilan data baru

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
                if (searchTerm.trim() !== '') {
                    response = await axios.get(`/transactions?sellerId=${sellerId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    response = await axios.get(`/transactions?sellerId=${sellerId}&page=${currentPage}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            } else if (userRole === "ROLE_ADMIN") {
                if (searchTerm.trim() !== '') {
                    response = await axios.get(`/transactions?page=${currentPage}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    response = await axios.get(`/transactions?page=${currentPage}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }
            const { data } = response.data;
    
            // Filter data booking berdasarkan nama kost, nama pelanggan, nama penjual
            const filteredData = data.filter(transaction =>
                (transaction.kost.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                transaction.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                transaction.kost.seller.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (searchStatus === '' || transaction.aprStatus === parseInt(searchStatus)) &&
                (provinceId === '' || transaction.kost.province.id === provinceId) &&
                (cityId === '' || transaction.kost.city.id === cityId) &&
                (subdistrictId === '' || transaction.kost.subdistrict.id === subdistrictId)
            );
    
            setBookingData(filteredData);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        }
    };

    const handleApprove = (transactionId, aprStatus) => {
        if (aprStatus !== 0) { // Jika status bukan 'Pending'
            // Tampilkan pesan SweetAlert bahwa status sudah diubah
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Change Status',
                text: 'The status of this transaction has already been changed and cannot be modified.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
        } else {
            navigate(`/approveBooking/${transactionId}`);
        }
    };

    const handleReject = (transactionId, customerId, aprStatus) => {
        if (aprStatus !== 0) { // Jika status bukan 'Pending'
            // Tampilkan pesan SweetAlert bahwa status sudah diubah
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Change Status',
                text: 'The status of this transaction has already been changed and cannot be modified.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to reject this transaction!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Reject'
            }).then((result) => {
                if (result.isConfirmed) {
                    rejectTransaction(transactionId, customerId); // Memasukkan customerId sebagai argumen
                }
            });
        }
    };

    const rejectTransaction = async (transactionId, customerId) => {
        try {
            setIsUploading(true);
            const response = await axios.post(`/transactions/cancel?transactionId=${transactionId}&customerId=${customerId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Transaction canceled successfully');
            fetchData(); // Fetch updated data
            setIsUploading(false);
            Swal.fire({
                icon: 'success',
                title: 'Transaction Canceled',
                text: 'The transaction has been canceled successfully!',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error canceling transaction:', error);
            setIsUploading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while canceling the transaction. Please try again later.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePrevPage = () => {
        if (currentPage >= 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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

    const handleStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };

    return (
        <div className="container-fluid mt-5">
            <div className="card mb-4 p-3">
                <h2 style={{ margin: "10px 0px 10px 10px" }}>Booking List</h2>
                <nav>
                    <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                        <li className="breadcrumb-item"><Link style={{ textDecoration: "none", color: "black" }} to="/customer">Data Master</Link></li>
                        <li className="mx-2">/</li>
                        <li className="breadcrumb-item active">Booking</li>
                    </ol>
                </nav>
                <div className="card-header fw-bold">
                    <i className="fa fa-file" style={{ marginRight: "10px" }}></i>
                    DATA Booking
                </div>
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-4 mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Kost Name or Customer Name Or Seller Name"
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

                        <div className="col-md-2 mb-4">
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleStatusChange}
                                    style={{ borderRadius: '15px 0 0 15px', minWidth: '80px' }}
                                >
                                    <option value="">Search By Status</option>
                                    <option value="0">Pending</option>
                                    <option value="1">Cancel</option>
                                    <option value="2">Reject</option>
                                    <option value="3">Approved</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kost Name</th>
                                <th>Customer Name</th>
                                <th>Customer Email</th>
                                <th>Price Kost/Month</th>
                                <th>Kost Province</th>
                                <th>Kost City</th>
                                <th>Kost Subdistrict</th>
                                <th>Status</th>
                                <th>Month Type</th>
                                <th>Payment Type</th>
                                <th>Seller Name</th>
                                {role === 'ROLE_SELLER' && (
                                <th>Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                        {bookingData.map((transaction, index) => (
                            <tr key={transaction.id}>
                                <td>{index + 1}</td>
                                <td>{transaction.kost.name}</td>
                                <td>{transaction.customer.fullName}</td>
                                <td>{transaction.customer.email}</td>
                                <td>{formatRupiah(transaction.kost.kostPrice.price)}</td>
                                <td>{transaction.kost.province.name}</td>
                                <td>{transaction.kost.city.name}</td>
                                <td>{transaction.kost.subdistrict.name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge text-white ${
                                        transaction.aprStatus === 0 ? 'bg-info' :
                                        transaction.aprStatus === 1 ? 'bg-danger' :
                                        transaction.aprStatus === 2 ? 'bg-danger' :
                                        transaction.aprStatus === 3 ? 'bg-success' : 'bg-danger'}`}
                                        style={{ padding: '10px', fontSize: '12px', borderRadius: '10px' }}>
                                        {transaction.aprStatus === 0 ? 'Pending' :
                                        transaction.aprStatus === 1 ? 'Cancel' :
                                        transaction.aprStatus === 2 ? 'Reject' :
                                        transaction.aprStatus === 3 ? 'Approve' : ''}
                                    </span>
                                </td>
                                <td>{transaction.monthType.name}</td>
                                <td>{transaction.paymentType.name}</td>
                                <td>{transaction.kost.seller.fullName}</td>
                                {role === 'ROLE_SELLER' && (
                                <> 
                                <td style={{ display: 'flex'}} className='py-3'>
                                    {/* Tampilkan tombol approve dan cancel hanya jika aprStatus === 0 */}
                                    {transaction.aprStatus === 0 && (
                                        <>
                                            <button
                                                style={{ borderRadius: '10px', color: 'white', border: 'none', padding: '0.5rem 1rem' }}
                                                className={`btn me-2 bg-dark`}
                                                onClick={() => handleApprove(transaction.id, transaction.aprStatus)}
                                            >
                                                <FaHamburger style={{ marginRight: '0.5rem' }} /> Change Status
                                            </button>
                                        </>
                                    )}
                                </td>
                                </>
                                )}
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

export default DataBooking;
