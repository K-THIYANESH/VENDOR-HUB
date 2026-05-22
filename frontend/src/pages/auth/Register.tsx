import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader, Sparkles } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import type { UserRole } from '../../store/authStore';
import api from '../../services/api';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [role, setRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync role with query params
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && ['buyer', 'seller', 'admin'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return addToast('Please fill out all required fields.', 'warning');
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/register', {
        username: name,
        email,
        password,
        role,
      });

      addToast('Registration successful! Please sign in.', 'success');
      navigate(`/login?role=${role}`);
    } catch (err) {
      // Handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-black text-slate-800 mb-1">
          Create Account
        </h2>
        <p className="text-xs text-slate-500">
          Sign up to join our platform as a <span className="font-bold text-indigo-600 capitalize">{role}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all bg-white text-slate-850 placeholder-slate-400"
            />
            <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all bg-white text-slate-850 placeholder-slate-400"
            />
            <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all bg-white text-slate-850 placeholder-slate-400"
            />
            <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          </div>
        </div>

        {/* Role Warnings */}
        {role === 'seller' && (
          <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-cyan-800 leading-normal">
              <strong>Note:</strong> Seller accounts require approval from our administrator panel before they can list products.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-3d btn-3d-auth btn-shimmer-wrap disabled:opacity-50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-6"
        >
          {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Create Free Account'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to={`/login?role=${role}`} className="text-indigo-650 font-bold hover:text-indigo-800 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
export default Register;
