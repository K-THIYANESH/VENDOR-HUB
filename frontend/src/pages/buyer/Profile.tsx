import { useAuthStore } from '../../store/authStore';
import { Mail, ShieldAlert, BellRing } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-900">Account Profile</h1>
        <p className="text-xs text-slate-500">Manage account credentials, visual preferences, and portal controls.</p>
      </div>

      <div className="card-premium-gradient p-8 rounded-3xl shadow-sm space-y-8">
        {/* Profile Details */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-650 border border-indigo-100 flex items-center justify-center font-display font-black text-xl shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-display font-extrabold text-slate-900 text-lg flex items-center gap-1.5 justify-center sm:justify-start">
              {user.name}
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </h3>
            <span className="text-xs text-slate-600 flex items-center gap-1.5 justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {user.email}
            </span>
          </div>
        </div>

        {/* Configurations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-display font-bold text-xs uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-slate-500" /> Notifications Feed
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recipients are notified automatically regarding product listings supply approvals or payment completions.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-3 shadow-sm">
            <h4 className="font-display font-bold text-xs uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" /> Account Security
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              JWT token sessions persist in secure browser local storage configurations for optimal protection layers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
