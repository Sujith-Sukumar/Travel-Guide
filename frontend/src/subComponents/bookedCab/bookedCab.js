import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../bookedCab/bookedCab.css'
import Travelnavbar from '../../components/navbar/travelnavbar';
import { FaCar } from 'react-icons/fa';

function BookedCab() {
    const name = localStorage.getItem('username')
    const cabNumber = 'TN 07 AB 1234'
    const navigate = useNavigate()
    const [booking, setBooking] = useState([]);
    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await fetch('https://travel-guide-backend-pfri.onrender.com/cabs/search', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                console.log(data, 'fetched data');
                setBooking(data);
            } catch (error) {
                console.error('Error fetching bus bookings:', error);
            }
        };

        fetchBooking();
    }, [])
    const queryDeletion = (id) => {
        alert('booking canceled')
        navigate('/')
        fetch(`https://travel-guide-backend-pfri.onrender.com/cab/delete/${id}`, {
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
            <h2 className="title"style={{textTransform:'uppercase'}}>Booked <FaCar /> Cab</h2>
            {booking.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                <div className="card-container">
                    {booking.map((item, index) => (
                        <div key={index} className="cardd">
                            <h3 className="cardd-title">Passenger Name: {name}</h3>
                            <p><span>Cab Number:</span> {cabNumber}</p>
                            <p><span>From:</span> {item.bookedData?.pickupplace}</p>
                            <p><span>To:</span> {item.bookedData?.dropplace}</p>
                            <p><span>Date:</span> {item.bookedData?.pickupDate}</p>
                            <p><span>Price:</span> {item.cabprice}</p>
                            <button className='btn btn-danger cancel-btn' onClick={() => queryDeletion(item._id)}>cancel</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    )
}

export default BookedCab
