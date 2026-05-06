const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');

// Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movies' });
    }
});

// Smart Recommendation System
router.get('/recommendations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const userBookings = await Booking.find({ userId });
        
        if (userBookings.length === 0) {
            // If no history, return top-rated movies as fallback
            const topRated = await Movie.find().sort({ rating: -1 }).limit(4);
            return res.json(topRated);
        }

        // Extract genres from user's booking history
        const bookedMovieTitles = userBookings.map(b => b.movieTitle);
        const bookedMovies = await Movie.find({ title: { $in: bookedMovieTitles } });
        
        const genreCounts = {};
        bookedMovies.forEach(m => {
            m.genres.forEach(g => {
                genreCounts[g] = (genreCounts[g] || 0) + 1;
            });
        });

        // Find favorite genres
        const favoriteGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);

        // Recommend movies with these genres that the user hasn't booked
        const recommendations = await Movie.find({
            genres: { $in: favoriteGenres },
            title: { $not: { $in: bookedMovieTitles } }
        }).limit(4);

        // Fallback if no matching unbooked movies
        if (recommendations.length === 0) {
            const fallback = await Movie.find({ title: { $not: { $in: bookedMovieTitles } } }).sort({ rating: -1 }).limit(4);
            return res.json(fallback);
        }

        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching movie details' });
    }
});

// Add movie
router.post('/', auth, admin, async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ message: 'Error adding movie' });
    }
});

// Update movie
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(400).json({ message: 'Error updating movie' });
    }
});

// Delete movie
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting movie' });
    }
});

// Seed data
router.post('/seed', auth, admin, async (req, res) => {
    try {
        await Movie.deleteMany({});
        const movies = [
            {
                title: "Dune: Part Two",
                poster: "https://image.tmdb.org/t/p/original/61955f309995543666d6d877f0d0689b.jpg",
                rating: 8.9,
                duration: "2h 46m",
                genres: ["Sci-Fi", "Adventure", "Drama"],
                description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
                cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
                trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
                theatres: [
                    {
                        name: "PVR Cinemas",
                        location: "Downtown",
                        shows: [
                            { time: "10:00 AM", price: 250, seats: generateSeats() },
                            { time: "06:00 PM", price: 350, seats: generateSeats() }
                        ]
                    }
                ]
            },
            {
                title: "Oppenheimer",
                poster: "https://image.tmdb.org/t/p/original/8Gxv0MmlUCO1S9G3S2YvY7vhCio.jpg",
                rating: 8.4,
                duration: "3h 0m",
                genres: ["Drama", "History", "Biography"],
                description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
                trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
                theatres: [
                    {
                        name: "Cineplex Star",
                        location: "Westside",
                        shows: [{ time: "04:00 PM", price: 250, seats: generateSeats() }]
                    }
                ]
            },
            {
                title: "The Batman",
                poster: "https://image.tmdb.org/t/p/original/74xTEgt7R36FpZuB7buR3pC96Lw.jpg",
                rating: 7.9,
                duration: "2h 56m",
                genres: ["Action", "Crime", "Drama"],
                description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
                cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright"],
                trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
                theatres: [
                    {
                        name: "PVR Cinemas",
                        location: "Downtown",
                        shows: [{ time: "08:00 PM", price: 300, seats: generateSeats() }]
                    }
                ]
            },
            {
                title: "Interstellar",
                poster: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6vCU67vUEvKFd.jpg",
                rating: 8.7,
                duration: "2h 49m",
                genres: ["Sci-Fi", "Adventure", "Drama"],
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
                trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
                theatres: [
                    {
                        name: "IMAX Elite",
                        location: "North Mall",
                        shows: [{ time: "09:00 PM", price: 500, seats: generateSeats() }]
                    }
                ]
            }
        ];
        await Movie.insertMany(movies);
        res.json({ message: "Seed successful", count: movies.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Seed failed" });
    }
});

function generateSeats() {
    const rows = 8;
    const cols = 12;
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                id: `${String.fromCharCode(65 + r)}${c + 1}`,
                type: r < 2 ? 'gold' : r < 5 ? 'premium' : 'regular',
                isBooked: false
            });
        }
        grid.push(row);
    }
    return grid;
}

module.exports = router;
