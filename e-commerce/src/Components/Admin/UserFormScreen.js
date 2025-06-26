import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useMediaQuery } from 'react-responsive';

const UserFormScreen = () => {
    const { id: userId } = useParams(); // Get user ID from URL for editing
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Only used for creation or explicit password reset
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false); // For form submission
    const [error, setError] = useState(null); // For form submission errors
    const [fetchLoading, setFetchLoading] = useState(true); // Loading state for fetching user details
    const [fetchError, setFetchError] = useState(null); // Error state for fetching user details

    // const isMobile = useMediaQuery({ query: '(max-width:768px)' });
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        if (userId) { // If userId exists, we are in edit mode
            const fetchUser = async () => {
                try {
                    setFetchLoading(true);
                    setFetchError(null);

                    const response = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, { // Adjust API path
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to fetch user for editing');
                    }

                    setName(data.user.name);
                    setEmail(data.user.email);
                    setRole(data.user.role);
                    setFetchLoading(false);
                } catch (err) {
                    setFetchError(err.message || 'An unknown error occurred');
                    setFetchLoading(false);
                    console.error("Failed to fetch user for editing:", err);
                }
            };

            if (userToken) {
                fetchUser();
            } else {
                setFetchError("Not authorized, no token found. Please log in as admin.");
                setFetchLoading(false);
                // navigate('/login');
            }
        } else { // If no userId, we are in create mode
            setFetchLoading(false); // No user to fetch
            // Reset form fields if coming from an edit screen to a create screen
            setName('');
            setEmail('');
            setPassword('');
            setRole('user');
        }
    }, [userId, userToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let response;
            let responseData;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            };

            if (userId) { // EDIT mode
                const updateData = { name, email, role };
                // If you allow password changes here, uncomment the line below
                // if (password) updateData.password = password; // Only if user enters a new password

                response = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, { // Adjust API path
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(updateData),
                });
                responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to update user');
                }
                alert('User updated successfully!');
            } else { // CREATE mode
                const createData = { name, email, password, role };
                response = await fetch('http://localhost:5000/api/v1/admin/users', { // Adjust API path
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(createData),
                });
                responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to create user');
                }
                alert('User created successfully!');
            }
            navigate('/admin/users'); // Go back to the user list after success
        } catch (err) {
            setError(err.message || 'An unknown error occurred');
            console.error("Operation failed:", err);
            alert('Error: ' + (err.message || 'An unknown error occurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                {userId ? 'Edit User' : 'Create New User'}
            </h2>

            {fetchLoading ? (
                <div className="text-center text-lg">Loading user details...</div>
            ) : fetchError ? (
                <div className="text-center text-red-500 text-lg">Error: {fetchError}</div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        {!userId && ( // Only show password field for creation
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                                <input
                                    type="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!userId} // Required only for new user
                                    disabled={loading}
                                />
                            </div>
                        )}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                disabled={loading}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading || fetchLoading}
                            >
                                {loading ? (userId ? 'Updating...' : 'Creating...') : (userId ? 'Update User' : 'Create User')}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/admin/users')}
                                disabled={loading || fetchLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserFormScreen;