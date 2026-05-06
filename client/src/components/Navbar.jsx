import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ticket, User, LogOut, Sun, Moon, Globe } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '0.75rem 2rem', position: 'sticky', top: '1rem', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                <Ticket size={28} />
                <span>TapTicket</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" style={{ fontWeight: 500, color: 'var(--text-muted)', transition: 'var(--transition)' }} className="nav-link">{t('Movies')}</Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '0 1rem' }}>
                    <button onClick={toggleTheme} style={{ background: 'transparent', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={18} color="var(--text-muted)" />
                        <select 
                            onChange={(e) => changeLanguage(e.target.value)} 
                            value={i18n.language}
                            style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="en" style={{ background: 'var(--bg-dark)' }}>English</option>
                            <option value="es" style={{ background: 'var(--bg-dark)' }}>Spanish</option>
                            <option value="fr" style={{ background: 'var(--bg-dark)' }}>French</option>
                            <option value="de" style={{ background: 'var(--bg-dark)' }}>German</option>
                            <option value="it" style={{ background: 'var(--bg-dark)' }}>Italian</option>
                            <option value="ja" style={{ background: 'var(--bg-dark)' }}>Japanese (日本語)</option>
                            <option value="zh" style={{ background: 'var(--bg-dark)' }}>Chinese (中文)</option>
                            <option value="ru" style={{ background: 'var(--bg-dark)' }}>Russian (Русский)</option>
                            <option value="hi" style={{ background: 'var(--bg-dark)' }}>Hindi (हिंदी)</option>
                            <option value="bn" style={{ background: 'var(--bg-dark)' }}>Bengali (বাংলা)</option>
                            <option value="te" style={{ background: 'var(--bg-dark)' }}>Telugu (తెలుగు)</option>
                            <option value="mr" style={{ background: 'var(--bg-dark)' }}>Marathi (मराठी)</option>
                            <option value="ta" style={{ background: 'var(--bg-dark)' }}>Tamil (தமிழ்)</option>
                            <option value="gu" style={{ background: 'var(--bg-dark)' }}>Gujarati (ગુજરાતી)</option>
                            <option value="kn" style={{ background: 'var(--bg-dark)' }}>Kannada (ಕನ್ನಡ)</option>
                            <option value="ml" style={{ background: 'var(--bg-dark)' }}>Malayalam (മലയാളം)</option>
                            <option value="pa" style={{ background: 'var(--bg-dark)' }}>Punjabi (ਪੰਜਾਬੀ)</option>
                        </select>
                    </div>
                </div>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('Admin')}</Link>
                        )}
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <User size={20} />
                            <span>{user.name}</span>
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={20} />
                            <span>{t('Logout')}</span>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/login" style={{ color: 'var(--text-main)' }}>{t('Login')}</Link>
                        <Link to="/signup" className="glass" style={{ background: 'var(--primary)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, color: 'white' }}>{t('Sign Up')}</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
