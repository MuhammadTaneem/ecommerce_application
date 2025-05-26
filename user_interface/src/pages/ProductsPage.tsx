import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { filterProductsByCategory } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProductsPage = () => {
  const { category } = useParams<{ category?: string }>();
  const { filteredProducts, loading } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sorting, setSorting] = useState<string>('featured');

  // Filter products by category
  useEffect(() => {
    if (category) {
      dispatch(filterProductsByCategory(category));
    } else {
      dispatch(filterProductsByCategory('all'));
    }
  }, [category, dispatch]);

  // Get category name for display
  const getCategoryName = (): string => {
    if (!category) return 'All Products';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sorting) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Filter products by price
  const filteredByPrice = sortedProducts.filter(
    product => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{getCategoryName()}</h1>
        
        <div className="mt-4 flex items-center space-x-2 sm:mt-0">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Price Range (${priceRange[0]} - ${priceRange[1]})
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">Sort By</label>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="input"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">Availability</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm">
                    In Stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="out-of-stock"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="out-of-stock" className="ml-2 text-sm">
                    Out of Stock
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">Rating</label>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                      defaultChecked={rating === 4}
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-2 text-sm">
                      {rating}+ stars
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredByPrice.length === 0 ? (
        <div className="my-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">No products found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredByPrice.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredByPrice.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 sm:flex-row"
            >
              <div className="h-48 w-full sm:h-auto sm:w-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="mb-2 text-xl font-bold">{product.name}</h2>
                <p className="mb-4 flex-1 text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button onClick={() => {}}>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;