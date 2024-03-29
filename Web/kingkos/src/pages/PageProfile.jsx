import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import Profile from '../components/Profile/Profile';
import NavProfile from '../components/Profile/NavProfile';

function PageProfile() {

  return (
      <div>
        <NavProfile />
        <Profile/>
        <Footer />
      </div>
  );
}

export default PageProfile;
