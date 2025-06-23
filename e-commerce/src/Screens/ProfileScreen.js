import './ProfileScreen.css';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSuccess, logout } from '../Redux/authSlice'; // Import logout for token expiry handling
import { clearCart } from '../Redux/cartSlice'; // Assuming you clear cart on logout
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirects

function ProfileScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const { user, token } = useSelector((state) => state.auth);

    // State for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobilenumber, setMobilenumber] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true); // Start as true, expecting an initial fetch

    // Effect 1: Fetch user profile data from the backend
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setError("No token found. Please Log in.");
                setLoading(false); // Stop loading if no token
                navigate('/Login'); // Redirect to login
                return;
            }

            // Set loading only if we are actually going to fetch
            // (it's already true from initial useState)
            setError("");
            setSuccess("");

            try {
                const res = await fetch("http://localhost:5000/api/profile", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    // Directly update local state with fetched data
                    // NO dispatch(updateSuccess(data)) here for initial fetch
                    // The second useEffect handles syncing from Redux after loginSuccess/initializeAuth
                    setName(data.name || "");
                    setEmail(data.email || "");
                    setMobilenumber(data.mobilenumber || "");
                    setAge(data.age || "");
                    // No need to dispatch updateSuccess here. The local state is updated.
                    // The Redux 'user' state should already have the correct data from loginSuccess
                    // or initializeAuth during app load. This fetch is just to confirm/get latest.
                } else if (res.status === 401 || res.status === 403) {
                    setError(data.message || "Session expired. Please log in again.");
                    dispatch(logout());
                    dispatch(clearCart());
                    navigate('/Login');
                } else {
                    setError(data.message || "Failed to Fetch Profile");
                }
            } catch (fetchError) {
                console.error("Fetch Profile Error", fetchError);
                setError("Server Error. Could not Fetch Profile.");
            } finally {
                setLoading(false); // Always set loading to false after fetch attempt
            }
        };

        // This condition makes sure we only fetch if we have a token.
        // It's crucial for the initial load.
        // The `user` object might be populated by `authSlice` from localStorage,
        // so checking `token` is sufficient for initiating the fetch.
        if (token) {
            fetchUserProfile();
        } else {
            // If component mounts and no token (should be caught by ProtectedRoute normally)
            setLoading(false); // No fetch, so stop loading
            setError("You need to be logged in to view this page.");
            navigate('/Login'); // Ensure redirection if not logged in
        }
    }, [token, dispatch, navigate]); // Dependencies: only token, dispatch, and navigate

    // Effect 2: Synchronize local state with Redux user state
    // This effect ensures that if the 'user' object in Redux (e.g., from loginSuccess)
    // is updated, the form fields reflect that. It also handles the initial population
    // if Redux 'user' is already available from localStorage on component mount.
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setMobilenumber(user.mobilenumber || "");
            setAge(user.age || "");
            setPassword("");
            setConfirmPassword("");
            // Set loading to false here if the initial user data is available
            // directly from Redux without needing a fetch.
            // This ensures the form is usable even before the fetchUserProfile finishes
            // (or if it's skipped for some reason).
            setLoading(false); // Assuming user data is here, we are ready
        }
    }, [user]); // Only depends on the Redux 'user' object

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (password && password !== confirmPassword) { // Only check if password is provided
            setError("Password fields do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    mobilenumber,
                    age: Number(age),
                    ...(password && { password }),
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || 'Profile Updated Successfully!');
                // IMPORTANT: Dispatch updateSuccess HERE after successful backend update
                dispatch(updateSuccess(data.user)); // This updates Redux and triggers the 2nd useEffect
                setPassword("");
                setConfirmPassword("");
            } else if (res.status === 401 || res.status === 403) {
                setError(data.message || "Session expired. Please log in again.");
                dispatch(logout());
                dispatch(clearCart());
                navigate('/Login');
            } else {
                setError(data.message || "Failed to Update Profile.");
            }
        } catch (submitError) {
            console.error("Update Profile Error!", submitError);
            setError("Server Error. Could not update Profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {/* Show loading message only when actually loading/updating */}
            {loading && <p className="loading-message">Loading Profile.......</p>}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit} className="profile-form">
                {/* Render fields only if not actively loading from backend,
                    or if initial data is available. This prevents flickering. */}
                {(!loading || (user && token)) && (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password: (optional)</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmpassword">Confirm Password:</label>
                            <input type="password" id="confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobilenumber">Mobile Number:</label>
                            <input type="text" id="mobilenumber" value={mobilenumber} onChange={(e) => setMobilenumber(e.target.value)} required />
                        </div>
                    </>
                )}
                <button type="submit" disabled={loading || (password && password !== confirmPassword)}>
                    {loading ? 'Updating .....' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}

export default ProfileScreen;