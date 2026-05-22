import { Link } from 'react-router-dom';
import { Sparkles, Globe, Shield, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-8 mt-auto text-slate-650">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Vision */}
          <div className="md:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-ai-500 flex items-center justify-center text-white shadow-premium">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-slate-900">
                Vendor<span className="bg-gradient-to-r from-brand-600 to-ai-500 bg-clip-text text-transparent">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              AI-driven Hyperlocal Multi-Vendor E-Commerce SaaS. Empowering buyers, vendors, and admins with predictive logistics and real-time commerce analytics.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 bg-slate-200 border border-slate-350 px-2 py-1 rounded-md flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-550" /> Active Platform
              </span>
            </div>
          </div>

          {/* Buyers Columns */}
          <div>
            <h4 className="font-display text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Buyer Portal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link to="/ai-search" className="text-sm text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Smart AI Search
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers Columns */}
          <div>
            <h4 className="font-display text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Partner Portal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/role-selection" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/add-product" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  AI Listings Generator
                </Link>
              </li>
              <li>
                <Link to="/seller/earnings" className="text-sm text-slate-600 hover:text-brand-600 transition-colors">
                  Vendor Earnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin / Security */}
          <div>
            <h4 className="font-display text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Security & Support</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/admin" className="text-sm text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> Administration Hub
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Help Center
                </span>
              </li>
              <li>
                <span className="text-xs text-slate-450 block mt-2">
                  Built for Hackathon DevFusion 2.0. Powered by React 19 & Flask.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-450">
            © {new Date().getFullYear()} VendorHub Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
