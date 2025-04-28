import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cartedPlaces.css';

function CartedPlaces() {
  const navigate = useNavigate();
  const [cartPlace, setCartPlace] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bgUrl, setBgUrl] = useState("");
  

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('https://travel-guide-backend-pfri.onrender.com/bookmark/search', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setCartPlace(data)
        setIsLoading(false);
      })
      .catch(error => console.error('Error fetching cart data:', error));
  }, []);

  useEffect(() => {
    const fetchAllImages = async () => {
      if (cartPlace.length === 0) return;
      try {
        const imageDataArray = await Promise.all(
          cartPlace.map(async (item) => {
            console.log(`Fetching image for: ${item.filename}`);
            const res = await fetch(`https://travel-guide-backend-pfri.onrender.com/search/attra?filename=${item.filename}`);
            if (!res.ok) {
              console.error(`Failed to fetch image for ${item.filename}`);
              return null;
            }
            const data = await res.json();
            return data[0] || null;
          })
        );

        setImages(imageDataArray.filter(img => img !== null));
      } catch (error) {
        console.error('Images fetching error occurred:', error);
      }
    };

    fetchAllImages();
  }, [cartPlace]);

  useEffect(() => {
    console.log("Fetched Images:", images)
  })
  const cartremove = async (id) => {
    navigate('/')
    alert('Bookmarked Removed')
    try {
      const res = await fetch(`https://travel-guide-backend-pfri.onrender.com/bookmark/delete/${id}`);
      const data = await res.json();
      console.log(data);

    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };
 useEffect(() => {
            const fetchImage = async () => {
                try {
                    const response = await fetch('http://localhost:4000/bookingimage/cart1.jpg');
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    console.log(imageUrl);
                    
    
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = () => {
                        setBgUrl(imageUrl);
                        // setIsImageLoaded(true);
                    };
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };
    
            fetchImage();
        }, []);
  return (
    <div className='background-imagee' 
    style={{
      backgroundImage: bgUrl  ? `url(${bgUrl})` : 'none',
      padding: "2rem"
    }}
    >
      <h2 className='desert-heading'>BROWSE YOUR <br /><span className='desert-sub-heading' >FAVORITES</span></h2>
      <div className="cartedPlaces">
        {cartPlace.length > 0 ? (
          cartPlace.map((item, index) => (
            <div key={item._id} className="card">
              <p className='remove-bookmarked' onClick={() => cartremove(item._id)}> &times;</p>
              {images[index] && (
                <img
                  src={images[index].imgUrl || images[index][0]?.image || images[index]?.image}
                  alt={`State ${index + 1}`}
                  // width="200"
                />
              )}
              
              <div className="content">
                <h3>{item.statename}</h3>
                <button className='cart-button' onClick={() => navigate(`/cartplacedetails/${item._id}`)}>Visit</button>
              </div>
            </div>
          ))
        ) : (
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: '100vh' }}
          >
            <p className="text-inf">You have no items wishlisted </p></div>

        )}
      </div>
    </div>
  );
}

export default CartedPlaces;
