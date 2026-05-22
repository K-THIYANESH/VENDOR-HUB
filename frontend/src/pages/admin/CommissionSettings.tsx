import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';

export const CommissionSettings = () => {
  const { addToast } = useToastStore();
  const [commissionRate, setCommissionRate] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch commission settings
  const fetchCommission = async () => {
    setIsFetching(true);
    try {
      const response = await api.get('/api/admin/commission');
      setCommissionRate(response.data.commissionPercent?.toString() || '10');
    } catch (err) {
      // Ignore
    } finally {
      setIsFetching(false);
    }
  };

  // Save updated settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionRate || isNaN(parseFloat(commissionRate))) {
      return addToast('Please enter a valid commission percentage rate.', 'warning');
    }

    setIsLoading(true);
    try {
      await api.post('/api/admin/commission', {
        commissionPercent: parseFloat(commissionRate),
      });
      addToast('Platform commission settings updated successfully!', 'success');
    } catch (err) {
      // Handled by api
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommission();
  }, []);

  return (
    <div className="space-y-8 max-w-md mx-auto animate-fadeIn">
      {/* Back button and title */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h1 className="font-display font-black text-3xl text-slate-800">Commission Rules</h1>
        <p className="text-xs text-slate-500">Configure global transaction commission fees deducted from seller sales.</p>
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center min-h-[150px]">
          <Loader className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-6">
          {/* Form input fields */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 block">Commission Fee Percentage</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="10"
                className="w-full border border-slate-250 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold bg-white text-slate-850 placeholder-slate-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">
                %
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              This rate is automatically applied to vendor sales subtotals when calculations for direct settlements are made.
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary-gradient disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-colors"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Commission Settings
          </button>
        </form>
      )}
    </div>
  );
};

export default CommissionSettings;

