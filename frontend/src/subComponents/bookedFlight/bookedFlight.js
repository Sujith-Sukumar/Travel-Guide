import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookedFlight.css'
import Travelnavbar from '../../components/navbar/travelnavbar';
import { FaPlane } from 'react-icons/fa';

function BookedFlight() {
    const navigate = useNavigate()
    const [booking, setBooking] = useState([]);

    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://localhost:4000/flight/search', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                console.log("Fetched booking data:", data);
                setBooking(data);
            } catch (error) {
                console.log('Error fetching bookings:', error);
            }
        };
        fetchBooking();
    }, []);

    const queryDeletion = (id) => {
        alert('booking canceled')
        navigate('/')
        fetch(`http://localhost:4000/flight/delete/${id}`,
            {
                method: 'DELETE'
            })
            .then((res) => res.json())
            .then(() => {
                setBooking((prevBookings) =>
                    prevBookings.filter((booking) => booking._id !== id)
                );
            })
            .catch((error) => {
                console.log('Error deleting student:', error);
            })
    }
    return (
        <>
        <Travelnavbar />
        <div className="booked-flights-container">
            <h2 className="title" style={{textTransform:'uppercase'}}>Booked <FaPlane /> Flights</h2>
            {booking.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                <div className="card-container">
                    {booking.map((item, index) => (
                        <div key={index} className="cardd">
                            <h3 className="cardd-title">Passenger Name: <span style={{color:'red',textTransform:'uppercase'}}>{item.personDetails?.name || 'N/A'}</span></h3>
                            <p><span>Contact Info:</span> {item.personDetails?.number || 'N/A'}</p>
                            <p><span>DOB:</span> {item.personDetails?.dob || 'N/A'}</p>
                            <p><span>Flight Name:</span> {item.flightDetails?.name || 'N/A'}</p>
                            <p><span>From:</span> {item.bookedDetails?.from || 'N/A'}</p>
                            <p><span>To:</span> {item.bookedDetails?.to || 'N/A'}</p>
                            <p><span>Date:</span> {item.bookedDetails?.date || 'N/A'}</p>
                            <p><span>Class Type:</span> {item.bookedDetails?.economy || 'N/A'}</p>
                            <p><span>Fare:</span> {item.bookedDetails?.fare || 'N/A'}</p>
                            <p><span>Price:</span> {item.flightDetails?.price || 'N/A'}</p>
                            <button className='btn btn-danger cancel-btn' onClick={() => queryDeletion(item._id)}>cancel</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
}

export default BookedFlight;
