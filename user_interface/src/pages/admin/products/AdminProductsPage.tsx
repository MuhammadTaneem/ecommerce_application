import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react';

import DataTable from '../../../components/ui/DataTable';
import getAdminProducts from '../../../services/productService';
import { ProductType } from '../../../types/index';
import { useToast } from '../../../hooks/use-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import productService from '../../../services/productService';
import { useTheme } from '../../../hooks/useTheme';
import { adminStyles, actionButtons } from '../../../styles/admin';

const ProductsPage = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const columns = [
    {
      id: 'product',
      header: 'PRODUCT',
      cell: (product: ProductType) => (
        <div className={adminStyles.flexCenter}>
          <img
            src={product.images[0].image}
            alt={product.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              {product.short_description}
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
          ${product.base_price}
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
      cell: (product: ProductType) => product.stock_quantity,
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
        <span>⭐ {product.average_rating.toFixed(1)} ({product.rating_count})</span>
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
          >
            <Eye className={adminStyles.buttonIcon} />
          </Button>
        </div>
      ),
      className: 'w-[150px]',
    },
  ];

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAdminProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleDeleteProduct = (product: ProductType) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const handleEditProduct = (product: ProductType) => {
    // TODO: Implement edit functionality
    console.log('Edit product:', product);
  };

  const confirmDelete = () => {
    if (!currentProduct) return;
    // In a real app, this would call the delete API
    setProducts(products.filter(p => p.id !== currentProduct.id));
    setShowDeleteConfirm(false);
    setCurrentProduct(null);
    toast({
      title: 'Success',
      description: 'Product deleted successfully.',
    });
  };

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
            className={adminStyles.primaryButton}
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
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className={adminStyles.dangerButton}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 