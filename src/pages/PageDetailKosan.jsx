import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import DetailKosan from '../components/Kosan/DetailKosan';
import NavDetailKosan from '../components/Kosan/NavDetailKosan';

function PageDetailKosan() {

  return (
      <div>
        <NavDetailKosan />
        <DetailKosan />
        <Footer />
      </div>
  );
}

export default PageDetailKosan;
