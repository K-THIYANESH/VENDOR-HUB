import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight, Package } from 'lucide-react';


export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || 'ORDER_XYZ';

  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-12 animate-fadeIn">
      {/* Success badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto animate-bounce shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-pulse" />
      </div>

      <div className="space-y-3">
        <h1 className="font-display font-black text-3xl text-slate-900">Order Confirmed!</h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
          Thank you for your purchase! Your hyperlocal order has been logged successfully and sent to vendor coordination.
        </p>
      </div>

      {/* Invoice details */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2.5">
          <span className="text-slate-500">Order ID Number</span>
          <span className="font-bold text-slate-800 select-all font-mono">{orderId}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <Package className="w-4 h-4 text-indigo-500" />
          <span>Status: <strong className="text-slate-800">Pending Verification</strong></span>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-col gap-3">
        <Link
          to="/orders"
          className="w-full btn-primary-gradient font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          Track Hyperlocal Orders
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-xs transition-colors border border-slate-200"
        >
          Return to Shopping
        </Link>
      </div>
    </div>
  );
};
export default OrderSuccess;
