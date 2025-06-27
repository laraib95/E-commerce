import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCartBackend } from '../Redux/CartSlice';
import "./ProductDetail.css"; // Imports the CSS file for styling the ProductDetail component

const API_BASE_URL = 'http://localhost:5000/api/v1';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // NEW STATE: To keep track of the currently displayed large image
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/product/${id}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data.product);
                setLoading(false);

                // --- NEW: Set the initial main image after product data is fetched ---
                if (data.product.images && data.product.images.length > 0) {
                    setMainImage(data.product.images[0].url);
                }
                // -------------------------------------------------------------------

            } catch (err) {
                console.error("Error fetching product details:", err);
                setError(err.message || "Failed to load product details.");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0 && product && value <= product.stock) {
            setQuantity(value);
        } else if (value < 1) {
            setQuantity(1);
        } else if (product && value > product.stock) {
            setQuantity(product.stock);
        }
    };

    const handleAddToCartClick = () => {
        if (!isLoggedIn) {
            alert("Please log in to add items to your cart.");
            navigate('/Login');
            return;
        }
        if (product.stock === 0) {
            alert("This product is out of stock.");
            return;
        }

        dispatch(addItemToCartBackend({ productId: product._id, quantity: quantity }))
            .unwrap()
            .then(() => {
                alert(`${quantity} of ${product.name} added to cart!`);
                // Optionally navigate or show a cart drawer
                // navigate('/Cartscreen');
            })
            .catch((err) => {
                alert(`Failed to add to cart: ${err.message || 'An error occurred'}`);
                console.error("Add to cart error:", err);
            });
    };

    // NEW FUNCTION: Handles click on a thumbnail image
    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error: {error}</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="not-found">
                <h2>Product Not Found</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="main">
            <button onClick={() => navigate(-1)}>← Back</button>
            <div className="container">
                {/* START OF NEW IMAGE GALLERY STRUCTURE */}
                <div className="image-gallery">
                    {/* Main Big Image */}
                    <div className="main-image-display">
                        {/* Only render if mainImage state has a value */}
                        {mainImage && (
                            <img src={mainImage} alt={product.name} />
                        )}
                    </div>

                    {/* Small Thumbnail Images */}
                    <div className="thumbnail-list">
                        {product.images && product.images.map((image, index) => (
                            <img
                                key={index} // Using index as key is okay if images don't reorder or get added/removed often. A unique image._id from backend would be better if available.
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                // Add a class to highlight the currently active thumbnail
                                className={`thumbnail-item ${image.url === mainImage ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(image.url)}
                            />
                        ))}
                    </div>
                </div>
                {/* END OF NEW IMAGE GALLERY STRUCTURE */}

                <div className="text">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <h2>${product.price.toFixed(2)}</h2>
                    <p>Category: {product.category}</p>
                    <p>Seller: {product.seller}</p>
                    <p className={product.stock === 0 ? 'out-of-stock' : ''}>
                        Stock: {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </p>

                    {product.stock > 0 && (
                        <div className="quantity-controls">
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.stock}
                            />
                        </div>
                    )}

                    <button
                        className="Addtocart"
                        onClick={handleAddToCartClick}
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;