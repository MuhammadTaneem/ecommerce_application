import { ProductImageType, ProductType, SkuType, VariantDict } from "../../features/product_type.ts";
import axiosInstance from "../../utilites/api.ts";
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsComponent() {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [productPrice, setProductPrice] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<ProductImageType | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<VariantDict>({});
    const [matchingSku, setMatchingSku] = useState<SkuType | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/products/product/${id}`);
            setProduct(response.data);
            setProductPrice(response.data.base_price);
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
        if (Object.keys(updatedVariants).length === Object.keys(product?.skus[0]?.variants_dict || {}).length) {
            const sku = product?.skus.find((sku) =>
                Object.entries(updatedVariants).every(
                    ([key, val]) => sku.variants_dict[key] === val
                )
            );

            if (sku) {
                setMatchingSku(sku);
                setProductPrice(sku.price ??product?.base_price);
                setErrorMessage(null); // Clear any previous error message
            } else {
                setProductPrice(product?.base_price??0);
                setMatchingSku(null);
                setErrorMessage("Unable to find product with the selected variants."); // Set error message
            }
        } else {
            setMatchingSku(null); // Reset matching SKU if not all variants are selected
            setErrorMessage(null); // Clear error message when variants are not fully selected
        }
    };

    const tabs = ['Description', 'Additional Information', 'Ratting'];



    return (
        <>
            {loading ? (
                    <p>Loading...</p>
                ) :
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
                                        {productPrice} Tk
                                    </p>
                                    {product.short_description && (
                                        <p className="mt-6">{product.short_description}</p>
                                    )}
                                    <div className="mt-6 ">
                                        <ul className="list-disc space-y-2 mt-3 text-base md:text-lg text-gray-700">
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
                                        {/* Variant Selection */}
                                    </div>
                                    <div className="mt-6">
                                        {product.has_variants && (
                                            <div className="space-y-4">
                                                {Object.keys(product.skus[0]?.variants_dict || {}).map((attribute) => (
                                                    <div key={attribute} className="mt-4">
                                                        <label
                                                            className="block font-semibold text-gray-700 mb-2">{attribute}</label>
                                                        <div className="flex space-x-2 flex-wrap">
                                                            {getUniqueOptions(attribute).map((value, index) => (
                                                                <button
                                                                    key={`${attribute}-${value}-${index}`}
                                                                    className={`px-4 py-2 border  rounded transition-all duration-200 focus:outline-none ${
                                                                        selectedVariants[attribute] === value
                                                                            ? "bg-gray-800 text-white border-gray-600"
                                                                            : " border-gray-300 hover:bg-gray-300"
                                                                    }`}
                                                                    onClick={() => handleVariantChange(attribute, value)}
                                                                >
                                                                    {value}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {errorMessage && ( // Show error message if no matching SKU
                                                    <p className="text-red-500 mt-2 font-semibold">{errorMessage}</p>
                                                )}

                                                {/*                {matchingSku && (*/}
                                                {/*                    <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-md">*/}
                                                {/*                        <h4 className="text-lg font-semibold text-gray-800">Selected SKU:</h4>*/}
                                                {/*                        <p className="text-gray-700">SKU: <span*/}
                                                {/*                            className="font-bold">{matchingSku.sku_code}</span></p>*/}
                                                {/*                        <p className="text-gray-700">Price: <span*/}
                                                {/*                            className="font-bold">{matchingSku.price} $</span></p>*/}
                                                {/*                        <p className="text-gray-700">*/}
                                                {/*                            Stock:{" "}*/}
                                                {/*                            <span*/}
                                                {/*                                className={`font-bold ${matchingSku.stock_quantity ? 'text-green-600' : 'text-red-600'}`}>*/}
                                                {/*    {matchingSku.stock_quantity ? matchingSku.stock_quantity : "Out of Stock"}*/}
                                                {/*</span>*/}
                                                {/*                        </p>*/}
                                                {/*                    </div>*/}
                                                {/*                )}*/}
                                            </div>
                                        )}
                                    </div>
                                    <div className="my-12 flex justify-around">

                                        <p>quantity</p>
                                        <button> add to cart</button>

                                    </div>
                                </div>


                            </div>

                            <div className="flex flex-col items-center w-full p-4">
                                {/* Tab headers */}
                                <div className="flex mt-4 border-b-2 border-gray-200">
                                    {tabs.map((tab, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTab(index)}
                                            className={`py-2 px-4 focus:outline-none ${
                                                activeTab === index
                                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab content */}
                                <div className="my-6">
                                    {activeTab === 0 && <div className="product_description_container">
                                        <div className=" rounded-lg shadow-none">
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
                                    </div>}
                                    {activeTab === 1 && <div className="product_description_container">
                                        <div className=" rounded-lg shadow-none">
                                            <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">
                                                {Object.entries(product.additional_info).map(([key, value], index) => (
                                                    <li key={index} className="flex items-start">
                                        <span className="font-semibold capitalize text-gray-900 mr-2">
                                            {key}:
                                        </span>
                                                        <span className="flex-1">{value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>}
                                    {activeTab === 2 && <div>upcoming feature</div>}
                                </div>
                            </div>


                            {/*<div className="product_description_container">*/}
                            {/*    <div className="my-6 bg-gray-50 p-4 rounded-lg shadow-none">*/}
                            {/*        <h3 className="text-lg md:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">*/}
                            {/*            Description:*/}
                            {/*        </h3>*/}
                            {/*        <ul className="list-disc pl-5 space-y-2 mt-3 text-base md:text-lg text-gray-700">*/}
                            {/*            {Object.entries(product.description).map(([key, value], index) => (*/}
                            {/*                <li key={index} className="flex items-start">*/}
                            {/*                    <span className="font-semibold capitalize text-gray-900 mr-2">*/}
                            {/*                        {key}:*/}
                            {/*                    </span>*/}
                            {/*                    <span className="flex-1">{value}</span>*/}
                            {/*                </li>*/}
                            {/*            ))}*/}
                            {/*        </ul>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    )}
                </div>
            }

        </>

    );
}
