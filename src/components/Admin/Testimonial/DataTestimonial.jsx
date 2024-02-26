import React, { useState, useEffect } from 'react';
import axios from '../../../store/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultUserImg from '../../../assets/img/default-user.png';

function DataTestimonial() {
    const [reviews, setReviews] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        // Fetch reviews
        axios.get('/review/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching review data:', error);
            });

        // Fetch customers
        axios.get('/customer/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    }, []);

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Logic for searching
    const filteredReviews = reviews.filter((review) => {
        return (
            review.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customers.find((customer) => customer.id === review.customerId.id)?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customers.find((customer) => customer.id === review.customerId.id)?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customers.find((customer) => customer.id === review.customerId.id)?.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

    const handleUpdate = (reviewId) => {
        navigate(`/updateDataTestimoni/${reviewId}`);
    };

    const handleDelete = (reviewId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this review data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/review/v1/${reviewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    })
                    .then(response => {
                        // Update state to reflect the removal of the review
                        setReviews(reviews.filter(review => review.id !== reviewId));
                        console.log('Review deleted successfully');
                    })
                    .catch(error => {
                        console.error('Error deleting review:', error);
                    });
                Swal.fire(
                    'Deleted!',
                    'Your review data has been deleted.',
                    'success'
                );
            }
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid mt-5">
            <div className="card mb-4 p-3">
                <h2 style={{ margin: "10px 0px 10px 10px" }}>Review List</h2>
                <nav>
                    <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                        <li className="breadcrumb-item"><Link style={{ textDecoration: "none", color: "black" }} to="/dataTestimoni">Data Master</Link></li>
                        <li className="mx-2">/</li>
                        <li className="breadcrumb-item active">Review</li>
                    </ol>
                </nav>
                <div className="card-header fw-bold">
                    <i className="fa fa-comments" style={{ marginRight: "10px" }}></i>
                    DATA REVIEW
                </div>
                <div className="mt-4" style={{ width: "550px", marginLeft: "18px" }}>
                    <Link to="/addDataTestimoni" className="btn btn-success" style={{ borderRadius: '10px' }}>Add Review Testimonial</Link>
                </div>
                <div className="mt-4" style={{ width: "550px", marginLeft: "18px" }}>
                </div>
                <div className="mb-4 d-flex align-items-center col-md-6 my-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Review Message, Customer Name, Email, or Address"
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ borderRadius: '15px 0 0 15px' }}
                        />
                        <button className="btn btn-primary" type="button" style={{ borderRadius: '0 15px 15px 0' }}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Message</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((review, index) => (
                                <tr key={review.id}>
                                    <td>{index + 1}</td>
                                    <td>{review.message}</td>
                                    <td>{customers.find(customer => customer.id === review.customerId.id)?.fullName}</td>
                                    <td>{customers.find(customer => customer.id === review.customerId.id)?.email}</td>
                                    <td>{customers.find(customer => customer.id === review.customerId.id)?.address}</td>
                                    <td>
                                        <img
                                            className="img-fluid"
                                            src={customers.find(customer => customer.id === review.customerId.id)?.url ? customers.find(customer => customer.id === review.customerId.id)?.url : defaultUserImg}
                                            alt={customers.find(customer => customer.id === review.customerId.id)?.profileImageName ? customers.find(customer => customer.id === review.customerId)?.profileImageName : "Customer Image"}
                                            style={{ height: '40px', width: '40px', borderRadius: '100%' }}
                                        />
                                    </td>

                                    <td style={{ display: 'flex'}} className='py-3'>
                                        <button className="btn btn-secondary me-2" onClick={() => handleUpdate(review.id)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(review.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataTestimonial;
