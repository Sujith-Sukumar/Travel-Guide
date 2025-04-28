/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react';
import "./placedetails.css";
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowAltCircleDown, FaBookmark, FaPlane } from 'react-icons/fa';
import { faPlane, faTrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Travelnavbar from '../../components/navbar/travelnavbar';

function Placedetails() {
  const navigate = useNavigate()
  const [image, setimage] = useState([]);
  const { id } = useParams();
  const [coords, setCoords] = useState({ lat: 9.5009, lng: 76.2588 });

  useEffect(() => {
    console.log("Fetching ID:", id);
    if (!id) return;
    fetch(`http://localhost:4000/search/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image && data.image.data) {
          const blob = new Blob([new Uint8Array(data.image.data)], { type: data.imageType });
          const imageUrl = URL.createObjectURL(blob);
          setimage({ ...data, imageUrl });
        } else {
          setimage(data);
        }
        // console.log(data,'place details fetching data');
      })
      .catch((error) =>
        console.log('error fetching data'))
  }, [id])

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

  const cartClicked = async () => {
    try {
      const token = localStorage.getItem('token');

      const cartRes = await fetch('http://localhost:4000/bookmark/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!cartRes.ok) {
        throw new Error('Failed to fetch existing cart data');
      }
      const cartData = await cartRes.json();
      const alreadyExists = cartData.some(item => item.filename === image.filename);

      if (alreadyExists) {
        alert('This destination is already in your cart.');
        return;
      }

      const formData = new FormData();
      const blobb = new Blob([image.image.data], { type: image.imageType });

      formData.append('image', blobb, image.filename);
      formData.append('qoutesone', image.qoutesone);
      formData.append('qoutestwo', image.qoutestwo);
      formData.append('statename', image.statename);
      formData.append('description', image.description);
      formData.append('heading', image.heading);
      formData.append('airport', image.airport);
      formData.append('railway', image.railway);
      formData.append('filename', image.filename);
      formData.append('imageType', image.imageType);

      const response = await fetch('http://localhost:4000/bookmark', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error`);
      }
      const data = await response.json();
      alert('your destination book marked')
      console.log(data, 'fetch data');

    } catch (error) {
      console.log('cart is not working');
    }
  }
  return (
    <>
      <Travelnavbar />
      <div className='details-container'>
        <h1 className='details-heading'>
          {image.statename}
          <h4 className='details-subheading'>___ {image.heading} ___</h4>
        </h1>
        <div className='slide-icon'><a href='#second-page' style={{color:'white'}}><FaArrowAltCircleDown /></a></div>
        {image?.imageUrl && (
          <img src={image.imageUrl} alt={image.statename} className="details-image" loading="lazy" />
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
          <div className='share-bookmark'>
            <div className='share-bookmark-sub'>
              <FaBookmark className="heart-icon" style={{ color: "white", padding: "10px" }} size={50} onClick={cartClicked} />
              <FaPlane className="plane-icon" style={{ color: "white", padding: "10px" }} size={50} onClick={() => navigate('/booking')} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Placedetails;
