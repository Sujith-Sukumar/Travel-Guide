import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookinghome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faTrain, faBus, faTaxi } from '@fortawesome/free-solid-svg-icons';

const Booking = () => {
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [toInput, setToInput] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [activeOption, setActiveOption] = useState('flights');
    const [bgUrl, setBgUrl] = useState("");
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [trainDeparture, setTrainDeparture] = useState('');
    const [trainArrival, setTrainArrival] = useState('');
    const [filteredTrainPlaces, setFilteredTrainPlaces] = useState([]);


    const ValidPlaces = [
        'Delhi:(DEL) Indira Gandhi International Airport', 'Mumbai:(BOM) Chhatrapati Shivaji Maharaj International Airport', 'Bengaluru:(BLR) Kempegowda International Airport', 'Chennai:(MAA) Chennai International Airport', 'Kolkata:(CCU) Netaji Subhas Chandra Bose International Airport', 'Hyderabad:(HYD) Rajiv Gandhi International Airport',
        'Ahmedabad:(AMD) Sardar Vallabhbhai Patel International Airport', 'Goa:(GOI) Goa International Airport', 'Pune:(PNQ) Pune Airport', 'Kochi:(COK) Cochin International Airport', 'Jaipur:(JAI) Jaipur International Airport', 'Lucknow:(LKO) Chaudhary Charan Singh International Airport', 'Thiruvananthapuram:(TRV) Trivandrum International Airport', 'Visakhapatnam:(VTZ) Visakhapatnam International Airport',
        'Nagpur:(NAG) Dr. Babasaheb Ambedkar International Airport', 'Coimbatore:(CJB) Coimbatore International Airport', 'Varanasi:(VNS) Lal Bahadur Shastri International Airport', 'Srinagar:(SXR) Sheikh ul-Alam International Airport', 'Guwahati:(GAU) Lokpriya Gopinath Bordoloi International Airport'
    ];

    const ValidTrainStations = [
        "Thiruvananthapuram Central (TVC)",
        "Ernakulam Junction (ERS)",
        "Kochi Harbour Terminus (CHTS)",
        "Kozhikode (CLT)",
        "Alappuzha (ALLP)",
        "Kollam Junction (QLN)",
        "Thrissur (TCR)",
        "Kottayam (KTYM)",
        "Palakkad Junction (PGT)",
        "Shoranur Junction (SRR)",
        "Kannur (CAN)",
        "Kayamkulam Junction (KYJ)",
        "Mangalore Central (MAQ) – [Nearby]",
        "Ottapalam (OTP)",
        "Tirur (TIR)",
        "Chengannur (CNGR)",
        "Vadakara (BDJ)",
        "Aluva (AWY)",
        "Nilambur Road (NIL)",
        "Punalur (PUU)"
      ];
      


    const inputRef = useRef()
    const toRef = useRef()
    const dateRef = useRef()
    const traveleresRef = useRef()
    const economyRef = useRef()

    const departureRef = useRef()
    const arrivalRef = useRef()
    const departureDateRef = useRef()

    const originRef = useRef()
    const destinationRef = useRef()
    const origindateRef = useRef()
    const origintimeRef = useRef()
    const seatsRef = useRef()

    const pickupRef = useRef()
    const dropRef = useRef()
    const pickupDateRef = useRef()
    const pickuptimeRef = useRef()


    const handleInputChange = (event) => {
        const value = event.target.value || '';
        setInputValue(value);
        const matchedPlaces = ValidPlaces.filter(place =>
            place.toLowerCase().includes(value.toLowerCase()));
        setFilteredPlaces(matchedPlaces);
    }

    const handleToChange = (event) => {
        const value = event.target.value || '';
        setToInput(value);
        const matchedPlaces = ValidPlaces.filter(place =>
            place.toLowerCase().includes(value.toLowerCase()));
        setFilteredPlaces(matchedPlaces);
    };
    const handleTrainDepartureChange = (event) => {
        const value = event.target.value || '';
        setTrainDeparture(value);
        const matchedPlaces = ValidTrainStations.filter(place =>
          place.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTrainPlaces(matchedPlaces);
      };
      
      const handleTrainArrivalChange = (event) => {
        const value = event.target.value || '';
        setTrainArrival(value);
        const matchedPlaces = ValidTrainStations.filter(place =>
          place.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTrainPlaces(matchedPlaces);
      };
      
    const clicked = async (event) => {
        event.preventDefault();
        let bookingData = {};

        if (activeOption === 'flights') {
            bookingData = {
                name: 'airplane1.jpg',
                from: inputRef.current.value,
                to: toRef.current.value,
                date: dateRef.current.value,
                travalerescount: traveleresRef.current.value,
                economy: economyRef.current.value,
                fare: document.querySelector('input[name="fare"]:checked')?.value || "Not selected"
            }
        } else if (activeOption === 'trains') {
            bookingData = {
                name: 'train.jpg',
                departure: departureRef.current.value,
                arrival: arrivalRef.current.value,
                departureDate: departureDateRef.current.value,
            }
        } else if (activeOption === 'buses') {
            bookingData = {
                name: 'bus.jpg',
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                origindate: origindateRef.current.value,
                origintime: origintimeRef.current.value,
                seats: seatsRef.current.value
            }
        } else if (activeOption === 'cabs') {
            bookingData = {
                name: 'cab.jpg',
                pickupplace: pickupRef.current.value,
                dropplace: dropRef.current.value,
                pickupDate: pickupDateRef.current.value,
                pickuptime: pickuptimeRef.current.value
            }
        }

        if (activeOption === 'flights') {
            navigate(`/flightBooking`, { state: { bookingData } })
        }
        if (activeOption === 'trains') {
            navigate(`/bookingvehicle`, { state: { bookingData } })
        }
        if (activeOption === 'buses' || activeOption === 'cabs') {
            navigate(`/bookingcabbus`, { state: { bookingData } })
        }
    }

    const travelOptions = {
        flights: {
            image: bgUrl,
            form: (
                <>
                    <input list='places' placeholder="From" className="input-field" value={inputValue} onChange={handleInputChange} ref={inputRef} />
                    <datalist id='places'>
                        {filteredPlaces.map((place) => (
                            <option key={place} value={place}></option>
                        ))}
                    </datalist>
                    <span className="swap-icon">⇆</span>
                    <input list='destination' placeholder="To" className="input-field" value={toInput} onChange={handleToChange} ref={toRef} />
                    <datalist id='destination'>
                        {filteredPlaces.map((place) => (
                            <option key={place} value={place}></option>
                        ))}
                    </datalist>
                    <input type="date" className="input-field" ref={dateRef} min={new Date().toISOString().split("T")[0]} defaultValue={new Date().toISOString().split("T")[0]}
                    />
                    <select className="input-field" ref={traveleresRef}>
                        <option>1 Passenger</option>
                        <option>2 Passenger</option>
                    </select>
                    <select className="input-field" ref={economyRef}>
                        <option>Economy</option>
                        <option>Business</option>
                        <option>First Class</option>
                    </select>
                </>
            )
        },
        trains: {
            image: bgUrl,
            form: (
                <>
                    <input list='train-departure' placeholder="Departure Station" className="input-field" ref={departureRef} value={trainDeparture} onChange={handleTrainDepartureChange} />
                    <datalist id="train-departure">
                        {filteredTrainPlaces.map((place) => (
                            <option key={place} value={place} />
                        ))}
                    </datalist>
                    <input list='train-arrival' placeholder="Arrival Station" className="input-field" ref={arrivalRef} value={trainArrival} onChange={handleTrainArrivalChange} />
                    <datalist id="train-arrival">
                        {filteredTrainPlaces.map((place) => (
                            <option key={place} value={place} />
                        ))}
                    </datalist>
                    <input type="date" className="input-field" ref={departureDateRef} min={new Date().toISOString().split("T")[0]} defaultValue={new Date().toISOString().split("T")[0]} />
                </>
            )
        },
        buses: {
            image: bgUrl,
            form: (
                <>
                    <input type="text" placeholder="Origin" className="input-field" ref={originRef} />
                    <input type="text" placeholder="Destination" className="input-field" ref={destinationRef} />
                    <input type="date" className="input-field" ref={origindateRef} min={new Date().toISOString().split("T")[0]} defaultValue={new Date().toISOString().split("T")[0]} />
                    <input type="time" className="input-field" ref={origintimeRef} />
                    <input type="number" placeholder="Seats Required" className="input-field" ref={seatsRef} />
                </>
            )
        },
        cabs: {
            image: bgUrl,
            form: (
                <>
                    <input type="text" placeholder="Pickup Location" className="input-field" ref={pickupRef} />
                    <input type="text" placeholder="Drop Location" className="input-field" ref={dropRef} />
                    <input type="date" placeholder="" className="input-field" ref={pickupDateRef} min={new Date().toISOString().split("T")[0]} defaultValue={new Date().toISOString().split("T")[0]} />
                    <input type="time" className="input-field" ref={pickuptimeRef} />
                </>
            )
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsLoggedIn(token !== null)
    }, [])

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setIsImageLoaded(false);
                let imageName = '';
                if (activeOption === 'flights') imageName = 'airplane1.jpg';
                else if (activeOption === 'trains') imageName = 'train.jpg';
                else if (activeOption === 'buses') imageName = 'bus.jpg';
                else if (activeOption === 'cabs') imageName = 'cab.jpg';

                const response = await fetch(`https://travel-guide-backend-pfri.onrender.com/bookingimage/${imageName}`);
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
    }, [activeOption]);
    if (!isImageLoaded) {
        return <div className="d-flex justify-content-center align-items-center " style={{ height: '100vh' }}>Loading....</div>;
    }
    return (
        <>
            <div className="background-image" style={{ backgroundImage: `url(${travelOptions[activeOption].image})` }}>
                <h1 className="bg-heading">GET STARTED</h1>
                <div className="transport-options">
                    <div className={`option ${activeOption === 'flights' ? 'active' : ''}`} onClick={() => setActiveOption('flights')}>
                        <FontAwesomeIcon icon={faPlane} /> Flights
                    </div>
                    <div className={`option ${activeOption === 'trains' ? 'active' : ''}`} onClick={() => setActiveOption('trains')}>
                        <FontAwesomeIcon icon={faTrain} /> Trains
                    </div>
                    <div className={`option ${activeOption === 'buses' ? 'active' : ''}`} onClick={() => setActiveOption('buses')}>
                        <FontAwesomeIcon icon={faBus} /> Buses
                    </div>
                    <div className={`option ${activeOption === 'cabs' ? 'active' : ''}`} onClick={() => setActiveOption('cabs')}>
                        <FontAwesomeIcon icon={faTaxi} /> Cabs
                    </div>
                </div>

                <div className="booking-container">
                    {activeOption === 'flights' && (
                        <>
                            <div className="fare-type">
                                <span>Select A Fare Type:</span>
                                <div className="fare-options">
                                    <label className="fare-item">
                                        <input type="radio" name="fare" value="Regular" /> Regular
                                    </label>
                                    <label className="fare-item">
                                        <input type="radio" name="fare" value="Armed" /> Armed
                                    </label>
                                    <label className="fare-item">
                                        <input type="radio" name="fare" value="Student" /> Student
                                    </label>
                                    <label className="fare-item">
                                        <input type="radio" name="fare" value="Senior Citizen" /> Senior Citizen
                                    </label>
                                    <label className="fare-item">
                                        <input type="radio" name="fare" value="Doctors & Nurses" /> Doctors & Nurses
                                    </label>
                                </div>
                            </div>

                            <div className="options">
                                <label>
                                    <input type="checkbox" defaultChecked /> Direct flight only
                                </label>
                            </div>
                        </>
                    )}
                    <div className="input-group">
                        {travelOptions[activeOption].form}
                    </div>
                    <div className="options">
                        {activeOption === 'flights' && (
                            isLoggedIn ? (
                                <button className="search-btnn" onClick={clicked}>Search</button>
                            ) : (
                                <button className="search-btnn" onClick={() => window.alert('login and book your destination')}>Search</button>
                            )
                        )}
                        {activeOption !== 'flights' && (
                            isLoggedIn ? (
                                <button className="search-btnn" onClick={clicked}>Search</button>
                            ) : (
                                <button className="search-btnn" onClick={() => window.alert('login and book your destination')}>Search</button>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Booking;
