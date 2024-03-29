import React, { useEffect } from 'react';
import SideBar from '../../../components/Admin/SideBar/SideBar';
import NavbarAdmin from '../../../components/Admin/Navbar/NavbarAdmin';
import UpdateDataKosan from '../../../components/Admin/Kosan/UpdateDataKosan';

function PageUpdateDataKosan() {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideBar />
        </div>
        <div className="col-md-10">
          <div className="row">
            <div className="col-md-12 ">
              <NavbarAdmin />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <UpdateDataKosan/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageUpdateDataKosan;
