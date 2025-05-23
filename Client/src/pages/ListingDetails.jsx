import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import "../styles/Requests.scss";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer"
import { setListing } from "../redux/state";
import { use } from "react";
import BookingPayment from "../components/BookingPayment";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { listingId } = useParams();
  const [listing, setlisting] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null)
  const customer = useSelector((state) => state?.user);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handleRequest = async ()=>{
    try{
      console.log("Requesting to update property listing")
      const res = await axios.post('http://localhost:3001/requests/add', {
        userId: customer._id,
        listingId: listingId,
        message: "I would like to update this property listing",
      })
      if(res.status === 201){
        alert("Request sent successfully")
      }
      else{
        alert("Request failed")
      }
    }catch(err){
      console.log("Request Failed", err.message)
      alert("Request Failed", err.message)
    }
  }
  const getRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/requests/get/${listingId}`);
      if (res.status === 200) {
        const currentRequest = res.data.find(item => 
          item.message === "I would like to update this property listing"
        );
        
        if (currentRequest) {
          setRequestStatus(currentRequest.status);
        } else {
          setRequestStatus(null);
        }
      }
    } catch (err) {
      console.log("Fetch Requests Failed", err.message);
    }
  }

  const handleUpdate = () => {
    dispatch(setListing(listing))
    navigate('updateproperty')
  }

  /* FETCH LISTING DETAILS */
  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setlisting(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
    getRequest();
  }, []);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */

  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      // Set booking data for payment
      setBookingData({
        listingId: listingId,
        listingName: listing.title,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        checkIn: dateRange[0].startDate.toDateString(),
        checkOut: dateRange[0].endDate.toDateString(),
        guestName: customer.firstName + " " + customer.lastName,
        guestEmail: customer.email,
        userName: customer.firstName + " " + customer.lastName,
        userEmail: customer.email,
        userPhone: customer.phone || "",
        totalAmount: listing.price * dayCount,
      });

      // Show payment form
      setShowPayment(true);
    } catch (err) {
      console.log("Submit Booking Failed.", err.message)
    }
  }

  const handlePaymentSuccess = async (payment) => {
    try {
      // Create booking with payment details
      const bookingForm = {
        customerId: customer._id,
        guestName: customer.firstName + " " + customer.lastName,
        guestEmail: customer.email,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalAmount: listing.price * dayCount,
        paymentIntentId: payment.paymentId, // Use Razorpay payment ID as paymentIntentId
        status: 'confirmed'
      }

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm)
      })

      if (response.ok) {
        // navigate(`/${customer._id}/trips`)
        navigate(`/`)
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }
    } catch (err) {
      console.log("Create Booking Failed.", err.message)
      alert("Failed to create booking: " + err.message);
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false);
  }

  return loading ? (
    <Loader />
  ) : showPayment ? (
    <>
      <Navbar />
      <div className="listing-details">
        <BookingPayment 
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
      <Footer />
    </>
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`${item}`}
              alt="listing photo"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`${listing.creator.profileImagePath}`}
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {/* {listing.amenities[0].split(",").map((item, index) => ( */}
              {listing.amenities.map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            {customer._id === listing.creator._id && <div className="date-range-calendar">
              {requestStatus && (
                <div className={`request-status status-${requestStatus}`}>
                  Request Status: {requestStatus}
                </div>
              )}
              
              {requestStatus === "accepted" ? (
                <button className="button" onClick={handleUpdate}>
                  Update Property
                </button>
              ) : requestStatus === "pending" ? (
                <div className="pending-message">
                  Update request is pending approval
                </div>
              ) : (
                <button className="button" onClick={handleRequest}>
                  Request Update
                </button>
              )}
            </div>}
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
