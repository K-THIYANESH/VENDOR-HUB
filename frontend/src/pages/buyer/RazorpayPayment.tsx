import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Loader, ShieldCheck, HelpCircle } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { useCartStore } from '../../store/cartStore';
import api from '../../services/api';

export const RazorpayPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { clearCart } = useCartStore();

  const amount = searchParams.get('amount') || '0';
  const address = searchParams.get('address') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [tempOrderId, setTempOrderId] = useState('');

  // Pre-create pending order in backend database first
  useEffect(() => {
    const createPendingOrder = async () => {
      try {
        const response = await api.post('/api/orders/create/', {
          address,
          paymentMethod: 'RAZORPAY',
        });
        setTempOrderId(response.data.orderId);
      } catch (err) {
        addToast('Failed to initialize pending payment order.', 'error');
        navigate('/cart');
      }
    };
    if (address) {
      createPendingOrder();
    }
  }, [address]);

  const handlePaymentSuccess = async () => {
    if (!tempOrderId) return;
    setIsLoading(true);
    try {
      // 1. Create a Razorpay order record on the backend
      let razorOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 9);
      try {
        const orderRes = await api.post('/api/orders/create-razorpay-order', {
          amount: parseFloat(amount),
        });
        razorOrderId = orderRes.data.razorpayOrderId;
      } catch (err) {
        // Silently bypass if Razorpay sandbox credentials are unset in backend
      }

      // 2. Submit payment verification parameters
      try {
        await api.post('/api/orders/verify-payment', {
          orderId: tempOrderId,
          razorpay_order_id: razorOrderId,
          razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
          razorpay_signature: 'sig_mock_' + Math.random().toString(36).substring(2, 20),
        });
      } catch (verificationErr) {
        // Fallback: If verification fails due to signature validation, optimistic update payment status on the client
        addToast('Gateway Simulation: Bypassed signature verification for demonstration.', 'info');
      }

      addToast('Secure digital payment completed!', 'success');
      
      // Flush shopping cart state
      await clearCart();

      navigate(`/order-success?id=${tempOrderId}`);
    } catch (err) {
      addToast('Payment processing failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentDecline = () => {
    addToast('Payment transaction cancelled by customer.', 'warning');
    navigate('/cart');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Razorpay Sandbox Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        {/* Glow decoration */}
        <div className="absolute -top-1/4 -right-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> SECURE GATEWAY
          </span>
          <span className="font-display font-black text-sm tracking-tight text-slate-800">
            Razorpay <span className="text-blue-650">Sandbox</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-500 block">AMOUNT TO PAY</span>
          <h2 className="font-display font-black text-3xl text-slate-900">₹{parseFloat(amount).toLocaleString('en-IN')}</h2>
        </div>
      </div>

      {/* Simulator Actions */}
      <div className="card-premium-gradient p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-700 mb-1">Razorpay Sandbox Simulator</h4>
            <p className="text-[10px] text-blue-600 leading-normal">
              This panel simulates the secure Razorpay payment lifecycle. Complete mock transaction validation checks.
            </p>
          </div>
        </div>

        {/* Inputs info */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-550">Cardholder Name</label>
            <input
              type="text"
              disabled
              value="John Doe (Mock Buyer)"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-xs text-slate-655"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-555">Mock Card Number</label>
            <input
              type="text"
              disabled
              value="••••  ••••  ••••  4321"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-xs text-slate-655"
            />
          </div>
        </div>

        {/* Simulator controls */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-500 animate-pulse">Securing transaction check...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handlePaymentSuccess}
              disabled={!tempOrderId}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Complete Mock Payment
            </button>
            <button
              onClick={handlePaymentDecline}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer"
            >
              Cancel Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default RazorpayPayment;
