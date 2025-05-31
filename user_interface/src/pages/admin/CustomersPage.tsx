import { useState } from 'react';
import { Search, Filter, User, Mail, Phone, X } from 'lucide-react';
import Button from '../../components/ui/Button';

// In a real app, these would come from an API
const sampleCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    orders: 12,
    total_spent: 1245.50,
    status: 'Active',
    created_at: '2023-01-15',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    orders: 8,
    total_spent: 875.25,
    status: 'Active',
    created_at: '2023-02-20',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '+1122334455',
    orders: 5,
    total_spent: 430.75,
    status: 'Active',
    created_at: '2023-03-10',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1555666777',
    orders: 3,
    total_spent: 215.30,
    status: 'Inactive',
    created_at: '2023-04-05',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '+1777888999',
    orders: 7,
    total_spent: 650.80,
    status: 'Active',
    created_at: '2023-02-28',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    name: 'Sarah Brown',
    email: 'sarah@example.com',
    phone: '+1444555666',
    orders: 4,
    total_spent: 320.45,
    status: 'Active',
    created_at: '2023-05-12',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  }
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewCustomer = (customer: any) => {
    setCurrentCustomer(customer);
    setShowCustomerDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customers..."
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
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        
        <Button variant="outline" className="flex-shrink-0">
          <Filter size={16} className="mr-2" />
          More Filters
        </Button>
      </div>

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
                  Orders
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Spent
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {customer.name}
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
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {customer.orders}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                    {formatCurrency(customer.total_spent)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {customer.created_at}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No customers found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium">{customers.length}</span> customers
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
              <img
                src={currentCustomer.avatar}
                alt={currentCustomer.name}
                className="h-20 w-20 rounded-full object-cover mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {currentCustomer.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Customer ID: #{currentCustomer.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Joined: {currentCustomer.created_at}
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
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Orders: <span className="font-medium">{currentCustomer.orders}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Spent: <span className="font-medium">{formatCurrency(currentCustomer.total_spent)}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    currentCustomer.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>{currentCustomer.status}</span>
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Recent Orders</h4>
              <div className="space-y-3">
                {/* In a real app, this would show actual order history */}
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Order #12345</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2023-08-15</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">$125.00</p>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Order #12344</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2023-07-22</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">$89.50</p>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Order #12343</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2023-06-10</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">$45.25</p>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Delivered
                    </span>
                  </div>
                </div>
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