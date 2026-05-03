const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// Create a new booking with double-booking prevention
router.post('/', auth, async (req, res) => {
    try {
        const { movieId, movieTitle, theatreName, showTime, seats, totalAmount } = req.body;
        const userId = req.user.id;

        // 1. Fetch movie and check if seats are already booked (Double Booking Prevention)
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        const theatre = movie.theatres.find(t => t.name === theatreName);
        const show = theatre.shows.find(s => s.time === showTime);

        // Check if any requested seat is already booked
        const alreadyBooked = [];
        show.seats.forEach(row => {
            row.forEach(seat => {
                if (seats.includes(seat.id) && seat.isBooked) {
                    alreadyBooked.push(seat.id);
                }
            });
        });

        if (alreadyBooked.length > 0) {
            return res.status(400).json({ 
                message: 'Some seats are already booked. Please choose different seats.',
                alreadyBooked 
            });
        }

        // 2. Create the booking
        const booking = new Booking({
            userId,
            movieId,
            movieTitle,
            theatreName,
            showTime,
            seats,
            totalAmount
        });

        await booking.save();

        // 3. Update movie seats to booked
        show.seats.forEach(row => {
            row.forEach(seat => {
                if (seats.includes(seat.id)) {
                    seat.isBooked = true;
                }
            });
        });
        
        await movie.save();

        // 4. Emit Socket event for real-time updates
        const io = req.app.get('io');
        io.to(movieId).emit('seatsUpdated', { 
            theatreName, 
            showTime, 
            bookedSeats: seats 
        });

        res.json({ message: 'Booking successful', booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating booking' });
    }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

module.exports = router;
