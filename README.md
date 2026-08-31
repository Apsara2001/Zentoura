# 🌴 Zentoura - Full-Stack Multilingual Travel & Tourism Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB?logo=react)](https://reactjs.org/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MySQL-339933?logo=node.js)](https://nodejs.org/)

**Zentoura** is a modern, full-stack travel and tourism web application. It offers destination exploration, hotel and room bookings, activity discovery, user reviews, multilingual travel blogs, and a comprehensive admin management dashboard.

---

## ✨ Features

### 👤 Customer Features
- **🌐 Multilingual Support**: Dynamic language selection (English, Spanish, etc.) using `i18next` and Google Cloud Translate API.
- **📍 Destinations & Places**: Discover curated travel destinations with high-resolution image galleries and local details.
- **🏨 Hotel & Room Booking**: Search hotels by location, price, and rating; view room availability; and make instant reservations.
- **🏄 Activity Discovery**: Browse travel experiences, view activity details, and book local tours.
- **📝 Travel Blog Platform**: Read, search, write, and edit community travel stories.
- **💬 Contact & Messages**: Reach out via support message forms.
- **⭐ Reviews & Ratings**: Submit ratings and feedback for hotels, places, and activities.
- **🔐 User Portal & Dashboard**: Account registration, secure JWT authentication, profile editing, and booking history tracking.

### 🛡️ Admin Portal Features
- **📊 Analytics Dashboard**: Visual statistics and revenue/booking analytics powered by Recharts.
- **🏨 Hotel & Room Management**: Add, update, and manage hotel listings and room availability.
- **📍 Places & Destinations Management**: Manage tourism spots and curated destination catalogs.
- **🎯 Activity & Booking Management**: Oversee activity listings and customer booking reservations.
- **📰 Blog Moderation**: Create, edit, publish, and translate travel articles.
- **📬 Messages Inbox**: Manage and respond to customer inquiries.
- **👥 User Administration**: Manage platform users and role assignments.

---

## 🛠️ Tech Stack

### **Frontend (`/Zentoura-frontend`)**
* **Framework:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Framer Motion
* **State & Routing:** React Router v6
* **Localization:** `i18next` & `react-i18next`
* **Charts & Icons:** Recharts & React Icons
* **Form & Notifications:** React Hook Form & React Toastify
* **HTTP Client:** Axios

### **Backend (`/Zentoura-backend`)**
* **Runtime & Framework:** Node.js & Express.js
* **Database:** MySQL
* **ORM:** Sequelize
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Translation:** Google Cloud Translate API
* **File Uploads:** Multer

---

## 📂 Project Structure

```text
Zentoura/
├── Zentoura-frontend/         # React + Vite Frontend Client
│   ├── src/
│   │   ├── components/        # Shared UI components & navbar/footer
│   │   ├── pages/             # Page views (Home, Hotels, Places, Admin Dashboard, etc.)
│   │   ├── context/           # Authentication & state providers
│   │   └── i18n/              # Language translation files
│   ├── package.json
│   └── vite.config.js
│
└── Zentoura-backend/          # Node.js + Express REST API
    ├── config/                # Database configuration (db.js)
    ├── controllers/           # API request controllers
    ├── models/                # Sequelize database models
    ├── routes/                # Express API routes
    ├── middlewares/           # Auth JWT & role validation middleware
    ├── uploads/               # Image asset storage
    ├── .env.example           # Environment template
    ├── app.js                 # Express app initialization
    ├── server.js              # Server entry point
    └── package.json
