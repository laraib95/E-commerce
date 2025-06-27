import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCartBackend } from '../Redux/CartSlice'; // Assuming you have this async thunk for backend cart
import './ProductCard.css'; // Assuming you have CSS for this

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Your backend API base URL

function Productcard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to load products.");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (productId) => {
        // You'll need to check if user is logged in here or in cartSlice thunk
        dispatch(addItemToCartBackend({ productId, quantity: 1 }))
            .unwrap()
            .then(() => {
                alert('Product added to cart!');
            })
            .catch((err) => {
                alert(`Failed to add to cart: ${err}`);
                console.error("Add to cart error:", err);
            });
    };

    if (loading) {
        return <div className="products-loading">Loading products...</div>;
    }

    if (error) {
        return <div className="products-error">Error: {error}</div>;
    }

    return (
        <div className="maingrid">
            <div className='back-button'>
                <button onClick={() => navigate(-1)}>← Back</button>
            </div>
            {products.map(product => (
                <div key={product._id} className="product_grid"> {/* Use product._id */}
                    {product.images && product.images.length > 0 && (
                        <img src={product.images[0].url} alt={product.name} className="productimage" />
                    )}
                    <h3>{product.name}</h3>
                    <p>${product.price.toFixed(2)}</p> {/* Format price */}
                    <div className="overlay">
                        <button className="buy-now" onClick={() => navigate(`/product/${product._id}`)}>Details</button> {/* Use product._id */}
                        <button className="buy-now" onClick={() => handleAddToCart(product._id)}>Add to Cart</button> {/* Optional: Add to Cart button */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Productcard;