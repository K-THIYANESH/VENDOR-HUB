import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ShoppingBag, ArrowRight, DollarSign, Calendar, MapPin } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { TableSkeleton } from '../../components/common/Skeletons';

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my-orders');
      setOrders(response.data || []);
    } catch (err) {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefundRequest = async (orderId: string) => {
    try {
      await api.post(`/api/orders/refund/${orderId}`);
      addToast('Refund request logged successfully!', 'success');
      fetchOrders();
    } catch (err) {
      // Handled by Axios interceptor
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-900">My Orders</h1>
        <p className="text-xs text-slate-500">Track shipping updates, trace deliveries, or log refund disputes.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card-premium-gradient rounded-3xl p-6 shadow-sm space-y-6">
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Order ID</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{order._id}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Date Placed</span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Shipment Target</span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 max-w-[200px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {order.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-indigo-50 text-indigo-650 border-indigo-100'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="space-y-3.5 border-b border-slate-100 pb-4">
                {order.items?.map((item: any) => (
                  <div key={item.productId} className="flex justify-between items-center gap-4 py-1.5 first:pt-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      <span className="text-[10px] text-slate-500">
                        ₹{item.price.toLocaleString('en-IN')} × {item.quantity} · Vendor: {item.sellerName}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-500">Grand Total Amount Paid:</span>
                  <span className="font-display font-black text-base text-slate-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Refund Status */}
                  {order.refundStatus === 'Requested' ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Refund Disputed
                    </span>
                  ) : order.refundStatus === 'Approved' ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" /> Refund Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRefundRequest(order._id)}
                      className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Request Refund
                    </button>
                  )}

                  {/* Track link */}
                  <Link
                    to={`/orders/track?id=${order._id}`}
                    className="px-4 py-2 btn-primary-gradient font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-6 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
          <h2 className="font-display text-lg font-bold text-slate-800">No Orders Logged</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            You haven't placed any hyperlocal commerce orders on the platform yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-2.5 rounded-xl btn-primary-gradient font-bold text-xs inline-block transition-all"
          >
            Start Shopping Catalog
          </Link>
        </div>
      )}
    </div>
  );
};
export default Orders;
