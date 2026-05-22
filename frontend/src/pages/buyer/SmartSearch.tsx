import { useState } from 'react';
import { Sparkles, Loader, Search, HelpCircle, Box } from 'lucide-react';
import api from '../../services/api';
import { ProductCard } from './Home';
import { useToastStore } from '../../store/toastStore';

export const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedQuery, setParsedQuery] = useState<any | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { addToast } = useToastStore();

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      return addToast('Please enter an AI search query.', 'warning');
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await api.post('/api/ai/smart-search', { query });
      const data = response.data;
      setParsedQuery(data.parsedQuery || {});
      setResults(data.products || []);
      addToast('Query parsed successfully by AI!', 'success');
    } catch (err: any) {
      // Graceful fallback if Gemini API throws exception
      setParsedQuery({
        keywords: query,
        category: 'All',
        maxPrice: 'No Limit',
      });
      // Fallback: search products catalog
      try {
        const fallbackRes = await api.get('/api/products/', { params: { search: query } });
        setResults(fallbackRes.data || []);
      } catch (fallbackErr) {
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'cheap keyboard under 3000',
    'trending clothes for summer in fashion',
    'premium kitchen setup and electronics',
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* AI Header */}
      <div className="text-center py-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: '6s' }} /> GEMINI POWERED SEARCH
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 mb-2">
          AI Smart Search
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Type natural sentences to browse products. Our AI will automatically parse categories, price caps, and keywords for you.
        </p>
      </div>

      {/* search form */}
      <form onSubmit={handleSmartSearch} className="relative card-premium-gradient p-6 rounded-3xl shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., high stock mechanical keyboard under 5000 in electronics..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm shadow-sm bg-white text-slate-800 placeholder-slate-400"
          />
          <Sparkles className="absolute left-4 top-4.5 w-5 h-5 text-cyan-500 animate-pulse" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          {/* suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Suggestions:</span>
            {sampleQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.12)] hover:border-indigo-300 hover:text-indigo-650 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
              >
                "{q}"
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 btn-3d btn-3d-ai btn-shimmer-wrap disabled:opacity-50 text-xs flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader className="w-4.5 h-4.5 animate-spin" /> : <Search className="w-4.5 h-4.5" />}
            Analyze with AI
          </button>
        </div>
      </form>

      {/* viewport */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
          <p className="text-xs font-semibold text-slate-500 animate-pulse">Gemini AI is parsing filters & database index...</p>
        </div>
      ) : hasSearched ? (
        <div className="space-y-8 animate-fadeIn">
          {/* AI Parser Feedback */}
          {parsedQuery && (
            <div className="bg-gradient-to-r from-white to-cyan-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-xs uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> AI Filter Analysis
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {parsedQuery.keywords && (
                    <span className="text-xs font-bold text-slate-655 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                      Keyword: <strong className="text-indigo-600">"{parsedQuery.keywords}"</strong>
                    </span>
                  )}
                  {parsedQuery.category && (
                    <span className="text-xs font-bold text-slate-655 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                      Category: <strong className="text-cyan-600">"{parsedQuery.category}"</strong>
                    </span>
                  )}
                  {parsedQuery.maxPrice && (
                    <span className="text-xs font-bold text-slate-655 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                      Price Limit: <strong className="text-amber-600">₹{parsedQuery.maxPrice}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results grid */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-black text-slate-900 flex items-center gap-2">
              Matched Items ({results.length})
            </h2>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {results.map((prod) => (
                  <ProductCard key={prod._id || prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 p-8 rounded-2xl max-w-sm mx-auto shadow-sm">
                <Box className="w-10 h-10 text-slate-400 mx-auto mb-4 animate-bounce" />
                <h3 className="font-display font-bold text-base text-slate-800 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Try widening your search terms or adjusting target budget.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-center">
          <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3 animate-bounce" />
          <h3 className="font-display font-bold text-base text-slate-800 mb-1">How it works</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Our search utilizes Gemini generative AI to translate conversational search sentences (like "I need running clothes or cool shoes under 4000") into MongoDB queries. Try typing a query above to see it in action!
          </p>
        </div>
      )}
    </div>
  );
};
export default SmartSearch;
