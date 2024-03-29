import { Link } from 'react-router-dom';
import img1 from '../../assets/img/login-tenant.svg'
import img2 from '../../assets/img/login-owner.svg'

function SelectRegister() {
    return (
        <section className="nav d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(to bottom, #a36903, #873f00)', minHeight: '100vh' }}>
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-lg-12">
                        <div className="card text-center" style={{ borderRadius: '2rem', backgroundColor: 'white', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
                            <div className="card-body">
                                <h5 className="card-title py-2">REGISTER AS</h5>
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="card wow fadeInUp" style={{ marginBottom: '1rem', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">Customer (Pencari Kos)</h5>
                                                <img src={img1} alt="" />
                                                <p className="card-text">Register as a customer to find and rent rooms.</p>
                                                <Link to="/register/customer" className="btn btn-secondary" style={{ borderRadius: '10px' }}>Register as Customer</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="card wow fadeInUp" style={{ marginBottom: '1rem', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">Seller (Pemilik Kos)</h5>
                                                <img src={img2} alt="" />
                                                <p className="card-text">Register as a seller to list and manage rooms.</p>
                                                <Link to="/register/seller" className="btn btn-secondary" style={{ borderRadius: '10px' }}>Register as Seller</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SelectRegister;
