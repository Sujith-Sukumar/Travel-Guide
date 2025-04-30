import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../flightBooking/flightbooking.css';
import { FaPlane } from 'react-icons/fa';

const FlightBooking = () => {
    const navigate = useNavigate()
    const nameRef = useRef();
    const dobRef = useRef();
    const numberRef = useRef();
    const location = useLocation()
    const bookeddata = location.state?.bookingData;
    console.log(bookeddata, 'this is booked data from sample one');
    const [bgUrl, setBgUrl] = useState("");
    const [isImageLoaded, setIsImageLoaded] = useState(false);



    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch('https://travel-guide-backend-pfri.onrender.com/bookingimage/airplane1.jpg');
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
    const flightData = [
        {
            name: "Akasa Air",
            departure: "02:40",
            arrival: "05:05",
            from: `${bookeddata.from}`,
            to: `${bookeddata.to}`,
            price: "₹5,422",
        },
        {
            name: "IndiGo",
            departure: "05:25",
            arrival: "07:40",
            from: `${bookeddata.from}`,
            to: `${bookeddata.to}`,
            price: "₹5,497",
        },
        {
            name: "Air India",
            departure: "06:30",
            arrival: "08:25",
            from: `${bookeddata.from}`,
            to: `${bookeddata.to}`,
            price: "₹6,100",
        },
    ]

    const handleBookClick = async (flight) => {
        if (!nameRef.current.value) {
            alert("Please enter your name!");
            nameRef.current.focus();
            return;
        }
        if (!dobRef.current.value) {
            alert("Please enter your date of birth!");
            dobRef.current.focus();
            return;
        }
        if (!numberRef.current.value) {
            alert("Please enter your number!");
            numberRef.current.focus();
            return;
        }
        const personDetails = {
            name: nameRef.current.value,
            dob: dobRef.current.value,
            number: numberRef.current.value
        }

        const combinedData = {
            flightDetails: flight,
            bookedDetails: bookeddata,
            personDetails: personDetails
        }
        const token = localStorage.getItem('token');

        // navigate('/bookedflight')

        try {
            const response = await fetch('https://travel-guide-backend-pfri.onrender.com/book/flights', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(combinedData)
            });
            if (!response.ok) {
                throw new Error("Booking failed");
            }
            const data = await response.json()
            console.log('booking respone', data);
            alert('Flight booked successfully!');
            navigate('/bookedflight');

        } catch (error) {
            console.log('error in booking', error);

        }
    }
    return (
        <div className="flight-booking-container"
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
                        <input type="text" value={bookeddata?.from} readOnly />
                    </div>
                    <span className="flight-swap-icon">⇆</span>
                    <div className="flight-booking-search-item">
                        <label>TO</label>
                        <input type="text" value={bookeddata?.to} readOnly />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>DEPART</label>
                        <input type="date" value={bookeddata?.date} readOnly />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>PASSENGERS</label>
                        <input type="text" value={bookeddata?.travalerescount} readOnly />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>CLASS</label>
                        <input type="text" value={bookeddata?.economy} readOnly />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>FARE</label>
                        <input type="text" value={bookeddata?.fare} readOnly />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>NAME</label>
                        <input type="text" placeholder='Name' ref={nameRef} required />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>DOB</label>
                        <input type="date" placeholder='DOB' ref={dobRef} required />
                    </div>
                    <div className="flight-booking-search-item">
                        <label>NUMBER</label>
                        <input type="number" placeholder='Number' ref={numberRef} required />
                    </div>
                </div>
            </div>

            <div className="flight-list">
                {flightData.map((flight, index) => (
                    <div className="flight-item" key={index}>
                        <h3 className="flight-name" ><FaPlane /> {flight.name}</h3>
                        <div className="flight-details">
                            <h2 className="departure-time">{flight.departure}</h2>
                            <span className="non-stop">Non stop</span>
                            <h2 className="arrival-time">{flight.arrival}</h2>
                            <p className="destination">{flight.from.split(':')[0]} <FaPlane /> {flight.to.split(':')[0]}</p>
                            <p className="flight-price">{flight.price}</p>
                            <button className="book-btn" onClick={() => handleBookClick(flight)}>Book</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FlightBooking;
