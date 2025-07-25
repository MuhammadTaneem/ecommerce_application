import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { AddressType, PaymentMethod, CartItemType } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CreditCard, Wallet, Smartphone, ArrowLeft, Check } from 'lucide-react';
import authService from '../services/auth.services';
import orderService from '../services/order.services';
import { useToast } from '../hooks/use-toast';
import { clearCart } from '../store/slices/cartSlice';

const paymentSchema = z.object({
  method: z.enum(['cash', 'mobile', 'card'] as const),
  mobile_number: z.string().optional(),
  transaction_id: z.string().optional(),
  card_number: z.string().optional(),
  expiry_date: z.string().optional(),
  cvv: z.string().optional(),
  voucher_code: z.string().optional(),
}).refine(data => {
  if (data.method === 'mobile') {
    return !!data.mobile_number && !!data.transaction_id;
  }
  if (data.method === 'card') {
    return !!data.card_number && !!data.expiry_date && !!data.cvv;
  }
  return true;
}, {
  message: "Please fill in all required fields for the selected payment method",
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// Temporary mock addresses until API is fixed
const mockAddresses: AddressType[] = [
  {
    id: 1,
    name: "Office",
    is_default: true,
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "Dhaka",
    area: "uttara",
    phone_number: "+8801234567890",
    created_at: "2025-07-02T16:28:56.771131+06:00",
    updated_at: "2025-07-02T16:28:56.771145+06:00"
  },
  {
    id: 2,
    name: "home",
    is_default: false,
    address_line1: "123 Main Street s",
    address_line2: "Apt 4B",
    city: "Dhaka",
    area: "uttara",
    phone_number: "+8801234567890",
    created_at: "2025-07-02T16:29:04.816082+06:00",
    updated_at: "2025-07-02T16:29:04.816096+06:00"
  }
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items } = useSelector((state: RootState) => state.cart);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price from cart items
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.unit_price) * item.quantity,
    0
  );

  // Fetch addresses from the API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        
        // Try to use the API first
        try {
          // Check if authService has getAddresses method
          if (typeof authService.getAddresses === 'function') {
            const addressData = await authService.getAddresses();
            setAddresses(addressData);
          } else {
            // If not available, use mock data
            console.warn('Using mock address data since API is not available');
            setAddresses(mockAddresses);
          }
        } catch (error) {
          // Fallback to mock data if API fails
          console.warn('API call failed, using mock address data', error);
          setAddresses(mockAddresses);
        }
        
        // Set default address if available
        const defaultAddress = addresses.find((addr: AddressType) => addr.is_default);
        if (defaultAddress && !selectedAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (addresses.length > 0 && !selectedAddress) {
          // If no default address, select the first one
          setSelectedAddress(addresses[0].id);
        }
      } catch (error) {
        console.error('Error setting up addresses:', error);
        toast({
          title: "Error",
          description: "Failed to load your addresses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'cash',
      voucher_code: '',
    },
  });

  const currentPaymentMethod = watch('method');

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a shipping address",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare order data
      const orderData = {
        address_id: selectedAddress,
        voucher_code: data.voucher_code || undefined
      };
      
      // Call the API to place the order
      const response = await orderService.createOrder(orderData);
      
      // Clear the cart after successful order
      dispatch(clearCart());
      
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
        variant: "default"
      });
      
      // Navigate to order confirmation or orders page
      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/cart')}
        className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Cart
      </button>
      
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* Shipping Address Section */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                    <Button
                      type="button"
                      onClick={() => navigate('/profile?tab=addresses&action=add')}
                    >
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div 
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={`cursor-pointer rounded-lg border p-4 ${
                          selectedAddress === address.id 
                            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.is_default && (
                                <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {address.address_line1}
                              {address.address_line2 && <>, {address.address_line2}</>}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.city}, {address.area}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Phone: {address.phone_number}
                            </p>
                          </div>
                          
                          {selectedAddress === address.id && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/profile?tab=addresses&action=add')}
                      className="w-full"
                    >
                      + Add New Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div 
                      className={`cursor-pointer rounded-lg border p-4 ${
                        currentPaymentMethod === 'cash' 
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedPaymentMethod('cash');
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Wallet className="mb-2 h-8 w-8 text-green-500" />
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <input 
                          type="radio" 
                          value="cash" 
                          {...register("method")} 
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div 
                      className={`cursor-pointer rounded-lg border p-4 ${
                        currentPaymentMethod === 'mobile' 
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedPaymentMethod('mobile');
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <Smartphone className="mb-2 h-8 w-8 text-blue-500" />
                        <h3 className="font-medium">Mobile Banking</h3>
                        <input 
                          type="radio" 
                          value="mobile" 
                          {...register("method")} 
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div 
                      className={`cursor-pointer rounded-lg border p-4 ${
                        currentPaymentMethod === 'card' 
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedPaymentMethod('card');
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <CreditCard className="mb-2 h-8 w-8 text-purple-500" />
                        <h3 className="font-medium">Credit/Debit Card</h3>
                        <input 
                          type="radio" 
                          value="card" 
                          {...register("method")} 
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Banking Fields */}
                  {currentPaymentMethod === 'mobile' && (
                    <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Mobile Number</label>
                        <Input 
                          {...register("mobile_number")} 
                          placeholder="Enter your mobile number" 
                        />
                        {errors.mobile_number && (
                          <p className="mt-1 text-xs text-red-500">{errors.mobile_number.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="mb-1 block text-sm font-medium">Transaction ID</label>
                        <Input 
                          {...register("transaction_id")} 
                          placeholder="Enter transaction ID" 
                        />
                        {errors.transaction_id && (
                          <p className="mt-1 text-xs text-red-500">{errors.transaction_id.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Credit Card Fields */}
                  {currentPaymentMethod === 'card' && (
                    <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Card Number</label>
                        <Input 
                          {...register("card_number")} 
                          placeholder="1234 5678 9012 3456" 
                        />
                        {errors.card_number && (
                          <p className="mt-1 text-xs text-red-500">{errors.card_number.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Expiry Date</label>
                          <Input 
                            {...register("expiry_date")} 
                            placeholder="MM/YY" 
                          />
                          {errors.expiry_date && (
                            <p className="mt-1 text-xs text-red-500">{errors.expiry_date.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="mb-1 block text-sm font-medium">CVV</label>
                          <Input 
                            {...register("cvv")} 
                            placeholder="123" 
                            type="password" 
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Voucher Code Field */}
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium">Voucher Code (Optional)</label>
                    <Input 
                      {...register("voucher_code")} 
                      placeholder="Enter voucher code" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700">
                            {item.thumbnail && (
                              <img 
                                src={item.thumbnail} 
                                alt={item.name} 
                                className="h-full w-full object-cover rounded-md"
                              />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                      <p className="text-sm font-medium">{formatPrice(totalPrice)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Shipping</p>
                      <p className="text-sm font-medium">{formatPrice(0)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
                      <p className="text-sm font-medium">{formatPrice(totalPrice * 0.05)}</p>
                    </div>
                    <div className="flex justify-between font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p>Total</p>
                      <p>{formatPrice(totalPrice + (totalPrice * 0.05))}</p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!selectedAddress || loading || isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
