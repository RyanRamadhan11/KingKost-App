import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import TermsAndConditions from '../components/TermsAndConditions/TermsAndConditions';
import NavTerm from '../components/TermsAndConditions/NavTerm';

function PageTermsAndConditions() {

  return (
      <div>
        <NavTerm />
        <TermsAndConditions />
        <Footer />
      </div>
  );
}

export default PageTermsAndConditions;
