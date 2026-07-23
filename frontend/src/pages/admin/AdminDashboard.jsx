import React, { useState } from 'react';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [caterers, setCaterers] = useState([
    { id: 1, name: 'Royal Indian Feasts', email: 'contact@royalfeasts.in', fssai: 'FSSAI-102938', status: 'Pending' },
    { id: 2, name: 'Delhi Wedding Caterers', email: 'info@delhiweddings.in', fssai: 'FSSAI-992123', status: 'Approved' },
  ]);

  const handleStatus = (id, newStatus) => {
    setCaterers(caterers.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleLogout = () => navigate('/');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--color-royal-blue)', color: 'white', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--color-gold)' }}>Admin Panel</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li style={{ cursor: 'pointer', padding: '0.5rem', background: 'var(--color-royal-blue-light)', borderRadius: 'var(--border-radius)' }}>Manage Caterers</li>
          <li style={{ cursor: 'pointer', padding: '0.5rem' }}>Customers</li>
          <li style={{ cursor: 'pointer', padding: '0.5rem' }}>Platform Analytics</li>
        </ul>
        <button onClick={handleLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', position: 'absolute', bottom: '2rem' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: 'var(--color-bg)' }}>
        <h1 style={{ marginBottom: '2rem' }}>Caterer Approvals</h1>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {caterers.map(caterer => (
            <div key={caterer.id} className="glass animate-fade-in" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{caterer.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{caterer.email} | {caterer.fssai}</p>
                <span style={{ 
                  display: 'inline-block', marginTop: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                  background: caterer.status === 'Approved' ? '#dcfce7' : caterer.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                  color: caterer.status === 'Approved' ? '#166534' : caterer.status === 'Rejected' ? '#991b1b' : '#92400e'
                }}>
                  {caterer.status}
                </span>
              </div>
              
              {caterer.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleStatus(caterer.id, 'Approved')} style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => handleStatus(caterer.id, 'Rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
