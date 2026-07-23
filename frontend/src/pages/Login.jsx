import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin');
    else if (role === 'caterer') navigate('/caterer');
    else navigate('/customer');
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-royal-blue)' }}>Welcome Back</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Login As</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="customer">Customer</option>
              <option value="caterer">Caterer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Enter email" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Enter password" />
          </div>
          
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--color-saffron-dark)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
