import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import EditProfile from '../components/Profile/EditProfile';
import NavEditProfile from '../components/Profile/NavEditProfile';

function PageEditProfile() {

  return (
      <div>
        <NavEditProfile />
        <EditProfile/>
        <Footer />
      </div>
  );
}

export default PageEditProfile;
