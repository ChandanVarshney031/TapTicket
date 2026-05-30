import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { 
    LayoutDashboard, Film, Ticket, TrendingUp, Plus, Trash2, Edit, Save, X, 
    DollarSign, BarChart, ShoppingBag 
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [movies, setMovies] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingMovie, setEditingMovie] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        poster: '',
        rating: 0,
        duration: '',
        genres: [],
        description: '',
        cast: [],
        trailerUrl: '',
        theatres: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [statsRes, moviesRes, bookingsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/stats`, { headers }),
                fetch(`${API_URL}/api/movies`),
                fetch(`${API_URL}/api/admin/bookings`, { headers })
            ]);

            const statsData = await statsRes.json();
            const moviesData = await moviesRes.json();
            const bookingsData = await bookingsRes.json();

            setStats(statsData);
            setMovies(moviesData);
            setBookings(bookingsData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMovie = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/movies/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMovies(movies.filter(m => m._id !== id));
        } catch (err) {
            console.error('Error deleting movie:', err);
        }
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/movies`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newMovie)
            });
            if (res.ok) {
                const added = await res.json();
                setMovies([...movies, added]);
                setShowAddModal(false);
                setNewMovie({ title: '', poster: '', rating: 0, duration: '', genres: [], description: '', cast: [], trailerUrl: '', theatres: [] });
            }
        } catch (err) {
            console.error('Error adding movie:', err);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading Admin Panel...</div>;

    const chartData = {
        labels: stats?.mostBookedMovie.map(m => m._id) || [],
        datasets: [{
            label: 'Number of Bookings',
            data: stats?.mostBookedMovie.map(m => m.count) || [],
            backgroundColor: 'rgba(244, 63, 94, 0.6)',
            borderColor: 'rgb(244, 63, 94)',
            borderWidth: 1
        }]
    };

    const revenueData = {
        labels: stats?.revenueByMovie.map(m => m._id) || [],
        datasets: [{
            label: 'Revenue (₹)',
            data: stats?.revenueByMovie.map(m => m.revenue) || [],
            backgroundColor: [
                '#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6'
            ]
        }]
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <LayoutDashboard className="text-rose-500" /> Admin Dashboard
                    </h1>
                </header>

                <div className="flex gap-4 mb-8 border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'overview' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-white/60 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('movies')}
                        className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'movies' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-white/60 hover:text-white'}`}
                    >
                        Manage Movies
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'bookings' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-white/60 hover:text-white'}`}
                    >
                        Recent Bookings
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-rose-500/10 rounded-xl"><DollarSign className="text-rose-500" /></div>
                                    <span className="text-white/60">Total Revenue</span>
                                </div>
                                <h2 className="text-3xl font-bold">₹{stats?.stats.totalRevenue.toLocaleString()}</h2>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-blue-500/10 rounded-xl"><ShoppingBag className="text-blue-500" /></div>
                                    <span className="text-white/60">Total Bookings</span>
                                </div>
                                <h2 className="text-3xl font-bold">{stats?.stats.totalBookings}</h2>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-green-500/10 rounded-xl"><Film className="text-green-500" /></div>
                                    <span className="text-white/60">Active Movies</span>
                                </div>
                                <h2 className="text-3xl font-bold">{movies.length}</h2>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <BarChart className="text-rose-500" /> Most Booked Movies
                                </h3>
                                <Bar data={chartData} options={{ 
                                    responsive: true,
                                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } }
                                }} />
                            </div>
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-rose-500" /> Revenue Distribution
                                </h3>
                                <div className="h-[300px] flex justify-center">
                                    <Pie data={revenueData} options={{ maintainAspectRatio: false }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'movies' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Movie Library</h2>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Plus size={20} /> Add New Movie
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {movies.map(movie => (
                                <div key={movie._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
                                                <Edit size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteMovie(movie._id)}
                                                className="p-3 bg-rose-500/20 hover:bg-rose-500/40 rounded-full transition-colors text-rose-500"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                                        <div className="flex gap-2 mb-2">
                                            {movie.genres.slice(0, 2).map(g => (
                                                <span key={g} className="text-xs bg-white/5 px-2 py-1 rounded text-white/60">{g}</span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-sm text-white/60">
                                            <span>{movie.duration}</span>
                                            <span className="text-yellow-500">★ {movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10 text-white/60 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Movie</th>
                                    <th className="px-6 py-4">Theatre</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">{booking.userId?.name || 'User'}</td>
                                        <td className="px-6 py-4">{booking.movieTitle}</td>
                                        <td className="px-6 py-4">{booking.theatreName}</td>
                                        <td className="px-6 py-4">{booking.showTime}</td>
                                        <td className="px-6 py-4">₹{booking.totalAmount}</td>
                                        <td className="px-6 py-4 text-white/40 text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Simple Add Movie Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add New Movie</h2>
                            <button onClick={() => setShowAddModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddMovie} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Title</label>
                                <input 
                                    required type="text" value={newMovie.title}
                                    onChange={e => setNewMovie({...newMovie, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Poster URL</label>
                                <input 
                                    required type="text" value={newMovie.poster}
                                    onChange={e => setNewMovie({...newMovie, poster: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Rating</label>
                                    <input 
                                        type="number" step="0.1" value={newMovie.rating}
                                        onChange={e => setNewMovie({...newMovie, rating: parseFloat(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Duration (e.g. 2h 30m)</label>
                                    <input 
                                        required type="text" value={newMovie.duration}
                                        onChange={e => setNewMovie({...newMovie, duration: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Description</label>
                                <textarea 
                                    required value={newMovie.description}
                                    onChange={e => setNewMovie({...newMovie, description: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-500/20"
                            >
                                Save Movie
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
