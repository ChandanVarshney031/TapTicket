const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    poster: { type: String, required: true },
    rating: { type: Number, default: 0 },
    duration: { type: String, required: true },
    genres: [{ type: String }], // Added genres
    description: { type: String, required: true },
    cast: [{ type: String }],
    trailerUrl: { type: String },
    theatres: [{
        name: { type: String },
        location: { type: String },
        shows: [{
            time: { type: String },
            price: { type: Number },
            seats: [[{ 
                id: { type: String },
                type: { type: String }, 
                isBooked: { type: Boolean, default: false }
            }]]
        }]
    }]
});

module.exports = mongoose.model('Movie', movieSchema);
