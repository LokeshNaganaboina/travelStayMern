import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDate, useHotel } from "../../context";
import { v4 as uuid } from "uuid";
import axios from "axios";
import "./Payment.css";
  
export const Payment = () => {
  const params = useParams();
  const { id } = params;

  const navigate = useNavigate();

  const { guests, checkInDate, checkOutDate } = useDate();

  const { setHotel } = useHotel();

  const numberOfNights =
    checkInDate && checkOutDate
      ? (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      : 0;

  const [singleHotel, setSingleHotel] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `https://travelstay.cyclic.app/api/hotels/${id}`
        );
        setSingleHotel(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id]);

  const { image, name, address, state, rating, price } = singleHotel;

  const totalPayableAmount = price * numberOfNights + 150;

  const loadScript = (source) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = source;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handleConfirmBookingClick = async () => {
    const response = await loadScript(`https://www.paypal.com/sdk/js?client-id=${process.env.Paypal_client_id}`);
    if (!response) {
      console.log({ message: "Paypal SDK failed to load" });
      return;
    }
  
    // Set up the transaction details
    const transactionDetails = {
      purchase_units: [{
        amount: {
          value: totalPayableAmount,
          currency_code: "USD"
        },
        description: "Thank you for booking with us"
      }]
    };
  
    // Render the PayPal button
    window.paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create(transactionDetails);
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          setHotel({
            ...singleHotel,
            orderId: uuid(),
            payment_id: details.id,
            checkInDate: checkInDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
            checkOutDate: checkOutDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
            totalPayableAmount
          });
          navigate("/order-summary");
        });
      }
    }).render('#paypal-button-container');  // Assuming '.btn-pay' is the container where you want to render the PayPal button
  };

  return (
    <Fragment>
      <header className="heading">
        <h1 className="heading-1">
          <Link className="link" to="/">
            TravelStay
          </Link>
        </h1>
      </header>
      <main className="payment-page d-flex justify-center">
        <div className="final-details-container d-flex direction-column gap-md">
          <h2>Trip Details</h2>
          <div className="dates-and-guests d-flex direction-column gap-md">
            <h3>Your Trip</h3>
            <div>
              <p>Dates</p>
              <span>
                {checkInDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -
                {checkOutDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div>
              <p>Guests</p>
              <span>{guests} Guests</span>
            </div>
          </div>
          <div className="d-flex direction-column gap-sm">
            <h3>Pay with</h3>
            <div>Paypal</div>
          </div>
          <div id="paypal-button-container"></div>
          <button
            className="button btn-primary btn-reserve cursor btn-pay"
            onClick={handleConfirmBookingClick}
          >
            Confirm Booking
          </button>
        </div>
        <div className="final-details d-flex direction-column gap-large">
          <div className="d-flex gap-sm">
            <img className="image" src={image} alt={name} />
            <div className="d-flex direction-column">
              <div className="d-flex direction-column grow-shrink-basis">
                <span>{name}</span>
                <span>
                  {address}, {state}
                </span>
              </div>
              <div className="rating-container">
                <span className="rating d-flex align-center">
                  <span className="material-icons-outlined">star</span>
                  <span>{rating}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="tag">
            Your booking is protected by{" "}
            <strong className="strong">TravelStay</strong> cover
          </div>
          <div className="price-detail-container">
            <div className="price-distribution d-flex direction-column">
              <h3>Price Details</h3>
              <div className="final-price d-flex align-center justify-space-between">
                <span className="span">
                  $ {price} x {numberOfNights} nights
                </span>
                <span className="span">$ {price * numberOfNights}</span>
              </div>
              <div className="final-price d-flex align-center justify-space-between">
                <span className="span">Service fee</span>
                <span className="span">$ 200</span>
              </div>
              <div className="final-price d-flex align-center justify-space-between">
                <span className="span">Total</span>
                <span className="span">$ {totalPayableAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};