import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import Testimonial from '../components/Testimonial/Testimonial';
import NavTestimonial from '../components/Testimonial/NavTestimonial';

function PageTestimonial() {

  return (
      <div>
        <NavTestimonial />
        <Testimonial />
        <Footer />
      </div>
  );
}

export default PageTestimonial;
