/* eslint-disable jsx-a11y/heading-has-content */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../bookingcabbus/bookingcabbus.css';
import { useLocation } from 'react-router-dom';
import { FaBus, FaCar } from 'react-icons/fa';

function Bookingcabbus() {
    const navigate = useNavigate()
    const location = useLocation();
    const bookedData = location.state?.bookingData;
    const [travelType, setTravelType] = useState("");
    const [sampletravelType, setsampleTravelType] = useState("");
      const [bgUrl, setBgUrl] = useState("");
      const [isImageLoaded, setIsImageLoaded] = useState(false);

      useEffect(() => {
        if (bookedData?.name) {
            const name = bookedData.name.toLowerCase();
    
            if (name.includes("bus")) {
                setTravelType("buses");
                setsampleTravelType("bus.jpg");
            } else if (name.includes("cab") || name.includes("car")) {
                setTravelType("cabs");
                setsampleTravelType("cab.jpg");
            }
        }
    }, [bookedData]);
    
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`http://localhost:4000/bookingimage/${sampletravelType}`);
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
    
        if (sampletravelType) {
            fetchImage();
        }
    }, [sampletravelType]); 

    if (!isImageLoaded) {
        return <div className="d-flex justify-content-center align-items-center " style={{ height: '100vh' }}>Loading ...</div>;
    }
    

    console.log(bookedData, 'booked data');
    const price = 350;

    const clickBooked = () => {
        const combinedData = {
            bookedData: bookedData,
            price: price
        }
        console.log(combinedData);

        const token = localStorage.getItem('token')
        const busBooking = async () => {
            const res = await fetch('http://localhost:4000/book/buses', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify(combinedData)
            });
            const data = await res.json()
            console.log(data, 'booking response');
            navigate('/bookedbus')
        }
        busBooking()
    }

    const cabPrice = 850;
    const cabBooked = () => {
        console.log(bookedData, 'cab booked data');
        const combinedData = {
            bookedData: bookedData,
            cabprice: cabPrice
        }
        console.log(combinedData);
        const token = localStorage.getItem('token')
        const cabbooking = async () => {
            const res = await fetch('http://localhost:4000/book/cabs', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify(combinedData)
            });
            const data = await res.json()
            console.log(data, 'fetched cab data');
            navigate('/bookedcab')


        }
        cabbooking();

    }

    const traveloption = {
        buses: {
            image: bgUrl,
            form: (
                <>
                    <div className="transport-list">
                        <div className="transport-item">
                            <h3 className="transport-name">Yathra <FaBus /></h3>
                            <div className="transport-details">
                                <div className="transport-row">
                                    <h2 className="transport-label">Origin:</h2>
                                    <h2 className="transport-value">{bookedData.origin}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Destination:</h2>
                                    <h2 className="transport-value">{bookedData.destination}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Time:</h2>
                                    <h2 className="transport-value">{bookedData.origintime}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Date:</h2>
                                    <h2 className="transport-value">{bookedData.origindate}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Seat:</h2>
                                    <h2 className="transport-value">A12</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-value">₹{price}</h2>
                                </div>
                            </div>
                            <button className='btn btn-success' onClick={clickBooked}>book now</button>
                        </div>
                    </div>
                </>
            )
        },
        cabs: {
            image: bgUrl,
            form: (
                <>
                    <div className="transport-list">
                        <div className="transport-item">
                            <h3 className="transport-name">Uber <FaCar /></h3>
                            <div className="transport-details">
                                <div className="transport-row">
                                    <h2 className="transport-label">Pickup:</h2>
                                    <h2 className="transport-value">{bookedData.pickupplace}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Drop:</h2>
                                    <h2 className="transport-value">{bookedData.dropplace}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Time:</h2>
                                    <h2 className="transport-value">{bookedData.pickuptime}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Date:</h2>
                                    <h2 className="transport-value">{bookedData.pickupDate}</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-label">Cab Number:</h2>
                                    <h2 className="transport-value">TN 07 AB 1234</h2>
                                </div>
                                <div className="transport-row">
                                    <h2 className="transport-value">₹{cabPrice}</h2>
                                </div>
                            </div>
                            <button className='btn btn-success' onClick={cabBooked}>Book now</button>
                        </div>
                    </div>
                </>
            )
        }
    };

    return (
        <div className="background-image" style={{ backgroundImage: `url(${traveloption[travelType]?.image})` }}>
            <p>Booking Cab/Bus</p>
            {traveloption[travelType]?.form}
        </div>
    );
}

export default Bookingcabbus;
