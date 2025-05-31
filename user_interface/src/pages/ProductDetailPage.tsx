import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSelectedProduct } from '../store/slices/productSlice';
import { ShoppingCart, Heart, Share2, ArrowLeft, Info, MessageSquare, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { ProductVariant } from '../types';
import sampleProducts from '../data/sampleProducts';
import ProductReviews from '../components/shop/ProductReviews';

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

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, selectedProduct, loading } = useSelector((state: RootState) => state.products);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState<ProductVariant | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'info' | 'reviews'>('details');
  
  useEffect(() => {
    if (id) {
      // Try to find product in Redux store first
      let product = products.find((p) => p.id === Number(id));
      
      // If not found in store, try to find in sample products
      if (!product) {
        product = sampleProducts.find((p) => p.id === Number(id));
      }
      
      if (product) {
        dispatch(setSelectedProduct(product));
        
        // Initialize with first SKU if product has variants
        if (product.has_variants && product.skus && product.skus.length > 0) {
          setSelectedSku(product.skus[0]);
          
          // Initialize selected variants from first SKU
          const initialVariants: Record<string, string> = {};
          Object.entries(product.skus[0].variants_dict || {}).forEach(([key, value]) => {
            initialVariants[key] = value;
          });
          setSelectedVariants(initialVariants);
        }
      } else {
        // If product not found, redirect to products page
        navigate('/products');
      }
    }
    
    return () => {
      dispatch(setSelectedProduct(null));
    };
  }, [id, products, dispatch, navigate]);
  
  // Handle variant selection
  const handleVariantChange = (variantType: string, value: string) => {
    const newSelectedVariants = { ...selectedVariants, [variantType]: value };
    setSelectedVariants(newSelectedVariants);
    
    // Find matching SKU based on selected variants
    if (selectedProduct?.skus) {
      const matchingSku = selectedProduct.skus.find(sku => {
        if (!sku.variants_dict) return false;
        
        // Check if all selected variants match this SKU
        for (const [key, val] of Object.entries(newSelectedVariants)) {
          if (sku.variants_dict[key] !== val) {
            return false;
          }
        }
        return true;
      });
      
      if (matchingSku) {
        setSelectedSku(matchingSku);
      }
    }
  };
  
  // Get unique variant types and values
  const getVariantOptions = () => {
    if (!selectedProduct?.skus || selectedProduct.skus.length === 0) return {};
    
    const variantOptions: Record<string, string[]> = {};
    
    selectedProduct.skus.forEach(sku => {
      if (sku.variants_dict) {
        Object.entries(sku.variants_dict).forEach(([type, value]) => {
          if (!variantOptions[type]) {
            variantOptions[type] = [];
          }
          if (!variantOptions[type].includes(value)) {
            variantOptions[type].push(value);
          }
        });
      }
    });
    
    return variantOptions;
  };
  
  if (loading || !selectedProduct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // If product has variants, use the selected SKU price
    const productToAdd = {
      ...selectedProduct,
      price: selectedSku ? parseFloat(selectedSku.discount_price || selectedSku.price) : parseFloat(selectedProduct.discount_price || selectedProduct.base_price),
      sku: selectedSku ? selectedSku.sku_code : null,
      selectedVariants: selectedVariants,
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
  const inStock = selectedSku 
    ? selectedSku.stock_quantity > 0 
    : selectedProduct.stock_quantity > 0;
  
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
                {inStock ? `In Stock (${selectedSku ? selectedSku.stock_quantity : selectedProduct.stock_quantity})` : 'Out of Stock'}
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
                    <li key={index} className="text-gray-600 dark:text-gray-400">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Variants */}
            {Object.keys(variantOptions).length > 0 && (
              <div className="mb-6 space-y-4">
                {Object.entries(variantOptions).map(([variantType, values]) => (
                  <div key={variantType}>
                    <p className="mb-2 font-medium">{variantType}</p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => (
                        <button
                          key={`${variantType}-${value}`}
                          onClick={() => handleVariantChange(variantType, value)}
                          className={`rounded-md border px-3 py-1 text-sm ${
                            selectedVariants[variantType] === value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
                disabled={!inStock}
              >
                <ShoppingCart size={16} className="mr-2" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" aria-label="Add to wishlist">
                <Heart size={16} />
              </Button>
              <Button variant="outline" aria-label="Share product">
                <Share2 size={16} />
              </Button>
            </div>
            
            {/* Category */}
            {selectedProduct.category && (
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <p className="mb-2 font-medium">Category</p>
                <Link
                  to={`/products/${selectedProduct.category}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Category {selectedProduct.category}
                </Link>
              </div>
            )}
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
                {selectedProduct.description && Object.keys(selectedProduct.description).length > 0 ? (
                  <div className="prose max-w-none dark:prose-invert">
                    {Object.entries(selectedProduct.description).map(([key, value]) => (
                      <div key={key} className="mb-4">
                        <h3 className="text-lg font-medium">{key}</h3>
                        <p>{value}</p>
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
                {selectedProduct.additional_info && Object.keys(selectedProduct.additional_info).length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.entries(selectedProduct.additional_info).map(([key, value]) => (
                          <tr key={key}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium">{key}</td>
                            <td className="px-4 py-2">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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