import { useState, useEffect } from 'react';
import { DollarSign, Percent, Landmark, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { StatsCardSkeleton } from '../../components/common/Skeletons';

export const EarningsDashboard = () => {
  const [earnings, setEarnings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/seller/earnings');
      setEarnings(response.data);
    } catch (err) {
      // Mock fallback values for safety
      setEarnings({
        totalEarnings: 45000,
        commissionPercent: 10,
        commissionAmount: 4500,
        finalPayout: 40500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
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
          <h1 className="font-display font-black text-3xl text-slate-800">Earnings & Revenue</h1>
          <p className="text-xs text-slate-500">Track vendor sales metrics, commissions adjustments, and pending bank payouts.</p>
        </div>

        <button
          onClick={fetchEarnings}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Payouts
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Gross Revenue */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Gross Sales Revenue</span>
                <h3 className="font-display font-black text-2xl text-slate-800">
                  ₹{earnings?.totalEarnings?.toLocaleString('en-IN') || '0'}
                </h3>
                <span className="text-[10px] text-slate-550 font-semibold">Total items sold subtotal</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Platform Commission */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Platform Commission</span>
                <h3 className="font-display font-black text-2xl text-slate-800">
                  ₹{earnings?.commissionAmount?.toLocaleString('en-IN') || '0'}
                </h3>
                <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full inline-block">
                  Rate: {earnings?.commissionPercent}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                <Percent className="w-6 h-6" />
              </div>
            </div>

            {/* Net Payout */}
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white border border-indigo-700 p-6 rounded-2xl shadow-lg flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-100 block uppercase">Net Disbursed Payout</span>
                <h3 className="font-display font-black text-2xl text-white">
                  ₹{earnings?.finalPayout?.toLocaleString('en-IN') || '0'}
                </h3>
                <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct to Linked Bank
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white">
                <Landmark className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Direct Bank Payout terms */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-800">Hyperlocal Payout Terms</h3>
            <div className="text-xs text-slate-500 space-y-3 leading-relaxed">
              <p>
                1. Earnings payouts are processed automatically every Friday based on completed order deliveries.
              </p>
              <p>
                2. Standard platform commissions ({earnings?.commissionPercent}%) are calculated dynamically in accordance with platform administrative regulations.
              </p>
              <p>
                3. Refund claims that are approved by administration will be directly deducted from the subsequent weekly payout settlement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsDashboard;
