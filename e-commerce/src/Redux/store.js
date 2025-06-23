// configuring Redux Store
import { configureStore } from "@reduxjs/toolkit";      //using configureStore to setup the redux store
import authReducer from './authSlice';
import cartReducer from './cartSlice'; 

export const store = configureStore({
    reducer:{
        auth : authReducer,   
        cart: cartReducer,
    }
})