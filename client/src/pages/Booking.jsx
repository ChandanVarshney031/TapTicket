import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Armchair, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config';
import PaymentModal from '../components/PaymentModal';

const Booking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [selectedShow, setSelectedShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [error, setError] = useState('');
    
    const socketRef = useRef();

    useEffect(() => {
        if (!user) navigate('/login');
        
        // Fetch Movie Data
        fetch(`${API_URL}/api/movies/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(err => console.error(err));

        // Setup WebSockets
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('joinMovie', id);

        socketRef.current.on('seatsUpdated', ({ theatreName, showTime, bookedSeats }) => {
            setMovie(prevMovie => {
                if (!prevMovie) return prevMovie;
                const newMovie = JSON.parse(JSON.stringify(prevMovie));
                const theatre = newMovie.theatres.find(t => t.name === theatreName);
                if (theatre) {
                    const show = theatre.shows.find(s => s.time === showTime);
                    if (show) {
                        show.seats.forEach(row => {
                            row.forEach(seat => {
                                if (bookedSeats.includes(seat.id)) {
                                    seat.isBooked = true;
                                }
                            });
                        });
                    }
                }
                return newMovie;
            });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [id, user, navigate]);

    // Update local show reference when movie updates via socket
    useEffect(() => {
        if (movie && selectedTheatre && selectedShow) {
            const theatre = movie.theatres.find(t => t.name === selectedTheatre.name);
            const show = theatre?.shows.find(s => s.time === selectedShow.time);
            if (show) setSelectedShow(show);
        }
    }, [movie]);

    const handleSeatToggle = (seatId, isBooked) => {
        if (isBooked) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleConfirmBooking = async () => {
        const baseAmount = selectedSeats.length * selectedShow.price;
        const discount = selectedSeats.length >= 6 ? baseAmount * 0.1 : 0;
        const finalAmount = baseAmount - discount;

        const payload = {
            movieId: movie._id,
            movieTitle: movie.title,
            theatreName: selectedTheatre.name,
            showTime: selectedShow.time,
            seats: selectedSeats,
            totalAmount: finalAmount
        };

        try {
            const res = await fetch(`${API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setBookingComplete(true);
                setTimeout(() => navigate('/profile'), 3000);
            } else {
                setError(data.message);
                setShowPayment(false);
                // If seats were already booked, they will be updated via socket shortly
            }
        } catch (err) {
            setError('Booking failed. Please check your connection.');
            setShowPayment(false);
        }
    };

    if (!movie) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Booking Engine...</div>;

    if (bookingComplete) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '10rem' }}>
                <CheckCircle size={100} color="var(--primary)" style={{ marginBottom: '2rem' }} />
                <h1 style={{ fontSize: '3rem' }}>{t('Booking Confirmed!')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>{t('Enjoy your movie!')} Redirecting to your profile...</p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Book Tickets: {t(movie.title)}</h1>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertTriangle />
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'transparent', color: 'var(--danger)', fontWeight: 700 }}>Dismiss</button>
                </div>
            )}

            {!selectedShow ? (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {movie.theatres.map((theatre, idx) => (
                        <div key={idx} className="glass" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <MapPin size={24} color="var(--primary)" />
                                <h2 style={{ fontSize: '1.5rem' }}>{theatre.name} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>- {theatre.location}</span></h2>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {theatre.shows.map((show, sIdx) => (
                                    <button 
                                        key={sIdx} 
                                        className="glass" 
                                        style={{ padding: '0.75rem 2rem', fontWeight: 600, background: 'transparent' }}
                                        onClick={() => {
                                            setSelectedTheatre(theatre);
                                            setSelectedShow(show);
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    >
                                        {show.time}
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${show.price}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
                    <div className="glass" style={{ padding: '3rem', position: 'relative' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <div style={{ width: '80%', height: '8px', background: 'var(--primary)', margin: '0 auto', borderRadius: '100%', boxShadow: '0 10px 20px var(--primary)' }}></div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '4px' }}>{t('SCREEN')}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            {selectedShow.seats.map((row, rIdx) => (
                                <div key={rIdx} style={{ display: 'flex', gap: '0.75rem' }}>
                                    <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{String.fromCharCode(65 + rIdx)}</span>
                                    {row.map((seat, cIdx) => (
                                        <div 
                                            key={cIdx} 
                                            onClick={() => handleSeatToggle(seat.id, seat.isBooked)}
                                            style={{ 
                                                width: '24px', 
                                                height: '24px', 
                                                borderRadius: '4px', 
                                                cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                                                background: seat.isBooked ? '#1e293b' : selectedSeats.includes(seat.id) ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                border: '1px solid ' + (selectedSeats.includes(seat.id) ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                                transition: 'var(--transition)'
                                            }}
                                            title={seat.id}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <span>{t('Available')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: 'var(--primary)' }}></div>
                                <span>{t('Selected')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#1e293b' }}></div>
                                <span>{t('Booked')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>{t('Booking Summary')}</h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('Theatre')}</p>
                            <p style={{ fontWeight: 600 }}>{selectedTheatre.name}</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('Showtime')}</p>
                            <p style={{ fontWeight: 600 }}>{selectedShow.time}</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('Seats')} ({selectedSeats.length})</p>
                            <p style={{ fontWeight: 600 }}>{selectedSeats.join(', ') || 'None selected'}</p>
                        </div>

                        {selectedSeats.length >= 6 && (
                            <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={16} />
                                <span>{t('Group Discount Applied')}</span>
                            </div>
                        )}
                        
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>{t('Total Amount')}</span>
                                <div style={{ textAlign: 'right' }}>
                                    {selectedSeats.length >= 6 && (
                                        <p style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                                            ${selectedSeats.length * selectedShow.price}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                        ${(selectedSeats.length * selectedShow.price * (selectedSeats.length >= 6 ? 0.9 : 1)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowPayment(true)}
                                disabled={selectedSeats.length === 0}
                                className="glass" 
                                style={{ 
                                    width: '100%', 
                                    padding: '1rem', 
                                    background: selectedSeats.length > 0 ? 'var(--primary)' : '#475569', 
                                    color: 'white', 
                                    fontWeight: 700,
                                    cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {t('Proceed to Pay')}
                            </button>
                        </div>
                        <button 
                            onClick={() => { setSelectedShow(null); setSelectedSeats([]); }}
                            style={{ width: '100%', marginTop: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                        >
                            {t('Change Show / Theatre')}
                        </button>
                    </div>
                </div>
            )}

            <PaymentModal 
                isOpen={showPayment} 
                onClose={() => setShowPayment(false)} 
                onConfirm={handleConfirmBooking}
                amount={selectedSeats.length * (selectedShow?.price || 0)}
            />
        </div>
    );
};

export default Booking;
