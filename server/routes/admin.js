const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const mostBookedMovie = await Booking.aggregate([
            { $group: { _id: "$movieTitle", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const revenueByMovie = await Booking.aggregate([
            { $group: { _id: "$movieTitle", revenue: { $sum: "$totalAmount" } } },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            stats: {
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
            mostBookedMovie,
            revenueByMovie
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/bookings', auth, admin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
