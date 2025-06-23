import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { removeFromCart, updateQuantity } from '../Redux/cartSlice'; 
import { useMediaQuery } from 'react-responsive';
import "./Cartscreen.css";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // Derived state: totalItemsInCart can be calculated directly from Redux state
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isMobile = useMediaQuery({ query: '(max-width:768px)' });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });


  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id)); 
  };

  const handleUpdateQuantity = (id, newQty) => {
    dispatch(updateQuantity({ id, newQty })); 
  };

  const totalCost = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart" style={{
        fontSize: isMobile ? '10px' : isTablet ? '15px' : '22px',
        width: isMobile ? '10%' : isTablet ? '10%' : '20%',
      }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="cart-container"
    style={{width: '90%',
    }}>
      <div className='cart-screen-text'>
        <h2>Your Cart</h2>
        <p style={{fontSize:isMobile ? '8px' : isTablet ?'10px' : '15px' }}>
          Total Items in Cart: {totalItemsInCart}</p>
      </div>
      {cartItems.map(item => (
        <div className="cart-items" key={item.id} 
          style={{
            margin: isMobile ? '0px' : isTablet ? '0px' : '3px',
            padding: isMobile ? '0px' : isTablet ? '1px' : '2px',
            gap: isMobile ? '5px' : '15px'
          }}>
          <img src={item.image} alt={item.name}
            style={{
              width: isMobile ? '130px' : isTablet ? '200px' : '300px',
              height: isMobile ? '90px' : isTablet ? '150px' : '250px',
              borderRadius: isMobile ? '1px' : isTablet ? '3px' : '5px',
              marginRight: isMobile ? '0px' : isTablet ? '1px' : '10px'
            }} />
          <div className="cart-item"
            style={{
              width: isMobile ? '200px' : isTablet ? '400px' : '700px',
              margin: isMobile ? '0px' : isTablet ? '4px' : '10px',
              padding: isMobile ? '1px' :isTablet ? '3px' : '10px',
            }}>
            <h3 className="item-name"
              style={{
                fontSize: isMobile ? '8px' : isTablet ? '10px' : '20px',
                width: isMobile ? '160px' : '300px',
                fontWeight: isMobile ? 'normal' : isTablet ? '300' : '800',
                marginBottom: isMobile ? '1px' : '4px'
              }}
            >{item.name}</h3>
            <p className="item-price"
              style={{
                fontSize: isMobile ? '8px' : isTablet ? '12px' : '16px',
                width: isMobile ? '35px' : '90px',
                fontWeight: isMobile ? 'normal' : isTablet ? '100' : '700',
                marginBottom: isMobile ? '4px' : '5px'
              }}>${item.price.toFixed(2)}</p>
            <div className='quantitydiv'
              style={{
                display: 'flex',
                width: isMobile ? '30px' : '40px',
                height: isMobile ? '7px' : '10px',
                gap: isMobile ? '2px' : '5px',
                alignItems: 'center'
              }}>
              <p style={{ width: isMobile ? '15px' : '20px',
                  height: 'auto',
                  fontSize: isMobile ? '8px' : '10px',
                  marginBottom: isMobile ? '9px' : '3px' }}>Qty</p>
              <input className="quantity-control"
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, e.target.value)} 
                min="1"
                style={{
                  width: isMobile ? '15px' : '20px',
                  height: 'auto',
                  fontSize: isMobile ? '8px' : '10px'
                }}
              />
            </div>
          </div>
          <button className="remove-button" onClick={() => handleRemoveFromCart(item.id)}
            style={{
              width: isMobile ? '60px' : '100px',
              fontSize: isMobile ? '8px' : '13px'
            }}>
            Remove
          </button>
        </div>
      ))}
      <hr style={{ width: isMobile ? '16px' : '20px' }} />
      <div className="cart-summary" style={{ paddingTop: isDesktop ? '20px' : '0px' }}>
        <h3 style={{
          fontSize: isMobile ? '15px' : isTablet ? '18px' : '1.2em',
          fontWeight: isMobile ? 'normal' : isTablet ? '300' : '600'
        }}>Total: ${totalCost.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default CartScreen;