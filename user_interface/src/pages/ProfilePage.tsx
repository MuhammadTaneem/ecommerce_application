import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Package, CreditCard, Settings, User, MapPin, Plus } from 'lucide-react';
import AddressForm from '../components/profile/AddressForm';
import AddressCard from '../components/profile/AddressCard';
import { AddressType, OrderType } from '../types';
import OrderDetailsModal from '../components/shop/OrderDetailsModal';
import authService from '../services/auth.services';
import orderService from '../services/order.services';
import { useToast } from '../hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch addresses from server
  useEffect(() => {
    const fetchAddresses = async () => {
      if (activeTab === 'addresses') {
        try {
          setLoading(true);
          
          // Try to use the API
          try {
            // Check if authService has getAddresses method
            if (typeof authService.getAddresses === 'function') {
              const addressData = await authService.getAddresses();
              setAddresses(addressData);
            } else {
              console.warn('getAddresses function not available in authService');
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
            toast({
              title: "Error",
              description: "Failed to load your addresses. Please try again.",
              variant: "destructive"
            });
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAddresses();
  }, [activeTab]);
  
  // Fetch orders from server
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        try {
          setOrdersLoading(true);
          
          try {
            const orderData = await orderService.getOrders();
            setOrders(orderData);
          } catch (error) {
            console.error('Error fetching orders:', error);
            toast({
              title: "Error",
              description: "Failed to load your orders. Please try again.",
              variant: "destructive"
            });
          }
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Profile data:', data);
  };

  const handleAddressSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      if (editingAddress) {
        // Update existing address
        // Here you would call an API to update the address
        // For now, we'll just update the local state
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? { ...data, id: addr.id } : addr
        ));
        
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully",
          variant: "default"
        });
      } else {
        // Add new address
        // Here you would call an API to create a new address
        // For now, we'll just update the local state
        const newAddress = {
          ...data,
          id: Math.max(...addresses.map(a => a.id), 0) + 1,
        };
        setAddresses([...addresses, newAddress]);
        
        toast({
          title: "Address Added",
          description: "Your new address has been added successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowAddressForm(false);
      setEditingAddress(null);
    }
  };

  const handleEditAddress = (address: AddressType) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      setLoading(true);
      
      // Here you would call an API to delete the address
      // For now, we'll just update the local state
      setAddresses(addresses.filter(addr => addr.id !== id));
      
      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (orderId: string, itemId: number, rating: number, comment: string) => {
    // This would typically call an API to add a review
    console.log('Adding review:', { orderId, itemId, rating, comment });
  };

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

  const handleOrderUpdate = async (updatedOrder: OrderType) => {
    // Update the order in the orders list
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    
    // Refresh orders data from the server to get the latest updates
    try {
      setOrdersLoading(true);
      const orderData = await orderService.getOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast({
        title: "Error",
        description: "Failed to refresh orders data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <Input
                label="Full Name"
                error={errors.name?.message}
                {...register('name')}
              />
              
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              
              <Input
                label="Phone"
                {...register('phone')}
              />
              
              <div>
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        );
      
      case 'addresses':
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              </div>
            ) : showAddressForm ? (
              <AddressForm
                address={editingAddress || undefined}
                onSubmit={handleAddressSubmit}
                onCancel={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
              />
            ) : (
              <>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Address
                </Button>

                {addresses.length === 0 ? (
                  <div className="mt-6 text-center py-8 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                    <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                    <p className="text-sm text-gray-500">Add an address to make checkout easier.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteAddress}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div>
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-6 text-center py-8 border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                <Package size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
                <p className="text-sm text-gray-500">Start shopping to see your orders here.</p>
              </div>
            ) : (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">Order #{order.order_number}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Placed on {order.created_at ? formatDate(order.created_at.toString()) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.total)}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'payment':
        return (
          <div>
            <div className="grid gap-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Visa ending in 1234
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline">
                <CreditCard size={16} className="mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="order-updates"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="order-updates" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Order updates
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="promotions"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="promotions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Promotions and sales
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="newsletter"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Weekly newsletter
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="data-collection"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                    defaultChecked
                  />
                  <label htmlFor="data-collection" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Allow data collection for better shopping experience
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="third-party"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="third-party" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Share data with third-party partners
                  </label>
                </div>
              </div>
            </div>
            
            <Button>Save Preferences</Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Account</h1>
      
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="mb-6 flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold">John Doe</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <User size={16} className="mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'addresses'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <MapPin size={16} className="mr-3" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'orders'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Package size={16} className="mr-3" />
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'payment'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <CreditCard size={16} className="mr-3" />
                  Payment Methods
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings size={16} className="mr-3" />
                  Account Settings
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'profile' && 'Profile Information'}
                {activeTab === 'addresses' && 'Manage Addresses'}
                {activeTab === 'orders' && 'Order History'}
                {activeTab === 'payment' && 'Payment Methods'}
                {activeTab === 'settings' && 'Account Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          isOpen={!!selectedOrder}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;