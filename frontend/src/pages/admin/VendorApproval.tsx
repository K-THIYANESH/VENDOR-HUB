import { useState, useEffect } from 'react';
import { ShieldAlert, ArrowLeft, RefreshCw, Loader, Check, Trash } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { TableSkeleton } from '../../components/common/Skeletons';

export const VendorApproval = () => {
  const { addToast } = useToastStore();
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPendingVendors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/pending-vendors');
      setVendors(response.data || []);
    } catch (err) {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (vendorId: string) => {
    setProcessingId(vendorId);
    try {
      await api.put(`/api/admin/approve-vendor/${vendorId}`);
      addToast('Vendor store approved successfully!', 'success');
      setVendors((prev) => prev.filter((v) => v._id !== vendorId));
    } catch (err) {
      // Alerted globally
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!confirm('Are you sure you want to reject and delete this seller profile?')) return;
    setProcessingId(vendorId);
    try {
      await api.delete(`/api/admin/reject-vendor/${vendorId}`);
      addToast('Vendor store rejected and deleted.', 'info');
      setVendors((prev) => prev.filter((v) => v._id !== vendorId));
    } catch (err) {
      // Alerted globally
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
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
          <h1 className="font-display font-black text-3xl text-slate-800">Vendor Approvals</h1>
          <p className="text-xs text-slate-500">Review pending seller store applications to allow product listing capabilities.</p>
        </div>

        <button
          onClick={fetchPendingVendors}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200 self-start sm:self-center shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : vendors.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Store/Vendor Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 pr-6 text-right">Administrative Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Name details */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold font-display">
                      {vendor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-0.5">{vendor.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {vendor._id}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-4 font-semibold text-slate-655">{vendor.email}</td>

                  {/* Verification */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                      Pending Verification
                    </span>
                  </td>

                  {/* Action controls */}
                  <td className="p-4 pr-6 text-right">
                    {processingId === vendor._id ? (
                      <Loader className="w-4 h-4 animate-spin text-brand-600 inline-block" />
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(vendor._id)}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Approve Store"
                        >
                          <Check className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleReject(vendor._id)}
                          className="p-2 text-rose-650 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                          title="Reject / Delete Store"
                        >
                          <Trash className="w-4.5 h-4.5" />
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
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="font-display text-lg font-bold text-slate-800">Clear queue</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            There are no pending multi-vendor registration requests needing administrative reviews.
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorApproval;
