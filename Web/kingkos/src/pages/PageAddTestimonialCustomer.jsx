import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import NavTestimonial from '../components/Testimonial/NavTestimonial';
import AddTestimonial from '../components/Testimonial/AddTestimonial';

function PageAddTestimonialCustomer() {

  return (
      <div>
        <NavTestimonial />
        <AddTestimonial />
        <Footer />
      </div>
  );
}

export default PageAddTestimonialCustomer;
