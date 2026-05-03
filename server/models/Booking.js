const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    movieTitle: { type: String, required: true },
    theatreName: { type: String, required: true },
    showTime: { type: String, required: true },
    seats: [{ type: String }],
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
