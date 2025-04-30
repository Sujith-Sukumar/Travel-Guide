/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaSearch, FaUser, FaHeart, FaSignInAlt, FaSignOutAlt, FaPlane, FaTrain, FaBus, FaCar } from "react-icons/fa";
import "./travelnavbar.css";

const Travelnavbar = () => {
    const navigate = useNavigate();
    const searchRef = useRef();
    const location = useLocation();
    const isVideoHome = location.pathname === '/';

    const [destinations, setDestinations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserBox, setShowUserBox] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchedd, setSearchedd] = useState([])
    const [showSearch, setShowSearch] = useState(false);


    const inputChange = async (event) => {
        const searchdata = event.target.value.trim();

        try {
            const response = await fetch(`http://localhost:4000/search/attra?filename=${searchdata}`)
            const getdata = await response.json()
            if (searchdata === "") {
                setSearchedd([]);
            } else {
                setSearchedd(getdata)
            }
        } catch (error) {

        }
    }

    const submitted = async (event) => {
        event.preventDefault()
        inputChange({ target: searchRef.current })

    }
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        // setIsBlack(!isblack)
        if (!showSearch) {
            setTimeout(() => searchRef.current?.focus(), 100);
        }
    };
    const clicked = (id) => {
        navigate(`/placedetails/${id}`)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(token !== null)
    }, []);

    const storedUsername = localStorage.getItem('username')

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username')
        alert('Logged out successfully!');
        setIsLoggedIn(false);
        navigate('/');
    }
    useEffect(() => {
        if (searchInput === '') {
            setSearchedd([]);
        }
    }, [searchInput]);

    useEffect(() => {
        fetch('http://localhost:4000/destination/get')
            .then(res => res.json())
            .then(data => {
                setDestinations(data);
            })
            .catch(err => console.error('Error fetching destinations:', err))

    }, []);

    return (
        <>
            <nav className={`navbar navbar-expand-md fixed-top  ${!isVideoHome ? 'black-bg' : ''}`}>
                <div className="container-fluid position-relative">
                    <a className="navbar-brand" href="#">
                        Travel<span className="dot"> &</span><span className="logo-india"> Tourism</span>
                    </a>
                    <div className="navbar-collapse d-flex justify-content-between align-items-center">
                        <ul className="navbar-nav d-flex flex-row ms-auto">

                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home ▾</Link>
                            </li>

                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="#"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    Destinations ▾
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/booking">Book your Ticket ▾</Link>
                            </li>
                        </ul>
                        <div className="navbar-icons d-flex align-items-center">

                            <button className="search-btn" onClick={toggleSearch}>
                                <FaSearch className="icon" />
                            </button>

                            {showSearch && (
                                <form onSubmit={submitted} className="search-form d-flex">
                                    <input
                                        type="text"
                                        className="form-control nav-input-box"
                                        placeholder="Search..."
                                        ref={searchRef}
                                        onChange={inputChange}
                                    />
                                </form>
                            )}
                            <div className="nav-user" style={{ position: 'relative' }}>

                                <FaUser className="icon" onClick={() => setShowUserBox(!showUserBox)} />
                                {showUserBox && (
                                    <div className="user-dropdown">
                                        {isLoggedIn ? (
                                            <>
                                                <p><span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'white', fontSize: '15px' }}> &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;User INFO</span></p>
                                                <p><FaUser style={{ color: 'white', fontSize: '14px' }} /><span style={{ textTransform: 'uppercase', fontWeight: '', color: 'white', fontSize: '14px' }} >&nbsp;{storedUsername}</span></p>
                                                {isLoggedIn ? (
                                                    <p style={{ color: 'white', fontWeight: '' }} onClick={() => navigate('/cartedplaces')}><FaHeart style={{ color: '', fontSize: '14px' }} className="icn" onClick={() => navigate('/cartedplaces')} /> &nbsp;WISHLIST</p>
                                                ) : (
                                                    <FaHeart style={{ color: '', fontSize: '14px' }} className="icn" onClick={() => window.alert(' Login to view your saved bookmarks.')} />
                                                )}
                                                <p style={{ textTransform: 'uppercase', fontWeight: '', color: 'white' }}>Booked Details ▾</p>
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                    <p style={{ textTransform: 'capitalize', fontWeight: '', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/bookedflight')}>
                                                        <FaPlane style={{ color: '', fontSize: '15px', marginRight: '5px' }} />Flight
                                                    </p>
                                                    <p style={{ textTransform: '', fontWeight: '', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/bookedtrain')}>
                                                        <FaTrain style={{ color: '', fontSize: '15px', marginRight: '5px' }} />Train
                                                    </p>
                                                </div>

                                                <div style={{ display: 'flex', gap: '30px', marginTop: '-10px' }}>
                                                    <p style={{ textTransform: '', fontWeight: '', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/bookedbus')}>
                                                        <FaBus style={{ color: '', fontSize: '15px', marginRight: '5px' }} />Bus
                                                    </p>
                                                    <p style={{ textTransform: '', fontWeight: '', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/bookedcab')}>
                                                        <FaCar style={{ color: '', fontSize: '15px', marginRight: '5px' }} />Cab
                                                    </p>
                                                </div>
                                                <button className="logout-btn" onClick={handleLogout}>Logout <FaSignOutAlt /></button>
                                            </>
                                        ) : (
                                            <button className="logout-btn" onClick={() => navigate('/login')}>&nbsp;Login <FaSignInAlt /></button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="region-dropdown d-flex flex-row">
                            {destinations.map((place, index) => (
                                <div key={index} className="region">
                                    <img
                                        src={place.image}
                                        alt={place.title}
                                        className="region-image"
                                    />
                                    <div className="region-content">
                                        <h3 style={{ textTransform: 'capitalize' }}>{place.heading}</h3>
                                        <ul>
                                            {place.states.split(',').map((state, idx) => {
                                                const trimmedState = state.trim();
                                                const isKeralaOrTamilnadu =
                                                    trimmedState.toLowerCase() === 'kerala' ||
                                                    trimmedState.toLowerCase() === 'tamilnadu';

                                                return (
                                                    <li
                                                        key={idx}
                                                        style={{
                                                            color: isKeralaOrTamilnadu ? 'red' : 'inherit',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            if (!isLoggedIn) {
                                                                window.alert('Login and explore destinations');
                                                            } else {
                                                                if (isKeralaOrTamilnadu) {
                                                                    navigate('/multipleplaces', { state: { statename: trimmedState } });
                                                                } else {
                                                                    window.alert('This destination will be available soon! Stay tuned and explore the beauty of Kerala or Tamil Nadu');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {trimmedState}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchedd.length > 0 && (
                        <div className="search-sample">
                            <div className="searched d-flex flex-row">
                                {searchedd.map((item, index) => (
                                    <div key={index} className="search-result  position-relative">
                                        <button
                                            className="close-btn"
                                            onClick={() => setSearchedd([])}
                                        >
                                            &times;
                                        </button>
                                        <img src={item.image} alt={item.title} className="result-image" />
                                        <div className="region-content">
                                            <h3 className="result-name">{item.statename}</h3>
                                            {isLoggedIn ? (
                                                <button className="result-btn" onClick={() => clicked(item.id)}>More</button>
                                            ) : (
                                                <button className="result-btn" onClick={() => window.alert('login and explore more')}>More</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </nav >
        </>
    );
};

export default Travelnavbar;
