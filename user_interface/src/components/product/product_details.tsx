import { ProductType} from "../../features/product_type.ts";
import axiosInstance from "../../utilites/api.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function ProductDetailsComponent(){

    // const product: ProductType;
    const [product, setProduct] = useState<ProductType>();
    const [loading, setLoading] = useState<boolean>(false);
    const { id } = useParams();

    useEffect(() => {
        fetchData();
    }, );

    const fetchData = async () => {


        setLoading(true);
        try {
            const response = await axiosInstance.get(`/products/product/${id}`);

            setProduct(response.data);
            // dispatch(addProduct(response.data));

            console.log(response.data); // Consider removing this in production
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };
    return(
        <>
            {product&& (<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4">
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="flex justify-between px-6 py-4">
                    <div>
                        <span className="text-lg font-bold">Base Price:</span>
                        <span className="text-gray-600">{product.base_price}</span>
                    </div>
                    <div>
                        <span className="text-lg font-bold">Stock Quantity:</span>
                        <span className="text-gray-600">{product.stock_quantity}</span>
                    </div>
                </div>
                <div className="px-6 py-4">
                    <h3 className="text-lg font-bold">Images:</h3>
                    <ul className="flex flex-wrap justify-center">
                        {product.images.map((image) => (
                            <li key={image.id} className="mr-4 mb-4">
                                <img src={image.image} alt={image.image} className="w-24 h-24 rounded"/>
                            </li>
                        ))}
                    </ul>
                </div>
                {product.has_variants && (
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-bold">Variants:</h3>
                        <ul className="flex flex-wrap justify-center">
                            {product.skus.map((sku) => (
                                <li key={sku.id} className="mr-4 mb-4">
                                    <div className="bg-white rounded p-4">
                                        <h4 className="text-lg font-bold">{sku.sku_code}</h4>
                                        <p className="text-gray-600">Price: {sku.price}</p>
                                        <p className="text-gray-600">Stock Quantity: {sku.stock_quantity}</p>
                                        <ul className="flex flex-wrap justify-center">
                                            {Object.keys(sku.variants_dict).map((key) => (
                                                <li key={key} className="mr-2 mb-2">
                                                    <span className="text-gray-600">{key}:</span>
                                                    <span className="text-gray-600">{sku.variants_dict[key]}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>)}
            );
        </>
    );
};