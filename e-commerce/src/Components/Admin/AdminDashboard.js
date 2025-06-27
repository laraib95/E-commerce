import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminProductList'; 


function AdminDashboard() {
    const navigate = useNavigate();
    return (
        <div className="admin-dashboard-container">
            <button onClick={() => navigate(-1)} > {/* Button to navigate back to the previous page */}
        ← Back
      </button>
            <h2>Admin Dashboard</h2>
            <div className="admin-dashboard-links">
                <Link to="/admin/products" className="dashboard-link">
                    Manage Products
                </Link>
                <Link to="/admin/orders" className="dashboard-link">
                    Manage Orders
                </Link>
                <Link to="/admin/users" className="dashboard-link">
                    Manage Users
                </Link>
            </div>
        </div>
    );
}

export default AdminDashboard;