import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Loader, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { TableSkeleton } from '../../components/common/Skeletons';

export const RefundManagement = () => {
  const { addToast } = useToastStore();
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch all pending refund requests
  const fetchRefundRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/refund-requests');
      setRefundRequests(response.data || []);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a refund claim
  const handleApproveRefund = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await api.put(`/api/admin/approve-refund/${orderId}`);
      addToast('Refund request approved successfully.', 'success');
      setRefundRequests((prev) => prev.filter((r) => r._id !== orderId));
    } catch (err) {
      // Handled globally
    } finally {
      setProcessingId(null);
    }
  };

  // Reject a refund claim
  const handleRejectRefund = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await api.put(`/api/admin/reject-refund/${orderId}`);
      addToast('Refund request rejected.', 'info');
      setRefundRequests((prev) => prev.filter((r) => r._id !== orderId));
    } catch (err) {
      // Handled globally
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, []);

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
          <h1 className="font-display font-black text-3xl text-slate-800">Refund Claims</h1>
          <p className="text-xs text-slate-500">Manage buyer order dispute filings and authorize payment cancellations.</p>
        </div>

        <button
          onClick={fetchRefundRequests}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-250 self-start sm:self-center shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : refundRequests.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Dispute Purchase Items</th>
                <th className="p-4">Total Amount Claimed</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 pr-6 text-right">Resolve Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {refundRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Order ID & Date */}
                  <td className="p-4 pl-6 space-y-1">
                    <span className="font-mono font-bold text-slate-850">#{req._id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-slate-450 block">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  {/* Dispute Items */}
                  <td className="p-4">
                    <div className="space-y-1">
                      {req.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-550">
                          <span className="font-bold text-slate-800">{item.quantity}x</span>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Refund total */}
                  <td className="p-4 font-display font-black text-slate-800">
                    ₹{req.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Payment option */}
                  <td className="p-4 font-semibold text-slate-550">{req.paymentMethod}</td>

                  {/* Action buttons */}
                  <td className="p-4 pr-6 text-right">
                    {processingId === req._id ? (
                      <Loader className="w-4 h-4 animate-spin text-indigo-650 inline-block" />
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproveRefund(req._id)}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Approve Refund Claim"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleRejectRefund(req._id)}
                          className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                          title="Reject Refund Claim"
                        >
                          <XCircle className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-6 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="font-display text-lg font-bold text-slate-800">No disputes active</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            All user transactions are settled. There are currently no active customer refund claims.
          </p>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;

