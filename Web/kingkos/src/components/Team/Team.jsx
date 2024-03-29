import React from 'react';

import { Link } from 'react-router-dom';
import './Style.css';

function Team() {
  return (
    <>
      <div className="container-xxl py-5" style={{ marginTop: '5em' }}>
        <div className="container-fluid">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">KingKos Team Project</h6>
            <h1 className="mb-5">Meet Our Team</h1>
          </div>
          <div className="row g-5 team-row mb-5">
            <div className="col-lg-7 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="team-item mx-auto border rounded shadow" style={{ borderColor: 'blue' }}>
                    <div className="overflow-hidden">
                        <img className="img-fluid border" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/3753a1e4-8cdc-41f5-8fb0-245a90eba72bkel2.jpeg?alt=media" alt="" />
                    </div>
                    <div className="position-relative d-flex justify-content-center mt-3">
                        <p className='fw-bold'>Kelompok 2 || Enigmacamp</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="row g-5 team-row">
            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto border rounded shadow" style={{ borderColor: 'blue' }}>
                <div className="overflow-hidden">
                  <img className="img-fluid border" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/2ec9863a-4065-453d-9597-69abebb75c00ryan.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{ backgroundColor: 'gold', color: 'black' }} to="https://github.com/RyanRamadhan11" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{ backgroundColor: 'gold', color: 'black' }} to="https://www.linkedin.com/in/ryan-ramadhan-17118b222/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{ backgroundColor: 'gold', color: 'black' }} to="https://www.instagram.com/ryanrmdhans/" target='_blank'><i className="fab fa-instagram"></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Ryan Ramadhan</h5>
                  <small style={{ fontSize: '14px' }}>Frontend</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto  border rounded shadow">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/2aac8385-5822-4ff6-86f0-843a926437e0leo.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://github.com/leobgs" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.linkedin.com/in/leonardo-bagus-utomo/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.instagram.com/leo.nardobagusutomo/" target='_blank'><i className="fab fa-instagram"></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Leonardo</h5>
                  <small style={{fontSize: '14px'}}>Frontend</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto border rounded shadow">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/53195e25-44bd-474b-b857-5ce34e6c0ee7andre.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://github.com/AnRiyan1912" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.linkedin.com/in/andre-riyanto-809274294/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.instagram.com/andreriyannt19/" target='_blank'><i className="fab fa-instagram"></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Andre Riyanto</h5>
                  <small style={{fontSize: '14px'}}>Backend</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto border rounded shadow">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/106731e8-9ac9-449a-9c2d-f6e4e26b38d0ihsan.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://github.com/Daexaf" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.linkedin.com/in/muhammad-ihsan-64-mi/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.instagram.com/ihsan64.mi/" target='_blank'><i className="fab fa-instagram"></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Muhammad Ihsan</h5>
                  <small style={{fontSize: '14px'}}>Backend</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto border rounded shadow">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/5319081e-74ea-47c6-b672-4c74e7ce3a86tiar.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://github.com/septiarmustafa" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.linkedin.com/in/septiar-mustafa-26a121176/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.instagram.com/septiarmustafa" target='_blank'><i className="fab fa-instagram"></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Septiar Mustafa</h5>
                  <small style={{fontSize: '14px'}}>Mobile</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item mx-auto border rounded shadow">
                <div className="overflow-hidden">
                  <img className="img-fluid" src=" https://firebasestorage.googleapis.com/v0/b/kingkost-images.appspot.com/o/d915f117-70d4-4fb5-aa29-179c207e7d8cbaim.jpg?alt=media" alt="" />
                </div>
                <div className="position-relative d-flex justify-content-center mt-3">
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://github.com/baim" target='_blank'><i className="fab fa-github"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.linkedin.com/in/muhammad-ibrahim-b9a62b24a/" target='_blank'><i className="fab fa-linkedin"></i></Link>
                  <Link className="btn btn-square mx-1" style={{backgroundColor: 'gold', color: 'black'}} to="https://www.instagram.com/ibrahim.muh88/" target='_blank'><i className="fab fa-instagram" target='_blank'></i></Link>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Muhammad Ibrahim</h5>
                  <small style={{fontSize: '14px'}}>Mobile</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Team;
