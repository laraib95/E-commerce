// src/Redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// No need to import axios anymore

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to get the JWT token
const getAuthToken = () => {
    const token = localStorage.getItem('userToken'); 
    return token ? `Bearer ${token}` : '';
};

// Async Thunks for API interaction
// Fetch user's cart from the backend
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET', // Explicitly define method
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthToken(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Reject with the backend message or a generic error
                return rejectWithValue(errorData.message || `Failed to fetch cart with status: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();
            // The backend is returning an array of items directly 
            return data.items;
        } catch (error) {
            // This catch block handles network errors or errors thrown by our `rejectWithValue` function
            console.error("Fetch cart error:", error);
            return rejectWithValue(error.message || 'Failed to fetch cart.');
        }
    }
);

// Add item to cart on the backend
export const addItemToCartBackend = createAsyncThunk(
    'cart/addItemToCartBackend',
    async ({ productId, quantity = 1 }, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthToken(),
                },
                body: JSON.stringify({ productId, quantity }), // Stringify the request body
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || `Failed to add item to cart with status: ${response.status}`);
            }

            const data = await response.json();
            // After successfully adding, refetch the cart to ensure local state is in sync
            dispatch(fetchCart());
            return data.items; // Return the updated cart items from backend
        } catch (error) {
            console.error("Add item to cart error:", error);
            return rejectWithValue(error.message || 'Failed to add item to cart.');
        }
    }
);

// Remove item from cart on the backend
export const removeItemFromCartBackend = createAsyncThunk(
    'cart/removeItemFromCartBackend',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthToken(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || `Failed to remove item from cart with status: ${response.status}`);
            }

            // No data expected back for a delete, but refetch to sync
            dispatch(fetchCart());
            return productId; // Return the ID of the removed item
        } catch (error) {
            console.error("Remove item from cart error:", error);
            return rejectWithValue(error.message || 'Failed to remove item from cart.');
        }
    }
);

// Update item quantity on the backend
export const updateQuantityBackend = createAsyncThunk(
    'cart/updateQuantityBackend',
    async ({ productId, newQty }, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, { // Assuming PUT to /cart updates existing item
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthToken(),
                },
                body: JSON.stringify({ productId, quantity: newQty }), // Stringify the request body
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || `Failed to update item quantity with status: ${response.status}`);
            }

            // No specific data needed from update, refetch to sync
            dispatch(fetchCart());
            return { id: productId, newQty }; // Return updated ID and quantity
        } catch (error) {
            console.error("Update quantity error:", error);
            return rejectWithValue(error.message || 'Failed to update item quantity.');
        }
    }
);

// Clear cart on the backend
export const clearCartBackend = createAsyncThunk(
    'cart/clearCartBackend',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getAuthToken(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || `Failed to clear cart with status: ${response.status}`);
            }

            // After successfully clearing, clear local state and purchases
            dispatch(CartSlice.actions.clearCart()); // Use the synchronous reducer action
            return true;
        } catch (error) {
            console.error("Clear cart error:", error);
            return rejectWithValue(error.message || 'Failed to clear cart.');
        }
    }
);

const initialState = {
    items: [],
    totalPurchases: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalPurchases = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('TotalPurchase');
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // Payload is the array of cart items from backend
                state.totalPurchases = state.items.reduce((total, item) => total + item.quantity, 0);
                localStorage.setItem('cart', JSON.stringify(state.items));
                localStorage.setItem('TotalPurchase', state.totalPurchases.toString());
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                localStorage.removeItem('cart');
                localStorage.removeItem('TotalPurchase');
                state.items = [];
                state.totalPurchases = 0;
            })
            // addItemToCartBackend
            .addCase(addItemToCartBackend.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addItemToCartBackend.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(addItemToCartBackend.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // removeItemFromCartBackend
            .addCase(removeItemFromCartBackend.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeItemFromCartBackend.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(removeItemFromCartBackend.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // updateQuantityBackend
            .addCase(updateQuantityBackend.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateQuantityBackend.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(updateQuantityBackend.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // clearCartBackend
            .addCase(clearCartBackend.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(clearCartBackend.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(clearCartBackend.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearCart } = CartSlice.actions;

export default CartSlice.reducer;