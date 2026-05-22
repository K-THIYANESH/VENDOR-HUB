import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Truck, ArrowLeft, ShieldCheck, Box, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';

const steps = [
  { label: 'Placed', desc: 'Order logged in platform catalog' },
  { label: 'Confirmed', desc: 'Vendor confirmed product supply' },
  { label: 'Shipped', desc: 'Package passed to logistics carrier' },
  { label: 'Delivered', desc: 'Delivered at designated shipping address' },
];

export const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { addToast } = useToastStore();

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      setIsLoading(true);
      try {
        // Find matching order in buyer orders history list
        const res = await api.get('/api/orders/my-orders');
        const matched = res.data.find((o: any) => o._id === orderId);
        if (matched) {
          setOrder(matched);
        } else {
          addToast('Order record not found.', 'warning');
        }
      } catch (err) {
        addToast('Failed to load tracking data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <LoaderSpinner />
        <p className="text-xs font-semibold text-slate-500 mt-4 animate-pulse">Tracing hyperlocal logistic progression...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-4 shadow-sm">
        <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="font-display font-bold text-base text-slate-800">No active tracking id</h3>
        <Link to="/orders" className="text-xs font-bold text-indigo-650 hover:text-indigo-700">Back to My Orders</Link>
      </div>
    );
  }

  // Get index of active step
  const getActiveStepIndex = (status: string) => {
    if (status === 'Placed') return 0;
    if (status === 'Confirmed') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return 0;
  };

  const activeIndex = getActiveStepIndex(order.orderStatus);

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fadeIn">
      {/* Header navigations */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <Link to="/orders" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h1 className="font-display font-black text-2xl text-slate-900">Track Shipping Progression</h1>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          ID: {order._id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Progress Timeline Stepper */}
        <div className="md:col-span-2 card-premium-gradient p-6 rounded-3xl shadow-sm space-y-8">
          <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Truck className="w-4.5 h-4.5 text-indigo-500 animate-pulse" /> Shipment Chronicles
          </h3>

          <div className="relative pl-8 space-y-8">
            {/* Timeline backbone line */}
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-200" />

            {steps.map((step, idx) => {
              const isPassed = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={step.label} className="relative flex gap-4">
                  {/* Step Bubble marker */}
                  <span className={`absolute -left-[28px] w-6 h-6 rounded-full border-4 flex items-center justify-center text-white z-10 transition-all ${
                    isPassed
                      ? 'bg-indigo-650 border-white scale-105 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 border-slate-200'
                  }`}>
                    {isPassed && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </span>

                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${isPassed ? 'text-slate-850 font-extrabold' : 'text-slate-400'}`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
                          Active Status
                        </span>
                      )}
                    </h4>
                    <p className={`text-xs transition-colors leading-relaxed ${isPassed ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic summary details card */}
        <div className="card-premium-gradient p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-display font-black text-base text-slate-900 pb-3 border-b border-slate-100">
            Chronology Summary
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Destination Coordinates</span>
              <span className="text-xs font-semibold text-slate-700 leading-normal flex items-start gap-1">
                <Box className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {order.address}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Payment Method</span>
              <span className="text-xs font-bold text-slate-850">{order.paymentMethod}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Arrival</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Next 24-48 Hours (Hyperlocal)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoaderSpinner = () => (
  <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
);
export default OrderTracking;
