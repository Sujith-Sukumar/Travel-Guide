import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './travelfooter.css'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'

function Travelfooter() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    const [bgUrl, setBgUrl] = useState("");
    const [sbgUrl, setsBgUrl] = useState("");

    // const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
            const fetchImage = async () => {
                try {
                    const response = await fetch('https://travel-guide-backend-pfri.onrender.com/bookingimage/scanner.jpg');
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
    
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
        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const response = await fetch('https://travel-guide-backend-pfri.onrender.com/bookingimage/attractiongoldentemple.jpg');
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
    
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = () => {
                        setsBgUrl(imageUrl);
                        // setIsImageLoaded(true);
                    };
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };
    
            fetchImage();
        }, []);
    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsLoggedIn(token !== null)

    }, [])
    const handleClicked = () => {
        localStorage.removeItem('token')
        alert('logging out')
        navigate('/')
    }
    return (
        <>
            <div className='footer-image'>
                <div className='line'></div>
                <div className='footer-brand-social'>
                    <h3>Follow us</h3>
                    <div className='social-icons'>
                        <a href="https://www.facebook.com/sujith kallingal" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                        <a href="https://www.instagram.com/_sujiith_" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://www.linkedin.com/in/sujith-sukumar" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/Sujith-Sukumar" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                    </div>
                </div>
                <div className='quick-links'>
                    <h2>Travel <span style={{color:'red'}}> &</span> Tourism</h2>
                    <p className='quick-links-p'>Discover the beauty of the world through our travel and tourism platform. Whether you're seeking adventure, culture, or relaxation, we help you find the perfect destinations and experiences for your journey.</p>
                </div>

                <div className='newsletter-chat'>
                    <div className='chat'>
                        <h2>Scan To Chat</h2>
                        <img src={bgUrl} alt='WhatsApp QR' />
                    </div>

                    <div className='newsletter'>
                        <h2>Travel Explore</h2>
                        {isLoggedIn ? (
                            <>
                                <p>You're now signed in! View other user profiles, share your own travel experiences, and explore amazing destinations tailored just for you.</p>
                                <button onClick={handleClicked}> Logout</button>
                            </>
                        ) : (
                            <>
                                <p>Sign up and explore new places, discover exciting events, and get inspired for your next adventure.</p>
                                <button onClick={() => navigate('/login')}> Login now</button>
                            </>
                        )}
                    </div>

                </div>
                <div className='footer-links'>
                    <h4 onClick={()=>navigate('/termsanduse')}>Terms of Use</h4> | <h4 onClick={()=>navigate('/privacypolicy')}>Privacy Policy</h4> | <a href='mailto:sujithsukumarofficial@gmail.com' style={{textDecoration:'none',color:'white'}}><h4>Contact Us</h4></a>
                </div>

                <div className='footer-wrapper'>
                    <img src={sbgUrl} alt='Kerala Munnar' />
                </div>
            </div>
        </>
    )
}

export default Travelfooter
