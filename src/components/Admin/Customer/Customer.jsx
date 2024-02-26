import React, { useState, useEffect } from 'react';
import axios from '../../../store/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultUserImg from '../../../assets/img/default-user.png';
import { BsSearch } from 'react-icons/bs';

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const navigate = useNavigate();

    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    console.log(token);

    useEffect(() => {
        console.log("token nih uy");
        console.log(token);
        axios.get('/customer/v1', {
            headers: {
                Authorization: `Bearer ${token}` // Mengirim token ke server
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
    const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

    const handleUpdate = (customerId) => {
        navigate(`/updateCustomer/${customerId}`);
    };

    const handleDelete = (customerId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this customer data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/customer/v1/${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Mengirim token ke server
                    }
                })
                    .then(response => {
                        // Update state to reflect the removal of the customer
                        setCustomers(customers.filter(customer => customer.id !== customerId));
                        console.log('Customer deleted successfully');
                    })
                    .catch(error => {
                        console.error('Error deleting customer:', error);
                    });
                Swal.fire(
                    'Deleted!',
                    'Your customer data has been deleted.',
                    'success'
                );
            }
        });
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGenderChange = (e) => {
        setSearchGender(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        (customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         customer.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (searchGender === '' || customer.genderTypeId.name.toLowerCase().includes(searchGender.toLowerCase()))
    );

    return (
        <div className="container-fluid mt-5">
            <div className="card mb-4 p-3">
                <h2 style={{ margin: "10px 0px 10px 10px" }}>Customer List</h2>
                <nav>
                    <ol className="breadcrumb mb-4" style={{ marginLeft: "10px" }}>
                        <li className="breadcrumb-item"><Link style={{ textDecoration: "none", color: "black" }} to="/customer">Data Master</Link></li>
                        <li className="mx-2">/</li>
                        <li className="breadcrumb-item active">Customer</li>
                    </ol>
                </nav>
                <div className="card-header fw-bold">
                    <i className="fa fa-user" style={{ marginRight: "10px" }}></i>
                    DATA CUSTOMER
                </div>
                <div className="mt-4 mb-4" style={{ width: "550px", marginLeft: "18px" }}>
                    <Link to="/addCustomer" className="btn btn-success" style={{borderRadius: '10px'}}>Add Customer</Link>
                </div>
                <div className="card-body">
                    {/* Search Input */}
                    <div className="row mb-2">
                        <div className="col-md-6 mb-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Full Name or Address"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    style={{ borderRadius: '15px 0 0 15px' }}
                                />
                                <button className="btn btn-primary" type="button" style={{ borderRadius: '0 15px 15px 0' }}>
                                    <BsSearch color='white' />
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleGenderChange}
                                    style={{ borderRadius: '15px 0 0 15px', minWidth: '80px' }}
                                >
                                    <option value="">Search By Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <table className="table table-striped table-bordered">
                        <thead >
                            <tr>
                                <th>No</th>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr key={customer.id} >
                                    <td>{index + 1}</td>
                                    <td>{customer.fullName}</td>
                                    <td>{customer.username}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.genderTypeId.name}</td>
                                    <td>{customer.phoneNumber}</td>
                                    <td>{customer.address}</td>
                                    <td>
                                        <img
                                            className="img-fluid"
                                            src={customer.url ? customer.url : defaultUserImg}
                                            alt={customer.url ? customer.url : 'Placeholder Image'}
                                            style={{ height: '40px', width: '40px', borderRadius: '100%' }}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary me-2" onClick={() => handleUpdate(customer.id)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(customer.id)}>
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

export default Customer;
