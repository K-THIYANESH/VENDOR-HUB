import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, DollarSign, Package, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { StatsCardSkeleton, ChartSkeleton } from '../../components/common/Skeletons';

// Sales Coordinates Mock Data
const chartData = [
  { day: 'Mon', revenue: 4000 },
  { day: 'Tue', revenue: 7500 },
  { day: 'Wed', revenue: 5000 },
  { day: 'Thu', revenue: 12000 },
  { day: 'Fri', revenue: 9000 },
  { day: 'Sat', revenue: 15000 },
  { day: 'Sun', revenue: 23992 },
];

export const SellerDashboard = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/api/seller/dashboard');
        setStats(response.data);
      } catch (err) {
        // Fallback mock stats for local development checks
        setStats({
          sellerName: 'Vendor Partner',
          totalOrders: 14,
          totalProducts: 8,
          totalRevenue: 62450,
          weeklySales: 23992,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-slate-800">
          Welcome back, <span className="text-neon-gradient font-black glow-text-neon">{stats?.sellerName}</span>
        </h1>
        <p className="text-xs text-slate-500">Monitor active hyperlocal inventories, orders supply, and platform earnings.</p>
      </div>

      {/* KPI stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-100 hover:border-indigo-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-0.5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Revenue</span>
            <h3 className="font-display font-black text-2xl text-slate-800">
              ₹{stats?.totalRevenue.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.5% Growth
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Supply items */}
        <div className="bg-white border border-slate-100 hover:border-cyan-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-0.5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Products</span>
            <h3 className="font-display font-black text-2xl text-slate-800">{stats?.totalProducts} Listings</h3>
            <span className="text-[10px] text-slate-500 font-semibold">Active catalog listings</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-100 hover:border-amber-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-0.5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Active Orders</span>
            <h3 className="font-display font-black text-2xl text-slate-800">{stats?.totalOrders} Orders</h3>
            <span className="text-[10px] text-slate-500 font-semibold">Pending logistical handovers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Recharts Graphic */}
      <div className="card-premium-gradient p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-800">Financial Earnings Analysis</h3>
            <p className="text-[10px] text-slate-500">Weekly platform sales summaries including taxations and commissions deductions.</p>
          </div>
          <span className="text-xs font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Weekly Track
          </span>
        </div>

        {/* Chart Viewport */}
        <div className="h-[300px] w-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '11px',
                }}
                itemStyle={{ color: '#1e293b' }}
                labelStyle={{ color: '#64748b' }}
                formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default SellerDashboard;
