import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { ProductCard } from './Home';
import { ProductGridSkeleton } from '../../components/common/Skeletons';

const categoriesList = ['Electronics', 'Fashion', 'Home & Kitchen'];

export const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // States synchronized with query params
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('');

  // Sync state changes with URL query parameters
  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;
        
        const response = await api.get('/api/products/', { params });
        let items = response.data || [];
        
        // Sorting items locally
        if (sortBy === 'price_asc') {
          items.sort((a: any, b: any) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          items.sort((a: any, b: any) => b.price - a.price);
        }
        
        setProducts(items);
      } catch (err) {
        // Handled silently
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sortBy]);

  const handleClearFilters = () => {
    setSearchParams({});
    setCategory('');
    setSearch('');
    setSortBy('');
  };

  const handleCategorySelect = (catName: string) => {
    const nextCat = category === catName ? '' : catName;
    setCategory(nextCat);
    const newParams: any = {};
    if (nextCat) newParams.category = nextCat;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-8">
      {/* Header and Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900">Explore Catalog</h1>
          <p className="text-xs text-slate-500">Discover quality hyperlocal items verified by our administrators.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sorting dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none border border-slate-200 bg-white text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700"
          >
            <option value="">Default Sorting</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Mobile Filter trigger */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="sm:hidden border border-slate-200 bg-white p-2.5 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop Side Filters */}
        <aside className="hidden sm:block w-60 shrink-0 card-premium-gradient p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" /> Filters
            </h3>
            {(category || search || sortBy) && (
              <button onClick={handleClearFilters} className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer">
                Reset
              </button>
            )}
          </div>

          {/* Categories select */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Product Categories</h4>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-indigo-50 text-indigo-650 font-bold border-l-4 border-indigo-500'
                      : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid Viewport */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id || prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card-premium-gradient border border-slate-100 rounded-2xl max-w-md mx-auto p-8 shadow-sm">
              <Box className="w-10 h-10 text-slate-400 mx-auto mb-4 animate-pulse" />
              <h3 className="font-display font-bold text-base text-slate-800 mb-1">No products found</h3>
              <p className="text-xs text-slate-500 leading-normal mb-6">We couldn't locate any products matching your active filters.</p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl btn-primary-gradient text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter slider overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white border-l border-slate-100 h-full shadow-2xl p-6 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full bg-slate-50 cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategorySelect(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                        category === cat ? 'bg-indigo-50 text-indigo-650 font-bold' : 'text-slate-550 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {(category || search || sortBy) && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="mt-auto w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reset Active Filters
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProductListing;
