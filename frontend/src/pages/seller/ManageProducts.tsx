import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Box } from 'lucide-react';
import api from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import { TableSkeleton } from '../../components/common/Skeletons';

export const ManageProducts = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/api/products/seller/my-products');
      setProducts(response.data || []);
    } catch (err) {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/api/products/${prodId}`);
      addToast('Product listing deleted successfully!', 'success');
      fetchMyProducts();
    } catch (err) {
      // Interceptor prints errors
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={4} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-800">Manage Catalog Listings</h1>
          <p className="text-xs text-slate-500">Add, edit, or adjust hyperlocal product supplies and descriptions.</p>
        </div>

        <Link
          to="/seller/add-product"
          className="px-5 py-2.5 btn-primary-gradient font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all self-start sm:self-center shadow-md"
        >
          <PlusCircle className="w-4.5 h-4.5" /> Add New Listing
        </Link>
      </div>

      {/* Grid listing */}
      {products.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Active Stock</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((prod) => {
                const imgUrl = prod.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80';
                return (
                  <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Name & description */}
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

                    {/* Price */}
                    <td className="p-4 font-display font-black text-slate-800">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full border ${
                        prod.stock <= 3
                          ? 'text-rose-700 bg-rose-50 border-rose-100'
                          : 'text-slate-650 bg-slate-50 border-slate-200'
                      }`}>
                        {prod.stock} items left
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/seller/edit-product/${prod._id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-650 hover:bg-slate-100 rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-2 text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto space-y-6 shadow-sm">
          <Box className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="font-display text-lg font-bold text-slate-800">No products listed</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            You haven't listed any hyperlocal retail products on VendorHub yet.
          </p>
          <Link
            to="/seller/add-product"
            className="px-6 py-2.5 rounded-xl btn-primary-gradient font-bold text-xs inline-block transition-all shadow-md"
          >
            List Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};
export default ManageProducts;
