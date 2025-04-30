import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './travelState.css'
import VideoPlayer from '../videoHome/travelHome';
import Attractions from '../indiaAttractions/attractions';
import Booking from '../bookingHome/bookinghome';
import Travelnavbar from '../navbar/travelnavbar';
import Travelfooter from '../footer/travelfooter';

function TravelStates() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const slideRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchimage = async () => {
      try {
        const response = await fetch('http://localhost:4000/searchstateimage?filename=state')
        const data = await response.json();
        setImages(data)
        // console.log(data,'destinations');
        
      } catch (error) {
        console.log('images fetching error occured');
      }
    }
    fetchimage();
  }, [])

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentIndex(newIndex),
  };
  
  const clicked = () => {
    if (images.length > 0) {
      const selectedState = images[currentIndex];
      const stateName = selectedState.statename;
  
      if (stateName === 'Kerala' || stateName === 'Tamilnadu') {
        navigate(`/multipleplaces`, { state: { statename: stateName, imgUrl: selectedState.imgUrl || selectedState.image } });
      } else {
        window.alert('This destination isnt available yet. Stay tuned — explore Kerala or Tamilnadu!');
      }
    }
  };
  
  const nextState = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex)
    slideRef.current?.slickNext();
  }

  const prevState = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex)
    slideRef.current?.slickPrev();
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(token !== null)
  }, [])

  return (
    <>
      <Travelnavbar />
      <VideoPlayer />
      <div className="image-container">
        <h1 className='state-heading'>DESTINATIONS <h4 className='state-sub-heading'>__ for every bucket list __</h4></h1>
        <Slider ref={slideRef} {...settings}>
          {images.map((img, index) => (
            <div key={index} className="image-wrapper">
              <img src={img.imgUrl || img.image} alt={`State ${index + 1}`} />
            </div>
          ))}
        </Slider>
        {images.length > 0 ? (
          <div className="state-container">
            <h2 className="state-names">
              <HiOutlineArrowNarrowLeft className="state-icon" onClick={prevState} />
              {images[currentIndex]?.statename}
              <HiOutlineArrowNarrowRight className="state-icon" onClick={nextState} />
            </h2>
            {isLoggedIn ? (
              <button className="btn btn-danger more" onClick={clicked}>Discover More</button>
            ) : (
              <button className="btn btn-danger more" onClick={() => window.alert('login and discover more')}>Discover More</button>
            )}
          </div>
        ) : (
          <div className="loading-container">
          <div className="spinner-border text-info mb-3" role="status">
            {/* <span className="visually-hidden">Loading...</span> */}
          </div>
          {/* <p className="loading-text text-info">Loading...</p> */}
        </div>
        )}
      </div>
      <Attractions />
      <Booking />
      <Travelfooter />
    </>
  )
}
export default TravelStates