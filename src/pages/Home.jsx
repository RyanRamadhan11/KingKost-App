import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import About from '../components/About/About';
import Loading from '../components/Loading/Loading';
import Banner from '../components/Banner/Banner';
import Testimonial from '../components/Testimonial/Testimonial';
import Team from '../components/Team/Team';
import Accordion from '../components/Accordion/Accordion';
import Kosan from '../components/Kosan/Kosan';

function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  })
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
      <div>
        <Navbar />
        <Banner/>
        <About />
        <Kosan/>
        <Testimonial/>
        <Team/>
        <Accordion/>
        <Footer />
      </div>
      )};
    </>
  );
}

export default Home;
