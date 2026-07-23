import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--color-royal-blue)', marginBottom: '1rem', fontWeight: '800' }}>
        BulkyO: Grand Feasts for Grand Occasions
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        The premier platform for ordering authentic Indian catering for your grandest occasions. 
        Weddings, corporate events, and massive celebrations.
      </p>
      
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Customer Box */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', width: '300px', textAlign: 'left', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-green)' }}>Looking for Food?</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>Order authentic large-scale catering from FSSAI certified caterers.</p>
          <Link to="/register-customer" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: 'var(--color-green)', color: 'white', borderRadius: 'var(--border-radius)', fontWeight: 'bold' }}>
            Register as Customer
          </Link>
        </div>

        {/* Caterer Box */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', width: '300px', textAlign: 'left', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-saffron-dark)' }}>Are you a Caterer?</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>Join our platform and connect with thousands of customers for big occasions.</p>
          <Link to="/register-caterer" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: 'var(--color-saffron)', color: 'white', borderRadius: 'var(--border-radius)', fontWeight: 'bold' }}>
            Register as Caterer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
