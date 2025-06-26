import React, { useState } from "react";            //usestate to manage form inputs
import { useNavigate } from "react-router-dom";     //to navigate after success
import { useMediaQuery } from 'react-responsive';
import './Signupscreen.css';

function Signupscreen() {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [mobilenumber, setmobilenumber] = useState("");
    const [age, setage] = useState("");
    const [error, seterror] = useState("");
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });

    const handleSignup = async (e) => {
        e.preventDefault();

        //Validations
        if (!name || !email || !password || !mobilenumber || !age )  {
            seterror("All Fields are required!");
            return;
        }
        // Name validation
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        if (!name || !nameRegex.test(name)) {
            seterror("Please enter a valid name (letters only, min 2 characters).");
            return;
        }
        //email format validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            seterror("Invalid Email Format!");
            return;
        }
        //mobile number format validation
        const mobilenumberRegex = /^0\d{10}$/;
        if (!mobilenumberRegex.test(mobilenumber)) {
            seterror("Incorrect Contact Number! It should start with 0 and have 11 digits.");
            return;
        }

        // Save user data to local storage (temporary)
        // localStorage.setItem('user', JSON.stringify({ name, email, password, mobilenumber }));
        // alert("Account created successfully. Please log in.");
        // navigate('/Login');

        //API POST request to your backend
        try {
            const response = await
                fetch("http://localhost:5000/api/v1/register", {     //calling an API endpoint defined in (backend) auth.js file
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password, mobilenumber, age }),
                });
            const data = await response.json();
            if (response.ok) {
                alert("Account Created Successfuly, Please Login");
                navigate('/Login');
            } else {
                seterror(data.message || "Registration  Failed");
            }
        } catch (err) {
            console.error(err);
            seterror("Server Error. Please try again Later");
        }
    };

    return (
        <div className="login-wrapper"
            style={{
                width: isMobile ? '250px' : '500px'
            }}>
            <h1 style={{ fontSize: isMobile ? '15px' : '25px' }}>Create Account to login</h1>
            <form onSubmit={handleSignup}>                  {/*form submission*/}
                <div className="emailpassword">
                    <label>Name</label>
                    <input
                        style={{ fontSize: isMobile ? '12px' : '16px' }}
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        style={{ fontSize: isMobile ? '12px' : '16px' }}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        style={{ fontSize: isMobile ? '12px' : '16px' }}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                    />

                    <label>Contact Number</label>
                    <input
                        style={{ fontSize: isMobile ? '12px' : '16px' }}
                        type="text"
                        placeholder="Enter contact number (e.g. 03XXXXXXXXX)"
                        value={mobilenumber}
                        onChange={(e) => setmobilenumber(e.target.value)}
                        required
                    />

                    <label>Age</label>
                    <input
                        style={{ fontSize: isMobile ? '12px' : '16px' }}
                        type="number"
                        placeholder="Your Age"
                        value={age}
                        onChange={(e)=> setage(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="formbuttons">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default Signupscreen;
