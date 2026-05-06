const nodemailer = require('nodemailer');
const webpush = require('web-push');
const User = require('../models/User');

// Setup Web Push
webpush.setVapidDetails(
    'mailto:support@tapticket.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Setup Mailer
const createTransporter = async () => {
    let testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || testAccount.user,
            pass: process.env.SMTP_PASS || testAccount.pass,
        },
    });

    return transporter;
};

const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"TapTicket" <notifications@tapticket.com>',
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent: %s", info.messageId);
        if (!process.env.SMTP_USER) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

const sendPushNotification = async (userId, payload) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.pushSubscription) return;

        await webpush.sendNotification(user.pushSubscription, JSON.stringify(payload));
        console.log("Push notification sent to user:", userId);
    } catch (err) {
        console.error("Error sending push notification:", err);
    }
};

module.exports = {
    sendEmail,
    sendPushNotification
};
