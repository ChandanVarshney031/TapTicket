import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2, X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onConfirm, amount }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

    if (!isOpen) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing delay
        setTimeout(() => {
            setIsProcessing(false);
            onConfirm();
        }, 2500);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-muted)' }}>
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem' }}>
                        <CreditCard size={30} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem' }}>Secure Checkout</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Pay ${amount} to confirm your tickets</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Card Number</label>
                        <input 
                            type="text" 
                            placeholder="xxxx xxxx xxxx xxxx" 
                            value={cardData.number}
                            onChange={e => setCardData({...cardData, number: e.target.value})}
                            style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Expiry Date</label>
                            <input 
                                type="text" 
                                placeholder="MM/YY" 
                                value={cardData.expiry}
                                onChange={e => setCardData({...cardData, expiry: e.target.value})}
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CVC</label>
                            <input 
                                type="password" 
                                placeholder="***" 
                                value={cardData.cvc}
                                onChange={e => setCardData({...cardData, cvc: e.target.value})}
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#4ade80' }}>
                        <ShieldCheck size={16} />
                        <span>Your payment info is encrypted & secure.</span>
                    </div>

                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="glass" 
                        style={{ background: 'var(--primary)', padding: '1rem', color: 'white', fontWeight: 700, fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing...
                            </>
                        ) : (
                            `Pay $${amount}`
                        )}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default PaymentModal;
