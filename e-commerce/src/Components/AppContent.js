import { Route, Routes } from "react-router-dom";   //Imports components for routing : Route for defining individual routes, and Routes for wrapping multiple Route components
import Homescreen from '../Screens/Homescreen.js'; 
import Products from './Productcard'; 
import Cartscreen from "../Screens/Cartscreen"; 
import ProfileScreen from '../Screens/ProfileScreen.js';
import Navigation from './Navigation'; 
import LoginScreen from '../Screens/Loginscreen'; 
import Signup from '../Screens/Signupscreen';  
import ProductDetail from './Productdetail';  
import Footer from './Footer'; 
import ProtectedRoute from './ProtectedRoute';
import CartDrawer from './CartDrawer';

import AdminProtectedRoute from './Admin/AdminProtectedRoute.js';
import AdminDashboard from './Admin/AdminDashboard.js';
import AdminProductList from "./Admin/AdminProductList.js";
import ProductForm from "./ProductForm";
import AdminUserListScreen from "./Admin/AdminUserListScreen.js";
import UserFormScreen from "./Admin/UserFormScreen.js";
 
function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/Login" element={<LoginScreen />} />
        <Route path='/Signupscreen' element={<Signup />} />
        <Route path="/" element={<Homescreen />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/Productcard" element={<Products />} />
        <Route
          path="/Cartscreen"
          element={
            <ProtectedRoute>
              <Cartscreen />
            </ProtectedRoute>} />
            <Route
          path="/cartdrawer"
          element={
            <ProtectedRoute>
              <CartDrawer />
            </ProtectedRoute>} />
        <Route
          path="/ProfileScreen"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductList />} /> {/* for viewing all products*/}
          <Route path="/admin/product/new" element={<ProductForm />} /> {/* For adding new products */}
          <Route path="/admin/product/edit/:id" element={<ProductForm />} /> {/* For editing existing products */}
          
          <Route path='/admin/users' element={<AdminUserListScreen/>} />  {/* For viewing all users */}
          <Route path='/admin/users/create' element={<UserFormScreen/>}/>
          <Route path='/admin/users/:id/edit' element={<UserFormScreen/>}/>
      
        </Route>
      </Routes >
      <Footer />
    </>
  );
}
export default AppContent;