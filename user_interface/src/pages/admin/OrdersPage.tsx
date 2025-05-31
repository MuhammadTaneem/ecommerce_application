import { useState } from 'react';
import { Search, Filter, Eye, X, Download } from 'lucide-react';
import Button from '../../components/ui/Button';

// In a real app, these would come from an API
const sampleOrders = [
  {
    id: 'ORD-7652',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    date: '2023-08-15',
    status: 'Delivered',
    payment_status: 'Paid',
    total: 125.00,
  },
  {
    id: 'ORD-7651',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    date: '2023-08-15',
    status: 'Processing',
    payment_status: 'Paid',
    total: 258.50,
  },
  {
    id: 'ORD-7650',
    customer: {
      name: 'Robert Johnson',
      email: 'robert@example.com'
    },
    date: '2023-08-14',
    status: 'Shipped',
    payment_status: 'Paid',
    total: 89.99,
  },
  {
    id: 'ORD-7649',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    date: '2023-08-14',
    status: 'Pending',
    payment_status: 'Pending',
    total: 432.25,
  },
  {
    id: 'ORD-7648',
    customer: {
      name: 'Michael Wilson',
      email: 'michael@example.com'
    },
    date: '2023-08-13',
    status: 'Cancelled',
    payment_status: 'Refunded',
    total: 65.00,
  },
  {
    id: 'ORD-7647',
    customer: {
      name: 'Sarah Brown',
      email: 'sarah@example.com'
    },
    date: '2023-08-13',
    status: 'Delivered',
    payment_status: 'Paid',
    total: 175.50,
  },
  {
    id: 'ORD-7646',
    customer: {
      name: 'David Miller',
      email: 'david@example.com'
    },
    date: '2023-08-12',
    status: 'Delivered',
    payment_status: 'Paid',
    total: 92.75,
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: any) => {
    setCurrentOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, this would call an API
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
        <Button 
          variant="outline"
          className="mt-4 sm:mt-0"
        >
          <Download size={16} className="mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
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
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        
        <Button variant="outline" className="flex-shrink-0">
          <Filter size={16} className="mr-2" />
          More Filters
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="py-3 px-6 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    {order.date}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium rounded px-2 py-1 border-0 ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800 dark:text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> orders
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

      {/* Order Details Modal */}
      {showOrderDetails && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Order Details - {currentOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Customer Information</h4>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{currentOrder.customer.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentOrder.customer.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Date: {currentOrder.date}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(currentOrder.status)}`}>{currentOrder.status}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Payment: <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPaymentStatusColor(currentOrder.payment_status)}`}>{currentOrder.payment_status}</span>
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Order Items</h4>
              <div className="space-y-3">
                {/* In a real app, this would show actual order items */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">Sample Product 1</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: 2</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">$49.98</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">Sample Product 2</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: 1</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">$75.00</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Subtotal</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">$124.98</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Shipping</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">$0.00</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Tax</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">$0.02</p>
              </div>
              <div className="flex justify-between font-medium">
                <p className="text-base text-gray-800 dark:text-white">Total</p>
                <p className="text-base text-gray-800 dark:text-white">${currentOrder.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                Close
              </Button>
              <Button variant="primary">
                Update Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 