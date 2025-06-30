import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, X, RefreshCw, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../../components/ui/DataTable';
import { ProductType } from '../../../types/index';
import { useToast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import productService from '../../../services/productService';
import { useTheme } from '../../../hooks/useTheme';
import { adminStyles, actionButtons } from '../../../styles/admin';

// Cache for products data
let productsCache: ProductType[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const ProductsPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired, unless force refresh is requested
    if (!forceRefresh && productsCache && now - lastFetchTime < CACHE_DURATION) {
      setProducts(productsCache);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await productService.getAdminProducts();
      
      // Only update cache and state if we got valid data
      if (Array.isArray(data) && data.length > 0) {
        productsCache = data;
        lastFetchTime = now;
        setProducts(data);
      } else {
        // If we got empty data but have cache, keep using cache
        if (productsCache) {
          setProducts(productsCache);
        } else {
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products.',
        variant: 'destructive',
      });
      // Use cache on error if available
      if (productsCache) {
        setProducts(productsCache);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
    
    // Cleanup function to prevent memory leaks
    return () => {
      // We keep the cache between component unmounts
    };
  }, [fetchProducts]);

  const handleRefresh = () => {
    fetchProducts(true); // Force refresh
  };

  const handleDeleteProduct = (product: ProductType) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const handleEditProduct = (product: ProductType) => {
    // Navigate to the edit page with the product ID
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleViewProduct = (product: ProductType) => {
    // Navigate to the product detail page
    navigate(`/product/${product.id}`);
  };

  const confirmDelete = async () => {
    if (!currentProduct) return;
    
    try {
      setIsDeleting(true);
      // Call the API to delete the product
      await productService.deleteProduct(currentProduct.id);
      
      // Update local state and cache
      const updatedProducts = products.filter(p => p.id !== currentProduct.id);
      setProducts(updatedProducts);
      productsCache = updatedProducts;
      
      setShowDeleteConfirm(false);
      setCurrentProduct(null);
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      id: 'product',
      header: 'PRODUCT',
      cell: (product: ProductType) => (
        <div className={adminStyles.flexCenter}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].image}
              alt={product.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No img</span>
            </div>
          )}
          <div className="ml-4">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              {product.short_description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'base_price',
      header: 'BASE PRICE',
      cell: (product: ProductType) => (
        <div>
          ${product.base_price || '0.00'}
        </div>
      ),
    },
    {
      id: 'discount_price',
      header: 'DISCOUNT PRICE',
      cell: (product: ProductType) => (
        <div>
          ${product.discount_price ? product.discount_price : 'N/A'}
        </div>
      ),
    },
    {
      id: 'stock',
      header: 'STOCK',
      cell: (product: ProductType) => product.stock_quantity || 0,
    },
    {
      id: 'brand',
      header: 'BRAND',
      cell: (product: ProductType) => product.brand || 'N/A',
    },
    {
      id: 'rating',
      header: 'RATING',
      cell: (product: ProductType) => (
        <span>
          ⭐ {product.average_rating ? product.average_rating.toFixed(1) : '0.0'} 
          ({product.rating_count || 0})
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (product: ProductType) => (
        <div className={adminStyles.flexGap2}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProduct(product)}
            className={actionButtons.edit}
          >
            <Edit className={adminStyles.buttonIcon} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(product)}
            className={actionButtons.delete}
          >
            <Trash2 className={adminStyles.buttonIcon} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={actionButtons.view}
            onClick={() => handleViewProduct(product)}
          >
            <Eye className={adminStyles.buttonIcon} />
          </Button>
        </div>
      ),
      className: 'w-[150px]',
    },
  ];

  return (
    <div className={adminStyles.pageContainer}>
      <div className={adminStyles.headerContainer}>
        <div>
          <h1 className={adminStyles.headerTitle}>Products Management</h1>
          <p className={adminStyles.headerSubtitle}>Manage your product catalog and inventory</p>
        </div>
        <div className={adminStyles.flexGap2}>
          <Button
            variant="outline"
            className={adminStyles.secondaryButton}
          >
            <Filter className={adminStyles.buttonIcon} />
            Filters
          </Button>
          <Button
            variant="outline"
            className={adminStyles.secondaryButton}
            onClick={handleRefresh}
          >
            <RefreshCw className={adminStyles.buttonIcon} />
            Refresh
          </Button>
          <Button
            className={adminStyles.primaryButton}
            onClick={() => navigate('/admin/products/add')}
          >
            <Plus className={adminStyles.buttonIcon} />
            Add Product
          </Button>
        </div>
      </div>

      <div className={adminStyles.mainContainer}>
        <div className={adminStyles.contentContainer}>
          <div className={adminStyles.searchContainer}>
            <Search className={adminStyles.searchIcon}/>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={adminStyles.searchInput}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className={adminStyles.clearButton}
                onClick={() => setSearchTerm('')}
              >
                <X className={adminStyles.buttonIcon} />
              </Button>
            )}
          </div>

          <DataTable
            columns={columns}
            data={products}
            loading={isLoading}
            emptyMessage="No products found"
          />
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={adminStyles.modalOverlay}>
          <div className={adminStyles.modalContainer}>
            <h2 className={adminStyles.modalTitle}>
              Delete Product
            </h2>
            <p className={adminStyles.modalText}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className={adminStyles.modalActions}>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className={adminStyles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className={adminStyles.dangerButton}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 