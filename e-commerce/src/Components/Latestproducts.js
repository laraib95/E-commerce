import React from "react"; // Imports the React library.
import products from "./Productdata" // Imports the 'products' array from Productdata.js, which contains information about various products.
import { useNavigate } from "react-router-dom"; // Imports the useNavigate hook from react-router-dom for programmatic navigation.
import { useMediaQuery } from 'react-responsive';
<<<<<<< HEAD
// import "./Latestproducts.css"; // Imports the CSS file for styling the Latestproducts component.
=======
import "./Latestproducts.css"; // Imports the CSS file for styling the Latestproducts component.
>>>>>>> 33d13ea4b179516cf204099879d65814cd604a39

function Latestproducts() {
    const navigate = useNavigate(); // Initializes the navigate function to allow redirection to different routes.
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
<<<<<<< HEAD
=======
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
>>>>>>> 33d13ea4b179516cf204099879d65814cd604a39
    // Defines a handler function for when a product card is clicked.
    // It takes the product's 'id' as an argument.
    const handleProductClick = (id) => {
        navigate(`/product/${id}`); // Navigates to the detailed product page using the product's unique ID.
    };

    return (
<<<<<<< HEAD
        <div className={`m-0 p-0 w-full bg-gradient-to-b from-[#decc2f] to-[#FFC371] to-60% items-center justify-center overflow-scroll`}> {/* Main container for the latest products section. */}
            <div className={`flex flex-row h-[80px] ${isMobile ? 'gap-[20%]' : 'gap-[50%]'}`}>
                {/* Container for the heading and a "Shop Now" button. */}
                <h1 className={`font-extrabold m-[2px] [text-shadow:15px_5px_15px_black] whitespace-nowrap ${isMobile ? 'text-base' : 'text-2xl'}`}
                >Our Latest Products</h1> {/* Heading for the latest products section. */}
                <button className={`bg-transparent h-[50px] text-white border-2 border-white shadow-none  transition duration-300 ease-in-out hover:bg-white/15
                    hover:border-white
                    hover:-translate-y-0.5
                    hover:shadow-md
                    hover:shadow-black/10 focus:outline-none
                    focus:ring-4
                    focus:ring-white/50 active:bg-white/5
                    active:translate-y-0
                    active:shadow-none${isMobile ? 'text-[15px] w-[100px] h-[20px]' : 'text-[18px] w-[250px] h-[20px]'} `}
                >First to Shop Now</button> {/* A button that could potentially link to a general products page or a specific collection. */}
            </div>
            <div className={`flex justify-start gap-[5px] pl-0.5 box-border flex-wrap ${isMobile ? 'w-[500px] h-[200px]':'w-full h-[400px]'}`}> 
            {/* Container that holds all the individual product cards. */}
=======
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
>>>>>>> 33d13ea4b179516cf204099879d65814cd604a39
                {/* Maps over the 'products' array to render a card for each product. */}
                {products.map((product) => (
                    <div
                        key={product.id} // Unique key for each product card, important for React list rendering.
<<<<<<< HEAD
                        className={`flex flex-col gap-[1px] w-[200px] items-center p-[5px] rounded-lg shadow-md text-center border-none outline-none       
                                   cursor-pointer transition duration-200 ease-in-out box-border 
                            hover:shadow-[5px_5px_5px_grey] hover:-translate-y-0.5   `} // CSS class for styling individual product cards.
                        onClick={() => handleProductClick(product.id)} // Attaches an onClick event to navigate to the product's detail page.
                    >
                        <img src={product.image} alt={product.name} 
                        className={`bg-transparent h-[150px] w-[120px]`} /> {/* Displays the product's image. */}
                        <h3 className={`line-clamp-3 overflow-hidden text-ellipsis ${isMobile ? 'text-[8px]':'text-[12px]'}`}
                            >
                                {product.name}</h3> {/* Displays the product's name/title. */}
=======
                        className="product-card-item" // CSS class for styling individual product cards.
                        onClick={() => handleProductClick(product.id)} // Attaches an onClick event to navigate to the product's detail page.
                    >
                        <img src={product.image} alt={product.name} className="productimage" /> {/* Displays the product's image. */}
                        <h3
                        style={{
                            fontSize: isMobile ? '8px' : '12px'
                        }}>{product.name}</h3> {/* Displays the product's name/title. */}
>>>>>>> 33d13ea4b179516cf204099879d65814cd604a39
                        <p>{product.price}</p> {/* Displays the product's price. */}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Latestproducts; // Exports the Latestproducts component as the default export.