import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./multipleplaces.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Travelnavbar from "../../components/navbar/travelnavbar";

function Multipleplaces() {
  const [image, setImage] = useState([])
  const navigate = useNavigate()
  const location = useLocation();
  const statename = location.state?.statename;

  useEffect(() => {
    const fetchimage = async () => {
      if (!statename) return;
      try {
        const response = await fetch(`https://travel-guide-backend-pfri.onrender.com/search/attra?filename=explore${statename}`);
        const data = await response.json();
        setImage(data)
        console.log(data, 'data');
        data.forEach(({ image }) => {
          const img = new Image();
          img.src = image;
        });

      } catch (error) {
        console.log('error fetching images');
      }
    };
    fetchimage();
  }, [statename]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    cssEase: "ease-in-out",
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 8,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  const clicked = (id) => {
    navigate(`/placedetails/${id}`)
  }
  return (
    <>
      <Travelnavbar />
      {!image || image.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ height: '100vh' }}
        >
          <div className="spinner-border text-info mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-info">Loading...</p>
        </div>
      ) : (
        <div className="gallery-container">
          <h1 className="gallery-heading">
            EXPLORE
            <h4 className="gallery-subheading">___ {statename} tourism ___</h4>
          </h1>
          <Slider {...settings} className="gallery-slider">
            {image.map((item) => (
              <div key={item.id} className="gallery-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="gallery-image"
                  loading="lazy"
                />
                <p className="gallery-name">{item.statename}</p>
                <button
                  className="btn btn-primary btn-moree"
                  onClick={() => clicked(item.id)}
                >
                  Explore
                </button>
              </div>
            ))}
          </Slider>
        </div>
      )}

    </>
  );
}

export default Multipleplaces;
