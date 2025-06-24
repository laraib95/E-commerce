// import "./Homescreen.css" // Imports the CSS file for styling the Homescreen component
import Latestproducts from "../Components/Latestproducts"; // Imports the Latestproducts component
import salesimage from "../Images/sale-items.jpg"; // Imports the sales image
import { useNavigate } from 'react-router-dom'; // Imports the useNavigate hook for programmatic navigation
import { useMediaQuery } from 'react-responsive';
import SliderOne from '../Components/SliderOne';

function Homescreen() {
    const navigate = useNavigate(); // Initializes the navigate function
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const handleGrabSaleClick = () => {
        navigate('/Productcard'); // Navigates to the '/Productcard' route when the button is clicked
    };
    return (
        <div className="home"> {/* Main container for the home screen */}
        <div>
            <SliderOne/>
        </div>
            <div className={`w-full h-auto bg-black flex box-border ${isMobile ? 'flex-col mx-0 px-0 gap-1.5':'flex-row'}`}
            > 
            {/* Section dedicated to displaying sale information */}
                <div className={` gap-2.5 leading-tight m-0 p-0.5 mt-3.5 ${isMobile ? 'w-full' : 'w-1/2' }`}
                > {/* Left part of the sales section, containing text and a button */}
                    <h1 className={`text-white font-extrabold mb-5 ${isMobile ? 'text-2xl': 'text-4xl'}`}
                        >Discount Offer! </h1> {/* Main heading for the discount offer */}
                    <p className={`text-white text-wrap leading-normal mt-5 ${isMobile ? 'text-xs':'text-lg'}`}
                       >Don't miss out! Explore our latest deals and limited-time offers to find exactly what you need at unbeatable prices.Unlock incredible savings across our entire collection. These special sales are designed to bring you premium quality without the premium price tag.</p> {/* Descriptive text about the sale */}
                    <button className={`w-64 h-9 border-none  rounded-md shadow-md shadow-gray-500
               bg-gradient-to-b from-[#e4d023] to-[#f0af55] to-60%
               text-black text-lg cursor-pointer mt-2.5
               hover:scale-110 transition-transform duration-300 ease-in-out`} 
               onClick={handleGrabSaleClick} >Grab Sale Now</button> {/* Button to navigate to product cards */}
                </div>
                <div className={`leading-tight m-0 p-0.5 mt-3.5 ${isMobile?'w-full':'w-1/2'}`}>
                 {/* Right part of the sales section, containing an image */}
                    <img src={salesimage} alt="sale Products"
                        className={`m-0.5 p-0.5 h-auto object-cover ${isMobile ? 'w-4/5 mx-auto' : 'w-[95%] mx-auto'}`}
                    ></img> {/* Image related to sale products */}
                </div>
            </div>
            <hr classname={` border-none border-t-2 border-blac w-full `} /> {/* Horizontal rule to separate sections */}
            < Latestproducts /> {/* Renders the Latestproducts component */}
        </div>
    );
}
export default Homescreen; // Exports the Homescreen component as the default export