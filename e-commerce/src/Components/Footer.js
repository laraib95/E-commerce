import React from 'react'; // Imports the React library.
import { Link } from 'react-router-dom'; // Imports the Link component from react-router-dom for client-side navigation.
import './Footer.css'; // Imports the CSS file for styling the Footer component.
import { useMediaQuery } from 'react-responsive';

// Imports social media icon images.
import FacebookIcon from "../Images/facebook-logo.png";
import TwitterIcon from "../Images/twitter-logo.png";
import InstagramIcon from "../Images/insta-logo.png";

function Footer() {
    const currentYear = new Date().getFullYear(); // Gets the current full year dynamically.
    // const navigate = useNavigate(); // This line is commented out, indicating the useNavigate hook is not currently used in this component.
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

    return (
        <footer className="site-footer" 
              style={{margin: isMobile ? '0px' : isTablet ? '0px' : '0px',
                    padding: isMobile ? '1px' : isTablet ? '1px' : '2px'}}> {/* Main footer element with a class for styling. */}
            <div className="footer-content"> {/* Container for the main content sections of the footer. */}

                {/* About Us Section */}
                <div className="footer-section about">
                    <h3 style={{ fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px' }}>GO Shopping</h3> {/* Title for the about section. */}
                    <p style={{fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px'}}>
                        Your one-stop shop for all your needs. We deliver quality products right to your doorstep with care and speed.</p> {/* Description of the website/company. */}
                </div>

                {/* Quick Links Section */}
                <div className="footer-section links">
                    <h3 style={{ fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px' }}>
                        Quick Links</h3> {/* Title for the quick links section. */}
                    <ul style={{margin: isMobile ? '0px' : isTablet ? '4px' : '10px',
              padding: isMobile ? '1px' : isTablet ? '3px' : '10px'}}> {/* Unordered list for navigation links. */}
                        <li><Link to="/" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>Home</Link></li> {/* Link to the homepage. */}
                        <li><Link to="/Productcard" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>Products</Link></li> {/* Link to the products page. */}
                        <li><Link to="/Cartscreen" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>Cart</Link></li> {/* Link to the shopping cart page. */}
                        <li><Link to="/about" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>About Us</Link></li> {/* Link to the About Us page. */}
                        <li><Link to="/contact" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>Contact Us</Link></li> {/* Link to the Contact Us page. */}
                        <li><Link to="/login" style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}>Login</Link></li> {/* Link to the login page. */}
                    </ul>
                </div>

                {/* Social Media Section */}
                <div className="footer-section social">
                    <h3 style={{ fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px' }}>Follow Us</h3> {/* Title for the social media section. */}
                    <div className="social-links"> {/* Container for social media icons and links. */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}> {/* Link to Facebook, opens in a new tab. */}
                            <img src={FacebookIcon} alt='Facebook Link' className="fab fa-facebook-f"
                                style={{
                                    width: isMobile ? '15px' : isTablet ? '20px' : '50px',
                                    height: isMobile ? 'auto' : isTablet ? 'auto' : '50px'
                                }}></img> {/* Facebook icon image. */}
                            <span>Facebook</span> {/* Text label for the Facebook link. */}
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}> {/* Link to Twitter, opens in a new tab. */}
                            <img src={TwitterIcon} alt='Twitter link' className="fab fa-twitter"
                                style={{
                                    width: isMobile ? '15px' : isTablet ? '20px' : '50px',
                                    height: isMobile ? 'auto' : isTablet ? 'auto' : '50px'
                                }}></img> {/* Twitter icon image. */}
                            <span>Twitter</span> {/* Text label for the Twitter link. */}
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px' }}> {/* Link to Instagram, opens in a new tab. */}
                            <img src={InstagramIcon} alt='Instagram link' className="fab fa-instagram"
                                style={{
                                    width: isMobile ? '15px' : isTablet ? '20px' : '50px',
                                    height: isMobile ? 'auto' : isTablet ? 'auto' : '50px'
                                }}></img> {/* Instagram icon image. */}
                            <span>Instagram</span> {/* Text label for the Instagram link. */}
                        </a>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="footer-section contact">
                    <h3 style={{ fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px' }}>Contact Info</h3> {/* Title for the contact information section. */}
                    <p style={{fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px'}}><i className="fas fa-map-marker-alt"></i> 123 Shopping St, Retail City, State 12345</p> {/* Displays address with an icon. */}
                    <p style={{fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px'}}><i className="fas fa-phone"></i> +1 234 567 8900</p> {/* Displays phone number with an icon. */}
                    <p style={{fontSize: isMobile ? '7px' : isTablet ? '10px' : '15px'}}><i className="fas fa-envelope"></i> info@goshopping.com</p> {/* Displays email with an icon. */}
                </div>
            </div>

            {/* Footer Bottom Section - Copyright */}
            <div className="footer-bottom" style={{fontSize: isMobile ? '10px' : isTablet ? '15px' : '20px'}}>
                &copy; {currentYear} GO Shopping. All rights reserved. {/* Copyright notice with the dynamic current year. */}
            </div>
        </footer>
    );
};

export default Footer; // Exports the Footer component as the default export.