import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react';
import Button from '../../components/ui/Button';

// In a real app, these would come from an API
const sampleProducts = [
  {
    id: 'PRD-001',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: 79.99,
    stock: 45,
    status: 'Active',
    featured: true,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 28,
    status: 'Active',
    featured: false,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-003',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 59.99,
    stock: 17,
    status: 'Active',
    featured: true,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-004',
    name: 'Laptop Backpack',
    category: 'Accessories',
    price: 49.99,
    stock: 52,
    status: 'Active',
    featured: false,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-005',
    name: 'Wireless Keyboard',
    category: 'Electronics',
    price: 45.99,
    stock: 0,
    status: 'Out of Stock',
    featured: false,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-006',
    name: 'Desk Lamp',
    category: 'Home',
    price: 29.99,
    stock: 34,
    status: 'Active',
    featured: false,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-007',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 24.99,
    stock: 41,
    status: 'Active',
    featured: false,
    image: 'https://placehold.co/100x100'
  },
  {
    id: 'PRD-008',
    name: 'USB-C Hub',
    category: 'Electronics',
    price: 39.99,
    stock: 0,
    status: 'Out of Stock',
    featured: false,
    image: 'https://placehold.co/100x100'
  }
];

const ProductsPage = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product: any) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API
    setProducts(products.filter(p => p.id !== currentProduct.id));
    setShowDeleteConfirm(false);
    setCurrentProduct(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
        <Button 
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        <Button variant="outline" className="flex-shrink-0">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Featured
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {product.stock}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {product.featured ? 'Yes' : 'No'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
            <span className="font-medium">{products.length}</span> products
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Delete Product
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold">{currentProduct.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal would go here */}
      {/* We would need to implement a form with all product fields */}
    </div>
  );
};

export default ProductsPage; 