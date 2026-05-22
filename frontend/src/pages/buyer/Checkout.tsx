import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CreditCard, Sparkles, Loader, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import api from '../../services/api';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, fetchCart, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 1500 ? 0 : 150;
  const platform = 49;
  const total = subtotal + delivery + platform;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      return addToast('Please enter a delivery address.', 'warning');
    }

    if (paymentMethod === 'RAZORPAY') {
      // Redirect to simulated Razorpay checkout gateway
      navigate(`/razorpay-payment?amount=${total}&address=${encodeURIComponent(address)}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/orders/create/', {
        address,
        paymentMethod: 'COD',
      });
      const data = response.data;
      addToast('Order placed successfully!', 'success');
      
      // Clear shopping cart state locally and on backend
      await clearCart();
      
      navigate(`/order-success?id=${data.orderId}`);
    } catch (err) {
      // Axios error handler prints error
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-sm font-semibold text-slate-500">Your cart is empty. Proceeding back...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-900">Secure Checkout</h1>
        <p className="text-xs text-slate-500">Provide shipping coordinates and complete checkout transaction.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping details */}
        <div className="lg:col-span-2 space-y-6 card-premium-gradient p-6 rounded-3xl">
          {/* Address card */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Truck className="w-4 h-4 text-indigo-500" /> Delivery Address
            </h3>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete hyperlocal delivery address (Street name, Area, City, Pin Code)..."
              className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs bg-white text-slate-850"
            />
          </div>

          {/* Payment option cards */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <CreditCard className="w-4 h-4 text-indigo-500" /> Choose Payment Gateway
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD trigger */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-1 transition-all duration-200 ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-[inset_0_2px_4px_rgba(79,70,229,0.06)] translate-y-0'
                    : 'border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-sm bg-white'
                }`}
              >
                <span className="text-xs font-bold text-slate-850">Cash on Delivery (COD)</span>
                <span className="text-[10px] text-slate-500">Pay cash directly when order reaches doorstep.</span>
              </div>

              {/* Online payment mock */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col gap-1 relative overflow-hidden transition-all duration-200 ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-[inset_0_2px_4px_rgba(79,70,229,0.06)] translate-y-0'
                    : 'border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-sm bg-white'
                }`}
              >
                <span className="text-xs font-bold text-slate-850 flex items-center gap-1">
                  Razorpay Secure Payment
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-50 border border-indigo-100 px-1.5 rounded-full flex items-center gap-0.5 shrink-0 scale-90">
                    <Sparkles className="w-2.5 h-2.5" /> Instant
                  </span>
                </span>
                <span className="text-[10px] text-slate-500">Complete digital mock transaction checkout instantly.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price calc panel */}
        <div className="space-y-6">
          <div className="card-premium-gradient p-6 rounded-3xl space-y-6">
            <h3 className="font-display font-black text-lg text-slate-900 pb-3 border-b border-slate-100">
              Order Review
            </h3>

            {/* Cart overview */}
            <div className="space-y-3.5 max-h-40 overflow-y-auto pr-2 border-b border-slate-100 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">{item.name}</span>
                    <span className="text-[10px] text-slate-500">Quantity: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals panel */}
            <div className="space-y-3 border-b border-slate-100 pb-4 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-750">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-bold text-slate-750">
                  {delivery === 0 ? <span className="text-emerald-600">FREE</span> : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission Fee</span>
                <span className="font-bold text-slate-750">₹{platform}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-xs font-bold text-slate-600">Total payable</span>
              <span className="font-display font-black text-xl text-slate-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Place order trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-3d btn-3d-checkout btn-shimmer-wrap disabled:opacity-50 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Place Order Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Checkout;
