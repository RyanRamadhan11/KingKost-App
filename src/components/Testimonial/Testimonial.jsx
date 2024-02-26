import React, { useState, useEffect } from 'react';
import axios from '../../store/axiosInterceptor';
import Carousel from 'react-bootstrap/Carousel';
import { Row, Col } from 'react-bootstrap';
import defaultUserImg from '../../assets/img/default-user.png';
import { FaMapMarkerAlt } from 'react-icons/fa';



function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);

  const tokenString = localStorage.getItem('userLogin');
  const token = tokenString ? JSON.parse(tokenString).token : null;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewResponse, customerResponse] = await Promise.all([
          axios.get('/review/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
          }),
          axios.get('/customer/v1', {
            headers: {
                Authorization: `Bearer ${token}`
            }
          })
        ]);

        const reviewData = reviewResponse.data;
        const customerData = customerResponse.data;

        // Map customer data to each testimonial
        const updatedTestimonials = reviewData.map(testimonial => {
          const customer = customerData.find(customer => customer.id === testimonial.customerId.id);
          return {
            ...testimonial,
            customerData: customer || {} // Set customerData or an empty object if not found
          };
        });

        setTestimonials(updatedTestimonials);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Memisahkan testimonial menjadi bagian-bagian yang berisi tiga testimonial
  const separatedTestimonials = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    separatedTestimonials.push(testimonials.slice(i, i + 3));
  }

  return (
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s" style={{ paddingTop: '5em', paddingBottom: '10em' }}>
      <div className="container-fluid">
        <div className="text-center">
          <h5 className="section-title bg-white text-center text-dark px-3">Testimonial</h5>
          <h1 className="my-5">WHAT <span className='text-secondary'> THEY SAY </span>ABOUT US</h1>
        </div>
        <Carousel nextLabel={<span aria-hidden="true" className="carousel-control-next-icon" />} prevLabel={<span aria-hidden="true" className="carousel-control-prev-icon" />}>
          {separatedTestimonials.map((testimonialGroup, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center testimonial-carousel">
                {testimonialGroup.map((testimonial, i) => (
                  <Col key={i} md={4}>
                    {testimonial.customerData && (
                      <div className="testimonial-item border p-4" style={{backgroundColor: '#d1d0cd'}}>
                        <div className="card" style={{ minHeight: '350px', padding: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)' }}>
                        <div className="card-body text-center">
                            <p className="card-text mt-2 mb-0">"{testimonial.message}"</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center',  alignItems: 'center' }}>
                           <div style={{ marginBottom: '15px' }}>
                              <img
                                className="rounded-circle mx-auto"
                                src={testimonial.customerData.url || defaultUserImg}
                                alt={testimonial.customerData.fullName}
                                style={{
                                  width: '70px',
                                  height: '70px',
                                  borderColor: '#b55a05',
                                  border: '2px solid #b55a05', // Tambahkan border color dan ketebalan
                                }}
                              />
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <h5 className="card-title mb-2 ms-3">
                                    {testimonial.customerData.fullName}
                                </h5>
                                <p className="card-text mb-2 ms-3">
                                    <FaMapMarkerAlt className="me-1 mb-1" /> {/* Menambahkan ikon lokasi */}
                                    {testimonial.customerData.address}
                                </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Testimonial;
