import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
// import products from "./Productdata"; // REMOVE THIS LINE: No longer needed

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Your backend API base URL

function Latestproducts() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });

    // State for products, loading, and error
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products`); // Fetch from backend

                if (!response.ok) {
                    const errorData = await response.json(); // Attempt to parse error message
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products); // Assuming backend returns { success: true, products: [...] }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching latest products:", err);
                setError(err.message || "Failed to load latest products.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means this runs once on component mount

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    if (loading) {
        return <div className="text-center p-4">Loading latest products...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">Error: {error}</div>;
    }

    // You might want to add a check if `products` is empty and display a message
    if (products.length === 0) {
        return <div className="text-center p-4">No latest products found.</div>;
    }


    return (
        <div className={`m-0 p-0 w-full bg-gradient-to-b from-[#decc2f] to-[#FFC371] to-60% items-center justify-center overflow-scroll`}>
            <div className={`flex flex-row h-[80px] ${isMobile ? 'gap-[20%]' : 'gap-[50%]'}`}>
                <h1 className={`font-extrabold m-[2px] [text-shadow:15px_5px_15px_black] whitespace-nowrap ${isMobile ? 'text-base' : 'text-2xl'}`}>
                    Our Latest Products
                </h1>
                <button className={`bg-transparent h-[50px] text-white border-2 border-white shadow-none  transition duration-300 ease-in-out hover:bg-white/15
                    hover:border-white
                    hover:-translate-y-0.5
                    hover:shadow-md
                    hover:shadow-black/10 focus:outline-none
                    focus:ring-4
                    focus:ring-white/50 active:bg-white/5
                    active:translate-y-0
                    active:shadow-none${isMobile ? 'text-[15px] w-[100px] h-[20px]' : 'text-[18px] w-[250px] h-[20px]'} `}
                >First to Shop Now</button>
            </div>
            <div className={`flex justify-start gap-[5px] pl-0.5 box-border flex-wrap ${isMobile ? 'w-[500px] h-[200px]':'w-full h-[400px]'}`}>
                {products.map((product) => (
                    <div
                        key={product._id} // Use product._id as key from MongoDB
                        className={`flex flex-col gap-[1px] w-[200px] items-center p-[5px] rounded-lg shadow-md text-center border-none outline-none
                                cursor-pointer transition duration-200 ease-in-out box-border
                                hover:shadow-[5px_5px_5px_grey] hover:-translate-y-0.5   `}
                        onClick={() => handleProductClick(product._id)} // Use product._id for navigation
                    >
                        {/* Assuming product.images[0].url exists for the first image */}
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0].url} alt={product.name} className={`bg-transparent h-[150px] w-[120px]`} />
                        )}
                        <h3 className={`line-clamp-3 overflow-hidden text-ellipsis ${isMobile ? 'text-[8px]':'text-[12px]'}`}>
                            {product.name}
                        </h3>
                        <p>${product.price.toFixed(2)}</p> {/* Format price for display */}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Latestproducts;