import { Fragment, useEffect, useState } from "react";
import { HotelCard, Navbar } from "../../components";
import { useDate, useCategory} from "../../context";
import axios from "axios";

export const SearchResults = () => {
  const { destination } = useDate();
  const { hotelCategory } = useCategory();
  const [hotels, setHotels] = useState([]);
  //const { alert } = useAlert();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `https://travelstay.cyclic.app/api/hotels?category=${hotelCategory}`
        );
        setHotels(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [destination, hotelCategory]);

  const filteredSearchResults = hotels.filter(
    ({ city, address, state }) =>
      address.toLowerCase() === destination.toLowerCase() ||
      city.toLowerCase() === destination.toLowerCase() ||
      state.toLowerCase() === destination.toLowerCase()
  );

  return (
    <Fragment>
      <Navbar />
      <section className="main d-flex align-center gap-larger">
        {filteredSearchResults ? (
          filteredSearchResults.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))
        ) : (
          <h3>Nothing Found</h3>
        )}
      </section>
    </Fragment>
  );
};