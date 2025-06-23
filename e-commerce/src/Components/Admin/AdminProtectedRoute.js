//protected route specifically for admin operations checking admin role.
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const { isLoggedIn, user, status } = useSelector((state) => state.auth);

    // Check if logged in, user exists, and user has the 'Admin' role
    if (isLoggedIn && user && user.role === 'Admin') {
        return <Outlet />; // Render child routes if admin
    } else if (status === 'loading') {
        // Optional: Show a loading spinner while auth state is being determined
        return <p>Checking authorization...</p>;
    } else {
        // Redirect to login if not logged in or not admin
        return <Navigate to="/Login" replace />;
    }
};

export default AdminProtectedRoute;