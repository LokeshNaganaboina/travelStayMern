import {Routes,Route} from 'react-router-dom';
import './App.css';
import { Home,SingleHotel,SearchResults} from './pages';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/hotels/:name/:address/:id/reserve" element={<SingleHotel/>}></Route>
      <Route path="/hotels/:address" element={<SearchResults />} />
    </Routes>
  );
}

export default App;
