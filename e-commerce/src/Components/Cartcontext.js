import React, { createContext, useContext, useState, useEffect } from 'react'; // Imports React and necessary hooks: createContext for creating a context, useContext for consuming it, useState for state management, and useEffect for side effects.

// 1. Create the CartContext
// This creates a Context object. Components can subscribe to this Context to read its current value.
const CartContext = createContext();

// 2. Custom Hook to consume the CartContext
// This is a convenient custom hook that allows any functional component to easily access the cart context.
// It simplifies using useContext(CartContext) by providing a more semantic name.
export const useCart = () => {
  return useContext(CartContext);
};

// 3. CartProvider Component
// This component will wrap parts of your application that need access to the cart state.
// It manages the cart items and provides functions to interact with the cart.
export const CartProvider = ({ children }) => {
  // State for cart items.
  // It initializes its state by trying to load "cart" data from localStorage.
  // The function passed to useState is a "lazy initializer" – it only runs once on the initial render.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart"); // Attempts to retrieve the "cart" string from localStorage.
      if (stored) { // If data is found in localStorage:
        const parsedCart = JSON.parse(stored); // Parses the JSON string back into a JavaScript object/array.
        if (Array.isArray(parsedCart)) { // Ensures the parsed data is actually an array.
          // Maps over the parsed cart items to ensure price and quantity are correctly formatted (numbers).
          return parsedCart.map(item => ({
            ...item, // Spreads existing item properties.
            price: parseFloat(String(item.price).replace('$', '')) || 0, // Converts price to a float, removing '$' if present, defaults to 0.
            quantity: parseInt(item.quantity) || 1 // Converts quantity to an integer, defaults to 1.
          }));
        }
      }
    } catch (e) {
      // Catches any errors during localStorage access or JSON parsing and logs them.
      console.error("Failed to parse cart from localStorage:", e);
    }
    return []; // If no data or an error occurs, the cart initializes as an empty array.
  });

  // State for total purchases (e.g., number of successful checkouts or items added to cart).
  // Similar lazy initialization from localStorage.
  const [totalPurchases, setTotalPurchases] = useState(() => {
    try {
      const storedPurchases = localStorage.getItem("TotalPurchase"); // Retrieves "TotalPurchase" from localStorage.
      return storedPurchases ? parseInt(storedPurchases, 10) : 0; // Parses to integer, defaults to 0 if not found.
    } catch (e) {
      console.error("Failed to parse totalPurchases from localStorage:", e); // Logs errors during parsing.
      return 0; // Defaults to 0 on error.
    }
  });

  // Effect hook to synchronize 'cartItems' with localStorage.
  // This effect runs whenever 'cartItems' state changes.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Saves the current 'cartItems' array to localStorage as a JSON string.
    console.log("Cart items stored to localStorage:", cartItems); // Logs the stored cart items.
  }, [cartItems]); // Dependency array: the effect re-runs if 'cartItems' changes.

  // Effect hook to synchronize 'totalPurchases' with localStorage.
  // This effect runs whenever 'totalPurchases' state changes.
  useEffect(() => {
    localStorage.setItem("totalPurchases", totalPurchases.toString()); // Saves 'totalPurchases' to localStorage.
    console.log("Total purchases stored to localStorage:", totalPurchases); // Logs the stored total purchases.
  }, [totalPurchases]); // Dependency array: the effect re-runs if 'totalPurchases' changes.

  // Function to add a product to the cart.
  const addToCart = (productToAdd) => {
    setCartItems(prevItems => { // Uses the functional update form of setCartItems to ensure latest state is used.
      // Checks if the product already exists in the cart.
      const existingItemIndex = prevItems.findIndex(item => item.id === productToAdd.id);

      if (existingItemIndex > -1) {
        // If the item exists, map over previous items and increment the quantity of the existing item.
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 } // Increments quantity for the matching item.
            : item // Returns other items as they are.
        );
      } else {
        // If the item does not exist, create a new item object and add it to the cart.
        const newItem = {
          id: productToAdd.id,
          image: productToAdd.image,
          name: productToAdd.name,
          description: productToAdd.description,
          price: parseFloat(String(productToAdd.price).replace('$', '')), // Ensures price is a clean number.
          quantity: 1 // Sets initial quantity to 1 for new items.
        };
        return [...prevItems, newItem]; // Adds the new item to the existing array of cart items.
      }
    });
  };

  // Function to remove a product from the cart by its ID.
  const removeFromCart = (id) => {
    // Filters out the item with the matching ID, effectively removing it.
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Function to update the quantity of a specific item in the cart.
  const updateQuantity = (id, newQty) => {
    // Ensures the quantity is at least 1 and is a valid integer.
    const quantity = Math.max(1, parseInt(newQty) || 1);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item // Updates quantity for the matching item.
      )
    );
  };

  // Calculates the total number of distinct items (sum of quantities) in the cart.
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Function to increment the total purchases count.
  const incrementTotalPurchases = () => {
    setTotalPurchases(prevCount => prevCount + 1); // Increments the total purchases by 1.
  };
  
  // Defines the value that will be provided by the CartContext to consuming components.
  const contextValue = {
    cartItems,             // The current array of items in the cart.
    totalItemsInCart,      // The total count of items (sum of quantities).
    addToCart,             // Function to add a product to the cart.
    removeFromCart,        // Function to remove a product from the cart.
    updateQuantity,        // Function to update the quantity of a product in the cart.
    totalPurchases,        // The total count of purchases made.
    incrementTotalPurchases // Function to increment the total purchases count.
  };

  return (
    // The CartContext.Provider makes the 'contextValue' available to any child component that uses 'useCart'.
    <CartContext.Provider value={contextValue}>
      {children} {/* Renders the child components passed to the CartProvider. */}
    </CartContext.Provider>
  );
};