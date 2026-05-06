import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Ticket, Download, User as UserIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Profile = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
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

    const downloadTicket = (booking) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(139, 92, 246); // Primary color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('TapTicket - Movie Ticket', 20, 25);

        // Ticket Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.text(booking.movieTitle, 20, 60);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Booking ID: ${booking._id}`, 20, 70);

        const tableData = [
            ['Theatre', booking.theatreName],
            ['Showtime', booking.showTime],
            ['Date', new Date(booking.bookingDate).toLocaleDateString()],
            ['Seats', booking.seats.join(', ')],
            ['Total Amount', `$${booking.totalAmount.toFixed(2)}`],
            ['Customer', user.name]
        ];

        doc.autoTable({
            startY: 80,
            head: [['Field', 'Details']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246] }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Please present this PDF at the counter. Enjoy your movie!', 20, doc.lastAutoTable.finalY + 20);

        doc.save(`Ticket_${booking.movieTitle}_${booking._id}.pdf`);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>{t('Loading Profile...')}</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '3rem' }}>{t('My Profile')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
                </div>
                <div className="glass" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <UserIcon size={24} color="var(--primary)" />
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as</p>
                        <p style={{ fontWeight: 600 }}>{user?.email}</p>
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Ticket color="var(--primary)" />
                {t('My Bookings')} ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
                <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You haven't booked any tickets yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} className="glass" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t(booking.movieTitle)}</h3>
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
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Seats: <span style={{ color: 'var(--text-main)' }}>{booking.seats.join(', ')}</span>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>${booking.totalAmount.toFixed(2)}</p>
                                <button 
                                    onClick={() => downloadTicket(booking)}
                                    className="glass" 
                                    style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', background: 'var(--primary)', color: 'white', fontWeight: 600 }}
                                >
                                    <Download size={18} />
                                    {t('Download Ticket')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
