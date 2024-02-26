import React, { useEffect } from 'react';
import SideBar from '../../../components/Admin/SideBar/SideBar';
import NavbarAdmin from '../../../components/Admin/Navbar/NavbarAdmin';
import DataKosan from '../../../components/Admin/Kosan/DataKosan';

function PageDataKosan() {

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Bagian Kiri (Sidebar) */}
        <div className="col-md-2">
          <SideBar />
        </div>
        {/* Bagian Kanan (Navbar dan Main Content) */}
        <div className="col-md-10">
          <div className="row">
            {/* Navbar */}
            <div className="col-md-12 ">
              <NavbarAdmin />
            </div>
          </div>
          <div className="row">
            {/* Main Content */}
            <div className="col-md-12">
              {/* Isi dari main content, misalnya <Home /> */}
              <DataKosan/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDataKosan;
