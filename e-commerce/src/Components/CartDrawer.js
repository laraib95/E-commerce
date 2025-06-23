import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {FaTimes, FaTrash} from "react-icons/fa"
// import { TbHourglassEmpty } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../Redux/cartSlice";
import './CartDrawer.css';

function CartDrawer({isOpen, onClose}){
    const dispatch = useDispatch();
    const navigate = useNavigate();

      // Get cart items from Redux store
    const cartItems = useSelector((state) => state.cart.items);
      // Derived state: totalItemsInCart can be calculated directly from Redux state
    const totalItemsInCart =  cartItems.reduce((total,item)=> total + item.quantity,0);
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    
    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id))
    };
    // const handleUpdateQuantity = (id, newqty) => {
    //     dispatch(updateQuantity({id,newqty}))
    // };

    const totalCost = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  //handle button navigations 
  const handleViewCart=()=>{
    onClose();
    navigate('/Cartscreen');
  }
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  }
  return(
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
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            {/* <TbHourglassEmpty size={isMobile ? 40 : 60} /> */} {/* Uncomment if using the icon */}
                            <p style={{fontSize: isMobile ? '16px' : '20px'}}>Your cart is empty</p>
                            <button className="shop-now-btn" onClick={() => { onClose(); navigate("/Productcard"); }}>Shop Now</button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            // Inline CartItem structure for now. Consider making this a separate component.
                            <div className="cart-drawer-item" key={item.id}>
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    <div className="item-quantity-controls">
                                        <p>{item.quantity}</p>
                                        {/* <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1} // Disable decrement if quantity is 1
                                        >-</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        >+</button> */}
                                    </div>
                                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="item-actions">
                                    <FaTrash className="delete-icon" onClick={() => handleRemoveFromCart(item.id)} />
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
                            <span>${totalCost}</span>
                        </div>
                        <div className="drawer-buttons">
                            <button className="btn-view-cart" onClick={handleViewCart}>
                                View Cart
                            </button>
                            <button className="btn-checkout" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
  )

};
export default CartDrawer;