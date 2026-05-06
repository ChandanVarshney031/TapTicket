import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MovieDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/movies/${id}`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching movie:', err));
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>{t('Loading Details...')}</div>;
    if (!movie) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Movie not found</div>;

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
                {/* Poster & Booking Sidebar */}
                <div>
                    <img src={movie.poster} alt={movie.title} style={{ width: '100%', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
                    <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                        <Link to={`/book/${movie._id}`} className="glass" style={{ display: 'block', textAlign: 'center', background: 'var(--primary)', padding: '1rem', fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>
                            {t('Book Tickets Now')}
                        </Link>
                    </div>
                </div>

                {/* Details */}
                <div>
                    <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem' }}>{t(movie.title)}</h1>
                    
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                            <Star size={20} fill="var(--accent)" />
                            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{movie.rating} {t('Rating')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Clock size={20} />
                            <span style={{ fontSize: '1.1rem' }}>{movie.duration}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{t('Synopsis')}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>{movie.description}</p>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{t('Cast')}</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {movie.cast.map((actor, index) => (
                                <span key={index} className="glass" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>{actor}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{t('Trailer')}</h3>
                        <div style={{ width: '100%', height: '400px', borderRadius: '1rem', overflow: 'hidden' }}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={movie.trailerUrl} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
