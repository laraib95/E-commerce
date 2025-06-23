import React from 'react'; // Imports the React library
import { useParams, useNavigate } from 'react-router-dom'; // Imports useParams hook to access URL parameters and useNavigate hook for navigation
import products from './Productdata'; // Imports the products array from Productdata.js
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/cartSlice'; // Imports the useCart custom hook to interact with the cart context
import "./Productdetail.css"; // Imports the CSS file for styling the ProductDetail component

const ProductDetail = () => {
  const { id } = useParams(); // Extracts the 'id' parameter from the URL
  const navigate = useNavigate(); // Initializes the navigate function for programmatic navigation
  const dispatch = useDispatch();

  // Finds the product in the 'products' array that matches the 'id' from the URL
  // parseInt(id, 10) converts the string id to an integer with base 10
  const product = products.find(p => p.id === parseInt(id, 10));

  // If no product is found with the given ID, display a "Product Not Found" message
  if (!product) {
    return (
      <div style={{ padding: '20px', color:'red'}}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button> {/* Button to navigate back to the previous page */}
      </div>
    );
  }

  // Handler function for the "Add to Cart" button click
  const handleAddToCartClick = () => {
    dispatch(addToCart(product)); // Adds the current product to the cart using the addToCart function from context
    navigate('/Cartscreen'); // Navigates the user to the cart screen after adding the product
  };

  // Renders the product detail page if a product is found
  return (
    <div className="main"> {/* Main container for the product detail page */}
      <button onClick={() => navigate(-1)} > {/* Button to navigate back to the previous page */}
        ← Back
      </button>

      <div className="container"> {/* Container for product image and details */}
        <img
          src={product.image} // Displays the product image
          alt={product.name} // Alt text for the image for accessibility
        />
        <div className="text"> {/* Container for product text details */}
          <h1>{product.name}</h1> {/* Displays the product name */}
          <p >{product.description}</p> {/* Displays the product description */}
          <h2> {/* Displays the product price, formatted to two decimal places */}
            ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price).replace('$', '')).toFixed(2)}
          </h2>
          <button className="Addtocart" onClick={handleAddToCartClick} >Add to Cart</button> {/* Button to add the product to the cart */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; // Exports the ProductDetail component as the default export