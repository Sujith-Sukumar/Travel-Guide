import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../bookedBus/bookedBus.css'
import Travelnavbar from '../../components/navbar/travelnavbar'
import { FaBus } from 'react-icons/fa'

function BookedBus() {
    const navigate = useNavigate()
    const [booking,SetBooking] = useState([])
    const name = localStorage.getItem('username')
    useEffect(() => {
        const fetchBooking = async () => {
          const token = localStorage.getItem('token')
          try {
            const res = await fetch('https://travel-guide-backend-pfri.onrender.com/bus/search', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
            const data = await res.json();
            console.log(data, 'fetched data');
            SetBooking(data);
          } catch (error) {
            console.error('Error fetching bus bookings:', error);
          }
        };
      
        fetchBooking();
      }, [])
      const queryDeletion = (id) => {
        alert('booking canceled')
        navigate('/')
        fetch(`https://travel-guide-backend-pfri.onrender.com/bus/delete/${id}`, {
            method: 'DELETE'
        })
            .then((res) => res.json())
            .then(() => {
                console.log('query deleted');
                SetBooking((prevBookings) =>
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
    <h2 className="title"style={{textTransform:'uppercase'}}>Booked <FaBus /> Bus</h2>
    {booking.length === 0 ? (
        <p className="no-bookings">No bookings found.</p>
    ) : (
        <div className="card-container">
            {booking.map((item, index) => (
                <div key={index} className="cardd">
                    <h3 className="cardd-title">Passenger Name: {name}</h3>
                    {/* <p><span>Contact Info:</span> {item.persondetails?.number || 'N/A'}</p> */}
                    <p><span>Train Name:</span> {}Express</p>
                    <p><span>From:</span> {item.bookedData?.origin || 'N/A'}</p>
                    <p><span>To:</span> {item.bookedData?.destination || 'N/A'}</p>
                    <p><span>Date:</span> {item.bookedData?.origindate || 'N/A'}</p>
                    <p><span>Departure:</span> {item.bookedData?.origintime || 'N/A'}</p>
                    <p><span>Arrival:</span> {item.bookedData?.seats || 'N/A'}</p>
                    <p><span>Price:</span> {item.price || 'N/A'}</p>
                    <button className='btn btn-danger cancel-btn' onClick={() => queryDeletion(item._id)}>cancel</button>
                </div>
            ))}
        </div>
    )}
</div>
</>
  )
}

export default BookedBus
