import { Outlet } from 'react-router-dom';
import { ToastContainer } from '../components/common/Toast';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-grid relative overflow-hidden px-4 py-12">
      {/* Sharp Neon Glow Header Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neon-gradient z-50 shadow-[0_1px_10px_rgba(255,0,127,0.35)]" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Brand visual header */}
        <Link to="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-neon-gradient flex items-center justify-center text-white shadow-premium glow-hover">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-slate-900">
            Vendor<span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#00f0ff] bg-clip-text text-transparent glow-text-neon animate-pulse-glow">Hub</span>
          </span>
        </Link>

        {/* Central Workspace Card */}
        <div className="w-full bg-white/90 backdrop-blur-xl border border-slate-100 p-8 rounded-3xl shadow-lg glow-card-neon">
          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
export default AuthLayout;
