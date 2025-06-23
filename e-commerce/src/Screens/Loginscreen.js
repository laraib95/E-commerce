// Import for Google Login
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useState } from "react"; // Imports React and the useState hook for managing component state
// import googlelogo from '../Images/googleicon.png' // Imports the Google logo image
import './Loginscreen.css'; // Imports the CSS file for styling the LoginScreen component
import { useNavigate } from "react-router-dom";

//Redux Imports

import { loginSuccess } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';

function LoginScreen() {
    // Declares state variables using the useState hook
    const [email, setemail] = useState(""); // State for storing the email input value
    const [password, setpassword] = useState(""); // State for storing the password input value
    const [error, seterror] = useState(""); // State for storing error messages
    // const [loggedin, setloggedin] = useState(false); // State for tracking login status
    const navigate = useNavigate();                 //initialize useNavigate hook
    const dispatch = useDispatch();                 //initialize useDispatch hook

    // Function to validate email format using a regular expression
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/; // Regular expression for basic email validation
        return re.test(email); // Returns true if the email matches the pattern, false otherwise
    }

    // Handler function for form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission behavior (page reload)
        seterror(" ");

        // Checks if both email and password fields are empty
        if (!email || !password) {
            seterror("Both Fields are required!"); // Sets an error message
            return; // Stops the function execution
        }

        // Checks if the email format is invalid
        if (!validateEmail(email)) {
            seterror("Invalid Email Format!"); // Sets an error message for invalid email
            return; // Stops the function execution
        }

        // // Checks if the entered email and password match the hardcoded values
        // const savedUser = JSON.parse(localStorage.getItem('user'));
        // if (savedUser && savedUser.email === email && savedUser.password === password) {
        //     setloggedin(true);
        //     seterror("");
        //     navigate('/');
        // }
        // else {
        //     seterror("Invald Email or Password"); // Sets an error message for incorrect credentials
        // }

        //API POST request to backend
        try {
            const response = await
                fetch("http://localhost:5000/api/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({ email, password }),
                });
            const data = await response.json();             //parse the response json
            if (response.ok ) {
                alert("Logged in Successfuly !");
                //Dispatch the  LoginSuccess action with User data and token from backend 
                dispatch(loginSuccess({
                    user: data.user,
                    token: data.token
                }));
                seterror(" ");
                navigate('/');
            }
            else {
                seterror(data.message || "Login  Failed");
            }
        } catch (error) {
            console.error(error);
            seterror("Server Error. Please Try Again later")
        }
    };

    // // --- Google Login Handlers ---
    // const handleGoogleSuccess = (credentialResponse) => {
    //     console.log('Google Login Success:', credentialResponse);
    //     // Here you would typically send credentialResponse.credential (ID token) to your backend
    //     // to verify the user and create/retrieve their account.
    //     const decodedToken = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    //     const userProfile = {
    //         name: decodedToken.name,
    //         email: decodedToken.email,
    //         profilePic: decodedToken.picture // Google profile picture URL
    //     };
    //     dispatch(loginSuccess({ user: userProfile, token: credentialResponse.credential })); // Dispatch with Google data
    //     seterror("");
    //     navigate('/');
    // };

    // const handleGoogleError = () => {
    //     console.log('Google Login Failed');
    //     seterror("Google login failed. Please try again.");
    // };


    // JSX for rendering the LoginScreen component
    return (
        // <GoogleOAuthProvider clientId="908949675200-kthv4j93e3qhthl24f6b8lq5d7lgien8.apps.googleusercontent.com"> {/* Wrap with GoogleOAuthProvider */}
            <div className="Loginwrapper"> {/* Main container for the login screen */}
                <h1>Login to Shop please</h1> {/* Heading for the login page */}
                <div className="inputs"> {/* Container for input fields and buttons */}
                    <form onSubmit={handleSubmit}> {/* Login form with submission handler */}
                        <div className="emailpassword"> {/* Container for email and password input fields */}
                            <label>Email</label> {/* Label for the email input */}
                            <input className="Email" type="email" placeholder="enter your email" value={email}
                                onChange={(e) => setemail(e.target.value)} required></input> {/* Email input field */}
                            <label>Password</label> {/* Label for the password input */}
                            <input type="password" placeholder="enter the password" value={password}
                                onChange={(e) => setpassword(e.target.value)} required></input> {/* Password input field */}
                        </div>
                        {error && <p style={{ color: "red" }}>{error}</p>} {/* Displays error message if `error` state is not empty */}
                        <p>  Don't have account ? Register here</p>
                        <div className="formbuttons"> {/* Container for form action buttons */}
                            <button className='signup-button' type="button" onClick={() => navigate('/Signupscreen')}>Sign up</button> {/* Sign up button (currently not functional as a separate route) */}
                            <button className='login-button' type="submit">Login</button> {/* Login button to submit the form */}
                        </div>
                        {/* <div class="separator">
                            <span class="text">OR</span>
                        </div>
                        <div className="social-login"> {/* Container for social login  */}
                            {/* Google Login Button 
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap // Optional: for one-tap sign-in experience
                                render={({ onClick }) => (
                                    <button type="button" onClick={onClick} className="googlebutton">
                                        <img src={googlelogo} alt="Googlelogo" /> Login with Google
                                    </button>
                                )}
                            />
                        </div> */}
                    </form>
                </div>
            </div>
        // </GoogleOAuthProvider >
    );
}
export default LoginScreen; // Exports the LoginScreen component as the default export