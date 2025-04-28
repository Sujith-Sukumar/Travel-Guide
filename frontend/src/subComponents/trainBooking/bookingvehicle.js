import React, { useRef,useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './bookingvehicle.css'
import { FaTrain } from 'react-icons/fa'

function Bookingvehicle() {
  const navigate = useNavigate()
  const nameRef = useRef()
  const numberRef = useRef()
  const location = useLocation()
  const bookedData = location?.state.bookingData;
  const [bgUrl, setBgUrl] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

   useEffect(() => {
          const fetchImage = async () => {
              try {
                  const response = await fetch('https://travel-guide-backend-pfri.onrender.com/bookingimage/train.jpg');
                  const blob = await response.blob();
                  const imageUrl = URL.createObjectURL(blob);
  
                  const img = new Image();
                  img.src = imageUrl;
                  img.onload = () => {
                      setBgUrl(imageUrl);
                      setIsImageLoaded(true);
                  };
              } catch (error) {
                  console.error('Error fetching image:', error);
              }
          };
  
          fetchImage();
      }, []);
      if (!isImageLoaded) {
          return <div className="d-flex justify-content-center align-items-center " style={{ height: '100vh' }}>Loading ...</div>;
      }

  const transportationData = [
    {
      name: "Akasa Express",
      departure: "22:40",
      arrival: "05:05",
      from: `${bookedData.departure}`,
      to: `${bookedData.arrival}`,
      price: "₹2,400",
    },
    {
      name: "vandhe Bharath",
      departure: "24:30",
      arrival: "04:15",
      from: `${bookedData.departure}`,
      to: `${bookedData.arrival}`,
      price: "₹3,500",
    }]

  const handleBookClick = async (transportation) => {

    if (!nameRef.current.value) {
      alert("Please enter your name!");
      nameRef.current.focus();
      return;
    }
    if (!numberRef.current.value) {
      alert("Please enter your number!");
      numberRef.current.focus();
      return;
    }
    const personDetails = {
      name: nameRef.current.value,
      number: numberRef.current.value
    }

    const combinedData = {
      transportationDetails: transportation,
      persondetails: personDetails,
      bookedDetails: bookedData
    }
    const token = localStorage.getItem('token')

    try {
      const respone = await fetch('https://travel-guide-backend-pfri.onrender.com/book/trains', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(combinedData)
      })
      const data = respone.json()
      console.log('booking respone', data);
      alert('Train booked successfully')
      navigate('/bookedtrain')

    } catch (error) {
      console.log('error booking train', error);
    }
  }

  return (
    <div className="transportation-booking-container"
     style={{
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="flight-booking-header">
        <div className="flight-booking-search-box">
          <div className="flight-booking-search-item">
            <label>FROM</label>
            <input type="text" value={bookedData?.departure} readOnly />
          </div>
          <span className="flight-swap-icon">⇆</span>
          <div className="flight-booking-search-item">
            <label>TO</label>
            <input type="text" value={bookedData?.arrival} readOnly />
          </div>
          <div className="flight-booking-search-item">
            <label>DATE</label>
            <input type="date" value={bookedData?.departureDate} readOnly />
          </div>
          <div className="flight-booking-search-item">
            <label>NAME</label>
            <input type="text" placeholder='Name' ref={nameRef} required />
          </div>
          <div className="flight-booking-search-item">
            <label>NUMBER</label>
            <input type="number" placeholder='Number' ref={numberRef} required />
          </div>
        </div>
      </div>
      <div className="flight-list">
        {transportationData.map((transportation, index) => (
          <div className="flight-item" key={index}>
            <h3 className="flight-name" ><FaTrain /> {transportation.name}</h3>
            <div className="flight-details">
              <h2 className="departure-time">{transportation.departure}</h2>
              <span className="non-stop">Non stop</span>
              <h2 className="arrival-time">{transportation.arrival}</h2>
              <p className="destination">{transportation.from.split(':')[0]} <FaTrain /> {transportation.to.split(':')[0]}</p>
              <p className="flight-price">{transportation.price}</p>
              <button className="book-btn" onClick={() => handleBookClick(transportation)}>Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}

export default Bookingvehicle
