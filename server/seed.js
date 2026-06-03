const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

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

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        await Movie.deleteMany({});
        await Movie.insertMany(movies);
        console.log('Database seeded successfully!');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error seeding database:', err);
    });
