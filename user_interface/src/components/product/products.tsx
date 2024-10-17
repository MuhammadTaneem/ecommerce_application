import {useAppDispatch} from "../../core/store.ts";
import {ProductListType} from "../../features/product_type.ts";
import {useEffect, useState} from "react";
import axiosInstance from "../../utilites/api.ts";
import {addProduct} from "../../features/productSlice.ts";
import {useLocation} from "react-router-dom";
import {ShoppingCartIcon} from "@heroicons/react/24/solid";

export default function ProductListComponent() {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const [products, setProducts] = useState<ProductListType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchCategory, setSearchCategory] = useState<string>(get_params());

    useEffect(() => {
        // get_params();
        setSearchCategory(get_params())
    }, [location.hash]);

    function get_params() {
        // setSearchCategory(location.hash.replace(/^#/, ''));
        return (location.hash.replace(/^#/, ''));
    }

    useEffect(() => {
        fetchData();
    }, [searchCategory]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const queryUrl = searchCategory ? `${searchCategory}/` : '';
            const response = await axiosInstance.get(`/products/products/${queryUrl}`);

            setProducts(response.data);
            dispatch(addProduct(response.data));

            console.log(response.data); // Consider removing this in production
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : products.length > 0 ? (
                <div className="product-list pt-5 grid grid-cols-4 text-blue-600">
                    {products.map((product: ProductListType, index: number) => (
                        <div key={index}
                             className="product-card max-w-sm bg-white shadow-lg rounded-lg overflow-hidden m-3">

                            {product.image ? (
                                <img className="w-full h-64" src={product.image}
                                     alt={product.name}/>
                            ) : (
                                <img className="w-full h-48 object-cover" src="/src/assets/placeholder.png"
                                     alt={product.name}/>
                            )}


                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>

                                <div className="price-cart-line pt-3 flex justify-between">
                                    <span className="text-gray-600">${product.base_price}</span>

                                    <button
                                        className="mt-1 text-gray-700 rounded-full hover:text-black hover:bg-gray-200 transition duration-300 ease-in-out p-2">
                                        <ShoppingCartIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products available.</p>
            )}
        </>
    );
}
