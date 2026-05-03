import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

const Auth = ({ mode }) => {
    const isLogin = mode === 'login';
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const endpoint = isLogin ? 'login' : 'signup';
        try {
            const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>{isLogin ? 'Login to your TapTicket account' : 'Join thousands of movie fans today'}</p>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                required 
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }}
                            />
                        </div>
                    )}
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required 
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }}
                        />
                    </div>

                    <button type="submit" className="glass" style={{ background: 'var(--primary)', padding: '1rem', color: 'white', fontWeight: 700, marginTop: '1rem', fontSize: '1.1rem' }}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <Link to={isLogin ? '/signup' : '/login'} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Auth;
