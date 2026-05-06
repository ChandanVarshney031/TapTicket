const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendEmail, sendPushNotification } = require('../services/notificationService');

const setupCronJobs = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running showtime reminder cron job...');
        try {
            const now = new Date();
            // Get bookings for today (simplified for demo)
            const bookings = await Booking.find({
                bookingDate: {
                    $gte: new Date(now.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                }
            });

            for (const booking of bookings) {
                // Check if show is in the next 2 hours
                // This is a simplified check since showTime is just a string like "10:00 AM"
                const [time, modifier] = booking.showTime.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                
                const showDate = new Date();
                showDate.setHours(hours, minutes, 0, 0);

                const timeDiff = showDate.getTime() - new Date().getTime();
                const hoursUntilShow = timeDiff / (1000 * 60 * 60);

                if (hoursUntilShow > 0 && hoursUntilShow <= 2) {
                    const user = await User.findById(booking.userId);
                    if (user) {
                        // Send Reminder
                        sendEmail(
                            user.email,
                            `Reminder: Your show starts soon!`,
                            `Your show for ${booking.movieTitle} at ${booking.theatreName} starts at ${booking.showTime}. Don't be late!`,
                            `<p>Don't forget! Your show for <b>${booking.movieTitle}</b> starts at <b>${booking.showTime}</b>.</p>`
                        );
                        
                        sendPushNotification(user._id, {
                            title: 'Showtime Reminder!',
                            body: `${booking.movieTitle} starts in less than 2 hours.`
                        });
                    }
                }
            }
        } catch (err) {
            console.error('Error in reminder cron job:', err);
        }
    });
};

module.exports = setupCronJobs;
