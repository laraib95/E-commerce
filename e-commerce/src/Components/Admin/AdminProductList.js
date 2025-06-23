// src/Components/AdminProductList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './adminProductList.css'; // Create this CSS file

function AdminProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);

    // Function to fetch products
    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/v1/products'); // Public route, no token needed
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products);
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err) {
            console.error("Fetch products error:", err);
            setError('Server error: Could not fetch products.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle product deletion
    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setLoading(true);
        setError('');
        setDeleteSuccess('');

        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Admin-only route, requires token
                },
            });
            const data = await res.json();
            if (res.ok) {
                setDeleteSuccess('Product deleted successfully!');
                fetchProducts(); // Refresh the list after deletion
            } else {
                setError(data.message || 'Failed to delete product.');
            }
        } catch (err) {
            console.error("Delete product error:", err);
            setError('Server error: Could not delete product.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Fetch products on component mount

    if (loading) return <p className="loading-message">Loading Products...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-product-list-container">
            <button onClick={() => navigate(-1)} > {/* Button to navigate back to the previous page */}
                ← Back
            </button>
            <h2>Manage Products</h2>
            <Link to="/admin/product/new" className="add-product-button">Add New Product</Link>

            {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}

            {products.length === 0 ? (
                <p>No products found. Add some!</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Link to={`/admin/product/edit/${product._id}`} className="edit-button">Edit</Link>
                                    <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminProductList;