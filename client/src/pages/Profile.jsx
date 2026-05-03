import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/bookings/my-bookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Profile...</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem' }}>My Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
            </div>

            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Ticket color="var(--primary)" />
                My Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
                <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You haven't booked any tickets yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{booking.movieTitle}</h3>
                                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} />
                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ padding: '0 2rem', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    {booking.theatreName}
                                </p>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Showtime: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{booking.showTime}</span>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seats: {booking.seats.join(', ')}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>${booking.totalAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
