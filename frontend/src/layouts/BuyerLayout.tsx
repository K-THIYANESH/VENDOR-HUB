import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BottomNav } from '../components/common/BottomNav';
import { ToastContainer } from '../components/common/Toast';

export const BuyerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neon-grid pb-16 md:pb-0 relative overflow-hidden">
      {/* Sharp Neon Glow Header Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neon-gradient z-50 shadow-[0_1px_10px_rgba(255,0,127,0.35)]" />

      <Navbar />
      
      {/* Scrollable Viewport Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
};
export default BuyerLayout;
