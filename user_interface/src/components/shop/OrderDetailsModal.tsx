import React, { useEffect, useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { OrderType, OrderItemType } from '../../types';
import orderService from '../../services/order.services';
import { useToast } from '../../hooks/use-toast';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderType;
  onOrderUpdate?: (updatedOrder: OrderType) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  order,
  onOrderUpdate 
}) => {
  const [detailedOrder, setDetailedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingOrder, setCancellingOrder] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isOpen || !order?.id) return;
      
      try {
        setLoading(true);
        const orderDetails = await orderService.getOrderDetails(order.id);
        setDetailedOrder(orderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
}
    };

    fetchOrderDetails();
    // Reset cancel confirmation when modal opens/closes
    setShowCancelConfirm(false);
  }, [isOpen, order?.id]);

  if (!isOpen) return null;

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!detailedOrder?.id) return;
    
    try {
      setCancellingOrder(true);
      const updatedOrder = await orderService.cancelOrder(detailedOrder.id);
      
      // Update the local state
      setDetailedOrder(updatedOrder);
      
      // Notify parent component about the update
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
        variant: "default"
      });
      
      // Hide the confirmation dialog
      setShowCancelConfirm(false);
      
      // Automatically close the modal after cancellation
      onClose();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  // Check if order can be cancelled (only pending or processing orders)
  const canBeCancelled = detailedOrder && (detailedOrder.status === 1 || detailedOrder.status === 2);

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format price
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: // Pending
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 2: // Processing
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 3: // Shipped
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 4: // Delivered
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 5: // Cancelled
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Processing';
      case 3: return 'Shipped';
      case 4: return 'Delivered';
      case 5: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  // Render cancel confirmation dialog
  const renderCancelConfirmation = () => {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-red-500" />
            <h3 className="text-lg font-bold">Cancel Order</h3>
          </div>
          <p className="mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(false)}
              disabled={cancellingOrder}
            >
              No, Keep Order
            </Button>
            <Button
              variant="primary"
              onClick={handleCancelOrder}
              loading={cancellingOrder}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Order
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order Details #{order.order_number}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-primary-500 mb-4" />
            <p>Loading order details...</p>
          </div>
        ) : detailedOrder ? (
          <>
        {/* Order Info */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p className="font-medium">
                  {detailedOrder.created_at ? formatDate(detailedOrder.created_at.toString()) : 'N/A'}
                </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(detailedOrder.status)}`}>
                  {getStatusText(detailedOrder.status)}
                </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold">Items</h3>
          <div className="space-y-4">
                {detailedOrder.items && detailedOrder.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                        alt={item.product_name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                    <p className="font-medium">{formatPrice(item.unit_price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p>{detailedOrder.address_line1}</p>
                {detailedOrder.address_line2 && <p>{detailedOrder.address_line2}</p>}
              <p>
                  {detailedOrder.city}, {detailedOrder.area}
                </p>
                <p>Phone: {detailedOrder.phone_number}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>{formatPrice(detailedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Shipping:</span>
                  <span>{formatPrice(detailedOrder.shipping_cost)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Tax:</span>
                  <span>{formatPrice(detailedOrder.tax)}</span>
                </div>
                {parseFloat(detailedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between py-1">
                    <span>Discount:</span>
                    <span>-{formatPrice(detailedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t mt-2 pt-2 font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(detailedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {detailedOrder.notes && (
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold">Notes</h3>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <p>{detailedOrder.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
            <div className="mt-6 flex justify-between">
              {canBeCancelled && (
                <Button 
                  variant="primary" 
                  onClick={() => setShowCancelConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Order
                </Button>
              )}
          <Button onClick={onClose}>Close</Button>
        </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>Unable to load order details. Please try again later.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        )}
      </div>
      
      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && renderCancelConfirmation()}
    </div>
  );
};

export default OrderDetailsModal; 