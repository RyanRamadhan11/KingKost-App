import React, {useState, useEffect} from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import logo from '../../assets/img/king.png';
import {useSelector, useDispatch} from "react-redux";
import {setAuthenticated} from "../../store/authSlice.js";
import Swal from 'sweetalert2';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import defaultUserImg from '../../assets/img/default-user.png';
import axios from '../../store/axiosInterceptor';


function NavTransactionList() {

    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
    const username = useSelector((state) => state.authentication.username);
    const role = useSelector((state) => state.authentication.role);
    const userId = useSelector((state) => state.authentication.userId);

    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hapus data dari localStorage
                localStorage.removeItem('userLogin');
                localStorage.removeItem('isLoggedIn');

                localStorage.removeItem('customerData');

                dispatch(setAuthenticated(false));
                Swal.fire({
                    icon: 'success',
                    title: 'Logout Successful!',
                    text: 'You have been logged out.',
                    showConfirmButton: true,
                    timer: 2000
                }).then(() => {
                    navigate("/login");
                });
            }
        });
    };

    const [UserData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(userId)
                const userDataResponse = await axios.get(`/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                  });
                const matchedUser = userDataResponse.data.data;
                setUserData(matchedUser);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <>
            <div className="container-fluid bg-dark px-5 d-none d-lg-block">
                <div className="row gx-0">
                    <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center" style={{height: '45px'}}>
                            <small className="me-3 text-light"><i className="fa fa-map-marker-alt me-2"></i>Kosan,
                                Ragunan City</small>
                            <small className="me-3 text-light"><i className="fa fa-phone-alt me-2"></i>+012 345
                                6789</small>
                            <small className="text-light"><i
                                className="fa fa-envelope-open me-2"></i>info@kingkos.com</small>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center text-lg-end">
                        <div className="d-inline-flex align-items-center" style={{height: '45px'}}>
                            <Link to="#" className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2">
                                <i className="fab fa-twitter fw-normal"></i>
                            </Link>
                            <Link to="#" className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2">
                                <i className="fab fa-facebook-f fw-normal"></i>
                            </Link>
                            <Link to="#" className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2">
                                <i className="fab fa-instagram fw-normal"></i>
                            </Link>
                            <Link to="#" className="btn btn-sm btn-outline-light btn-sm-square rounded-circle">
                                <i className="fab fa-youtube fw-normal"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid position-relative p-0">
                <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                    <Link to="/" className="navbar-brand p-0">
                        <p className="m-0" style={{ color: '#cfb000', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
                            <img src={logo} alt="KingKos Logo" className="logo-image" style={{ marginRight: '1rem', height: '30px' }} />
                            KingKos
                        </p>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="fa fa-bars"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto py-0">
                            <NavLink to="/" className="nav-item nav-link" activeClassName="active">Home</NavLink>
                            <div className="nav-item dropdown">
                                <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Looking For ? </Link>
                                <div className="dropdown-menu m-0">
                                    <NavLink to="/kosan" className="dropdown-item" activeClassName="active">Kos</NavLink>
                                    <Link to="/testimonial" className="dropdown-item" activeClassName="active">Testimonial</Link>
                                </div>
                            </div>
                            <NavLink to="/about" className="nav-item nav-link" activeClassName="active">About</NavLink>
                            <NavLink to="/team" className="nav-item nav-link" activeClassName="active">Team</NavLink>
                            <NavLink to="/contact" className="nav-item nav-link" activeClassName="active">Contact</NavLink>
                            <NavLink to="/TermsAndConditions" className="nav-item nav-link" activeClassName="active">Terms And Conditions</NavLink>
                        </div>
                        {isAuthenticated ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" style={{borderRadius: '5px'}} id="dropdown-basic" className="text-black fw-bold">
                                    <img src={UserData && UserData.url ? UserData.url : defaultUserImg} alt="User" style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }} />
                                    {username}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item  className="text-black">{role}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    {role === 'ROLE_CUSTOMER' && ( // Memeriksa jika rolenya adalah ROLE_SELLER
                                        <>
                                        <Dropdown.Item  className="text-black">
                                            <NavLink to="/profile" className="dropdown-item" activeClassName="active">Profile</NavLink>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item  className="text-black">
                                            <NavLink to="/myBooking" className="dropdown-item" activeClassName="active">My Booking</NavLink>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        </>
                                    )}
                                    <Dropdown.Item onClick={handleLogout} className="white text-white">
                                        <Button variant="danger" className="w-100" style={{borderRadius: '15px',}}>
                                            Logout
                                        </Button>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                            <Link to="/login">
                                <button className="btn btn-warning mt1" style={{ borderRadius: '10px', color: 'black', fontWeight: 'bold' }} type="submit">
                                    LOGIN
                                </button>
                            </Link>

                            <Link to="/register">
                                <button className="ms-2 btn btn-warning mt1" style={{ borderRadius: '10px', color: 'black', fontWeight: 'bold' }} type="submit">
                                REGISTER
                                </button>
                            </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                    <div className="container py-5">
                        <div className="row justify-content-center py-5">
                            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                                <h1 className="display-3 text-white animated slideInDown">My Booking</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb justify-content-center">
                                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                        <li className="breadcrumb-item"><Link to="/pages">Pages</Link></li>
                                        <li className="breadcrumb-item text-white active" aria-current="page">My Booking
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavTransactionList;