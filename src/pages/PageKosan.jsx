import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import NavKosan from '../components/Kosan/NavKosan';
import Kosan from '../components/Kosan/Kosan';

function PageKosan() {

  return (
      <div>
        <NavKosan />
        <Kosan />
        <Footer />
      </div>
  );
}

export default PageKosan;
