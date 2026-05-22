import { Link } from 'react-router-dom';
import { ShoppingBag, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'buyer',
    title: 'Buyer Portal',
    desc: 'Browse product categories, query AI Smart search, verify listings, and track your orders.',
    icon: ShoppingBag,
    color: 'from-brand-500 to-brand-600',
    bgColor: 'bg-brand-50/50',
    borderColor: 'hover:border-brand-300',
  },
  {
    id: 'seller',
    title: 'Seller Dashboard',
    desc: 'List products using AI description generator, monitor stock alerts, and track earnings.',
    icon: Landmark,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50/30',
    borderColor: 'hover:border-cyan-300',
  },
  {
    id: 'admin',
    title: 'Admin Platform',
    desc: 'Approve pending vendors, adjust commissions, handle refund disputes, and check platform statistics.',
    icon: ShieldCheck,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50/30',
    borderColor: 'hover:border-indigo-300',
  },
];

export const RoleSelection = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2 text-center">
        Select Workspace Portal
      </h2>
      <p className="text-sm text-slate-500 text-center mb-8">
        Choose your role to access your dedicated hub and workspace tools.
      </p>

      {/* Roles Stack */}
      <div className="flex flex-col gap-5 w-full">
        {roles.map((role, idx) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 card-premium-gradient ${role.borderColor}`}
            >
              {/* Icon Blob */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${role.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Information */}
              <div className="flex-1">
                <h3 className="font-display font-bold text-base text-slate-800 mb-1 flex items-center gap-1.5">
                  {role.title}
                  {role.id === 'seller' && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> AI Powered
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{role.desc}</p>
                
                {/* Visual Direct Actions */}
                <div className="flex items-center gap-4">
                  <Link
                    to={`/login?role=${role.id}`}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <span className="text-[10px] text-slate-300">|</span>
                  <Link
                    to={`/register?role=${role.id}`}
                    className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:opacity-85 transition-opacity"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default RoleSelection;
