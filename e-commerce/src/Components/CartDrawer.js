import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { FaTimes, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import {
    fetchCart, // Import the new async thunk
    removeItemFromCartBackend, // Import the new async thunk
    clearCartBackend // Import the new async thunk
} from "../Redux/CartSlice";
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: cartItems, status, error } = useSelector((state) => state.cart);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    // Fetch cart on component mount or when drawer opens if logged in
    useEffect(() => {
        if (isOpen && isLoggedIn && status === 'idle') {
            dispatch(fetchCart());
        }
    }, [isOpen, isLoggedIn, dispatch, status]);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });

    const handleRemoveFromCart = (id) => {
        if (isLoggedIn) {
            dispatch(removeItemFromCartBackend(id));
        }
    };

    const handleClearCart = () => {
        if (isLoggedIn) {
            dispatch(clearCartBackend());
        }
    };

    const totalCost = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0);

    //handle button navigations
    const handleViewCart = () => {
        onClose();
        navigate('/Cartscreen');
    }
    const handleCheckout = () => {
        onClose();
        navigate('/checkout'); // You'll need to create a Checkout screen and logic
    }

    return (
        <>
            {/* Overlay - appears when drawer is open, closes drawer on click */}
            {isOpen && <div className="cart-drawer-overlay" onClick={onClose}></div>}

            {/* Cart Drawer Container */}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h2>Your Cart ({totalItemsInCart} items)</h2>
                    <FaTimes className="close-icon" onClick={onClose} />
                </div>

                <div className="drawer-items">
                    {status === 'loading' && <div className="loading-message">Loading cart...</div>}
                    {status === 'failed' && <div className="error-message">Error: {error}</div>}
                    {status === 'succeeded' && cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <p style={{ fontSize: isMobile ? '16px' : '20px' }}>Your cart is empty</p>
                            <button className="shop-now-btn" onClick={() => { onClose(); navigate("/Productcard"); }}>Shop Now</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-drawer-item" key={item.product._id || item.id}>
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    <div className="item-quantity-controls">
                                        <p>{item.quantity}</p>
                                    </div>
                                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="item-actions">
                                    {/* Use item.product._id for removal */}
                                    <FaTrash className="delete-icon" onClick={() => handleRemoveFromCart(item.product ? item.product._id : item.id)} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="drawer-summary">
                        <div className="summary-row">
                            <span>Total Items:</span>
                            <span>{totalItemsInCart}</span>
                        </div>
                        <div className="summary-row total-cost">
                            <span>Total Cost:</span>
                            <span>${totalCost.toFixed(2)}</span> {/* Format to 2 decimal places */}
                        </div>
                        <div className="drawer-buttons">
                            <button className="btn-view-cart" onClick={handleViewCart}>
                                View Cart
                            </button>
                            <button className="btn-checkout" onClick={handleCheckout}>
                                Checkout
                            </button>
                            <button className="btn-clear-cart" onClick={handleClearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};
export default CartDrawer;