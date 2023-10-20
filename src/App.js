import {Routes,Route} from 'react-router-dom';
import './App.css';
import { Home,SingleHotel,SearchResults,Wishlist,Payment,OrderSummary} from './pages';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/hotels/:name/:address/:id/reserve" element={<SingleHotel/>}></Route>
      <Route path="/hotels/:address" element={<SearchResults />} />
      <Route path="/wishlists" element={<Wishlist />} />
      <Route path="/confirm-booking/stay/:id" element={<Payment />} />
      <Route path="/order-summary" element={<OrderSummary />} />
    </Routes>
  );
}

export default App;
