import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { filterProductsByCategory } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import { Grid, List, SlidersHorizontal, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import sampleProducts from '../data/sampleProducts';
import { sampleBrands } from '../data/sampleBrands';
import { Slider } from '@mui/material';

const ProductsPage = () => {
  const { category } = useParams<{ category?: string }>();
  const { filteredProducts, loading } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use sample products if filteredProducts is empty
  const products = filteredProducts.length > 0 ? filteredProducts : sampleProducts;
  
  // Get search params
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const showDiscountParam = searchParams.get('discount') === 'true';
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sorting, setSorting] = useState<string>(sortParam);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState('10000');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const brandsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter products by category
  useEffect(() => {
    if (category) {
      dispatch(filterProductsByCategory(category));
    } else {
      dispatch(filterProductsByCategory('all'));
    }
  }, [category, dispatch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (sorting !== 'featured') params.set('sort', sorting);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1].toString());
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  }, [sorting, selectedTags, selectedBrands, priceRange, navigate, location.pathname]);

  // Handle click outside for brand dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandsDropdownRef.current && !brandsDropdownRef.current.contains(event.target as Node)) {
        setIsBrandsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get category name for display
  const getCategoryName = (): string => {
    if (!category) return 'All Products';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  // Handle price input changes
  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      if (type === 'min') {
        setMinPriceInput(value);
      } else {
        setMaxPriceInput(value);
      }
    }
  };

  // Apply price input changes
  const applyPriceInputs = () => {
    const min = minPriceInput === '' ? 0 : parseInt(minPriceInput);
    const max = maxPriceInput === '' ? 10000 : parseInt(maxPriceInput);
    
    if (min <= max) {
      setPriceRange([min, max]);
    } else {
      // Reset inputs to current range if invalid
      setMinPriceInput(priceRange[0].toString());
      setMaxPriceInput(priceRange[1].toString());
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setPriceRange([min, max]);
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
  };

  // Clear all filters
  const clearFilters = () => {
    setSorting('featured');
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setMinPriceInput('0');
    setMaxPriceInput('10000');
    navigate(location.pathname);
  };

  // Toggle tag selection
  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  // Toggle brand selection
  const toggleBrand = (brandId: number) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };

  // Extract all unique tags and brands from products
  const allTags = products.reduce((tags, product) => {
    if (product.tags) {
      product.tags.forEach(tag => {
        if (!tags.some(t => t.id === tag.id)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, [] as {id: number, name: string, slug: string}[]);

  // Extract all unique brands from products
  const allBrands = sampleBrands;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sorting) {
      case 'price-low':
        return parseFloat(a.base_price) - parseFloat(b.base_price);
      case 'price-high':
        return parseFloat(b.base_price) - parseFloat(a.base_price);
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'rating':
        return (b.average_rating || 0) - (a.average_rating || 0);
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Filter products by search, tags, brands, and price
  const filteredResults = sortedProducts.filter(product => {
    const matchesSearch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.short_description && product.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesTags = selectedTags.length > 0
      ? product.tags && product.tags.some(tag => selectedTags.includes(tag.id))
      : true;

    const matchesBrands = selectedBrands.length > 0
      ? product.brand && typeof product.brand === 'object' && 'id' in product.brand && selectedBrands.includes((product.brand as { id: number }).id)
      : true;

    const matchesPrice = parseFloat(product.base_price) >= priceRange[0] && 
                        parseFloat(product.base_price) <= priceRange[1];
    
    return matchesSearch && matchesTags && matchesBrands && matchesPrice;
  });

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
      
      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="input pr-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button type="submit" className="ml-2">
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </form>
      </div>
      
      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Brands</label>
              <div className="relative" ref={brandsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                  className="input flex w-full items-center justify-between"
                >
                  <span className="truncate">
                    {selectedBrands.length > 0
                      ? `${selectedBrands.length} selected`
                      : 'Select brands'}
                  </span>
                  {isBrandsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {isBrandsOpen && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {allBrands.map(brand => (
                      <label
                        key={brand.id}
                        className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                        />
                        <span className="text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                <option value="newest">Newest First</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Price Range</label>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                    sx={{
                      color: '#2563eb', // primary-600
                      '& .MuiSlider-thumb': {
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.5,
                      },
                    }}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min ($)</label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={minPriceInput}
                      onChange={(e) => handlePriceInputChange('min', e.target.value)}
                      onBlur={applyPriceInputs}
                      className="input py-1 px-2 text-sm w-full"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max ($)</label>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="10000"
                      value={maxPriceInput}
                      onChange={(e) => handlePriceInputChange('max', e.target.value)}
                      onBlur={applyPriceInputs}
                      className="input py-1 px-2 text-sm w-full"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full px-3 py-1 text-xs ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredResults.length} {filteredResults.length === 1 ? 'product' : 'products'}
      </div>
      
      {loading && products.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="my-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">No products found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredResults.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 sm:flex-row"
            >
              <div className="h-48 w-full sm:h-auto sm:w-48">
                <img
                  src={product.images && product.images.length > 0 
                    ? product.images[0].image 
                    : product.thumbnail}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="mb-2 text-xl font-bold">{product.name}</h2>
                
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {product.tags.map(tag => (
                      <span 
                        key={tag.id} 
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="mb-4 flex-1 text-gray-600 dark:text-gray-400">
                  {product.short_description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="text-lg font-bold">
                        ${parseFloat(product.discount_price || product.base_price).toFixed(2)}
                      </p>
                      {product.discount_price && parseFloat(product.discount_price) < parseFloat(product.base_price) && (
                        <p className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                          ${parseFloat(product.base_price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <p className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    disabled={product.stock_quantity <= 0}
                  >
                    View Details
                  </Button>
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