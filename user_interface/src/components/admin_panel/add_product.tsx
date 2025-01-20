import {useEffect, useState} from "react";
import axiosInstance from "@/utilites/api.ts";
import {z} from "zod"
import {useAppSelector} from "@/core/store.ts";
import {Controller, SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PhotoIcon} from "@heroicons/react/16/solid";
import {BrandType, CategoryType, ProductContextType} from "@/features/product_type.ts";


export default function AdminAddProductComponent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [contextData, setContextData] = useState<ProductContextType>({});
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
        stock_quantity: z.number(),
        category: z.number().int("Category must be a valid number"),
        has_variants: z.boolean(),
        brand: z.number().nullish().optional(),
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
                sku_code: z.string().optional(),
                base_price: z.number().positive("Price must be positive"),
                discount_price: z.number().positive("Price must be positive").optional(),
                stock_quantity: z.number(),
                variants_dict: z.array(z.number()),
            })
        ).optional(),
    });

    type productFormFields = z.infer<typeof productSchema>;
    const {
        control,
        register,
        handleSubmit,
        setError,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<productFormFields>({
        defaultValues: {
            base_price: 0,
            has_variants: false,
            key_features: [],
            brand: null
        },
        resolver: zodResolver(productSchema),
    });


    const {fields: keyFeatureFields, append: addKeyFeature, remove: removeKeyFeature} = useFieldArray({
        control,
        name: "key_features",
    });

  const { fields: skuFields, append: addSku, remove: removeSku } = useFieldArray({
    control,
    name: "skus",
  });


    const onSubmitProduct: SubmitHandler<productFormFields> = async (data) => {
        console.log("submitting something")
        setTimeout(() => {
            console.log("3 seconds have passed");
        }, 3000);
        console.log(data)


        try {
            const response = await axiosInstance.post('admin/products/', {"product": data});
            if (response.status === 200) {
                const token = response.data
                console.log(token);
                // dispatch(login(token));
            }

        } catch (error) {
            // dispatch(logout());

            setError("root", {
                message: error?.message,
            });
            console.log(error?.message);
            console.log(error?.status);
        }
    };

    // cosnt select_varients: Record<number, string>[] = {};


    return (
      <>
        {loading ? (
          <p>Loading</p>
        ) : (
          <div className="p-2">
            product add hobe ekhane

            <div className="image_upload grid grid-cols-4 auto-rows-max gap-4">
              <div className=" col-span-1">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium"
                >
                  Main photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed  px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className=" col-span-3">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium"
                >
                  Optional photos
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed  px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form
              className="my-8  grid grid-cols-5 auto-rows-min gap-4"
              onSubmit={handleSubmit(onSubmitProduct)}
            >
              <div className="col-span-2">
                <label className="input-label">Product Name </label>
                <input
                  {...register("name")}
                  type="text"
                  id="product_name"
                  placeholder="Product Name"
                  className="input-field"
                />
                {errors.name && (
                  <div className="error-message">{errors.name.message}</div>
                )}
              </div>

              {/* Base Price Field */}
              <div className=" ">
                <label className="input-label">Price </label>
                <input
                  {...register("base_price", { valueAsNumber: true })}
                  type="number"
                  placeholder="Base Price"
                  className="input-field"
                />
                {errors.base_price && (
                  <div className="error-message">
                    {errors.base_price.message}
                  </div>
                )}
              </div>

              {/* Discount Price Field */}
              <div className="space-y-1">
                <label className="input-label">Discount Price </label>
                <input
                  {...register("discount_price", { valueAsNumber: true })}
                  type="number"
                  placeholder="Discount Price"
                  className="input-field"
                />
                {errors.discount_price && (
                  <div className="error-message ">
                    {errors.discount_price.message}
                  </div>
                )}
              </div>

              {/* Stock Quantity Field */}
              <div className="">
                <label className="input-label">Stock Quantity </label>
                <input
                  {...register("stock_quantity", { valueAsNumber: true })}
                  type="number"
                  placeholder="Stock Quantity"
                  className="input-field"
                />
                {errors.stock_quantity && (
                  <div className="error-message ">
                    {errors.stock_quantity.message}
                  </div>
                )}
              </div>

              {/* Short Description Field */}
              <div className="">
                <label className="input-label">Short Description </label>
                <textarea
                  {...register("short_description")}
                  placeholder="Short Description"
                  className="input-field "
                />
                {errors.short_description && (
                  <div className="error-message ">
                    {errors.short_description.message}
                  </div>
                )}
              </div>

              {/* Category Field */}

              <div className="col-span-2">
                <label htmlFor="category" className="input-label">
                  Select Category
                </label>
                <select
                  {...register("category", { valueAsNumber: true })}
                  id="category"
                  className="select-field"
                >
                  <option value="">Select a category</option>
                  {contextData["categories"]?.map((category: CategoryType) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="error-message ">
                    {errors.category.message}
                  </div>
                )}
              </div>
              {/* Brand Field */}

              <div className="col-span-2">
                <label htmlFor="brand" className="input-label">
                  Select Brand
                </label>
                <select
                  {...register("brand", { valueAsNumber: true })}
                  id="brand"
                  defaultValue=""
                  className="select-field"
                >
                  <option value="" disabled>
                    Select a brand
                  </option>
                  {contextData["brands"]?.map((brand: BrandType) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brand && (
                  <div className="error-message ">{errors.brand.message}</div>
                )}
              </div>

              {/* Key Features */}

              <div className="col-span-5 space-y-2">
                <h3 className="text-lg font-semibold">
                  Key Features
                  <button
                    type="button"
                    onClick={() => addKeyFeature({ key: "", value: "" })}
                    className="p-2 rounded"
                  >
                    +
                  </button>
                </h3>

                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Key Feature{" "}
                  <button
                    type="button"
                    onClick={() => addKeyFeature({ key: "", value: "" })}
                    className="p-2 rounded flex items-center justify-center relative"
                  >
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative  inline-flex items-center justify-center h-6 w-6 rounded-full bg-sky-500 text-white font-bold">
                        +
                      </span>
                    </span>
                  </button>
                </h3>

                {keyFeatureFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-4">
                    {/* Key Input */}
                    <input
                      {...register(`key_features.${index}.key`)}
                      type="text"
                      placeholder="Key"
                      className="input-field"
                    />
                    {errors.key_features?.[index]?.key && (
                      <p className="error-message">
                        {errors.key_features[index].key?.message}
                      </p>
                    )}

                    {/* Value Input */}
                    <input
                      {...register(`key_features.${index}.value`)}
                      type="text"
                      placeholder="Value"
                      className="input-field"
                    />
                    {errors.key_features?.[index]?.value && (
                      <p className="error-message">
                        {errors.key_features[index].value?.message}
                      </p>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="p-2 rounded text-red-600"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Has Variants Checkbox */}
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("has_variants")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform absolute top-0.5 left-0.5"></div>
                </label>
                <span className="text-gray-700">Has Variants</span>
              </div>


              {/*skus */}

              <div className="col-span-5">
                {skuFields.map((field, index) => (
                    <div key={field.id}>



                      {/* Discount Price Field */}
                      <div className="space-y-1">
                        <label className="input-label">Price </label>
                        <input
                            {...register(`skus.${index}.base_price`, { valueAsNumber: true })}
                            type="number"
                            placeholder=" Price"
                            className="input-field"
                        />
                        {errors.skus?.[index]?.base_price && (
                            <div className="error-message ">
                              {errors.skus?.[index]?.base_price.message}
                            </div>
                        )}
                      </div>


                      {/* Discount Price Field */}
                      <div className="space-y-1">
                        <label className="input-label">Discount Price </label>
                        <input
                            {...register(`skus.${index}.discount_price`, { valueAsNumber: true })}
                            type="number"
                            placeholder="Discount Price"
                            className="input-field"
                        />
                        {errors.skus?.[index]?.discount_price && (
                            <div className="error-message ">
                              {errors.skus?.[index]?.discount_price.message}
                            </div>
                        )}
                      </div>



                      {/* Stock Quantity Field */}

                      <div className="">
                        <label className="input-label">Variant Stock Quantity </label>
                        <input
                            {...register(`skus.${index}.stock_quantity`, { valueAsNumber: true })}
                            type="number"
                            placeholder="Stock Quantity"
                            className="input-field"
                        />
                        {errors.skus?.[index]?.stock_quantity && (
                            <div className="error-message ">
                              {errors.skus?.[index]?.stock_quantity.message}
                            </div>
                        )}
                      </div>


                        {/* select variant Field */}

                        <h4>Variants</h4>


                        {contextData["variants"]?.map((variant, variantIndex) => (


                            <div key={variant.id} style={{ marginBottom: "20px" }}>
                                <label>{variant.name}:</label>
                                <Controller
                                    name={`skus.${index}.variants_dict`}
                                    control={control}
                                    render={({ field }) => (
                                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                            {variant.values.map((value) => {
                                                const selectedValue = field.value?.[variant.id]; // Get selected value for this variant
                                                const isSelected = selectedValue === value.id;
                                                // console.log([variant.id], value.id);

                                                return (
                                                    <button
                                                        key={value.id}
                                                        type="button"
                                                        style={{
                                                            padding: "10px 20px",
                                                            border: "1px solid",
                                                            borderColor: isSelected ? "blue" : "#ccc",
                                                            backgroundColor: isSelected ? "lightblue" : "white",
                                                            color: isSelected ? "black" : "#333",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            console.log(watch())


                                                            // select_varients[variant.id]= value.id;
                                                            // console.log(select_varients);

                                                            // Update the selected value for this variant
                                                            field.onChange({
                                                                ...field.value, // Preserve other selected variants
                                                                [variant.id]: value.id, // Update only this variant
                                                            });
                                                        }}
                                                    >
                                                        {value.value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                                {errors?.skus?.[index]?.variants_dict && (
                                    <p  className="error-message ">{errors.skus[index]?.variants_dict?.message}</p>
                                )}
                            </div>
                        ))}







                        <button type="button" onClick={() => removeSku(index)}>
                        Remove SKU
                      </button>
                    </div>
                ))}
                <button type="button" onClick={() => addSku({
                    sku_code: "fasdfds",
                    base_price: 0,
                    discount_price: 0,
                    stock_quantity: 0,
                    variants_dict: [],
                })}>
                  Add SKU
                </button>
              </div>







              {/* Submit Button */}
              <div className="col-span-5">
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
                <div className="error-message mt-2">{errors.root.message}</div>
              )}
            </form>
          </div>
        )}
      </>
    );

}