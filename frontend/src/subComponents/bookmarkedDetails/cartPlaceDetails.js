/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react'
import './cartPlaceDetails.css'
import { useParams } from 'react-router-dom';
import { faPlane, faTrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Travelnavbar from '../../components/navbar/travelnavbar';
import { FaArrowAltCircleDown } from 'react-icons/fa';

function CartPlaceDetails() {
  const [image, setimage] = useState({});
  const [imageadd, setImageAdd] = useState()
  const { id } = useParams();
  const [coords, setCoords] = useState({ lat: 9.5009, lng: 76.2588 });

  useEffect(() => {
    console.log("Fetching ID:", id);
    if (!id) return;

    fetch(`https://travel-guide-backend-pfri.onrender.com/cart/search/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image && data.image.data) {
          const uint8Array = new Uint8Array(data.image.data);
          const blob = new Blob([uint8Array], { type: data.imageType });
          const imageUrl = URL.createObjectURL(blob);

          setimage({ ...data, imageUrl });
          console.log("Image URL:", imageUrl);

        } else {
          setimage(data);
        }

        console.log(data, 'dataa');
      });
  }, [id]);




  useEffect(() => {
    if (image.statename) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          image.statename + ", Kerala"
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setCoords({ lat: data[0].lat, lng: data[0].lon });
          }
        })
        .catch((error) => console.error("Error fetching location:", error));
    }
  }, [image.statename]);


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://travel-guide-backend-pfri.onrender.com/search?filename=${image.statename}`);
        const data = await res.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data) && data.length > 0) {
          setImageAdd(data[0]);
        } else {
          setImageAdd(data);
        }

      } catch (error) {
        console.log('Image fetching error occurred:', error);
      }
    };

    if (image.statename) {
      fetchImage();
    }
  }, [image.statename]);




  return (
    <>
      <Travelnavbar />
      <div className='details-container'>
        <h1 className='details-heading'>
          {image.statename}
          <h4 className='details-subheading'>___ {image.heading} ___</h4>
        </h1>
        <div className='slide-icon'><a href='#second-page' style={{ color: 'white' }}><FaArrowAltCircleDown /></a></div>
        {imageadd?.image ? (
          <img
            src={imageadd.image}
            alt={image.statename || "Image"}
            className="details-image"
            loading="lazy"
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="d-flex align-items-center gap-2">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: '1.5rem', height: '1.5rem' }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              {/* <p className="mb-0 text-primary">Loading image...</p> */}
            </div>
          </div>

        )}

      </div>
      <div className="box-container" id='second-page'>
        <div className="box red-box">
          <h1 className='heading'>{image.heading}</h1>
          <h4 className='description'>{image.description}</h4>
        </div>
        <div className="box green-box">
          <div className='location-box'>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d${coords.lng}!3d${coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(
                image.statename || ""
              )}, Kerala!5e1!3m2!1sen!2sin!4v1741188460467!5m2!1sen!2sin`}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <h3 className='airport'><FontAwesomeIcon icon={faPlane} /> Major airport : </h3>
          <h4 className='airport-name'>{image.airport}</h4>
          <h3 className='railway'><FontAwesomeIcon icon={faTrain} /> Nearest Railway Stations : </h3>
          <h4 className='railway-name'>
            {image.railway?.split(')').map((station, index) =>
              station.trim() && (
                <span key={index}>
                  {station.trim()})<br />
                </span>
              )
            )}
          </h4>

        </div>
      </div>
    </>
  );
}

export default CartPlaceDetails
