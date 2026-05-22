// Product Card loading placeholder
export const ProductCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse">
    <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4" />
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
    <div className="flex justify-between items-center">
      <div className="h-6 bg-slate-200 rounded w-1/4" />
      <div className="h-9 bg-slate-200 rounded-full w-9" />
    </div>
  </div>
);

// Product Grid placeholder
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// KPI Widget placeholder
export const StatsCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-10 bg-slate-200 rounded-full w-10" />
    </div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
    <div className="h-4 bg-slate-200 rounded w-1/4" />
  </div>
);

// Chart loading placeholder
export const ChartSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
    <div className="h-[300px] bg-slate-200/50 rounded-xl" />
  </div>
);

// Table loader
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-12 bg-slate-200/50 border-b border-slate-100" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-slate-100">
        <div className="h-6 bg-slate-200 rounded flex-1" />
        <div className="h-6 bg-slate-200 rounded flex-1" />
        <div className="h-6 bg-slate-200 rounded flex-1" />
      </div>
    ))}
  </div>
);
