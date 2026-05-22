import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return addToast('Please input your registered email.', 'warning');
    }

    setIsSubmitted(true);
    addToast('Simulation: Reset link dispatched to ' + email, 'success');
  };

  return (
    <div>
      {!isSubmitted ? (
        <>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black text-slate-800 mb-1">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500">
              Input your account email address below and we will dispatch a password reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white text-slate-850 placeholder-slate-400"
                />
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-3d btn-3d-auth btn-shimmer-wrap font-bold py-2.5 rounded-xl text-sm mt-4"
            >
              Send Reset Code
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800 mb-2">Code Dispatched</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            A password recovery link has been dispatched to <strong>{email}</strong>. Check your inbox or spam directory.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
        </Link>
      </div>
    </div>
  );
};
export default ForgotPassword;

