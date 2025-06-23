import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './productForm.css'; 

function ProductForm() {
    const { id } = useParams(); // Get product ID from URL if editing
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]); // For file objects when uploading
    const [imagesPreview, setImagesPreview] = useState([]); // For displaying image previews
    const [oldImages, setOldImages] = useState([]); // For existing images when editing

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Define categories (should match your backend Product model enum)
    const categories = [
                'Cameras',
                'MemoryCards',
                'InkCatiadges',
                'Protectors',
                'Headphones',
    ];

    // Effect to fetch product details if in "edit" mode
    useEffect(() => {
        if (id) { // If ID exists, it's an edit operation
            const fetchProduct = async () => {
                setLoading(true);
                setError('');
                try {
                    const res = await fetch(`http://localhost:5000/api/v1/product/${id}`); // Public GET route
                    const data = await res.json();
                    if (res.ok) {
                        const product = data.product;
                        setName(product.name);
                        setPrice(product.price);
                        setDescription(product.description);
                        setCategory(product.category);
                        setStock(product.stock);
                        setSeller(product.seller);
                        setOldImages(product.images); // Set existing images
                    } else {
                        setError(data.message || 'Failed to fetch product details for edit.');
                    }
                } catch (err) {
                    console.error("Fetch product for edit error:", err);
                    setError('Server error: Could not fetch product details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]); // Rerun when ID changes (i.e., component loaded for different product)

    // Handle image selection
    const onChangeImages = e => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        setOldImages([]); // Clear old images when new ones are selected

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // FormData is essential for sending files (images)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('seller', seller);

        images.forEach(image => {
            formData.append('images', image); // Append each selected image
        });
        // If editing and no new images are selected, send old images to backend if your API expects them for merge
        // For simplicity, we assume backend replaces images. If not, you'd need to handle oldImages explicitly.

        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:5000/api/v1/admin/product/${id}` : 'http://localhost:5000/api/v1/admin/product/new';
        console.log("DEBUGGING: token from redux : ",token)
        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}` // Admin-only route, requires token
                    // 'Content-Type': 'multipart/form-data' is NOT needed for FormData, it's set automatically
                },
                body: formData,
            });
            console.log("DEBUGGING: just getting response")
            const data = await res.json();
            console.log("DEBUGGING: Got response")

            if (res.ok) {
                setSuccess(data.message || (id ? 'Product updated successfully!' : 'Product added successfully!'));
                navigate('/admin/products'); // Go back to product list after success
            } else {
                setError(data.message || (id ? 'Failed to update product.' : 'Failed to add product.'));
            }
        } catch (err) {
            console.error("Product form submission error:", err);
            setError('Server error: Could not save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <button onClick={() => navigate(-1)} > {/* Button to navigate back to the previous page */}
        ← Back
      </button>
            <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
            {loading && <p className="loading-message">Saving Product...</p>}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock:</label>
                    <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="seller">Seller Name:</label>
                    <input type="text" id="seller" value={seller} onChange={(e) => setSeller(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Product Images:</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        onChange={onChangeImages}
                        multiple
                        accept="image/*" // Only allow image files
                    />
                </div>

                <div className="image-previews">
                    {oldImages.length > 0 && (
                        <div className="existing-images">
                            <h4>Existing Images:</h4>
                            {oldImages.map((img, index) => (
                                <img key={index} src={img.url} alt={`Existing ${index}`} className="product-image-preview" />
                            ))}
                        </div>
                    )}
                    {imagesPreview.length > 0 && (
                        <div className="new-images">
                            <h4>New Images:</h4>
                            {imagesPreview.map((img, index) => (
                                <img key={index} src={img} alt={`New Preview ${index}`} className="product-image-preview" />
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                </button>
            </form>
        </div>
    );
}

export default ProductForm;