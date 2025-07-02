import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, Info, MessageSquare, FileText } from 'lucide-react';
import Button from '../../components/ui/Button.tsx';
import { useCart } from '../../hooks/useCart.ts';
import ProductReviews from '../../components/shop/ProductReviews.tsx';
import { SKUType, ProductType, VariantType, VariantValueType, KeyValuePair } from '../../types/index.ts';
import productService from '../../services/productService.ts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchContextData } from '../../store/slices/contextSlice';

// Dummy review data
const dummyReviews = [
  {
    id: 1,
    user: 'John Doe',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and it exceeded my expectations.',
    date: '2024-03-15'
  },
  {
    id: 2,
    user: 'Jane Smith',
    rating: 4,
    comment: 'Very good product. The only reason I\'m not giving 5 stars is because of the slightly delayed shipping.',
    date: '2024-03-10'
  },
  {
    id: 3,
    user: 'Mike Johnson',
    rating: 5,
    comment: 'Perfect! Exactly what I was looking for.',
    date: '2024-03-05'
  },
  {
    id: 4,
    user: 'Sarah Williams',
    rating: 4,
    date: '2024-03-01'
  },
  {
    id: 5,
    user: 'David Brown',
    rating: 5,
    comment: 'Amazing quality and great value for money. Highly recommended!',
    date: '2024-02-28'
  }
];

// Define an interface for the actual SKU variant_dict structure from API
interface ActualSKU extends Omit<SKUType, 'variants_dict'> {
  variants_dict: Record<string, string | number>;
}

// Define a modified product type that uses the actual SKU structure
interface ActualProductType extends Omit<ProductType, 'skus'> {
  skus: ActualSKU[];
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ActualProductType | null>(null);
  const [selectedSku, setSelectedSku] = useState<ActualSKU | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'info' | 'reviews'>('details');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get context data from Redux store
  const dispatch = useDispatch();
  const contextData = useSelector((state: RootState) => state.context.contextData);

