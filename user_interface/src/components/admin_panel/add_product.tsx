import {useEffect, useState} from "react";
import axiosInstance from "@/utilites/api.ts";
import {addProduct} from "@/features/productSlice.ts";
import {z} from "zod"
import {useAppSelector} from "@/core/store.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {login, logout} from "@/features/authSlice.ts";
import {PhotoIcon} from "@heroicons/react/16/solid";
import {CategoryType} from "@/features/categories_type.ts";
import {BrandType} from "@/features/product_type.ts";


export default function AdminAddProductComponent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [contextData, setContextData] = useState<any>({});
    const token = useAppSelector(state => (state.auth.token));

    useEffect(() => {
        get_context();
    }, []);


    const get_context = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`admin/products/context/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setContextData(response.data);
            console.log(response.data); // Consider removing this in production
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const productSchema = z.object({
        name: z.string().min(1, "Name is required"),
        base_price: z.number().positive("Base price must be a positive number"),
        short_description: z.string().optional(),
        discount_price: z.number().optional(),
        stock_quantity: z.number().nullable().optional(),
        category: z.number().int("Category must be a valid number"),
        has_variants: z.boolean(),
        brand: z.string().optional(),
        tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
        key_features: z.array(
            z.object({
                key: z.string().min(1, "Key is required"),
                value: z.string().min(1, "Value is required"),
            })
        ).optional(),
        description: z.record(z.string(), z.string()).optional(),
        additional_info: z.record(z.string(), z.string()).optional(),
        skus: z.array(
            z.object({
                sku_code: z.string().min(1, "SKU code is required"),
                price: z.number().positive("Price must be positive"),
                stock_quantity: z.number().nullable(),
                variants_dict: z.record(z.string(), z.string()),
            })
        ).optional(),
    });

    type productFormFields = z.infer<typeof productSchema>;
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<productFormFields>({
        defaultValues: {
            base_price: 0,
            has_variants: false,
        },
        resolver: zodResolver(productSchema),
    });




    const onSubmitProduct: SubmitHandler<productFormFields> = async (data) => {
        console.log("submityting something")
        setTimeout(() => {
            console.log("3 seconds have passed");
        }, 3000);
        console.log(data)
        // try {
        //     const response = await axiosInstance.post('/auth/login/', {
        //         'email': data.email,
        //         'password': data.password,
        //     });
        //     if (response.status === 200) {
        //         const token = response.data
        //         console.log(token);
        //         dispatch(login(token));
        //     }
        //
        // } catch (error) {
        //     dispatch(logout());
        //
        //     setError("root", {
        //         message: error?.message,
        //     });
        //     console.log(error?.message);
        //     console.log(error?.status);
        // }
    };


    return (
        <>
            {loading ? (<p>Loading</p>) : (
                <div className='p-2'>
                    product add hobe ekhane

                    {/*<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>*/}
                    {/*<form className="mt-8 space-y-6">*/}
                    {/*    /!* Email Field *!/*/}
                    {/*    <div className="space-y-1 ">*/}
                    {/*        <input*/}
                    {/*            {...register("name")}*/}
                    {/*            type="text"*/}
                    {/*            placeholder="name"*/}
                    {/*            className="input_field"*/}
                    {/*        />*/}

                    {/*        {errors.name && (*/}
                    {/*            <div className="text-red-500 text-sm">{errors.name.message}</div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</form>*/}


                    <div className="image_upload grid grid-cols-4 auto-rows-max gap-4">
                        <div className=" col-span-1">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium">
                                Main photo
                            </label>
                            <div
                                className="mt-2 flex justify-center rounded-lg border border-dashed  px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                                    <div className="mt-4 flex text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-span-3">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium">
                                Optional photos
                            </label>
                            <div
                                className="mt-2 flex justify-center rounded-lg border border-dashed  px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                                    <div className="mt-4 flex text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <form  className="my-8  grid grid-cols-5 auto-rows-min gap-4" onSubmit={handleSubmit(onSubmitProduct)}>


                        <div className="col-span-2">
                            <label className="input_label">Product Name </label>
                            <input
                                {...register("name")}
                                type="text"
                                id="product_name"
                                placeholder="Product Name"
                                className="input_field"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
                        </div>

                        {/* Base Price Field */}
                        <div className=" ">
                            <label className="input_label">Price </label>
                            <input
                                {...register("base_price",{valueAsNumber:true})}
                                type="number"
                                placeholder="Base Price"
                                className="input_field"
                            />
                            {errors.base_price && (
                                <div className="text-red-500 text-sm">{errors.base_price.message}</div>
                            )}
                        </div>

                        {/* Discount Price Field */}
                        <div className="space-y-1">
                            <label className="input_label">Discount Price </label>
                            <input
                                {...register("discount_price",{valueAsNumber:true})}
                                type="number"
                                placeholder="Discount Price"
                                className="input_field"
                            />
                            {errors.discount_price && (
                                <div className="text-red-500 text-sm">{errors.discount_price.message}</div>
                            )}
                        </div>

                        {/* Stock Quantity Field */}
                        <div className="">
                            <label className="input_label">Stock Quantity </label>
                            <input
                                {...register("stock_quantity",{valueAsNumber:true})}
                                type="number"
                                placeholder="Stock Quantity"
                                className="input_field"
                            />
                            {errors.stock_quantity && (
                                <div className="text-red-500 text-sm">{errors.stock_quantity.message}</div>
                            )}
                        </div>


                        {/* Short Description Field */}
                        <div className="">
                            <label className="input_label">Short Description </label>
                            <textarea
                                {...register("short_description")}
                                placeholder="Short Description"
                                className="input_field "
                            />
                            {errors.short_description && (
                                <div className="text-red-500 text-sm">{errors.short_description.message}</div>
                            )}
                        </div>


                        {/* Category Field */}

                        <div className="col-span-2">
                            <label htmlFor="category" className="block text-sm font-medium">
                                Select Category
                            </label>
                            <select
                                {...register('category',{valueAsNumber:true})}
                                id="category"
                                className="select_field"
                            >
                                <option value="">Select a category</option>
                                {contextData['categories']?.map((category:CategoryType) => (
                                    <option key={category.id} value={category.id}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category &&
                                <div className="text-red-500 text-sm">{errors.category.message}</div>}
                        </div>
                        {/* Brand Field */}

                        <div className="col-span-2">
                            <label htmlFor="brand" className="block text-sm font-medium">
                                Select Brand
                            </label>
                            <select
                                {...register('brand',{valueAsNumber:true})}
                                id="brand"
                                className="select_field"
                            >
                                <option value="" disabled >Select a brand</option>
                                {contextData['brands']?.map((brand:BrandType) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand &&
                                <div className="text-red-500 text-sm">{errors.brand.message}</div>}
                        </div>


                        {/* Has Variants Checkbox */}
                        <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("has_variants")}
                                    className="sr-only peer"
                                />
                                <div
                                    className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                                <div
                                    className="w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform absolute top-0.5 left-0.5"></div>
                            </label>
                            <span className="text-gray-700">Has Variants</span>
                        </div>

                        {/* Key Features */}
                        {/*<h3>Key Features</h3>*/}
                        {/*{keyFeatureFields.map((field, index) => (*/}
                        {/*    <div key={field.id} className="flex space-x-2">*/}
                        {/*        <input*/}
                        {/*            {...register(`key_features.${index}.key`)}*/}
                        {/*            type="text"*/}
                        {/*            placeholder="Key"*/}
                        {/*            className="input_field"*/}
                        {/*        />*/}
                        {/*        <input*/}
                        {/*            {...register(`key_features.${index}.value`)}*/}
                        {/*            type="text"*/}
                        {/*            placeholder="Value"*/}
                        {/*            className="input_field"*/}
                        {/*        />*/}
                        {/*        <button*/}
                        {/*            type="button"*/}
                        {/*            onClick={() => removeKeyFeature(index)}*/}
                        {/*            className="bg-red-500 text-white px-2"*/}
                        {/*        >*/}
                        {/*            Remove*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() => addKeyFeature({key: "", value: ""})}*/}
                        {/*    className="bg-blue-500 text-white px-4"*/}
                        {/*>*/}
                        {/*    Add Key Feature*/}
                        {/*</button>*/}

                        {/* SKUs */}
                        {/*<h3>SKUs</h3>*/}
                        {/*{skuFields.map((field, index) => (*/}
                        {/*    <div key={field.id} className="flex space-x-2">*/}
                        {/*        <input*/}
                        {/*            {...register(`skus.${index}.sku_code`)}*/}
                        {/*            type="text"*/}
                        {/*            placeholder="SKU Code"*/}
                        {/*            className="input_field"*/}
                        {/*        />*/}
                        {/*        <input*/}
                        {/*            {...register(`skus.${index}.price`)}*/}
                        {/*            type="number"*/}
                        {/*            placeholder="Price"*/}
                        {/*            className="input_field"*/}
                        {/*        />*/}
                        {/*        <input*/}
                        {/*            {...register(`skus.${index}.stock_quantity`)}*/}
                        {/*            type="number"*/}
                        {/*            placeholder="Stock Quantity"*/}
                        {/*            className="input_field"*/}
                        {/*        />*/}
                        {/*        <button*/}
                        {/*            type="button"*/}
                        {/*            onClick={() => removeSku(index)}*/}
                        {/*            className="bg-red-500 text-white px-2"*/}
                        {/*        >*/}
                        {/*            Remove*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={() =>*/}
                        {/*        addSku({sku_code: "", price: 0, stock_quantity: null})*/}
                        {/*    }*/}
                        {/*    className="bg-blue-500 text-white px-4"*/}
                        {/*>*/}
                        {/*    Add SKU*/}
                        {/*</button>*/}

                        {/* Submit Button */}
                        <div>
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                }`}
                            >
                                {isSubmitting ? "Loading..." : "Submit"}
                            </button>
                        </div>

                        {/* Root Error */}
                        {errors.root && (
                            <div className="text-red-500 text-sm mt-2">{errors.root.message}</div>
                        )}
                    </form>

                </div>)}
        </>


    );

}


// popuip code
//
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         // <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//         // <button
//             className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//             onClick={handleSubmit}
//         >
//             &times;
//         </button>
//         <p>pop up windows is here</p>
//         <button
//             onClick={handleSubmit}
//         >
//             submit product
//
//         </button>
//     </div>
// </div>
