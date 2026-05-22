import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, RefreshCw, CheckCircle, Truck, Package, Clock, Loader } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { TableSkeleton } from '../../components/common/Skeletons';

export const SellerOrders = () => {
  const { addToast } = useToastStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/orders/seller-orders');
      setOrders(response.data || []);
    } catch (err) {
      // Handled silently by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/api/orders/update-status/${orderId}`, { status: newStatus });
      addToast(`Order status updated to ${newStatus}`, 'success');
      // Optimistically update status local state
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      // Interceptor alerts error
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Placed':
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
      case 'Confirmed':
        return <Package className="w-3.5 h-3.5 text-amber-500" />;
      case 'Shipped':
        return <Truck className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Delivered':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      case 'Confirmed':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Shipped':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'Delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-250';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => window.history.back()}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="font-display font-black text-3xl text-slate-800">Logistical Handovers</h1>
          <p className="text-xs text-slate-500">Track and dispatch customer purchases for hyperlocal delivery.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : orders.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Customer Items</th>
                <th className="p-4">Financial Status</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 pr-6 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {orders.map((order) => {
                const totalItemsPrice = order.items.reduce(
                  (sum: number, item: any) => sum + item.subtotal,
                  0
                );
                return (
                  <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                    {/* Order details metadata */}
                    <td className="p-4 pl-6 space-y-1">
                      <span className="font-mono font-bold text-slate-800">#{order.orderId.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Customer purchase items list */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-650">
                            <span className="font-bold text-slate-800">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Financial summary stats */}
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-slate-850 block">
                        ₹{totalItemsPrice.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                          order.paymentStatus === 'Paid'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                            : 'text-slate-600 bg-slate-50 border-slate-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Status badges */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Process statuses buttons */}
                    <td className="p-4 pr-6 text-right">
                      {updatingId === order.orderId ? (
                        <Loader className="w-4 h-4 animate-spin text-brand-650 inline-block" />
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          {order.orderStatus === 'Placed' && (
                            <button
                                onClick={() => handleUpdateStatus(order.orderId, 'Confirmed')}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] transition-colors"
                            >
                              Confirm Order
                            </button>
                          )}
                          {order.orderStatus === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(order.orderId, 'Shipped')}
                              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg text-[10px] transition-colors"
                            >
                              Ship Item
                            </button>
                          )}
                          {order.orderStatus === 'Shipped' && (
                            <button
                              onClick={() => handleUpdateStatus(order.orderId, 'Delivered')}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] transition-colors"
                            >
                              Handover/Deliver
                            </button>
                          )}
                          {order.orderStatus === 'Delivered' && (
                            <span className="text-[10px] font-bold text-slate-400">Fulfilled</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-6 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="font-display text-lg font-bold text-slate-800">No Orders Received</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            Orders placed for your products will show up here for you to fulfill.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
