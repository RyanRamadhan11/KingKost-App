import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

function Contact() {
  return (
    <div className="container-fluid px-5" style={{ paddingTop: '5em', paddingBottom: '5em' }}>
      <div className="container-fluid">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h5 className="section-title bg-white text-center text-primary px-3">Contact Us</h5>
          <h4 className="mb-5 mt-3">Get in Touch for Further Information</h4>
        </div>
        <div className="row g-4 d-flex justify-content-center">
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <h5>Connect with Us</h5>
            <p className="mb-4">If you have any questions or need further information about kingkosan, feel free to contact us.</p>
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px' }}>
                <i className="fa fa-map-marker-alt text-white"></i>
              </div>
              <div className="ms-3">
                <h5 className="text-primary">Address</h5>
                <p className="mb-0">Jalan Ragunan, Jakarta, Indonesia</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px' }}>
                <Link to="https://wa.me/6281234567890" target="_blank">
                  <FaWhatsapp style={{ marginRight: "5px", color:'white', fontWeight: 'bold' }} />
                </Link>
              </div>
              <div className="ms-3">
                <h5 className="text-primary">WhatsApp</h5>
                <p className="mb-0">+012 345 67890</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: '50px', height: '50px' }}>
                <i className="fa fa-envelope-open text-white"></i>
              </div>
              <div className="ms-3">
                <h5 className="text-primary">Email</h5>
                <p className="mb-0">info@kingkosan.com</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <iframe
              className="position-relative rounded w-100 h-100"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4324.616614851777!2d106.82127882018206!3d-6.304289718904046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed44c9532647%3A0x5589ddd11d4aa627!2sEnigma%20Camp!5e0!3m2!1sen!2sid!4v1708227411844!5m2!1sen!2sid"
              frameBorder="0"
              style={{ minHeight: '300px', border: '0' }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
