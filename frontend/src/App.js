import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TravelStates from './components/statesGallery/travelStates';
import Multipleplaces from './subComponents/placesGallery/multipleplaces';
import Placedetails from './subComponents/placesdetails.js/placedetails';
import Booking from './components/bookingHome/bookinghome';
import BookedFlight from './subComponents/bookedFlight/bookedFlight';
import CartedPlaces from './subComponents/bookmarkedPlaces/cartedPlaces';
import Bookingvehicle from './subComponents/trainBooking/bookingvehicle';
import BookedTrain from './subComponents/bookedTrain/bookedTrain';
import CartPlaceDetails from './subComponents/bookmarkedDetails/cartPlaceDetails';
import FlightBooking from './subComponents/flightBooking/flightbooking';
import BookedBus from './subComponents/bookedBus/bookedBus';
import BookedCab from './subComponents/bookedCab/bookedCab';
import Bookingcabbus from './subComponents/bookingcabbus/bookingcabbus';
import Travelnavbar from './components/navbar/travelnavbar';
import SignInUp from './subComponents/signIn/signIn';
import Termsofuse from './subComponents/TermsofUse/termsofuse';
import Privacyandpolicy from './subComponents/Privacypolicy/privacyandpolicy';

function App() {
  return (
    <>
      <Router>
        <Travelnavbar />
        <Routes>
          <Route path='/'  element={<TravelStates />} />
          <Route path='/login'  element={<SignInUp/>} />
          <Route path='/multipleplaces' element={<Multipleplaces />} />
          <Route path='/placedetails/:id' element={<Placedetails />} />
          <Route path='/booking' element={<Booking />}/>
          <Route path='/flightBooking' element={<FlightBooking />}/>
          <Route path='/bookedflight' element={<BookedFlight />}/>
          <Route path='/cartedplaces' element={<CartedPlaces />}/>
          <Route path='/bookingvehicle' element={<Bookingvehicle />}/>
          <Route path='/bookedtrain' element={<BookedTrain />}/>
          <Route path='/bookingcabbus' element={<Bookingcabbus />}/>
          <Route path='/bookedbus' element={<BookedBus />}/>
          <Route path='/bookedcab' element={<BookedCab />}/>
          <Route path='/cartplacedetails/:id' element={<CartPlaceDetails />}/>
          <Route path='/termsanduse' element={<Termsofuse />}/>
          <Route path='/privacypolicy' element={<Privacyandpolicy />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
