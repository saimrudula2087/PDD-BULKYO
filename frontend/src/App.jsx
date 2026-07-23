import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterCaterer from './pages/RegisterCaterer';
import RegisterCustomer from './pages/RegisterCustomer';
import AdminDashboard from './pages/admin/AdminDashboard';
import CatererDashboard from './pages/caterer/CatererDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MenuDetails from './pages/customer/MenuDetails';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen">
          <nav style={{ padding: '1rem 2rem', background: 'var(--color-bg-card)', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-saffron-dark)', fontFamily: 'var(--font-heading)' }}>
              BulkyO
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" style={{ padding: '0.5rem 1rem', background: 'var(--color-bg)', borderRadius: 'var(--border-radius)', fontWeight: '500' }}>Login</Link>
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-caterer" element={<RegisterCaterer />} />
            <Route path="/register-customer" element={<RegisterCustomer />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/caterer/*" element={<CatererDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/caterer-menu/:id" element={<MenuDetails />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/success" element={<OrderSuccess />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
