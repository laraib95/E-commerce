import products from "./Productdata"; // Imports the 'products' array from Productdata.js, containing product information
import { useNavigate } from "react-router-dom"; // Imports the useNavigate hook for programmatic navigation
import './Productcard.css'; // Imports the CSS file for styling the Productcard component
import { useDispatch } from "react-redux";
import { addToCart, incrementTotalPurchases } from '../Redux/cartSlice';

function Productcard() {
    const navigate = useNavigate(); // Initializes the navigate function
    const dispatch =  useDispatch();
    // Destructures addToCart and incrementTotalPurchases functions from the useCart hook
    // const cartItems = useSelector((state) => state.cart.items);

    // Handler for the "Buy Now" action
    const handleBuyNow = (product) => {
        dispatch(addToCart(product));
        alert('Thanks for your purchase!'); // Displays a confirmation alert
        dispatch(incrementTotalPurchases()); // Increments the total number of purchases in the cart context
        navigate('/Cartscreen'); // Navigates the user to the cart screen
    };

    return (
        <div className="maingrid"> {/* Main container for the product grid */}
            {/* Maps over the 'products' array to render each product as a card */}
            {products.map((product) => (
                <div key={product.id} className="product_grid"> {/* Individual product card container, with a unique key */}
                    <img src={product.image} alt={product.name} className="productimage" /> {/* Product image */}
                    <h3>{product.name}</h3> {/* Product name */}
                    <p>{product.price}</p> {/* Product price */}
                    <div className="overlay"> {/* Overlay containing action buttons */}
                        {/* Button to navigate to the product detail page when clicked */}
                        <button className="buy-now" onClick={() => navigate(`/product/${product.id}`)}>Details</button>
                        {/* Button to add the product to the cart and then trigger the handleBuyNow function */}
                        <button className="buy-now" onClick={() => {
                            handleBuyNow(product); // Calls the handleBuyNow function to show alert and navigate
                        }}
                        >Buy Now</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default Productcard; // Exports the Productcard component as the default export