import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import About from '../components/About/About';
import NavAbout from '../components/About/NavAbout';

function PageAbout() {

  return (
      <div>
        <NavAbout />
        <About/>
        <Footer />
      </div>
  );
}

export default PageAbout;
