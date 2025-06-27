import "./Navigation.css";
import Carticon from "../Images/carticon.png";
import { Link } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logo from "../Images/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearCart } from "../Redux/CartSlice";
import CartDrawer from './CartDrawer';
// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/AuthSlice';

function Navigation() {
        const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize useDispatch for logout and any future cart dispatches

    // Select authentication state from Redux store
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.user); // Get user object (contains username, etc.)

    //check if islogged in user is admin
    const isAdmin = isLoggedIn && user && user.role === 'Admin';


    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        dispatch(clearCart());
        navigate('/');       // Navigate to home or login page after logout
    };
    const toggleCartDrawer = () => {
        setIsCartDrawerOpen(!isCartDrawerOpen);
    };

    return (
        <div className="header"
            style={{
                margin: isMobile ? '0px' : isTablet ? '0px' : '2px',
                padding: isMobile ? '2px' : isTablet ? '3px' : '3px',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: isMobile ? 'center' : 'space-around'
            }}>
            <div className="logoname"
                style={{
                    width: isMobile ? '100%' : 'auto',
                    height: 'auto',
                    marginBottom: isMobile ? '10px' : '0px',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                <img src={logo} alt="Website Logo" className="logo"
                    style={{
                        width: isMobile ? '90px' : isTablet ? '120px' : '250px',
                        height: isMobile ? 'auto' : isTablet ? 'auto' : '80px'
                    }}></img>
                <h1 style={{
                    width: isMobile ? 'auto' : isTablet ? 'auto' : '50px',
                    fontSize: isMobile ? '12px' : isTablet ? '16px' : '40px',
                    marginTop: isMobile ? '10px' : '0px'
                }}>GO Shopping</h1>
            </div>
            <div className="nav ">
                <div className="Navigationbar"
                    style={{
                        height: isMobile ? 'auto' : isTablet ? 'auto' : '15px'
                    }}>
                    <ul
                        style={{
                            gap: isMobile ? '5px' : '20px'
                        }}>
                        <li><Link to="/" style={{
                            fontSize: isMobile ? '12px' : isTablet ? '12px' : '25px'
                        }}>Home</Link></li>
                        <li ><Link style={{
                            fontSize: isMobile ? '12px' : isTablet ? '12px' : '25px'
                        }} to="/about">About</Link></li>
                        <li><Link style={{
                            fontSize: isMobile ? '12px' : isTablet ? '12px' : '25px'
                        }} to="Contactus">Contact Us</Link></li>
                        {isAdmin && (
                            <li><Link style={{
                                fontSize: isMobile ? '12px' : isTablet ? '12px' : '25px'
                            }} to='/admin/dashboard'>Dashboard</Link></li>
                        )}
                    </ul>
                </div>
                <div className="icons"
                    style={{ gap: isMobile ? '10px' : '15px' }}
                >
                    {isLoggedIn && user ? ( // Conditionally render if logged in
                        <>
                            <Link to="/ProfileScreen"> {/* Link to user profile page*/}
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.name || 'User'}
                                        className="profile-pic"
                                        style={{
                                            height: isMobile ? '30px' : isTablet ? '40px' : '50px',
                                            width: isMobile ? '30px' : isTablet ? '40px' : '50px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span
                                        className="user-name"
                                        style={{
                                            fontSize: isMobile ? '12px' : isTablet ? '14px' : '20px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Hi, {user.name ? user.name.split(' ')[0] : 'User'}! {/* Display first name */}
                                    </span>
                                )}
                            </Link>
                            <button className="logout-button"
                                onClick={handleLogout}
                                style={{
                                    height: isMobile ? '30px' : isTablet ? '40px' : '50px',
                                    width: isMobile ? '60px' : '100px',
                                    fontSize: isMobile ? '12px' : isTablet ? '14px' : '18px',
                                    background: 'linear-gradient(90deg, #696969, #f0f8ff)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/Login">
                            <button className="loginbutton"
                                style={{
                                    height: isMobile ? '30px' : isTablet ? '40px' : '50px',
                                    width: isMobile ? '60px' : '200px'
                                }}
                            >Login</button>
                        </Link>
                    )}
                    <div onClick={toggleCartDrawer}>
                    {/* <Link to="/CartDrawer"  style={{ position: 'relative' }}> */}
                        <img src={Carticon} alt="Cart" className="carticon"
                            style={{
                                width: isMobile ? '25px' : (isTablet ? '35px' : '40px'),
                               height: isMobile ? '25px' : (isTablet ? '35px' : '40px'),
                            }}
                        ></img>
                    {/* </Link> */}
                    </div>
                </div>
            </div>
            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={toggleCartDrawer}
            />
        </div>
    );
}
export default Navigation;