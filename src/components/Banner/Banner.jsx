// Banner.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from '../../assets/img/banner1.jpg';
import banner2 from '../../assets/img/banner2.jpg';
import banner3 from '../../assets/img/banner3.jpg';
import banner4 from '../../assets/img/banner5.jpg';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Style.css';

function Banner() {
  const settings = {
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    variableWidth: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { onClick } = props;
    return <div className="slick-next" onClick={onClick}></div>;
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return <div className="slick-prev" onClick={onClick}></div>;
  }

  return (
    <div className=' banner-container'>
      <Slider {...settings} className="banner">
        <div className="grid-container banner-item">
          <img src={banner1} alt="Banner 1" />
        </div>
        <div className="grid-container banner-item">
          <img src={banner2} alt="Banner 2" />
        </div>
        <div className="grid-container banner-item">
          <img src={banner3} alt="Banner 3" />
        </div>
        <div className="grid-container banner-item">
          <img src={banner4} alt="Banner 4" />
        </div>
      </Slider>
    </div>
  );
}

export default Banner;
