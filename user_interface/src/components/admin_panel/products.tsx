import {useAppDispatch} from "../../core/store.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
// import {ProductListType} from "../../features/product_type.ts";
import axiosInstance from "../../utilites/api.ts";
import {addProduct} from "../../features/productSlice.ts";
// import {ShoppingCartIcon} from "@heroicons/react/24/solid";
import {ProductListType} from "../../features/product_type.ts";
import AdminAddProductComponent from "./create_product.tsx";




export default function AdminProductComponent() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    // const navigate = useNavigate();
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
                <p> Producat Page </p>


        </>
    )
}