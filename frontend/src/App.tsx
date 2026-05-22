import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout imports
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth page imports
import RoleSelection from './pages/auth/RoleSelection';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Buyer page imports
import Intro from './pages/buyer/Intro';
import Home from './pages/buyer/Home';
import ProductListing from './pages/buyer/ProductListing';
import ProductDetails from './pages/buyer/ProductDetails';
import SmartSearch from './pages/buyer/SmartSearch';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import RazorpayPayment from './pages/buyer/RazorpayPayment';
import OrderSuccess from './pages/buyer/OrderSuccess';
import Orders from './pages/buyer/Orders';
import OrderTracking from './pages/buyer/OrderTracking';
import Profile from './pages/buyer/Profile';

// Seller page imports
import SellerDashboard from './pages/seller/SellerDashboard';
import ManageProducts from './pages/seller/ManageProducts';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import InventoryStock from './pages/seller/InventoryStock';
import EarningsDashboard from './pages/seller/EarningsDashboard';
import SellerOrders from './pages/seller/SellerOrders';

// Admin page imports
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorApproval from './pages/admin/VendorApproval';
import RefundManagement from './pages/admin/RefundManagement';
import CommissionSettings from './pages/admin/CommissionSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route Segment */}
        <Route element={<AuthLayout />}>
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Entry Landing Page */}
        <Route path="/" element={<Intro />} />

        {/* Buyer/General Route Segment */}
        <Route element={<BuyerLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/ai-search" element={<SmartSearch />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<RazorpayPayment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/track/:id" element={<OrderTracking />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Seller Portal Route Segment */}
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<ManageProducts />} />
          <Route path="/seller/add-product" element={<AddProduct />} />
          <Route path="/seller/edit-product/:id" element={<EditProduct />} />
          <Route path="/seller/low-stock" element={<InventoryStock />} />
          <Route path="/seller/earnings" element={<EarningsDashboard />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>

        {/* Admin Desk Route Segment */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<VendorApproval />} />
          <Route path="/admin/refunds" element={<RefundManagement />} />
          <Route path="/admin/commissions" element={<CommissionSettings />} />
        </Route>

        {/* Fallback Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
