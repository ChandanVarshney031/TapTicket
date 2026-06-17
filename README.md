# TapTicket 🎟️

TapTicket is a modern, real-time, and localized movie ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js), WebSockets (Socket.io), and Framer Motion. It offers a premium and responsive user experience for moviegoers, along with a powerful analytics dashboard for administrators.

---

## ✨ Key Features

- **Real-Time Seat Booking**: Powered by Socket.io, seat status changes and selections are updated instantly across all connected clients to prevent double booking.
- **Interactive Seat Mapping**: Dynamic seating grid categories (Gold, Premium, Regular) with custom pricing.
- **Multi-language Support (i18n)**: Fully integrated localization framework utilizing `i18next` for seamless language switching (e.g., between English and Hindi).
- **PDF Ticket Generation**: Downloads detailed ticket PDFs using `jspdf` and `jspdf-autotable` upon successful booking.
- **Admin Dashboard**: Visual analytics with graphs (Chart.js) detailing revenue, movie bookings, active shows, and seat occupancy, alongside management tools for movies and shows.
- **Notification Services**: Web push notifications (via Web-Push VAPID) and automated email scheduling for bookings using `nodemailer` and `node-cron`.
- **Responsive Premium Design**: Beautiful, animated dashboard layouts, glassmorphism elements, and responsive pages styled with custom CSS and animated with `framer-motion`.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (Premium theme, Glassmorphism, Responsive layout)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Localization**: i18next & react-i18next
- **Real-Time updates**: Socket.io-client
- **Charts/Analytics**: Chart.js & react-chartjs-2
- **PDF Export**: jsPDF & jsPDF-AutoTable

### Backend
- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: MongoDB & Mongoose
- **Real-Time Server**: Socket.io
- **Security/Auth**: JSON Web Tokens (JWT) & bcryptjs
- **Background Tasks**: Node-cron (for scheduled checks)
- **Notifications**: Web-Push (Web Push notifications), Nodemailer (Emails)

---

## 📁 Project Structure

```text
TapTicket/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Auth context, etc.)
│   │   ├── pages/          # Home, Auth, Movie Details, Booking, Profile, Admin Dashboard
│   │   ├── utils/          # Utility scripts (Notifications, helpers)
│   │   └── i18n.js         # Localization configuration
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB Mongoose schemas (User, Movie, Booking)
│   ├── routes/             # Express route endpoints (auth, movies, bookings, admin)
│   ├── services/           # Nodemailer & push notifications handlers
│   ├── utils/              # Helper utilities & Cron jobs
│   ├── seed.js             # Initial database seed script
│   └── package.json
└── README.md               # Main project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** instance (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/ChandanVarshney031/TapTicket.git
cd TapTicket
```

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `server` directory and specify the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development

   # VAPID Keys for Push Notifications
   VAPID_PUBLIC_KEY=your_public_vapid_key
   VAPID_PRIVATE_KEY=your_private_vapid_key

   # SMTP Settings (For Emails)
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```
4. Seed the database with mock movies & showtimes:
   ```bash
   node seed.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the client folder (from the project root):
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables. Create a `.env` file in the `client` directory if you need to point to a custom server:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 License

This project is licensed under the **ISC License**.
