import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterCaterer = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, this would submit the form data to an API
    alert("Registration submitted for Admin approval!");
    navigate('/login');
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-saffron-dark)' }}>Caterer Registration</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Join BulkyO to provide catering for grand occasions.</p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Catering Business Name</label>
            <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="e.g. Royal Indian Feasts" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Enter business email" />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>FSSAI Certificate Upload</label>
            <div style={{ border: '2px dashed #cbd5e1', padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--border-radius)' }}>
              <input type="file" required accept=".pdf,.jpg,.jpeg,.png" style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Only FSSAI certified caterers are approved.</p>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input type="password" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Create password" />
          </div>
          
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--color-saffron)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'var(--transition-fast)' }}>
            Register Business
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCaterer;
