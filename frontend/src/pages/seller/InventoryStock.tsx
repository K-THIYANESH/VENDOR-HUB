import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { TableSkeleton } from '../../components/common/Skeletons';

export const InventoryStock = () => {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLowStock = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/seller/low-stock');
      setLowStockProducts(response.data || []);
    } catch (err) {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
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
          <h1 className="font-display font-black text-3xl text-slate-800">Low Stock Alerts</h1>
          <p className="text-xs text-slate-500">Monitor items running low on stock (less than 5 units) and update inventory.</p>
        </div>

        <button
          onClick={fetchLowStock}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : lowStockProducts.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {lowStockProducts.map((prod) => {
                const imgUrl = prod.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80';
                return (
                  <tr key={prod._id} className="hover:bg-rose-50/30 transition-colors">
                    {/* Details */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                        <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1 mb-0.5">{prod.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {prod._id}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-semibold text-slate-650">{prod.category}</td>

                    {/* Stock level alert color */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-rose-700 bg-rose-50 border border-rose-100">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {prod.stock} left
                      </span>
                    </td>

                    {/* Price tag */}
                    <td className="p-4 font-display font-black text-slate-800">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>

                    {/* Restock action */}
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/seller/edit-product/${prod._id}`}
                        className="inline-flex items-center px-3.5 py-1.5 btn-primary-gradient font-bold rounded-xl text-xs transition-all shadow-sm"
                      >
                        Restock Now
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-6 shadow-sm">
          <AlertCircle className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="font-display text-lg font-bold text-slate-800">All Stock Stable</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            None of your hyperlocal retail products are running critically low on stock. Good job!
          </p>
          <Link
            to="/seller/products"
            className="px-6 py-2.5 rounded-xl btn-primary-gradient font-bold text-xs inline-block transition-all shadow-md"
          >
            Go to Product Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default InventoryStock;
