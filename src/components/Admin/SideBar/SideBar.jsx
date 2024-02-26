import './Style.css';

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import img2 from '../../../assets/img/king.png'
import defaultUserImg from '../../../assets/img/default-user.png';

import { useSelector, useDispatch } from "react-redux";
import { setAuthenticated} from "../../../store/authSlice"; // Menambahkan import setUserData
import Swal from 'sweetalert2';

import axios from '../../../store/axiosInterceptor';

function SideBar() {

    const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
    const username = useSelector((state) => state.authentication.username);
    const role = useSelector((state) => state.authentication.role);
  
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
  
    const [UserData, setUserData] = useState(null);
    const userId = useSelector((state) => state.authentication.userId);

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
            localStorage.removeItem('isLoggedIn');
    
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

    return (
        <aside className="sidebar">
            <div className="sidebar-start">
                <div className="sidebar-head">
                    <NavLink to="/" className="logo-wrapper" title="Home">
                        <span className="sr-only">Home</span>
                        <img
                            src={img2}
                            alt=""
                            style={{ width: '49px', height: 'auto' }} 
                        />
                        <div className="logo-text ms-3">
                            <span className="logo-title">Kingkos</span>
                            <span className="logo-subtitle" style={{color: 'gold'}}>Dashboard</span>
                        </div>
                    </NavLink>
                    <button className="sidebar-toggle transparent-btn" title="Menu" type="button">
                        <span className="sr-only">Toggle menu</span>
                        <span className="icon menu-toggle" aria-hidden="true"></span>
                    </button>
                </div> 
                <div className="sidebar-body">
                    <span className="system-menu__title">Manage Data</span>
                    <ul className="sidebar-body-menu">
                        <li>
                            <NavLink to="/dashboard"><span className="icon"><i className="fas fa-home"></i></span>Dashboard</NavLink>
                        </li>
                    </ul>
                    <span className="system-menu__title">Manage Data Users</span>
                    <ul className="sidebar-body-menu">
                        <li>
                            <NavLink to="/customer"><span className="icon"><i className="fas fa-users"></i></span>Data Customer</NavLink>
                        </li>
                        {role === 'ROLE_ADMIN' && (
                        <li>
                            <NavLink to="/dataSeller"><span className="icon"><i className="fas fa-user"></i></span>Data Seller</NavLink>
                        </li>
                        )}
                    </ul>
                    <span className="system-menu__title">Manage Data Kosan</span>
                    <ul className="sidebar-body-menu">
                        <li>
                            <NavLink to="/datakosan"><span className="icon"><i className="fas fa-building"></i></span>Data Kosan</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dataBooking"><span className="icon"><i className="fas fa-shopping-cart"></i></span>Data Booking</NavLink>
                        </li>
                    </ul>
                    <span className="system-menu__title">Manage Data Testimonial</span>
                    <ul className="sidebar-body-menu">
                        <li>
                            <NavLink to="/dataTestimoni"><span className="icon"><i className="fas fa-comment"></i></span>Data Testimoni</NavLink>
                        </li>
                    </ul>
                    {role === 'ROLE_SELLER' && ( // Memeriksa jika rolenya adalah ROLE_SELLER
                        <>
                        <span className="system-menu__title">Profile</span>
                        <ul className="sidebar-body-menu">
                            <li>
                                <NavLink to="/myProfile"><span className="icon"><i className="fas fa-cog"></i></span>My Profile</NavLink>
                            </li>
                        </ul>
                        </>
                    )}
                </div>

            </div>

            <div className="sidebar-footer mt-5">
            {isAuthenticated ? (
                <>
                <Link to="##" className="sidebar-user">
                    <span className="sidebar-user-img">
                    <picture>
                        <img src={UserData && UserData.url ? UserData.url : defaultUserImg} alt="User name" />
                    </picture>
                    </span>
                    <div className="sidebar-user-info">
                    <span className="sidebar-user__title ps-2">{username}</span>
                    <span className="sidebar-user__subtitle ps-2">{role}</span>
                    </div>
                </Link>
                <div className='text-center pt-5'>
                    <p style={{ color: 'white', fontSize: '14px' }} className='py-0'>Kelompok 2 Pascal</p>
                    <p style={{ color: 'white', fontSize: '14px' }} className='py-0'>&copy;Enigmacamp 2024</p>
                </div>
                </>
            ) : (
                <span>Anda tidak terautentikasi</span>
                )}
            </div>

        </aside>
    );
}

export default SideBar;
