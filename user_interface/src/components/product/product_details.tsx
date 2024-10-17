import { ProductImageType, ProductType } from "../../features/product_type.ts";
import axiosInstance from "../../utilites/api.ts";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsComponent() {
    const [product, setProduct] = useState<ProductType>();
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState<ProductImageType>();
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Function to handle scroll by image width (based on image width)
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -128, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 128, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/products/product/${id}`);
            setProduct(response.data);
            setSelectedImage(response.data.images[0]);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Determine if scrolling is needed
    const shouldShowScrollButtons = () => {
        if (scrollRef.current) {
            const scrollWidth = scrollRef.current.scrollWidth;
            const clientWidth = scrollRef.current.clientWidth;
            return scrollWidth > clientWidth; // Show buttons if content is wider than the container
        }
        return false;
    };

    return (
        <div className="w-full mt-16">
            {product && (
                <div className="w-full sm:w-5/6 lg:w-2/3 mx-auto">
                    <div className="product_uper_container grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image container */}
                        <div className="image_container row-auto">
                            <div className="image_view h-64 md:h-96 flex justify-center items-center ">
                                <img
                                    className="max-w-full max-h-full object-contain p-2 rounded-2xl"
                                    src={selectedImage?.image}
                                    alt={product.name}
                                />
                            </div>

                            <div className="relative container mx-auto p-4 ">
                                <div className="image_list">
                                    {/* Left Scroll Button */}
                                    {shouldShowScrollButtons() && (
                                        <button
                                            onClick={scrollLeft}
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-400 bg-opacity-70 text-white rounded p-3 hover:bg-opacity-100 focus:outline-none"
                                        >
                                            &lt;
                                        </button>
                                    )}
                                    <div
                                        ref={scrollRef}
                                        className="mx-6 hide-scrollbar flex items-center overflow-x-auto space-x-2"
                                    >
                                        {product.images.map((image) => (
                                            <img
                                                onClick={() => setSelectedImage(image)}
                                                className="w-12 h-12 object-cover rounded border-2 "
                                                key={image.id}
                                                src={image.image}
                                                alt={product.name}
                                            />
                                        ))}
                                    </div>
                                    {/* Right Scroll Button */}
                                    {shouldShowScrollButtons() && (
                                        <button
                                            onClick={scrollRight}
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 bg-opacity-70 text-white rounded p-3 hover:bg-opacity-100 focus:outline-none"
                                        >
                                            &gt;
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Key point container */}
                        <div className="mt-16">
                            <h1 className="text-2xl md:text-4xl text-gray-800">{product.name}</h1>
                            <p className="text-xl md:text-2xl text-gray-600 mt-2">{product.base_price} $</p>
                            <div className="mt-6 p-4 ">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Key Features:</h3>
                                <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">
                                    {Object.entries(product.key_features).map(([key, value], index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="font-semibold capitalize text-gray-900 mr-2">{key}:</span>
                                            <span className="flex-1">{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="product_description_container">
                        <div className="my-6 bg-gray-50 p-4 rounded-lg shadow-none">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Description:</h3>
                            <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">
                                {Object.entries(product.description).map(([key, value], index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="font-semibold capitalize text-gray-900 mr-2">{key}:</span>
                                        <span className="flex-1">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
