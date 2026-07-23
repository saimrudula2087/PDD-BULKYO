import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--color-bg)', padding: '2rem' }}>
      <div className="glass" style={{ padding: '4rem 2rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '600px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '50%' }}>
            <CheckCircle size={64} />
          </div>
        </div>
        
        <h1 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>Order Requested Successfully!</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Your request has been sent to the caterer. They will contact you shortly to confirm the menu details and finalize the booking.
        </p>

        <div style={{ background: 'rgba(255, 153, 51, 0.1)', padding: '1.5rem', borderRadius: 'var(--border-radius)', marginBottom: '3rem', border: '1px solid var(--color-saffron)' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--color-saffron-dark)' }}>Order ID: #BLK-{Math.floor(Math.random() * 90000) + 10000}</p>
        </div>

        <button 
          onClick={() => navigate('/customer')}
          style={{ padding: '1rem 2rem', background: 'var(--color-green)', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: 'var(--shadow-md)' }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
