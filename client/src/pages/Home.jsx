import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all movies
        const fetchMovies = fetch('http://localhost:5000/api/movies').then(res => res.json());
        
        // Fetch recommendations if user is logged in
        const fetchRecs = user 
            ? fetch('http://localhost:5000/api/movies/recommendations', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).then(res => res.json())
            : Promise.resolve([]);

        Promise.all([fetchMovies, fetchRecs])
            .then(([moviesData, recsData]) => {
                setMovies(moviesData);
                setRecommendations(recsData);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching data:', err));
    }, [user]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Movies...</div>;

    return (
        <div className="container" style={{ paddingBottom: '5rem' }}>
            <header style={{ margin: '3rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>Experience Cinema Like Never Before</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Book your tickets in seconds with TapTicket</p>
            </header>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <Sparkles color="var(--primary)" fill="var(--primary)" size={24} />
                        <h2 style={{ fontSize: '1.8rem' }}>Recommended for You</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                        {recommendations.map(movie => (
                            <Link to={`/movie/${movie._id}`} key={`rec-${movie._id}`} style={{ flex: '0 0 240px', position: 'relative' }}>
                                <div className="glass" style={{ padding: '0', overflow: 'hidden', borderRadius: '1.5rem', transition: 'var(--transition)' }}>
                                    <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Star size={14} fill="var(--accent)" color="var(--accent)" />
                                        <span style={{ fontSize: '0.85rem' }}>{movie.rating}</span>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{movie.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{movie.genres.slice(0, 2).join(' • ')}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* All Movies Section */}
            <section>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Now Showing</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    {movies.map(movie => (
                        <Link to={`/movie/${movie._id}`} key={movie._id} className="glass animate-fade-in" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.3rem' }}>{movie.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)' }}>
                                        <Star size={16} fill="var(--accent)" color="var(--accent)" />
                                        <span>{movie.rating}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={14} />
                                        <span>{movie.duration}</span>
                                    </div>
                                    <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{movie.genres[0]}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
