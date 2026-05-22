import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import api from '../../services/api';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();

  const [role, setRole] = useState<UserRole>('buyer');
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

  // Already authenticated guard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'seller') navigate('/seller');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/home');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return addToast('Please enter both email and password.', 'warning');
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data;
      
      // Save credentials in persistent Zustand store
      setAuth(data.token, {
        userId: data.userId,
        name: data.name,
        email,
        role: data.role as UserRole,
      });

      addToast(`Welcome back, ${data.name}!`, 'success');
      
      // Redirect based on backend authenticated role
      if (data.role === 'seller') navigate('/seller');
      else if (data.role === 'admin') navigate('/admin');
      else navigate('/home');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Invalid credentials or login failed';
      addToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-black text-slate-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to access your dashboard as a <span className="font-bold text-indigo-600 capitalize">{role}</span>.
        </p>
      </div>

      {/* Role Picker Toggles */}
      <div className="flex bg-slate-100/80 backdrop-blur border border-slate-200/50 p-1.5 rounded-2xl mb-6 gap-1">
        {(['buyer', 'seller', 'admin'] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-xl text-xs font-black capitalize transition-all duration-200 ${
              role === r
                ? 'bg-white text-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-slate-200 translate-y-0'
                : 'text-slate-500 hover:text-slate-850 hover:-translate-y-0.5 hover:shadow-sm hover:bg-white/50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
            <Link to="/forgot-password" className="text-xs text-indigo-650 hover:text-indigo-800 hover:underline">Forgot?</Link>
          </div>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-3d btn-3d-auth btn-shimmer-wrap disabled:opacity-50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-6"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In to Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to={`/register?role=${role}`} className="text-indigo-650 font-bold hover:text-indigo-800 hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
};
export default Login;
