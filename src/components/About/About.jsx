import React from 'react';
import { Link } from 'react-router-dom';
import img from '../../assets/img/kos.jpg'

function About() {
    return (
        <div className="container-xxl" style={{paddingTop: '2em', paddingBottom: '10em'}}>
            <div className="container -fluid">
                <div className="row g-5">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{ minHeight: '400px' }}>
                        <div className="position-relative h-100">
                            <img className="img-fluid position-absolute w-100 h-100" src={img} alt="" style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                        <h6 className="section-title bg-white text-start text-warning pe-3">About Our Boarding House</h6>
                        <h1 className="mb-4">Welcome to <span className="text-warning">KingKos Boarding House</span></h1>
                        <p className="mb-4">Discover a cozy and comfortable living experience at KingKos Boarding House. We provide modern amenities and a friendly environment to make your stay memorable.</p>
                        <p className="mb-4">Our commitment is to offer you:</p>
                        <div className="row gy-2 gx-4 mb-4">
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Comfortable Rooms</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Secure and Safe Environment</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Modern Facilities</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Flexible Booking Options</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Responsive Customer Service</p>
                            </div>
                            <div className="col-sm-6">
                                <p className="mb-0"><i className="fa fa-arrow-right text-warning me-2"></i>Convenient Location</p>
                            </div>
                        </div>
                        <Link to="/TermsAndConditions" className="btn btn-warning py-3 px-5 mt-2" style={{borderRadius: '15px'}}>Read More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
