import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './bookedTrain.css'
import Travelnavbar from '../../components/navbar/travelnavbar';
import { FaTrain } from 'react-icons/fa';

function BookedTrain() {
    const navigate = useNavigate()
    const [booking, setBooking] = useState([]);
    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://localhost:4000/train/search', {
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
        fetch(`http://localhost:4000/train/delete/${id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                console.log('query deleted');
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
            <h2 className="title"style={{textTransform:'uppercase'}}>Booked <FaTrain /> Train</h2>
            {booking.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                <div className="card-container">
                    {booking.map((item, index) => (
                        <div key={index} className="cardd">
                            <h3 className="cardd-title">Passenger Name: {item.persondetails?.name || 'N/A'}</h3>
                            <p><span>Contact Info:</span> {item.persondetails?.number || 'N/A'}</p>
                            <p><span>Train Name:</span> {item.transportationDetails?.name || 'N/A'}</p>
                            <p><span>From:</span> {item.bookedDetails?.departure || 'N/A'}</p>
                            <p><span>To:</span> {item.bookedDetails?.arrival || 'N/A'}</p>
                            <p><span>Date:</span> {item.bookedDetails?.departureDate || 'N/A'}</p>
                            <p><span>Departure:</span> {item.transportationDetails?.departure || 'N/A'}</p>
                            <p><span>Arrival:</span> {item.transportationDetails?.arrival || 'N/A'}</p>
                            <p><span>Price:</span> {item.transportationDetails?.price || 'N/A'}</p>
                            <button className='btn btn-danger cancel-btn' onClick={() => queryDeletion(item._id)}>cancel</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
        )
}

export default BookedTrain