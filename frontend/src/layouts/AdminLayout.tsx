import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/common/Sidebar';
import { ToastContainer } from '../components/common/Toast';

export const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Role Gate
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex bg-neon-grid relative overflow-hidden">
      {/* Sharp Neon Glow Header Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neon-gradient z-50 shadow-[0_1px_10px_rgba(255,0,127,0.35)]" />

      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        {/* Scrollable administrative desk */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
export default AdminLayout;
