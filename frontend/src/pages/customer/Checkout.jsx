import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, Trash2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  
  const [guests, setGuests] = useState(100);
  const [date, setDate] = useState('2026-12-31');

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    if (guests < 50) return alert("Minimum guest count is 50 for big occasions.");
    
    // Simulate order placement
    clearCart();
    navigate('/customer/success');
  };

  const finalTotal = cartTotal * guests;

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-green)', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ArrowLeft size={20} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Checkout</h2>
      </div>

      <div className="container animate-fade-in" style={{ padding: '3rem 2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Cart Review */}
        <div className="glass" style={{ flex: '1 1 500px', padding: '2rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Order Review</h2>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No items selected.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>{item.name}</h4>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>₹{item.price} / plate</span>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Base Price Per Guest: </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-saffron-dark)' }}>₹{cartTotal}</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Form */}
        <div className="glass" style={{ flex: '1 1 350px', padding: '2rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>Event Details</h2>
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Number of Guests</label>
              <input 
                type="number" 
                min="50"
                required 
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Minimum 50 guests required.</p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Date</label>
              <input 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--border-radius)', border: '1px dashed #cbd5e1', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Cost:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-text)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>*Excluding taxes & setup charges.</p>
            </div>
            
            <button type="submit" disabled={cart.length === 0} style={{ padding: '1rem', background: 'var(--color-green)', color: 'white', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', fontSize: '1.1rem', opacity: cart.length === 0 ? 0.6 : 1 }}>
              Confirm Booking Request
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Checkout;
