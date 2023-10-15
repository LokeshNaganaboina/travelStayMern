import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, HotelCard, Categories} from "../../components";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCategory } from "../../context";
import "./Home.css";

export const Home = () => {

  const [hotels,setHotels] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(15);
  const [testData, setTestData] = useState([]);
  const { hotelCategory } = useCategory();
//   const { isSearchModalOpen } = useDate();
  useEffect(() => {
    (async () => {
      try {
        const {data} = await axios.get(`https://travelstay.cyclic.app/api/hotels?category=${hotelCategory}`);
        setTestData(data);
        setHotels(data ? data.slice(0,15) : []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [hotelCategory]);


  const fetchMoreData = () => {
    if (hotels.length >= testData.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      if (hotels && hotels.length > 0) {
        setHotels(
          hotels.concat(testData.slice(currentIndex, currentIndex + 16))
        );
        setCurrentIndex((prev) => prev + 15);
      } else {
        setHotels([]);
      }
    }, 1000);
  };

//   const filteredHotelsByPrice = getHotelsByPrice(hotels, priceRange);
//   const filteredHotelsByBedsAndRooms = getHotelsByRoomsAndBeds(
//     filteredHotelsByPrice,
//     noOfBathrooms,
//     noOfBedrooms,
//     noOfBeds
//   );
//   const filteredHotelsByPropertyType = getHotelsByPropertyType(
//     filteredHotelsByBedsAndRooms,
//     propertyType
//   );

//   const filteredHotelsByRatings = getHotelsByRatings(
//     filteredHotelsByPropertyType,
//     traveloRating
//   );

//   const filteredHotelsByCancelation = getHotelsByCancelation(
//     filteredHotelsByRatings,
//     isCancelable
//   );


  return (
    <div className="relative">
      <Navbar />
      <Categories/>
      {hotels && hotels.length > 0 ? (
        <InfiniteScroll
          dataLength={hotels.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            hotels.length > 0 && <h3 className="alert-text">Loading...</h3>
          }
          endMessage={<p className="alert-text">You have seen it all</p>}
        >
          <main className="main d-flex align-center wrap gap-larger">
            {
            hotels && hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
          </main>
        </InfiniteScroll>) : <></>}
    </div>
  );
};