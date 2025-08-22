// App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import  {Home}  from './Home';
import  {Cart}  from './Cart/Cart.jsx';
import  {Address}  from './AdminProduct/Address.jsx';
import {PaymentOption} from './PaymentOption.jsx';
import {OrderTracking}  from '../src/OrderTrack/OrderTracking.jsx';
import AdminProduct from './AdminProduct/AdminProduct.jsx';
import AdminMenProduct from './AdminProduct/AdminMenProduct.jsx';
import AdminWomenProduct from './AdminProduct/AdminWomenProduct.jsx';
import AdminChildProduct from './AdminProduct/AdminChildProduct.jsx';
import { MensCategory } from "./category/MensCategory"; // ✅ named import
import 'react-toastify/dist/ReactToastify.css';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Login from './signup/Login.jsx';
import Signup from './signup/SignUp.jsx';
import { Profile } from './Profile/Profile.jsx';
import  {AdminOrderTrack}  from './AdminProduct/AdminOrderTrack.jsx';
import Email from './Email/Email.jsx';
import { FavoritesPage } from './Favourite/Favourite.jsx';
import { AdminDashboard } from './AdminDashboard/AdminDashboard.jsx';

function App() {
  return (

      <Routes basename="/">
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/address" element={<Address />} />
        <Route path="/payment" element={<PaymentOption/>} />
        <Route path="/adminProduct" element={<AdminProduct/>} />
        <Route path="/adminMenProduct" element={<AdminMenProduct/>} />
        <Route path="/adminWomenProduct" element={<AdminWomenProduct/>} />
        <Route path="/adminChildProduct" element={<AdminChildProduct/>} />
        <Route path="/menCategory" element={<MensCategory/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/order-tracking" element={<OrderTracking/>} />
        <Route path="/AdminOrderTracking" element={<AdminOrderTrack/>} />
        <Route path="/email" element={<Email/>} />
        <Route path="/favourite" element={<FavoritesPage/>} />
                <Route path="/adminDashboard" element={<AdminDashboard/>} />
      </Routes>
  );
}

export default App;
