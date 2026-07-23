import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, ArrowLeft, Plus } from 'lucide-react';

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  
  // Mock Data for a specific caterer based on ID
  const caterer = {
    id,
    name: 'Royal Indian Feasts',
    rating: 4.8,
    specialty: 'North Indian, Mughlai',
    menu: [
      { id: 'm1', name: 'Royal North Indian Thali', price: 450, desc: 'Paneer Butter Masala, Dal Makhani, Naan, Jeera Rice, Gulab Jamun', type: 'Veg' },
      { id: 'm2', name: 'Mughlai Chicken Feast', price: 650, desc: 'Chicken Tikka, Mutton Biryani, Raita, Shahi Tukda', type: 'Non-Veg' },
      { id: 'm3', name: 'Premium Starter Platter', price: 250, desc: 'Hara Bhara Kebab, Paneer Tikka, Veg Spring Rolls', type: 'Veg' },
    ]
  };

  const handleAdd = (item) => {
    // Default quantity for big events will be requested at checkout, but we add 1 unit base.
    addToCart(item, 1);
  };

  const totalItemsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-green)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/customer')}>
          <ArrowLeft size={20} />
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Menu</h2>
        </div>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '20px' }} onClick={() => navigate('/customer/checkout')}>
          <ShoppingCart size={20} /> 
          <span style={{ fontWeight: 'bold' }}>{totalItemsInCart} Items</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>{caterer.name}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{caterer.specialty} • ★ {caterer.rating}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {caterer.menu.map(item => (
            <div key={item.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: item.type === 'Veg' ? '4px solid #166534' : '4px solid #991b1b', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.type === 'Veg' ? '#166534' : '#991b1b' }}></div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>{item.name}</h3>
                  </div>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--color-saffron-dark)', fontSize: '1.2rem' }}>₹{item.price} <span style={{fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>/ plate</span></span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{item.desc}</p>
              
              <button 
                onClick={() => handleAdd(item)}
                style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'var(--color-green)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} /> Add 
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
