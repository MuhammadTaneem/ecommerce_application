import { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import authService from '../../services/auth.services';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  avatar: string | null;
  // Additional fields that might be used in the UI
  orders?: number;
  total_spent?: number;
}

interface CustomerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

interface SearchParams {
  search?: string;
  email?: string;
  phone?: string;
  role_id?: string | number;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageOptions] = useState([5, 10, 25, 50]);
  const [pageInput, setPageInput] = useState('1');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, limit]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const searchParams: SearchParams = {};
      
      // Only add search parameters if they're not empty
      if (searchTerm) {
        searchParams.search = searchTerm;
      }
      
      if (emailFilter) {
        searchParams.email = emailFilter;
      }
      
      if (phoneFilter) {
        searchParams.phone = phoneFilter;
      }
      
      const response = await authService.getCustomers(currentPage, limit, searchParams);
      setCustomers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    setPageInput('1');
    fetchCustomers();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setEmailFilter('');
    setPhoneFilter('');
    setSelectedStatus('All');
    setCurrentPage(1);
    setPageInput('1');
    fetchCustomers();
  };

  // Filter customers based on status (active/inactive)
  // This is done client-side since the API doesn't support filtering by status
  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && customer.is_active) ||
      (selectedStatus === 'Inactive' && !customer.is_active);
    
    return matchesStatus;
  });

  const handleViewCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setShowCustomerDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput((currentPage - 1).toString());
    }
  };

  const handleNextPage = () => {
    if (currentPage * limit < totalCount) {
      setCurrentPage(currentPage + 1);
      setPageInput((currentPage + 1).toString());
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(pageInput, 10);
      const maxPage = Math.ceil(totalCount / limit);
      
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= maxPage) {
        setCurrentPage(pageNumber);
      } else {
        setPageInput(currentPage.toString());
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
        <Button 
          variant="primary"
          className="mt-4 sm:mt-0"
        >
          <User size={16} className="mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name..."
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
          
          <select
            className="input flex-shrink-0 sm:w-40"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
              setPageInput('1');
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex-shrink-0"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </Button>

          <Button 
            type="submit" 
            variant="primary" 
            className="flex-shrink-0"
          >
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="email-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email-filter"
                type="text"
                placeholder="Filter by email..."
                className="input w-full"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="phone-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                id="phone-filter"
                type="text"
                placeholder="Filter by phone..."
                className="input w-full"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={`${customer.first_name} ${customer.last_name}`}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                            <User size={20} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: #{customer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail size={14} className="mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <Phone size={14} className="mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          customer.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          View
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredCustomers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No customers found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
            <select
              className="input w-16 py-1"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing limit
                setPageInput('1');
                fetchCustomers();
              }}
            >
              {pageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mr-4">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
              <span className="font-medium">{totalCount}</span> customers
            </p>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => {
                  handlePreviousPage();
                  fetchCustomers();
                }}
              >
                Previous
              </Button>
              
              <div className="flex items-center mx-2">
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / limit)) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === currentPage;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        setPageInput(pageNum.toString());
                        fetchCustomers();
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 ${
                        isCurrentPage 
                          ? 'bg-primary text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {Math.ceil(totalCount / limit) > 5 && (
                  <>
                    <span className="mx-1 text-gray-500 dark:text-gray-400">...</span>
                    <div className="flex items-center ml-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Go to:</span>
                      <input
                        type="text"
                        className="input w-14 py-1 px-2"
                        value={pageInput}
                        onChange={handlePageInputChange}
                        onKeyDown={handlePageInputKeyDown}
                        aria-label="Go to page"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage * limit >= totalCount}
                onClick={() => {
                  handleNextPage();
                  fetchCustomers();
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && currentCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Customer Details
              </h3>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              {currentCustomer.avatar ? (
                <img
                  src={currentCustomer.avatar}
                  alt={`${currentCustomer.first_name} ${currentCustomer.last_name}`}
                  className="h-20 w-20 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                  <User size={40} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {currentCustomer.first_name} {currentCustomer.last_name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Customer ID: #{currentCustomer.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Joined: {new Date(currentCustomer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Contact Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <Mail size={14} className="mr-2" /> {currentCustomer.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-2">
                  <Phone size={14} className="mr-2" /> {currentCustomer.phone}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    currentCustomer.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>{currentCustomer.is_active ? 'Active' : 'Inactive'}</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                Close
              </Button>
              <Button variant="primary">
                Edit Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage; 