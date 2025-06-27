// configuring Redux Store
import { configureStore } from "@reduxjs/toolkit";      //using configureStore to setup the redux store
import authReducer from './AuthSlice';
import cartReducer from './CartSlice'; 

export const Store = configureStore({
    reducer:{
        auth : authReducer,   
        cart: cartReducer,
    }
})