// App.js or wherever your main app structure is
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { useState } from 'react';

// === RESTAURANT COMPONENTS ===
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Signup from '../components/Signup';
import Login from '../components/Login';
import Payment from '../components/Payment';
import HomePage from '../components/HomePage';
import SpecialFeatures from '../components/SpecialFeatures';
import UpdateMenu from '../components/UpdateMenu';
import CustomerEntry from '../components/CustomerEntry';
import MenuPage from '../components/MenuPage';
import ChefPage from '../components/ChefPage';
import ReceptionManager from '../components/ReceptionManager';
import RestaurantDashboard from '../components/DashBoard';
import StaffManagement from '../components/StaffManagement';
import ExpensesManagement from '../components/ExpensesManagement';

// === ACCOUNTANT COMPONENTS ===
import AccountantManager from '../components/AccountantManager'; // ✅ FIXED PATH
import ReportPage from '../pages/ReportPage';
import GraphicalAnalysis from '../pages/GraphicalAnalysis';
import PaymentBreakdown from '../pages/PaymentBreakdown';

// === INVENTORY COMPONENTS ===
import InventorySidebar from "../components/Sidebar";
import InventoryTopbar from "../components/Topbar";
import InventoryDashboard from "../pages/Dashboard";
import StockManagement from "../pages/StockManagement";
import InventoryReports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import StockUsageEntry from "../pages/StockUsageEntry";
import ErrorBoundary from "../components/ErrorBoundary";
import { NotificationProvider } from "../context/NotificationContext";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const showNavbar = ['/', '/signup', '/login', '/paynow'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/paynow" element={<Payment />} />

        {/* === RESTAURANT MODULE === */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/SpecialFeatures" element={<SpecialFeatures />} />
        <Route path="/update-menu" element={<UpdateMenu />} />
        <Route path="/customer-entry/:user_id" element={<CustomerEntry />} />
        <Route path="/menu/:user_id" element={<MenuPage />} />
        <Route path="/chef" element={<ChefPage />} />
        <Route path="/reception" element={<ReceptionManager />} />
        <Route path="/dashboard" element={<RestaurantDashboard />} />
        <Route path="/staffmanagement" element={<StaffManagement />} />
        <Route path="/expenses-management" element={<ExpensesManagement />} />

        {/* === ACCOUNTANT MODULE === */}
        <Route path="/account-management" element={<AccountantManager />} /> {/* ✅ FIXED */}
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/graphical-analysis" element={<GraphicalAnalysis />} />
        <Route path="/payment-breakdown" element={<PaymentBreakdown />} />

        {/* === INVENTORY MODULE === */}
        <Route
          path="/inventory/*"
          element={
            <NotificationProvider>
              <div className="app-container">
                <InventorySidebar onToggle={setIsSidebarCollapsed} />
                <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
                  <InventoryTopbar />
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<InventoryDashboard />} />
                      <Route path="/stock" element={<StockManagement />} />
                      <Route path="/reports" element={<InventoryReports />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/stock-usage" element={<StockUsageEntry />} />
                    </Routes>
                  </ErrorBoundary>
                </div>
              </div>
            </NotificationProvider>
          }
        />

        {/* === FALLBACK === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
