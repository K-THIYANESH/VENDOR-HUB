import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Laptop, Shirt, ShieldCheck, Zap } from 'lucide-react';
import api from '../../services/api';
import { ProductGridSkeleton } from '../../components/common/Skeletons';

const categories = [
  { name: 'Electronics', icon: Laptop, color: 'text-indigo-600 bg-indigo-50 border-indigo-150' },
  { name: 'Fashion', icon: Shirt, color: 'text-cyan-600 bg-cyan-50 border-cyan-150' },
  { name: 'Home & Kitchen', icon: ShieldCheck, color: 'text-amber-700 bg-amber-50 border-amber-150' },
];

export const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products/');
        setProducts(response.data.slice(0, 4) || []);
      } catch (err) {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-50/70 via-white to-cyan-50/50 border border-indigo-100/50 px-6 py-16 sm:px-12 sm:py-24 text-center shadow-premium">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-750 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-650 animate-pulse" /> AI-POWERED COMMERCE
          </span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
          Hyperlocal Commerce,{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Supercharged by AI
          </span>
        </h1>
        
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          Welcome to the next generation of hyperlocal multi-vendor retail. Discover local products, generate AI descriptions, and enjoy frictionless checkout payments.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-bold shadow-premium glow-hover flex items-center justify-center gap-1.5 transition-all text-sm"
          >
            Explore Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/ai-search"
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-indigo-150 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1.5 text-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-650 animate-spin" style={{ animationDuration: '6s' }} />
            Try Smart AI Search
          </Link>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-black text-slate-900">Explore Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group p-6 card-premium-gradient rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-4 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800 group-hover:text-indigo-650 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-500">Browse collection</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-black text-slate-900">Best Selling Products</h2>
            <p className="text-xs text-slate-500">Curated trending products from verified vendors near you.</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-indigo-650 hover:text-indigo-800 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-premium-gradient border border-slate-200 rounded-2xl p-8 max-w-sm mx-auto">
            <Zap className="w-8 h-8 text-indigo-500 mx-auto mb-3 animate-pulse" />
            <h3 className="font-display font-bold text-base text-slate-800 mb-1">No products available</h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">Be the first to list high-quality items on VendorHub!</p>
            <Link
              to="/login?role=seller"
              className="text-xs font-bold btn-secondary-tint px-4 py-2 rounded-lg inline-block"
            >
              List a Product
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

// Shared Product Card Widget
export const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

  return (
    <div
      onClick={() => navigate(`/product/${product._id || product.id}`)}
      className="group card-premium-gradient p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-1 h-full"
    >
      {/* Product Image */}
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-55 border border-slate-100 mb-4 relative shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider text-indigo-750 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full shadow-premium">
          {product.category || 'Product'}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-slate-800 group-hover:text-indigo-650 transition-colors line-clamp-1 mb-1 text-sm">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <span className="font-display font-black text-slate-900 text-base">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500">Stock: {product.stock}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
