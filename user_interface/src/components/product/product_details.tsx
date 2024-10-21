import { ProductImageType, ProductType, SkuType, VariantDict } from "../../features/product_type.ts";
import axiosInstance from "../../utilites/api.ts";
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsComponent() {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<ProductImageType | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<VariantDict>({});
    const [matchingSku, setMatchingSku] = useState<SkuType | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
    const scrollRef = useRef<HTMLDivElement | null>(null);

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
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -128, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 128, behavior: "smooth" });
    };

    const shouldShowScrollButtons = useMemo(() => {
        if (scrollRef.current) {
            const scrollWidth = scrollRef.current.scrollWidth;
            const clientWidth = scrollRef.current.clientWidth;
            return scrollWidth > clientWidth;
        }
        return false;
    }, [selectedImage, product]);

    // Get unique variant options for a specific attribute
    const getUniqueOptions = (attribute: string) => {
        if (!product?.skus) return [];
        return [
            ...new Set(
                product.skus
                    .map((sku) => sku.variants_dict[attribute])
                    .filter((value) => value && value.trim() !== "")
            ),
        ];
    };

    // Handle variant change
    const handleVariantChange = (attribute: string, value: string) => {
        const updatedVariants = { ...selectedVariants, [attribute]: value };
        setSelectedVariants(updatedVariants);

        // Check for matching SKU only if all variant attributes have values
        if (Object.keys(updatedVariants).length === Object.keys(product.skus[0]?.variants_dict || {}).length) {
            const sku = product?.skus.find((sku) =>
                Object.entries(updatedVariants).every(
                    ([key, val]) => sku.variants_dict[key] === val
                )
            );

            if (sku) {
                setMatchingSku(sku);
                setErrorMessage(null); // Clear any previous error message
            } else {
                setMatchingSku(null);
                setErrorMessage("Unable to find product with the selected variants."); // Set error message
            }
        } else {
            setMatchingSku(null); // Reset matching SKU if not all variants are selected
            setErrorMessage(null); // Clear error message when variants are not fully selected
        }
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
                                    {shouldShowScrollButtons && (
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
                                    {shouldShowScrollButtons && (
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
                            <p className="text-xl md:text-2xl text-gray-600 mt-2">
                                {matchingSku ? matchingSku.price : product.base_price} $
                            </p>
                            <div className="mt-6 p-4 ">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    Key Features:
                                </h3>
                                <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">
                                    {Object.entries(product.key_features).map(
                                        ([key, value], index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="font-semibold capitalize text-gray-900 mr-2">
                                                    {key}:
                                                </span>
                                                <span className="flex-1">{value}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Variant Selection */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Select Variants:</h3>
                            {product.has_variants &&
                                Object.keys(product.skus[0]?.variants_dict || {}).map(
                                    (attribute) => (
                                        <div key={attribute} className="mr-4 mt-4">
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                {attribute}
                                            </label>
                                            <div className="flex space-x-2">
                                                {getUniqueOptions(attribute).map(
                                                    (value, index) => (
                                                        <button
                                                            key={`${attribute}-${value}-${index}`}
                                                            className={`px-4 py-2 rounded ${
                                                                selectedVariants[attribute] ===
                                                                value
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-200 text-gray-700"
                                                            }`}
                                                            onClick={() =>
                                                                handleVariantChange(
                                                                    attribute,
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            {value}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                            {errorMessage && ( // Show error message if no matching SKU
                                <p className="text-red-500 mt-2">{errorMessage}</p>
                            )}

                            {matchingSku && (
                                <div className="mt-4">
                                    <p>SKU: {matchingSku.sku_code}</p>
                                    <p>Price: {matchingSku.price} $</p>
                                    <p>
                                        Stock:{" "}
                                        {matchingSku.stock_quantity
                                            ? matchingSku.stock_quantity
                                            : "Out of Stock"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="product_description_container">
                        <div className="my-6 bg-gray-50 p-4 rounded-lg shadow-none">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Description:
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">
                                {Object.entries(product.description).map(([key, value], index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="font-semibold capitalize text-gray-900 mr-2">
                                            {key}:
                                        </span>
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
