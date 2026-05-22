import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Landmark, 
  ShieldCheck, 
  CheckCircle,
  Apple,
  Smartphone,
  Cpu,
  Gamepad2,
  Zap,
  Shirt,
  Laptop,
  Monitor,
  Tv,
  Activity,
  BarChart3,
  Percent
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Intro = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Route user to dashboard or select role
  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      if (user.role === 'seller') navigate('/seller');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/home');
    } else {
      navigate('/role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-neon-grid text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-[#ff007f]/25 selection:text-[#ff007f]">
      {/* Sharp Neon Glow Header Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neon-gradient z-50 shadow-[0_1px_10px_rgba(255,0,127,0.35)]" />

      {/* Landing navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 py-4 px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-neon-gradient flex items-center justify-center text-white shadow-premium glow-hover">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900">
            Vendor<span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#00f0ff] bg-clip-text text-transparent glow-text-neon animate-pulse-glow">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <button
              onClick={handleGetStarted}
              className="btn-3d btn-3d-auth btn-shimmer-wrap px-5 py-2 text-xs flex items-center gap-1.5"
            >
              Enter Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold text-slate-650 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link
                to="/role-selection"
                className="btn-3d btn-3d-auth btn-shimmer-wrap px-5 py-2 text-xs flex items-center gap-1.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero card segment */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff007f] bg-pink-50/50 border border-pink-100/85 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" /> Next-Gen Hyperlocal Commerce
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tight text-slate-900 leading-[1.05] max-w-4xl">
            Vendor<span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#bd00ff] bg-clip-text text-transparent">Hub</span>{' '}
            <span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#00f0ff] bg-clip-text text-transparent glow-text-neon animate-pulse-glow block mt-2 sm:inline sm:mt-0">
              Supercharged by AI
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Welcome to the ultimate digital engine bridging local vendors, buyers, and administrators. 
            Enjoy AI search queries, automated listing write-ups, and secure checkouts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto btn-3d btn-3d-auth btn-shimmer-wrap px-8 py-3.5 text-sm flex items-center justify-center gap-2"
            >
              Access Portal Hub
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/home"
              className="w-full sm:w-auto btn-3d btn-3d-neutral px-8 py-3.5 text-sm flex items-center justify-center gap-2"
            >
              Browse Catalog
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Scroll to Explore</span>
          <div className="w-1.5 h-6 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-full h-2 bg-indigo-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Brand Partner Infinite Ticker */}
      <section className="py-8 bg-white border-y border-slate-200/60 overflow-hidden select-none">
        <div className="max-w-6xl mx-auto px-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Trusted Retail Partners & Brands</span>
          <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full w-max">Active Sellers</span>
        </div>
        <div className="w-full relative flex items-center overflow-hidden py-3 bg-slate-50/50">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-infinite-scroll flex items-center gap-12 whitespace-nowrap">
            {/* First set of brands */}
            {[
              { name: 'Apple Inc.', icon: Apple, color: 'text-slate-900' },
              { name: 'Samsung Electronics', icon: Smartphone, color: 'text-blue-600' },
              { name: 'Intel Corp.', icon: Cpu, color: 'text-indigo-650' },
              { name: 'Sony Interactive', icon: Gamepad2, color: 'text-indigo-500' },
              { name: 'Nike Sportswear', icon: Zap, color: 'text-amber-500' },
              { name: 'Adidas Originals', icon: Shirt, color: 'text-cyan-500' },
              { name: 'HP Inc.', icon: Laptop, color: 'text-slate-600' },
              { name: 'Dell Technologies', icon: Monitor, color: 'text-blue-500' },
              { name: 'LG Home Appliances', icon: Tv, color: 'text-rose-500' },
              { name: 'Puma Global', icon: Activity, color: 'text-emerald-500' },
            ].map((brand, idx) => {
              const Icon = brand.icon;
              return (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow">
                  <Icon className={`w-4 h-4 ${brand.color}`} />
                  <span className="text-xs font-bold text-slate-700 tracking-tight">{brand.name}</span>
                </div>
              );
            })}
            {/* Duplicate set for seamless looping */}
            {[
              { name: 'Apple Inc.', icon: Apple, color: 'text-slate-900' },
              { name: 'Samsung Electronics', icon: Smartphone, color: 'text-blue-600' },
              { name: 'Intel Corp.', icon: Cpu, color: 'text-indigo-650' },
              { name: 'Sony Interactive', icon: Gamepad2, color: 'text-indigo-500' },
              { name: 'Nike Sportswear', icon: Zap, color: 'text-amber-500' },
              { name: 'Adidas Originals', icon: Shirt, color: 'text-cyan-500' },
              { name: 'HP Inc.', icon: Laptop, color: 'text-slate-600' },
              { name: 'Dell Technologies', icon: Monitor, color: 'text-blue-500' },
              { name: 'LG Home Appliances', icon: Tv, color: 'text-rose-500' },
              { name: 'Puma Global', icon: Activity, color: 'text-emerald-500' },
            ].map((brand, idx) => {
              const Icon = brand.icon;
              return (
                <div key={`dup-${idx}`} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow">
                  <Icon className={`w-4 h-4 ${brand.color}`} />
                  <span className="text-xs font-bold text-slate-700 tracking-tight">{brand.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Buyer info section */}
      <section className="py-24 bg-white border-y border-slate-100 flex flex-col items-center">
        <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff007f] bg-pink-50/50 border border-pink-100/85 px-3 py-1 rounded-full shadow-sm">
              Buyer Workspace
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
              Frictionless Shopping Catalog & Smart AI Queries
            </h2>
            <p className="text-slate-605 text-sm leading-relaxed">
              Explore nearby inventories immediately. Use our intelligent search bar, filter items seamlessly by category or budget, and utilize our AI-backed assistant to discover exactly what you need.
            </p>
            <div className="space-y-3.5 pt-2">
              {[
                'Instant smart AI recommendations based on item context',
                'Hyperlocal routing showing stock counts and vendor location data',
                'Frictionless checkout using integrated payment simulators',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-slate-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/home"
                className="btn-3d btn-3d-buyer btn-shimmer-wrap px-5 py-2.5 text-xs flex items-center gap-2"
              >
                Open Shopping Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="card-3d relative bg-gradient-to-tr from-[#ff007f]/8 via-slate-50/20 to-[#00f0ff]/10 p-6 rounded-3xl border border-slate-200/60 shadow-premium flex flex-col gap-4 overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm relative z-10 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Preview Catalog</span>
                <span className="text-[9px] font-black text-[#ff007f] bg-pink-50/50 border border-pink-150 px-1.5 py-0.5 rounded-full">Electronics</span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
                <img src="/quantum_phone.png" alt="Quantum Smart Phone Pro" className="w-full h-full object-cover select-none" />
                <span className="absolute bottom-2.5 right-2.5 text-[9px] font-black bg-slate-800/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg">₹49,999</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Quantum Smart Phone Pro</h4>
                <p className="text-[10px] text-slate-555">High speed, multi-camera, localized vendor stock.</p>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#ff007f]/10 blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Seller info section */}
      <section className="py-24 bg-slate-50 flex flex-col items-center border-b border-slate-100">
        <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="md:order-2 space-y-6"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e1306c] bg-pink-50/50 border border-pink-100/85 px-3 py-1 rounded-full shadow-sm">
              Seller Hub
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
              AI Descriptions & Advanced Stock Inventories
            </h2>
            <p className="text-slate-650 text-sm leading-relaxed">
              Launch your shop catalog online. Create products with a single click, utilize our AI generator to write optimized metadata and selling points instantly, and monitor financial dashboards.
            </p>
            <div className="space-y-3.5 pt-2">
              {[
                'Generative AI product description tools using system prompting',
                'Low stock visual alerts and tracking indicators',
                'Comprehensive earnings chart displaying commission details',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#e1306c] shrink-0" />
                  <span className="text-xs text-slate-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/role-selection?role=seller"
                className="btn-3d btn-3d-seller btn-shimmer-wrap px-5 py-2.5 text-xs flex items-center gap-2"
              >
                Become a Seller Partner
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="card-3d md:order-1 relative bg-gradient-to-tr from-[#f77737]/8 via-slate-50/20 to-[#833ab4]/10 p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-premium min-h-[400px] flex flex-col justify-center overflow-hidden"
          >
            {/* Background glowing blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#f77737]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e1306c]/12 rounded-full blur-3xl pointer-events-none" />

            {/* Main Interactive Looking Dashboard Card */}
            <div className="relative z-10 space-y-4">
              
              {/* Card 1: Earnings Chart Mockup */}
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Earnings</span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">₹84,250 <span className="text-xs text-emerald-600 font-bold font-sans">+12.5%</span></h4>
                  </div>
                  <div className="px-2.5 py-1 bg-pink-50/50 border border-pink-150 rounded-lg text-[10px] font-bold text-[#e1306c]">Weekly View</div>
                </div>
                {/* SVG Line Chart Graph */}
                <div className="h-20 w-full mt-2">
                  <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e1306c" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#e1306c" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    {/* Area path */}
                    <path d="M 0 70 Q 50 40 100 55 T 200 25 T 300 10 L 300 80 L 0 80 Z" fill="url(#chart-grad)" />
                    {/* Line path */}
                    <path d="M 0 70 Q 50 40 100 55 T 200 25 T 300 10" fill="none" stroke="#e1306c" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Indicator dots */}
                    <circle cx="200" cy="25" r="4" fill="#e1306c" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="300" cy="10" r="4" fill="#e1306c" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Card 2: AI Description Preview Overlay */}
              <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-md transform translate-x-4 md:translate-x-8 -mt-2 relative z-20 border-l-4 border-l-[#ff007f]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-pink-50/50 border border-pink-150 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#ff007f] animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#ff007f] tracking-wider">AI Content Assistant</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-800">"Quantum Earbuds Max"</p>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[9px] text-slate-655 space-y-1">
                    <div className="flex items-center gap-1"><span className="text-[#ff007f] font-bold">•</span><span>Hybrid Active Noise Cancellation (40dB)</span></div>
                    <div className="flex items-center gap-1"><span className="text-[#ff007f] font-bold">•</span><span>Audiophile sound signature with 11mm dynamic drivers</span></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Inventory Stock Counter */}
              <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm transform -rotate-1 -translate-x-2 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#ff007f]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Wireless Headset X1</h5>
                    <span className="text-[9px] font-bold text-[#ff007f] bg-pink-50 border border-pink-100 px-1.5 py-0.2 rounded-full">Only 2 left in stock</span>
                  </div>
                </div>
                <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[15%]" />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin info section */}
      <section className="py-24 bg-white border-t border-slate-100 flex flex-col items-center">
        <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#bd00ff] bg-purple-50/50 border border-purple-100/85 px-3 py-1 rounded-full shadow-sm">
              Admin Control Desk
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
              Manage Vendor Approvals, Refunds, & Commissions
            </h2>
            <p className="text-slate-650 text-sm leading-relaxed">
              Verify platform integrity easily. Access dashboard analytics detailing active user sign-ups, approve/reject sellers checking in, adjusting commissions dynamically, and checking refund parameters.
            </p>
            <div className="space-y-3.5 pt-2">
              {[
                'Vendor registrations approval dashboard',
                'Platform-wide financial commission settings adjusters',
                'Active customer disputes resolver screens',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#bd00ff] shrink-0" />
                  <span className="text-xs text-slate-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/role-selection?role=admin"
                className="btn-3d btn-3d-admin btn-shimmer-wrap px-5 py-2.5 text-xs flex items-center gap-2"
              >
                Access Admin Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="card-3d relative bg-gradient-to-tr from-[#bd00ff]/8 via-slate-50/20 to-[#00f0ff]/10 p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-premium min-h-[400px] flex flex-col justify-center overflow-hidden"
          >
            {/* Background glowing blobs */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-[#bd00ff]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#00f0ff]/12 rounded-full blur-3xl pointer-events-none" />

            {/* Main Interactive Looking Admin Console Mockup */}
            <div className="relative z-10 space-y-4">
              
              {/* Card 1: Platform Control Metrics */}
              <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex items-center justify-between transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Security Audit</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping animate-duration-1000" />
                    <span className="text-xs font-bold text-slate-800">All Systems Operational</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-slate-455 block tracking-wide">SELLER FEE</span>
                    <span className="text-xs font-black text-[#bd00ff]">5.0%</span>
                  </div>
                  <div className="text-center border-l border-slate-150 pl-4">
                    <span className="text-[9px] font-bold text-slate-455 block tracking-wide">DAILY VOL</span>
                    <span className="text-xs font-black text-[#00f0ff]">₹32,450</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Dual Approval Requests stacked */}
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-md transform -translate-x-4 md:-translate-x-8 -mt-2 relative z-20 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Pending Registrations</span>
                  <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">2 Requests</span>
                </div>
                <div className="space-y-2.5">
                  {/* Vendor 1 */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-50/50 border border-purple-100 flex items-center justify-center text-[10px] font-black text-[#bd00ff]">LV</div>
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-800">Local Vendors Inc</h5>
                        <span className="text-[8px] text-slate-550 block -mt-0.5">local@vendors.com</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="text-[9px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg transition-colors cursor-default">Deny</button>
                      <button className="text-[9px] font-black bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-sm shadow-emerald-500/20 transition-colors cursor-default">Approve</button>
                    </div>
                  </div>
                  {/* Vendor 2 */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-55 border border-cyan-200 flex items-center justify-center text-[10px] font-black text-cyan-705">AR</div>
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-800">Apex Retailers</h5>
                        <span className="text-[8px] text-slate-550 block -mt-0.5">apex@retail.com</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="text-[9px] font-black bg-slate-100 hover:bg-slate-200 text-slate-650 px-2.5 py-1 rounded-lg transition-colors cursor-default">Deny</button>
                      <button className="text-[9px] font-black bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-sm shadow-emerald-500/20 transition-colors cursor-default">Approve</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Commission & Disputes Graph Mock */}
              <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm transform rotate-1 translate-x-2 relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Percent className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Commissions & Audits</h5>
                    <p className="text-[9px] text-slate-400">Real-time smart contract distribution</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-[#bd00ff] bg-purple-50/50 border border-purple-150 px-2 py-0.5 rounded-full">Audit Clean</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Security & Trust Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-150 flex flex-col items-center">
        <div className="max-w-6xl w-full px-6 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full">
              Enterprise Cyber Security
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
              Fintech-Grade Security Architecture
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We implement industry-standard Zero-Trust controls, secure auth mechanisms, and deep isolation properties to protect every customer, seller, and transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-slate-800 mb-2">Zero-Trust Isolation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strict multi-tenant database rules isolate seller operations, ensuring sellers never access other vendors' inventory, order lists, or payout analytics.
              </p>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-slate-800 mb-2">Secured Token Rotation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tokens are issued using secure HttpOnly, SameSite, and Secure flags with short lifetimes and automated rotation to completely prevent XSS session hijack attacks.
              </p>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-slate-800 mb-2">NoSQL & WAF Defense</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deep payload sanitization stops malicious NoSQL syntax injections and query tampering. Adaptive API throttling shields our server from DDoS/brute force threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="py-16 bg-white border-t border-slate-100/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-indigo-650">450+</h3>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Approved Sellers</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-cyan-650">₹1.2M+</h3>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Secured Volume</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-indigo-650">99.99%</h3>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Server Uptime</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-cyan-650">0.02%</h3>
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Dispute Ratio</p>
          </div>
        </div>
      </section>

      {/* Role select CTA */}
      <section className="py-24 bg-slate-50 border-t border-slate-100 flex flex-col items-center text-center">
        <div className="max-w-4xl w-full px-6 space-y-12">
          <div className="space-y-4">
            <h2 className="font-display font-black text-4xl text-slate-900 leading-tight">
              Ready to Join the Marketplace?
            </h2>
            <p className="text-slate-655 text-sm max-w-xl mx-auto leading-relaxed">
              Select your role workspace below to enter the registration portal. 
              Enjoy our custom AI-powered commerce features instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {/* Buyer Card */}
            <div className="card-3d bg-white border border-slate-150 p-6 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center hover:shadow-premium hover:border-indigo-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-base text-slate-800 mb-2">Buyer Portal</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-normal">
                Explore local shops, check out items, and request reviews with AI.
              </p>
              <Link
                to="/register?role=buyer"
                className="w-full btn-3d btn-3d-buyer btn-shimmer-wrap py-2 text-xs text-center block"
              >
                Join as Buyer
              </Link>
            </div>

            {/* Seller Card */}
            <div className="card-3d bg-white border border-slate-150 p-6 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center hover:shadow-premium hover:border-cyan-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-base text-slate-800 mb-2">Seller Dashboard</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-normal">
                Use our description assistant and manage stock analytics.
              </p>
              <Link
                to="/register?role=seller"
                className="w-full btn-3d btn-3d-seller btn-shimmer-wrap py-2 text-xs text-center block"
              >
                Register Shop
              </Link>
            </div>

            {/* Admin Card */}
            <div className="card-3d bg-white border border-slate-150 p-6 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center hover:shadow-premium hover:border-indigo-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-base text-slate-800 mb-2">Admin Hub</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-normal">
                Handle platform rules, commission margins, and pending requests.
              </p>
              <Link
                to="/login?role=admin"
                className="w-full btn-3d btn-3d-admin btn-shimmer-wrap py-2 text-xs text-center block"
              >
                Enter Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform footer */}
      <footer className="py-8 bg-white border-t border-slate-150 text-center text-xs text-slate-500">
        <p>© 2026 VendorHub. Built with precision and supercharged by AI.</p>
      </footer>
    </div>
  );
};

export default Intro;

