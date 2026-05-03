import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '0.75rem 2rem', position: 'sticky', top: '1rem', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                <Ticket size={28} />
                <span>TapTicket</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'var(--transition)' }} className="nav-link">Movies</Link>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <User size={20} />
                            <span>{user.name}</span>
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/login" style={{ color: 'var(--text-main)' }}>Login</Link>
                        <Link to="/signup" className="glass" style={{ background: 'var(--primary)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600 }}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
