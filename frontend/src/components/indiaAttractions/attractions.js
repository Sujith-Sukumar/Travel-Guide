import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./attraction.css";

function Attractions() {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [image, setImage] = useState([])

    useEffect(() => {
        const fetchimage = async () => {
            try {
                const response = await fetch(`https://travel-guide-backend-pfri.onrender.com/search/attra?filename=attra`)
                const data = await response.json();
                setImage(data);
                console.log(data,'fetched attraction');
                
                data.forEach(({ image }) => {
                    const img = new Image();
                    img.src = image;
                });
            } catch (error) {
                console.log('error fetching images');
            }
        }
        fetchimage()
    }, []);


    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        cssEase: "ease-in-out",
        swipeToSlide: true,
        draggable: true,
        // touchThreshold: 8,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };
    const clicked = (id) => {
        navigate(`placedetails/${id}`)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(token !== null)
    }, [])


    return (
        <div className="attractions-container">
            <h1 className="state-headingg">ATTRACTIONS<h4 className="state-sub-headingg">___ Worth a thousand stories ___</h4></h1>
            <Slider {...settings} className="attractions-slider">
                {image.map((item) => (
                    <div key={item.id} className="attraction-card">
                        <img src={item.image} alt={item.name} className="attraction-image" loading="lazy" />
                        <p className="attraction-name">{item.statename}</p>
                        {isLoggedIn ? (
                            <button className="btn btn-primary btn-more" onClick={() => clicked(item.id)}>More</button>
                        ) : (
                            <button className="btn btn-primary btn-more" onClick={() => window.alert('login and explore more')}>more</button>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Attractions;
