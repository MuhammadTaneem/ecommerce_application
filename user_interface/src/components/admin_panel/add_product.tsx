import {useEffect, useState} from "react";
import axiosInstance from "@/utilites/api.ts";
import {addProduct} from "@/features/productSlice.ts";
import {z} from "zod"
import {useAppSelector} from "@/core/store.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {login, logout} from "@/features/authSlice.ts";

export default function AdminAddProductComponent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [contextData, setContextData] = useState<any>({});
    const token = useAppSelector(state=> (state.auth.token));
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
        key_features: z.array(
            z.object({
                key: z.string().min(1, "Key is required"),
                value: z.string().min(1, "Value is required"),
            })
        ),
        description: z.record(z.string(), z.string()).optional(),
        additional_info: z.record(z.string(), z.string()).optional(),
        skus: z.array(
            z.object({
                sku_code: z.string().min(1, "SKU code is required"),
                price: z.number().positive("Price must be positive"),
                stock_quantity: z.number().nullable(),
                variants_dict: z.record(z.string(), z.string()),
            })
        ),
    });

    type productFormFields = z.infer<typeof productSchema>;
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<productFormFields>({
        // defaultValues: {
        //     email: "test@email.com",
        // },
        resolver: zodResolver(productSchema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await axiosInstance.post('/auth/login/', {
                'email': data.email,
                'password': data.password,
            });
            if(response.status === 200) {
                const token = response.data
                console.log(token);
                dispatch(login(token));
            }

        }  catch (error) {
            dispatch(logout());

            setError("root", {
                message:error?.message,
            });
            console.log(error?.message);
            console.log(error?.status);
        }
    };




    return (
        <>
            {loading?(<p>Loading</p>):(
                <div>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Product Name"
                                className="input_field"
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
                        </div>

                        {/* Base Price Field */}
                        <div className="space-y-1">
                            <input
                                {...register("base_price")}
                                type="number"
                                placeholder="Base Price"
                                className="input_field"
                            />
                            {errors.base_price && (
                                <div className="text-red-500 text-sm">{errors.base_price.message}</div>
                            )}
                        </div>

                        {/* Short Description Field */}
                        <div className="space-y-1">
        <textarea
            {...register("short_description")}
            placeholder="Short Description"
            className="input_field"
        />
                            {errors.short_description && (
                                <div className="text-red-500 text-sm">{errors.short_description.message}</div>
                            )}
                        </div>

                        {/* Discount Price Field */}
                        <div className="space-y-1">
                            <input
                                {...register("discount_price")}
                                type="number"
                                placeholder="Discount Price"
                                className="input_field"
                            />
                            {errors.discount_price && (
                                <div className="text-red-500 text-sm">{errors.discount_price.message}</div>
                            )}
                        </div>

                        {/* Stock Quantity Field */}
                        <div className="space-y-1">
                            <input
                                {...register("stock_quantity")}
                                type="number"
                                placeholder="Stock Quantity"
                                className="input_field"
                            />
                            {errors.stock_quantity && (
                                <div className="text-red-500 text-sm">{errors.stock_quantity.message}</div>
                            )}
                        </div>

                        {/* Category Field */}
                        <div className="space-y-1">
                            <input
                                {...register("category")}
                                type="number"
                                placeholder="Category ID"
                                className="input_field"
                            />
                            {errors.category && (
                                <div className="text-red-500 text-sm">{errors.category.message}</div>
                            )}
                        </div>

                        {/* Has Variants Checkbox */}
                        <div className="space-y-1">
                            <label>
                                <input type="checkbox" {...register("has_variants")} /> Has Variants
                            </label>
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

                        <button type="submit" className="bg-green-500 text-white px-6 py-2">
                            Submit
                        </button>
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
