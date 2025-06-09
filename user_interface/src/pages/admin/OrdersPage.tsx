import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import DataTable from '../../components/ui/DataTable';
import { OrderType, KeyValuePair } from '../../types';
import { useToast } from '../../hooks/use-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import orderService from '../../services/order.services';
import { adminStyles, actionButtons } from '../../styles/admin';
import { fetchContextData } from '../../store/slices/contextSlice';
import { RootState } from '../../store';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<KeyValuePair | 'All'>('All');
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { toast } = useToast();

  const dispatch = useDispatch();
  const { contextData, isLoading: contextLoading, error: contextError } = useSelector((state: RootState) => state.context);

  // Fetch context data on component mount if not already in store
  useEffect(() => {
    dispatch(fetchContextData() as any);
  }, [dispatch]);

  // Log context data whenever it changes
  useEffect(() => {
    if (contextData) {
      console.log('Context Data:', contextData);
    }
    if (contextError) {
      console.error('Context Error:', contextError);
    }
  }, [contextData, contextError]);

  const fetchOrders = async () => {
    // console.log(contextData);
    try {
      setIsLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch orders.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    console.log(contextData);
  }, []);
  // useEffect(() => {
  //   if (orders.length > 0) {
  //     const totalOrderCount = orders.length;
  //   }
  // }, [orders]);

  const handleStatusChange = async (order_id: number, newStatus: number) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(order_id, newStatus);
      setOrders(orders.map(order => 
        order.id === order_id ? updatedOrder : order
      ));
      toast({
        title: 'Success',
        description: 'Order status updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // const getPaymentStatusColor = (statusValue: string) => {
  //   switch (statusValue) {
  //     case 'Paid':
  //       return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400';
  //     case 'Pending':
  //       return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400';
  //     case 'Failed':
  //       return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400';
  //     case 'Refunded':
  //       return 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400';
  //     default:
  //       return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-400';
  //   }
  // };

  const StatusBadge = ({ value, colorClass }: { value: string; colorClass: string }) => (
    <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClass}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${colorClass.includes('bg-gray') ? 'bg-gray-400' : colorClass.split(' ')[1].replace('text', 'bg')}`} />
      {value}
    </span>
  );

  const columns = [
    {
      id: 'order',
      header: 'ORDER ID',
      cell: (order: OrderType) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {order.id}
        </div>
      ),
    },
    {
      id: 'date',
      header: 'DATE',
      cell: (order: OrderType) => {
        const date = new Date(order.created_at);
        return (
          <div className="text-gray-500 dark:text-gray-400">
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        );
      },
    },
    {
      id: 'time',
      header: 'TIME',
      cell: (order: OrderType) => {
        const time = new Date(order.created_at);
        return (
          <div className="text-gray-500 dark:text-gray-400">
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'STATUS',
      cell: (order: OrderType) => {
        const currentStatus = contextData?.order_status?.find(
          status => status.key === order.status
        )?.value || `Status ${order.status}`;

        return (
          <div className="relative inline-block">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id as number, Number(e.target.value))}
              className={`appearance-none inline-flex items-center gap-x-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset cursor-pointer hover:bg-opacity-80 focus:outline-none focus:ring-2 ${getStatusColor(currentStatus)}`}
              style={{ paddingRight: '2rem' }}
            >
              {contextData?.order_status?.map(status => (
                <option 
                  key={status.key} 
                  value={status.key}
                  className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                >
                  {status.value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
      },
    },
    {
      id: 'payment',
      header: 'PAYMENT',
      cell: (order: OrderType) => {
        const paymentStatus = contextData?.payment_status?.find(
          status => status.key === order.payment_status
        )?.value || `Status ${order.payment_status}`;

        return (
          <StatusBadge 
            value={paymentStatus}
            colorClass={getStatusColor(paymentStatus)}
          />
        );
      },
    },
    {
      id: 'total',
      header: 'TOTAL',
      cell: (order: OrderType) => (
        <div className="font-medium text-gray-900 dark:text-white">
          ${order.total}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: (order: OrderType) => (
        <div className={adminStyles.flexCenter}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentOrder(order);
              setShowOrderDetails(true);
            }}
            className={actionButtons.view}
          >
            <Eye className={adminStyles.buttonIcon} />
          </Button>
        </div>
      ),
    },
  ];



  return (
    <div className={adminStyles.pageContainer}>
      <div className={adminStyles.headerContainer}>
        <div>
          <h1 className={adminStyles.headerTitle}>Orders</h1>
          <p className={adminStyles.headerSubtitle}>Manage and track your orders</p>
        </div>
        <div className={adminStyles.flexGap2}>
          <Button
            variant="outline"
            className={adminStyles.secondaryButton}
          >
            <Download className={adminStyles.buttonIcon} />
            Export Orders
          </Button>
        </div>
      </div>

      <div className={adminStyles.mainContainer}>
        <div className={adminStyles.contentContainer}>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className={adminStyles.searchContainer}>
              <Search className={adminStyles.searchIcon}/>
              <Input
                type="text"
                placeholder="Search orders..."
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
            
            {/* <select
              className="input flex-shrink-0 sm:w-40"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'All')}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select> */}
            
            <Button 
              variant="outline"
              className={adminStyles.secondaryButton}
            >
              <Filter className={adminStyles.buttonIcon} />
              More Filters
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={orders}
            loading={isLoading}
            emptyMessage="No orders found"
          />
        </div>
      </div>

      {/* {showOrderDetails && currentOrder && (
        <div className={adminStyles.modalOverlay}>
          <div className={adminStyles.modalContainer}>
            <h2 className={adminStyles.modalTitle}>
              Order Details - {currentOrder.id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Customer Information
                </h4>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentOrder.customer.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentOrder.customer.email}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Order Information
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {currentOrder.date}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(currentOrder.status)}`}>
                    {currentOrder.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment: <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPaymentStatusColor(currentOrder.payment_status)}`}>
                    {currentOrder.payment_status}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Order Items
              </h4>
              <div className="space-y-3">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.total_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${currentOrder.subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Shipping</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${currentOrder.shipping.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tax</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${currentOrder.tax.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-base font-medium text-gray-900 dark:text-white">Total</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    ${currentOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className={adminStyles.modalActions}>
              <Button
                variant="outline"
                onClick={() => setShowOrderDetails(false)}
                className={adminStyles.cancelButton}
              >
                Close
              </Button>
              <Button
                className={adminStyles.primaryButton}
                onClick={() => {
                  // Handle order update
                  setShowOrderDetails(false);
                }}
              >
                Update Order
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default OrdersPage; 