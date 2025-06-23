import React from "react"; // Imports the React library.
import products from "./Productdata" // Imports the 'products' array from Productdata.js, which contains information about various products.
import { useNavigate } from "react-router-dom"; // Imports the useNavigate hook from react-router-dom for programmatic navigation.
import { useMediaQuery } from 'react-responsive';
import "./Latestproducts.css"; // Imports the CSS file for styling the Latestproducts component.

function Latestproducts() {
    const navigate = useNavigate(); // Initializes the navigate function to allow redirection to different routes.
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    // Defines a handler function for when a product card is clicked.
    // It takes the product's 'id' as an argument.
    const handleProductClick = (id) => {
        navigate(`/product/${id}`); // Navigates to the detailed product page using the product's unique ID.
    };

    return (
        <div className="latestprod"> {/* Main container for the latest products section. */}
            <div className="latesttop"
            style={{
                gap : isMobile ? '30%' : isTablet ? '40%' : '60%'
            }}> {/* Container for the heading and a "Shop Now" button. */}
                <h1
                style={{
                            fontSize: isMobile ? '1em' :isTablet ? '1.5em' : '2.5em',

                }}
                >Our Latest Products</h1> {/* Heading for the latest products section. */}
                <button
                style={{
                            fontSize: isMobile ? '8px' :isTablet ? '15px' : '18px',
                            width : isMobile ? '100px' : '250px', 
                            height : isMobile ? '20px' : '40px'

                }}
                >First to Shop Now</button> {/* A button that could potentially link to a general products page or a specific collection. */}
            </div>
            <div className="product-cards-container"
            style={{
                width: isMobile ? '400px' : '600px',
                height: isMobile ? '200px' : '400px'
            }}
            > {/* Container that holds all the individual product cards. */}
                {/* Maps over the 'products' array to render a card for each product. */}
                {products.map((product) => (
                    <div
                        key={product.id} // Unique key for each product card, important for React list rendering.
                        className="product-card-item" // CSS class for styling individual product cards.
                        onClick={() => handleProductClick(product.id)} // Attaches an onClick event to navigate to the product's detail page.
                    >
                        <img src={product.image} alt={product.name} className="productimage" /> {/* Displays the product's image. */}
                        <h3
                        style={{
                            fontSize: isMobile ? '8px' : '12px'
                        }}>{product.name}</h3> {/* Displays the product's name/title. */}
                        <p>{product.price}</p> {/* Displays the product's price. */}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Latestproducts; // Exports the Latestproducts component as the default export.