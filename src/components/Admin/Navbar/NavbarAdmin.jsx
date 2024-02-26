import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import img from '../../../assets/Admin/img/avatar/avatar-illustrated-02.png';
import { useSelector, useDispatch } from "react-redux";
import { setAuthenticated} from "../../../store/authSlice";
import Swal from 'sweetalert2';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import defaultUserImg from '../../../assets/img/def.webp';
import defaultUserImgAdm from '../../../assets/img/default-user.png';
import axios from '../../../store/axiosInterceptor';

function NavbarAdmin() {
    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
    const username = useSelector((state) => state.authentication.username);
    const role = useSelector((state) => state.authentication.role);
  
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi

    const [UserData, setUserData] = useState(null);
    const userId = useSelector((state) => state.authentication.userId);
    const tokenString = localStorage.getItem('userLogin');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(userId)
                const userDataResponse = await axios.get(`/seller/user/${userId}`, {
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
            localStorage.removeItem('userLogin');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('customerData');
            localStorage.removeItem('isLoggedIn');
    
            dispatch(setAuthenticated(false));
            Swal.fire({
              icon: 'success',
              title: 'Logout Successful!',
              text: 'You have been logged out.',
              showConfirmButton: true,
              timer: 2000
            }).then(() => {
              navigate("/login"); // Menggunakan navigate untuk navigasi
            });
          }
        });
      };

    return (
        <>
        <div className="layer"></div>
        <nav className="main-nav--bg" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="container main-nav">
                <div className="main-nav-start">
                    <div className="search-wrapper">
                        
                    </div>
                </div>
                <div className="main-nav-end">
                    <button className="sidebar-toggle transparent-btn" title="Menu" type="button">
                        <span className="sr-only">Toggle menu</span>
                        <span className="icon menu-toggle--gray" aria-hidden="true"></span>
                    </button>
                    <div className="lang-switcher-wrapper">
                        <button className="lang-switcher transparent-btn" type="button">
                            EN
                            <i data-feather="chevron-down" aria-hidden="true"></i>
                        </button>
                    </div>
                    <button className="theme-switcher gray-circle-btn" type="button" title="Switch theme">
                        <span className="sr-only">Switch theme</span>
                        <i className="sun-icon" data-feather="sun" aria-hidden="true"></i>
                        <i className="moon-icon" data-feather="moon" aria-hidden="true"></i>
                    </button>
                    {/* <div className="notification-wrapper">
                        <button className="gray-circle-btn dropdown-btn" title="To messages" type="button">
                            <span className="sr-only">To messages</span>
                            <span className="icon notification active" aria-hidden="true"></span>
                        </button>

                        <ul className="users-item-dropdown notification-dropdown dropdown-admin">
                            <li>
                                <Link to="/">
                                    <div className="notification-dropdown-icon info">
                                        <i data-feather="check"></i>
                                    </div>
                                    <div className="notification-dropdown-text">
                                        <span className="notification-dropdown__title">System just updated</span>
                                        <span className="notification-dropdown__subtitle">The system has been successfully upgraded. Read more
                                            here.</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <div className="notification-dropdown-icon danger">
                                        <i data-feather="info" aria-hidden="true"></i>
                                    </div>
                                    <div className="notification-dropdown-text">
                                        <span className="notification-dropdown__title">The cache is full!</span>
                                        <span className="notification-dropdown__subtitle">Unnecessary caches take up a lot of memory space and
                                            interfere ...</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <div className="notification-dropdown-icon info">
                                        <i data-feather="check" aria-hidden="true"></i>
                                    </div>
                                    <div className="notification-dropdown-text">
                                        <span className="notification-dropdown__title">New Subscriber here!</span>
                                        <span className="notification-dropdown__subtitle">A new subscriber has subscribed.</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link className="link-to-page" to="/">Go to Notifications page</Link>
                            </li>
                        </ul>
                    </div> */}
                    <div className="nav-user-wrapper">
                    {isAuthenticated ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" style={{ borderRadius: '15px' }} id="dropdown-basic" className="text-black fw-bold">
                                <img src={UserData && UserData.url ? UserData.url : defaultUserImgAdm} alt="User" style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }} />
                                {username}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item className="text-black">{role}</Dropdown.Item>
                                <Dropdown.Divider />
                                {role === 'ROLE_SELLER' && ( // Memeriksa jika rolenya adalah ROLE_SELLER
                                    <>
                                        <Dropdown.Item className="text-black">
                                            <NavLink to="/myProfile" className="dropdown-item" activeClassName="active">Profile</NavLink>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                    </>
                                )}
                                <Dropdown.Item onClick={handleLogout} className="white text-white">
                                    <Button variant="danger" className="w-100" style={{ borderRadius: '15px' }}>
                                        Logout
                                    </Button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Link to="/login">
                            <button className="btn btn-warning mt1" style={{ borderRadius: '10px', color: 'black', fontWeight: 'bold' }} type="submit">
                                LOGIN
                            </button>
                        </Link>
                    )}

                    </div>
                </div>
            </div>
        </nav>
        </>
    );
}

export default NavbarAdmin;