  useEffect(() => {
    // Fetch context data if not available
    if (!contextData) {
      dispatch(fetchContextData() as any);
    }
  }, [contextData, dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const n_id = Number(id);

        const response = await productService.getProductById(n_id);

        if (response) {
          // Cast the response to our actual product type with correct SKU structure
          setSelectedProduct(response as unknown as ActualProductType);
          // Reset selected variants when product changes
          setSelectedVariants({});
          setSelectedSku(null);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while fetching the product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  // Handle variant selection
  const handleVariantChange = (variantTypeId: string, valueId: string) => {
    const newSelectedVariants = { ...selectedVariants, [variantTypeId]: valueId };
    setSelectedVariants(newSelectedVariants);
    
    // Find matching SKU based on selected variants
    if (selectedProduct?.skus && selectedProduct.has_variants) {
      findMatchingSku(newSelectedVariants);
    }
  };
  
  // Find SKU that matches the selected variants
  const findMatchingSku = (variants: Record<string, string>) => {
    if (!selectedProduct?.skus || selectedProduct.skus.length === 0) {
      setSelectedSku(null);
      return;
    }
    
    // Get all variant type IDs that have been selected
    const selectedVariantTypeIds = Object.keys(variants);
    
    // Find a SKU that matches all selected variants
    const matchingSku = selectedProduct.skus.find(sku => {
      // Skip SKUs without variants_dict
      if (!sku.variants_dict) return false;
      
      // Check if all selected variants match this SKU
      for (const [typeId, valueId] of Object.entries(variants)) {
        // If this variant type exists in the SKU but doesn't match the selected value
        if (sku.variants_dict[typeId]?.toString() !== valueId) {
          return false;
        }
      }
      
      // If we need all variant types to be selected (complete match)
      // Check if the number of variant types in the SKU matches the number of selected types
      const skuVariantTypeIds = Object.keys(sku.variants_dict);
      return skuVariantTypeIds.length === selectedVariantTypeIds.length;
    });
    
    setSelectedSku(matchingSku || null);
  };
  
  // Get unique variant types and values for this product
  const getVariantOptions = () => {
    if (!selectedProduct?.skus || selectedProduct.skus.length === 0 || !selectedProduct.has_variants) {
      return {};
    }
    
    // Collect all variant types and their possible values from all SKUs
    const variantOptions: Record<string, Set<string>> = {};
    
    selectedProduct.skus.forEach(sku => {
      if (sku.variants_dict) {
        Object.entries(sku.variants_dict).forEach(([typeId, valueId]) => {
          if (!variantOptions[typeId]) {
            variantOptions[typeId] = new Set();
          }
          variantOptions[typeId].add(valueId.toString());
        });
      }
    });
    
    // Convert Sets to arrays
    const result: Record<string, string[]> = {};
    Object.entries(variantOptions).forEach(([typeId, valueSet]) => {
      result[typeId] = Array.from(valueSet);
    });
    
    return result;
  };
  
  // Get variant type object from context data
  const getVariantType = (variantTypeId: string): VariantType | undefined => {
    if (!contextData?.variants) return undefined;
    return contextData.variants.find(v => v.id.toString() === variantTypeId);
  };
  
  // Get variant value object from context data
  const getVariantValue = (variantTypeId: string, valueId: string): VariantValueType | undefined => {
    const variantType = getVariantType(variantTypeId);
    if (!variantType) return undefined;
    
    return variantType.values.find(v => v.id.toString() === valueId);
  };
  
  // Get variant type name from context data
  const getVariantTypeName = (variantTypeId: string): string => {
    const variantType = getVariantType(variantTypeId);
    return variantType ? variantType.name : variantTypeId;
  };
  
  // Get variant value name from context data
  const getVariantValueName = (variantTypeId: string, valueId: string): string => {
    const variantValue = getVariantValue(variantTypeId, valueId);
    return variantValue ? variantValue.value : valueId;
  };
  
  if (loading || !selectedProduct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // If product has variants, require a SKU selection
    if (selectedProduct.has_variants && !selectedSku) {
      // Show error or alert that user needs to select all variants
      alert("Please select all product options");
      return;
    }
    
    // Create a formatted variants object with human-readable names
    const formattedVariants: Record<string, string> = {};
    if (selectedProduct.has_variants && selectedSku && selectedSku.variants_dict) {
      Object.entries(selectedSku.variants_dict).forEach(([typeId, valueId]) => {
        const typeName = getVariantTypeName(typeId);
        const valueName = getVariantValueName(typeId, valueId.toString());
        formattedVariants[typeName] = valueName;
      });
    }
    
    // Use the selected SKU price and stock if available, otherwise use product price
    const productToAdd = {
      ...selectedProduct,
      price: selectedSku 
        ? parseFloat(selectedSku.discount_price || selectedSku.price) 
        : parseFloat(selectedProduct.discount_price || selectedProduct.base_price),
      sku: selectedSku ? selectedSku.sku_code : null,
      selectedVariants: formattedVariants, // Use formatted variants with human-readable names
      image: selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images[0].image 
        : selectedProduct.thumbnail
    };
    
    addItem(productToAdd, quantity);
  };
  
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };
  
  // Get current price based on selection
  const currentPrice = selectedSku 
    ? parseFloat(selectedSku.discount_price || selectedSku.price) 
    : parseFloat(selectedProduct.discount_price || selectedProduct.base_price);
  
  // Get original price for comparison
  const originalPrice = selectedSku 
    ? (selectedSku.discount_price ? parseFloat(selectedSku.price) : null)
    : (selectedProduct.discount_price ? parseFloat(selectedProduct.base_price) : null);
  
  // Check if product or selected SKU is in stock
  const inStock = selectedProduct.has_variants
    ? (selectedSku ? selectedSku.stock_quantity > 0 : false) 
    : selectedProduct.stock_quantity > 0;
  
  // Get current stock quantity
  const currentStock = selectedSku 
    ? selectedSku.stock_quantity 
    : selectedProduct.stock_quantity;
  
  // Get variant options
  const variantOptions = getVariantOptions();
  
  return (
    <div>
      <Link 
        to="/products" 
        className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>
      
      <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800">
        <div className="grid md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <img
                src={selectedProduct.images && selectedProduct.images.length > 0 
                  ? selectedProduct.images[0].image 
                  : selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="h-full w-full object-contain p-4"
              />
            </div>
            
            {/* Additional images */}
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {selectedProduct.images.map((img, index) => (
                  <div key={img.id} className="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-transparent bg-gray-100 dark:bg-gray-800 hover:border-primary-500">
                    <img
                      src={img.image}
                      alt={`${selectedProduct.name} - Image ${index + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-6 lg:col-span-2">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {selectedProduct.name}
            </h1>
            
            {/* Tags */}
            {selectedProduct.tags && selectedProduct.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedProduct.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(currentPrice)}
                </p>
                
                {originalPrice && originalPrice > currentPrice && (
                  <p className="ml-2 text-lg text-gray-500 line-through dark:text-gray-400">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>
              
              {/* Stock status */}
              <p className={`mt-1 text-sm ${inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {selectedProduct.has_variants 
                  ? (selectedSku 
                      ? (inStock ? `In Stock (${currentStock})` : 'Out of Stock') 
                      : 'Select options to check availability')
                  : (inStock ? `In Stock (${currentStock})` : 'Out of Stock')}
              </p>
            </div>
            
            {/* Short description */}
            {selectedProduct.short_description && (
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {selectedProduct.short_description}
              </p>
            )}
            
            {/* Key Features */}
            {selectedProduct.key_features && selectedProduct.key_features.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold">Key Features</h3>
                <ul className="list-inside list-disc space-y-2">
                  {selectedProduct.key_features.map((feature, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">{feature.key}: {feature.value}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Selected Variants Summary - only show when there's an issue with selection */}
            {selectedProduct.has_variants && Object.keys(selectedVariants).length > 0 && 
              // Only show when either no matching SKU found or selected SKU is out of stock
              (!selectedSku || (selectedSku && selectedSku.stock_quantity <= 0)) && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2">
                  {!selectedSku ? 'No matching option available:' : 'Selected option is out of stock:'}
                </h4>
                <div className="space-y-1">
                  {Object.entries(selectedVariants).map(([typeId, valueId]) => (
                    <div key={typeId} className="flex text-sm">
                      <span className="font-medium mr-2">{getVariantTypeName(typeId)}:</span>
                      <span className="text-gray-600 dark:text-gray-400">{getVariantValueName(typeId, valueId)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {!selectedSku 
                    ? 'This combination is not available.' 
                    : 'This combination is currently out of stock.'}
                </p>
              </div>
            )}
            
            {/* Variants - only show if product has variants */}
            {selectedProduct.has_variants && Object.keys(variantOptions).length > 0 && (
              <div className="mb-6 space-y-4">
                {Object.entries(variantOptions).map(([variantTypeId, valueIds]) => {
                  // Get the variant type from context data
                  const variantType = getVariantType(variantTypeId);
                  
                  return (
                    <div key={variantTypeId}>
                      <p className="mb-2 font-medium">{getVariantTypeName(variantTypeId)}</p>
                      <div className="flex flex-wrap gap-2">
                        {valueIds.map((valueId) => {
                          // Get the variant value from context data
                          const variantValue = getVariantValue(variantTypeId, valueId);
                          
                          return (
                            <button
                              key={`${variantTypeId}-${valueId}`}
                              onClick={() => handleVariantChange(variantTypeId, valueId)}
                              className={`rounded-md border px-3 py-1 text-sm ${
                                selectedVariants[variantTypeId] === valueId
                                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300'
                                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                              }`}
                            >
                              {variantValue ? variantValue.value : valueId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <p className="mb-2 font-medium">Quantity</p>
              <div className="flex w-32 items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center border-r hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-10 w-12 border-none text-center focus:outline-none dark:bg-gray-800"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center border-l hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                disabled={selectedProduct.has_variants ? (!selectedSku || !inStock) : !inStock}
              >
                <ShoppingCart size={16} className="mr-2" />
                {selectedProduct.has_variants 
                  ? (selectedSku 
                      ? (inStock ? 'Add to Cart' : 'Out of Stock') 
                      : 'Select Options')
                  : (inStock ? 'Add to Cart' : 'Out of Stock')}
              </Button>
              <Button variant="outline" aria-label="Add to wishlist">
                <Heart size={16} />
              </Button>
              <Button variant="outline" aria-label="Share product">
                <Share2 size={16} />
              </Button>
            </div>
            
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="mt-8 overflow-hidden rounded-lg bg-white dark:bg-gray-800">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center border-b-2 py-4 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <FileText size={16} className="mr-2" />
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center border-b-2 py-4 text-sm font-medium ${
                  activeTab === 'info'
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Info size={16} className="mr-2" />
                Additional Info
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center border-b-2 py-4 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <MessageSquare size={16} className="mr-2" />
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Product Details Tab */}
            {activeTab === 'details' && (
              <div>
                {selectedProduct.description && selectedProduct.description.length > 0 ? (
                  <div className="prose max-w-none space-y-6 dark:prose-invert">
                    {selectedProduct.description.map((part, index) => (
                      <div key={index} className=" pb-4 last:border-b-0 dark:border-gray-700">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {part.key}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {part.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No detailed description available.</p>
                )}

                {/* Reviews Section in Product Details Tab */}
                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
                  <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
                  <ProductReviews
                    reviews={dummyReviews}
                    averageRating={selectedProduct.average_rating}
                    totalReviews={selectedProduct.rating_count}
                  />
                </div>
              </div>
            )}

            {/* Additional Info Tab */}
            {activeTab === 'info' && (
              <div>
                {selectedProduct.additional_info && selectedProduct.additional_info.length > 0 ? (
                  <div className="prose max-w-none space-y-6 dark:prose-invert">
                    {selectedProduct.additional_info.map((part, index) => (
                      <div key={index} className=" pb-4 last:border-b-0 dark:border-gray-700">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {part.key}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {part.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No additional information available.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <ProductReviews
                  reviews={dummyReviews}
                  averageRating={selectedProduct.average_rating}
                  totalReviews={selectedProduct.rating_count}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;