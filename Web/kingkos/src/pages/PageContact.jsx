import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import Contact from '../components/Contact/Contact';
import NavContact from '../components/Contact/NavContact';

function PageContact() {

  return (
      <div>
        <NavContact />
        <Contact />
        <Footer />
      </div>
  );
}

export default PageContact;
