import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Package, CreditCard, Settings, User, MapPin, Plus } from 'lucide-react';
import AddressForm from '../components/profile/AddressForm';
import AddressCard from '../components/profile/AddressCard';
import { Address } from '../types';
import OrderDetailsModal from '../components/shop/OrderDetailsModal';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Simulated addresses data - in a real app, this would come from Redux/API
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Home',
      address_line1: '123 Main Street',
      address_line2: 'Apt 4B',
      city: 'Dhaka',
      area: 'Uttara',
      phone_number: '+8801234567890',
      is_default: true,
    },
    {
      id: 2,
      name: 'Office',
      address_line1: '456 Business Avenue',
      city: 'Dhaka',
      area: 'Banani',
      phone_number: '+8801987654321',
      is_default: false,
    },
  ]);
  
  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1001',
      date: '2024-03-15',
      status: 'Delivered',
      items: [
        {
          id: 1,
          name: 'Product 1',
          price: 49.99,
          quantity: 2,
          image: 'https://via.placeholder.com/150',
          hasReview: false
        },
        {
          id: 2,
          name: 'Product 2',
          price: 29.99,
          quantity: 1,
          image: 'https://via.placeholder.com/150',
          hasReview: true
        }
      ],
      total: 129.97
    },
    {
      id: 'ORD-1002',
      date: '2024-03-10',
      status: 'Delivered',
      items: [
        {
          id: 3,
          name: 'Product 3',
          price: 79.99,
          quantity: 1,
          image: 'https://via.placeholder.com/150',
          hasReview: false
        }
      ],
      total: 79.99
    }
  ]);
  
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

  const handleAddressSubmit = async (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...data, id: addr.id } : addr
      ));
    } else {
      // Add new address
      const newAddress = {
        ...data,
        id: Math.max(...addresses.map(a => a.id), 0) + 1,
      };
      setAddresses([...addresses, newAddress]);
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleAddReview = (orderId: string, itemId: number, rating: number, comment: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                hasReview: true
              };
            }
            return item;
          })
        };
      }
      return order;
    }));
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
            {showAddressForm ? (
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
              </>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div>
            <div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {order.date}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} items
                        </p>
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
          onAddReview={(itemId, rating, comment) => 
            handleAddReview(selectedOrder.id, itemId, rating, comment)
          }
        />
      )}
    </div>
  );
};

export default ProfilePage;