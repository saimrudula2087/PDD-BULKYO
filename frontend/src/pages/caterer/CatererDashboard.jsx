import React, { useState } from 'react';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CatererDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [menu, setMenu] = useState([
    { id: 1, name: 'Royal North Indian Thali', price: '₹450/plate', description: 'Paneer Butter Masala, Dal Makhani, Naan, Jeera Rice, Gulab Jamun.' },
    { id: 2, name: 'South Indian Sadhya', price: '₹350/plate', description: 'Avial, Sambar, Rasam, Payasam, served on Banana Leaf.' },
  ]);

  const handleLogout = () => navigate('/');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--color-saffron-dark)', color: 'white', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Caterer Panel</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li onClick={() => setActiveTab('menu')} style={{ cursor: 'pointer', padding: '0.5rem', background: activeTab === 'menu' ? 'rgba(0,0,0,0.2)' : 'transparent', borderRadius: 'var(--border-radius)' }}>My Menu</li>
          <li onClick={() => setActiveTab('orders')} style={{ cursor: 'pointer', padding: '0.5rem', background: activeTab === 'orders' ? 'rgba(0,0,0,0.2)' : 'transparent', borderRadius: 'var(--border-radius)' }}>Orders (Big Occasions)</li>
        </ul>
        <button onClick={handleLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', position: 'absolute', bottom: '2rem' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: 'var(--color-bg)' }}>
        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>My Catering Menu</h1>
              <button style={{ background: 'var(--color-saffron)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <Plus size={18} /> Add New Item
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {menu.map(item => (
                <div key={item.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-saffron)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>{item.name}</h3>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-green)' }}>{item.price}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{item.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button style={{ background: '#f1f5f9', color: 'var(--color-text)', border: 'none', padding: '0.5rem', borderRadius: 'var(--border-radius)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: 'var(--border-radius)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <h1>Pending Orders</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>No new orders at the moment. Make sure your menu is up to date!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatererDashboard;
