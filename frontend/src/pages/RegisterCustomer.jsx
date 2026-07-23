import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterCustomer = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Customer account created!");
    navigate('/login');
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-green)' }}>Customer Registration</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Create an account to order catering for your events.</p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
            <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. Rahul Sharma" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Enter your email" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Create password" />
          </div>
          
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--color-green)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'var(--transition-fast)' }}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomer;
