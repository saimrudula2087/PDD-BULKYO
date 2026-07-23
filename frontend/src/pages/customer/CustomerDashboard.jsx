import React, { useState } from 'react';
import { LogOut, Search, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const caterers = [
    { id: 1, name: 'Royal Indian Feasts', specialty: 'North Indian, Mughlai', rating: 4.8, minGuests: 100 },
    { id: 2, name: 'Delhi Wedding Caterers', specialty: 'Multi-cuisine, Desserts', rating: 4.6, minGuests: 200 },
    { id: 3, name: 'South Spice Catering', specialty: 'Authentic South Indian', rating: 4.9, minGuests: 50 },
  ];

  const handleLogout = () => navigate('/');

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--color-bg)' }}>
      {/* Customer Header Navigation */}
      <div style={{ background: 'var(--color-green)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Customer Portal</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingBag size={20} /> My Orders</span>
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Find the Perfect Caterer for Your Big Day</h1>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search caterers by name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '30px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', boxShadow: 'var(--shadow-md)' }}
            />
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
          </div>
        </div>

        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Top Rated FSSAI Certified Caterers</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {caterers.map(caterer => (
            <div key={caterer.id} className="glass" style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ height: '150px', background: 'linear-gradient(45deg, var(--color-saffron), var(--color-gold))' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>{caterer.name}</h3>
                  <span style={{ background: '#fef08a', color: '#854d0e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>★ {caterer.rating}</span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{caterer.specialty}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Min. Guests: {caterer.minGuests}</span>
                  <button onClick={() => navigate(`/caterer-menu/${caterer.id}`)} style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold' }}>View Menu</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
