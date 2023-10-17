import axios from "axios";
import {
  useEffect,
  useState
} from "react";
import {
  useParams
} from "react-router-dom";
//import { useAuth, useDate, useAlert } from "../../context";
import {
  HotelDetails,
  FinalPrice,
  HotelImages,
  Navbar
} from "../../components";
import "./SingleHotel.css";

export const SingleHotel = () => {
  const {
    id
  } = useParams();
  const [singleHotel, setSingleHotel] = useState({});

  // const { isAuthModalOpen, isDropDownModalOpen } = useAuth();
  // const { isSearchModalOpen } = useDate();
  // const { alert } = useAlert();

  useEffect(() => {
    (async () => {
      try {
        const {
          data
        } = await axios.get(
          `https://travelstay.cyclic.app/api/hotels/${id}`
        );
        setSingleHotel(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id]);


  const { name, state } = singleHotel;

  return (
    <div className="relative">
      <Navbar />
      <main className="single-hotel-page">
        <p className="hotel-name-add">
          {name}, {state}
        </p>
        <HotelImages singleHotel={singleHotel} />
        <div className="d-flex">
          <HotelDetails singleHotel={singleHotel} />
          <FinalPrice singleHotel={singleHotel} />
        </div>
      </main>
    </div>
  );
};