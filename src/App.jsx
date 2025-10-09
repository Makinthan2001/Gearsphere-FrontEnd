import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./pages/customer/CartContext";
import { OrdersProvider } from "./pages/customer/OrdersContext";
import SessionProvider from "./components/SessionProvider";
import AuthGuard from "./components/auth/AuthGuard";
import MainNavbar from "./components/navbar/MainNavbar";
import HomePage from "./pages/HomePage";
import Signup from "./components/signup/Signup";
import TechnicianManagement from "./pages/admin/TechnicianManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import OfflineBanner from "./components/OfflineBanner";

// Customer Pages
import Marketplace from "./pages/customer/Marketplace";
import PCBuilder from "./pages/customer/PCBuilder";
import FindTechnician from "./pages/customer/FindTechnician";
import Orders from "./pages/customer/Orders";
import CustomerProfile from "./pages/customer/Profile";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CPUPage from "./pages/customer/parts_components/cpu";
import CompareCPU from "./pages/customer/parts_components/compare_cpu";
import GPUPage from "./pages/customer/parts_components/gpu";
import CompareGPU from "./pages/customer/parts_components/compare_gpu";
import MotherboardPage from "./pages/customer/parts_components/motherboard";
import CompareMotherboard from "./pages/customer/parts_components/compare_motherboard";
import MemoryPage from "./pages/customer/parts_components/memory";
import CompareMemory from "./pages/customer/parts_components/compare_memory";
import StoragePage from "./pages/customer/parts_components/storage";
import CompareStorage from "./pages/customer/parts_components/compare_storage";
import PowerSupplyPage from "./pages/customer/parts_components/powersupply";
import ComparePowerSupply from "./pages/customer/parts_components/compare_powersupply";
import CasePage from "./pages/customer/parts_components/case";
import CompareCase from "./pages/customer/parts_components/compare_case";
import CPUCoolerPage from "./pages/customer/parts_components/cpucooler";
import CompareCPUCooler from "./pages/customer/parts_components/compare_cpucooler";
import MonitorPage from "./pages/customer/parts_components/monitor";
import CompareMonitor from "./pages/customer/parts_components/compare_monitor";
import OperatingSystemPage from "./pages/customer/parts_components/operatingsystem";
import CompareOperatingSystem from "./pages/customer/parts_components/compare_operatingsystem";
import CustomerReviews from "./pages/customer/CustomerReviews";
import TechnicianFeedback from "./pages/technician/TechnicianFeedback";
import AdminModerateReviews from "./pages/admin/AdminModerateReviews";
import ProductDetails from "./pages/customer/parts_pages/ProductDetails";

// Technician Pages
import TechnicianDashboard from "./pages/technician/Dashboard";
//import TechnicianServices from "./pages/technician/Services";
import BuildRequests from "./pages/technician/BuildRequests";
import TechnicianProfile from "./pages/technician/Profile";

// Admin Pages
import CustomerManagement from "./pages/admin/CustomerManagement";
import Analytics from "./pages/admin/Analytics";
import AdminMain from "./pages/admin/AdminMain";
// import Reports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/Profile";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminMonitoring from "./pages/admin/AdminMonitoring";

// Seller Pages
import ProductManagement from "./pages/seller/ProductManagement";
import Inventory from "./pages/seller/Inventory";
import SellerOrders from "./pages/seller/Orders";
import SalesAnalytics from "./pages/seller/Analytics";
import SellerProfile from "./pages/seller/Profile";
import SellerMain from "./pages/seller/SellerMain";
import Dashboard from "./pages/seller/Dashboard";

import SellerMonitoring from "./pages/seller/SellerMonitoring";

import CustomerLayout from "./pages/customer/CustomerLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import SellerLayout from "./pages/seller/SellerLayout";
import TechnicianLayout from "./pages/technician/TechnicianLayout";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/customer", "/admin", "/seller", "/technician"];
  const shouldShowMainNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowMainNavbar && <MainNavbar />}
      <Routes>
        {/* Public Routes with AuthGuard protection */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard>
              <Signup />
            </AuthGuard>
          }
        />

        {/* Customer Layout for all customer pages */}
        <Route element={<CustomerLayout />}>
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/pc-builder" element={<PCBuilder />} />
          <Route path="/cpu" element={<CPUPage />} />
          <Route path="/compare-cpu" element={<CompareCPU />} />
          <Route path="/gpu" element={<GPUPage />} />
          <Route path="/compare-gpu" element={<CompareGPU />} />
          <Route path="/motherboard" element={<MotherboardPage />} />
          <Route path="/compare-motherboard" element={<CompareMotherboard />} />
          <Route
            path="/customer/reviews"
            element={
              <CustomerReviews userId={sessionStorage.getItem("user_id")} />
            }
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/cpucooler" element={<CPUCoolerPage />} />
          <Route path="/compare-cpucooler" element={<CompareCPUCooler />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/compare-monitor" element={<CompareMonitor />} />
          <Route path="/operatingsystem" element={<OperatingSystemPage />} />
          <Route
            path="/compare-operatingsystem"
            element={<CompareOperatingSystem />}
          />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/compare-memory" element={<CompareMemory />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/compare-storage" element={<CompareStorage />} />
          <Route path="/powersupply" element={<PowerSupplyPage />} />
          <Route path="/compare-powersupply" element={<ComparePowerSupply />} />
          <Route path="/case" element={<CasePage />} />
          <Route path="/compare-case" element={<CompareCase />} />
          <Route
            path="/customer/find-technician"
            element={<FindTechnician />}
          />
        </Route>
        {/* Technician Layout for all technician pages */}
        <Route element={<TechnicianLayout />}>
          <Route path="/technician" element={<TechnicianDashboard />} />
          <Route
            path="/technician/dashboard"
            element={<TechnicianDashboard />}
          />
          <Route path="/technician/profile" element={<TechnicianProfile />} />
          {/* <Route path="/technician/services" element={<TechnicianServices />} /> */}
          <Route
            path="/technician/build-requests"
            element={<BuildRequests />}
          />
          <Route
            path="/technician/reviews"
            element={
              <TechnicianFeedback
                technicianId={sessionStorage.getItem("technician_id")}
              />
            }
          />
        </Route>
        {/* Admin Layout for all admin pages */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/admin/monitoring" element={<AdminMonitoring />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/technicians" element={<TechnicianManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          {/* <Route path="/admin/reports" element={<Reports />} /> */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/reviews" element={<AdminModerateReviews />} />
        </Route>
        {/* Seller Layout for all seller pages */}
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={<SellerMain />} />
          <Route path="/seller/products" element={<ProductManagement />} />
          <Route path="/seller/inventory" element={<Inventory />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/analytics" element={<SalesAnalytics />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/seller/dashboard" element={<Dashboard />} />
          <Route path="/seller/monitoring" element={<SellerMonitoring />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <OfflineBanner />
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: 'dark' or 'light' or 'colored'
        style={{ zIndex: 99999 }}
      />
      <AuthProvider>
        <SessionProvider>
          <AppContent />
        </SessionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
