import React from 'react';
import { Link } from 'react-router-dom'; // Jika menggunakan React Router

import NotFoundImage from '../../assets/img/notFound.avif'; // Ganti dengan path gambar yang sesuai

function NotFound() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <div style={{ textAlign: 'center', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
                <h1>404 - Halaman Tidak Ditemukan</h1>
                <div style={{ margin: '20px auto' }}>
                    <img src={NotFoundImage} alt="404 Not Found" style={{ width: '50%', maxWidth: '400px' }} />
                </div>
                <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
                <Link to="/login">
                    <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
