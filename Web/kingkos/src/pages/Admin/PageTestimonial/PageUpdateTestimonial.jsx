import React, { useEffect } from 'react';
import SideBar from '../../../components/Admin/SideBar/SideBar';
import NavbarAdmin from '../../../components/Admin/Navbar/NavbarAdmin';
import UpdateDataTestimonial from '../../../components/Admin/Testimonial/UpdateDataTestimonial';

function PageUpdateTestimonial() {

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
              <UpdateDataTestimonial/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageUpdateTestimonial;
