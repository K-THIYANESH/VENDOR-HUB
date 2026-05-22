import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Box } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20 card-premium-gradient rounded-3xl p-8 max-w-md mx-auto space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto animate-bounce">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Please log in to view items in your persistent shopping cart and synchronize catalog selections.
        </p>
        <Link
          to="/role-selection"
          className="px-6 py-2.5 rounded-xl btn-3d btn-3d-auth btn-shimmer-wrap text-xs inline-block"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 1500 ? 0 : 150;
  const platform = 49;
  const total = subtotal + delivery + platform;

  if (isLoading && items.length === 0) {
    return (
      <div className="text-center py-20">
        <Box className="w-10 h-10 text-indigo-550 animate-bounce mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Retrieving shopping cart items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-800">Shopping Cart</h1>
        <p className="text-xs text-slate-500">Review selected catalog items and finalize quantities.</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-slate-500">{items.length} unique items selected</span>
              <button onClick={() => clearCart()} className="btn-3d btn-3d-danger text-[10px] px-3 py-1.5">
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                const imgUrl = item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
                return (
                  <div
                    key={item.productId}
                    className="card-premium-gradient p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                        <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-1">{item.name}</h4>
                        <span className="font-display font-black text-slate-900 text-sm">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-850">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing calculations card */}
          <div className="card-premium-gradient p-6 rounded-3xl space-y-6">
            <h3 className="font-display font-black text-lg text-slate-800 pb-4 border-b border-slate-200">
              Cart Summary
            </h3>

            <div className="space-y-3.5 border-b border-slate-200 pb-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Shipping Charges</span>
                <span className="font-bold text-slate-800">
                  {delivery === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${delivery}`}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Platform Commission Fee</span>
                <span className="font-bold text-slate-800">₹{platform}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-slate-600">Estimated Total</span>
              <span className="font-display font-black text-2xl text-slate-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-3d btn-3d-checkout btn-shimmer-wrap font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-normal">
                Enjoy 100% buyer protection. Orders are fully verified by administrative moderation.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 card-premium-gradient rounded-3xl p-8 max-w-sm mx-auto space-y-6">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
          <h2 className="font-display text-lg font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
            Looks like you haven't added any products to your cart. Explore the catalog and start shopping!
          </p>
          <Link
            to="/products"
            className="px-6 py-2.5 rounded-xl btn-3d btn-3d-buyer btn-shimmer-wrap text-xs inline-block"
          >
            Start Browsing Catalog
          </Link>
        </div>
      )}
    </div>
  );
};
export default Cart;
