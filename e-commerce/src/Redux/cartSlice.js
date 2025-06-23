// src/Redux/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Function to safely get cart from localStorage for initial state
const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (Array.isArray(parsedCart)) {
        return parsedCart.map(item => ({
          ...item,
          price: parseFloat(String(item.price).replace('$', '')) || 0,
          quantity: parseInt(item.quantity) || 1
        }));
      }
    }
  } catch (e) {
    console.error("Failed to parse cart from localStorage on initialization:", e);
  }
  return []; // Default to empty array if no valid data
};

// Function to safely get total purchases from localStorage for initial state
const getInitialTotalPurchasesState = () => {
  try {
    const storedPurchases = localStorage.getItem('TotalPurchase'); // Corrected key based on your original code
    return storedPurchases ? parseInt(storedPurchases, 10) : 0;
  } catch (e) {
    console.error("Failed to parse TotalPurchase from localStorage on initialization:", e);
  }
  return 0; // Default to 0
};

const initialState = {
  items: getInitialCartState(),         // Array of cart items
  totalPurchases: getInitialTotalPurchasesState(), // Total purchases count
};

const cartSlice = createSlice({
  name: 'cart', // Name of this slice
  initialState,
  reducers: {
    // Action to add a product to the cart or increment its quantity
    addToCart: (state, action) => {
      const productToAdd = action.payload; // productToAdd will be the full product object
      const existingItemIndex = state.items.findIndex(item => item.id === productToAdd.id);

      if (existingItemIndex > -1) {
        // If item exists, increment quantity of the existing item
        state.items[existingItemIndex].quantity += 1;
      } else {
        // If item is new, add it to the cart with quantity 1
        const newItem = {
          id: productToAdd.id,
          image: productToAdd.image,
          name: productToAdd.name,
          description: productToAdd.description,
          price: parseFloat(String(productToAdd.price).replace('$', '')), // Clean price before adding
          quantity: 1
        };
        state.items.push(newItem);
      }
      // Synchronize with localStorage immediately after state change
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Action to remove a product from the cart by its ID
    removeFromCart: (state, action) => {
      const idToRemove = action.payload; // payload is the item's ID
      state.items = state.items.filter(item => item.id !== idToRemove);
      // Synchronize with localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Action to update the quantity of a specific item
    updateQuantity: (state, action) => {
      const { id, newQty } = action.payload; // payload is an object { id: item_id, newQty: new_quantity }
      const quantity = Math.max(1, parseInt(newQty, 10) || 1); // Ensure valid quantity (min 1)

      state.items = state.items.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      // Synchronize with localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Action to increment the total purchases count (purely client-side for now)
    incrementTotalPurchases: (state) => {
      state.totalPurchases += 1;
      // Synchronize with localStorage
      localStorage.setItem('TotalPurchase', state.totalPurchases.toString());
    },
    clearCart: (state)=>{
      state.items = [];
      state.totalPurchases = 0;
      localStorage.removeItem('cart');
      localStorage.removeItem('TotalPurchase')
    }
  },
});

// Export the generated action creators
export const { addToCart, removeFromCart, updateQuantity, incrementTotalPurchases, clearCart } = cartSlice.actions;

// Export the reducer as default
export default cartSlice.reducer;