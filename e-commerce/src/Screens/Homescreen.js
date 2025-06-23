import "./Homescreen.css" // Imports the CSS file for styling the Homescreen component
import Latestproducts from "../Components/Latestproducts"; // Imports the Latestproducts component
import salesimage from "../Images/sale-items.jpg"; // Imports the sales image
import { useNavigate } from 'react-router-dom'; // Imports the useNavigate hook for programmatic navigation
import { useMediaQuery } from 'react-responsive';


function Homescreen() {
    const navigate = useNavigate(); // Initializes the navigate function
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const handleGrabSaleClick = () => {
        navigate('/Productcard'); // Navigates to the '/Productcard' route when the button is clicked
    };
    return (
        <div className="home"> {/* Main container for the home screen */}
            <div className="salesection"
                style={{
                    flexDirection: isMobile ? 'column' : 'row',
                    margin: isMobile ? '2px' : '0px',
                    padding: isMobile ? '5px' : '0px',
                    gap: isMobile ? '6px' : '0px'
                }}
            > {/* Section dedicated to displaying sale information */}
                <div className="sales-section-left"
                    style={{ width: isMobile ? '100%' : '50%' }}
                > {/* Left part of the sales section, containing text and a button */}
                    <h1
                        style={{
                            fontSize: isMobile ? '1.6em' : '2.5em'
                        }}>Discount Offer! </h1> {/* Main heading for the discount offer */}
                    <p
                        style={{
                            fontSize: isMobile ? '12px' : '18px'
                        }}>Don't miss out! Explore our latest deals and limited-time offers to find exactly what you need at unbeatable prices.Unlock incredible savings across our entire collection. These special sales are designed to bring you premium quality without the premium price tag.</p> {/* Descriptive text about the sale */}
                    <button className="salebutton" onClick={handleGrabSaleClick} >Grab Sale Now</button> {/* Button to navigate to product cards */}
                </div>
                <div className="sales-section-right"
                    style={{ width: isMobile ? '100%' : '50%' }}
                > {/* Right part of the sales section, containing an image */}
                    <img src={salesimage} alt="sale Products"
                        style={{
                            width: isMobile ? '80%' : '95%',
                            height: 'auto'
                        }}
                    ></img> {/* Image related to sale products */}
                </div>
            </div>
            <hr style={{ border: "none", borderTop: "2px solid black", width: "100%" }} /> {/* Horizontal rule to separate sections */}
            < Latestproducts /> {/* Renders the Latestproducts component */}
        </div>
    );
}
export default Homescreen; // Exports the Homescreen component as the default export