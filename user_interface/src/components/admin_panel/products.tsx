import {useAppDispatch} from "@/core/store.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../utilites/api.ts";
import {addProduct} from "@/features/productSlice.ts";
import {AdminProductListType} from "@/features/product_type.ts";
import {Button} from "@/components/ui/button.tsx";
import {EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/solid'


export default function AdminProductComponent() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState<AdminProductListType[]>([]);
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
            const response = await axiosInstance.get(`/admin/products/${queryUrl}`);

            setProducts(response.data);
            dispatch(addProduct(response.data));

            console.log(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleAddProductClick = () => {
        navigate("/admin/products/add");
    };


    return (
        <>


            <div className="container min-w-full">
                {loading ? (
                    <p>Loading...</p>
                ) : products.length > 0 ? (


                    <div className="pt-5   text-blue-600 ">

                        <div className="flex justify-end">
                            <Button onClick={handleAddProductClick} >+ Add Product</Button>
                        </div>

                        <table className="bg-white border border-gray-200  w-full">
                            <thead className="">
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name&avator</th>
                                <th className="py-3 px-6 text-left">Base Price</th>
                                <th className="py-3 px-6 text-left">has variants</th>
                                <th className="py-3 px-6 text-left">stock quantity</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light ">


                            {products.map((product: AdminProductListType, index: number) => (

                                <tr
                                    key={product.id}
                                    className={`border-b border-gray-200 hover:bg-gray-100 ${
                                        index % 2 === 0 ? 'bg-gray-50' : ''
                                    }`}
                                >
                                    <td className="py-3 px-6">{product.name}</td>
                                    {/*<td className="py-3 px-6">{product.id}</td>*/}
                                    <td className="py-3 px-6">{product.base_price}</td>
                                    <td className="py-3 px-6">{product.has_variants ? 'yes' : 'no'}</td>
                                    <td className="py-3 px-6">{product.stock_quantity}</td>
                                    <td className="py-3 px-6">

                                        <Button variant="icon_button" size="icon">
                                            <EyeIcon className="size-6 text-blue-500"/>
                                        </Button>

                                        <Button variant="icon_button" size="icon">
                                            <PencilIcon className="text-amber-400"/>
                                        </Button>
                                        <Button variant="icon_button" size="icon" color='#EF5F5F'>
                                            <TrashIcon className="text-rose-400"/>
                                        </Button>


                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </table>

                    </div>
                ) : (<p>No products available.</p>)
                }
            </div>



        </>
    )
}