import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
// import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ListingUpdate from './pages/ListingUpdate';
import axios from 'axios';
import { GetHosts } from './pages/GetHosts';
import { RequestsPage } from './pages/RequestsPage';

function App() {

  // axios.defaults.baseURL = "http://localhost:3001/";
  // axios.defaults.withCredentials = true;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/:listingId/updateproperty" element={<ListingUpdate />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          {/* <Route path="/:userId/wishList" element={<WishList />} /> */}
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
          <Route path="/:userId/gethosts" element={<GetHosts />} />
          <Route path="/:useeId/requestpage" element={<RequestsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
