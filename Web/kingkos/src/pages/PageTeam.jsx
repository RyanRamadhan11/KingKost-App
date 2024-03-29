import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import NavTeam from '../components/Team/NavTeam';
import Team from '../components/Team/Team';

function PageTeam() {

  return (
      <div>
        <NavTeam />
        <Team />
        <Footer />
      </div>
  );
}

export default PageTeam;
