# Zentoura Frontend

Modern, production-ready travel blog platform frontend built with React (Vite), Tailwind CSS, and comprehensive features.

## 🚀 Features

### User Features
- **Modern UI/UX**: Glassmorphism effects, smooth animations, dark mode
- **Authentication**: JWT-based login and registration
- **Blogs**: Browse blogs with pagination, search, and language filters
- **Hotels**: Search hotels by location, filter by price and rating
- **Places & Activities**: Explore destinations and activities
- **Responsive Design**: Mobile-first, fully responsive

### Admin Features
- **Dashboard**: Statistics overview with charts (Recharts)
- **Content Management**: Full CRUD operations for blogs, hotels, places, and activities
- **Protected Routes**: Role-based access control
- **Modern Admin Panel**: Sidebar navigation, clean interface

### Technical Features
- **React 18** with Vite for fast development
- **Tailwind CSS** with custom travel theme
- **Framer Motion** for smooth animations
- **Axios** with JWT interceptors
- **React Router** for navigation
- **Context API** for state management
- **React Toastify** for notifications
- **Recharts** for data visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Zentoura backend running on `http://localhost:5000`

## 🛠️ Installation

```bash
cd Zentoura-frontend
npm install
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios configuration
├── components/
│   ├── Navbar.jsx           # Navigation with dark mode
│   ├── Footer.jsx           # Footer component
│   ├── Hero.jsx             # Animated hero section
│   ├── BlogCard.jsx         # Blog card component
│   ├── HotelCard.jsx        # Hotel card component
│   ├── ActivityCard.jsx     # Activity card component
│   ├── Loader.jsx           # Loading states
│   └── ProtectedRoute.jsx   # Route protection
├── context/
│   └── AuthContext.jsx      # Authentication context
├── layouts/
│   ├── MainLayout.jsx       # User layout
│   └── AdminLayout.jsx      # Admin layout with sidebar
├── pages/
│   ├── Home.jsx             # Home page
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   ├── Blogs.jsx            # Blog listing
│   ├── BlogDetails.jsx      # Blog details
│   ├── Hotels.jsx           # Hotel listing
│   ├── Places.jsx           # Places listing
│   ├── Activities.jsx       # Activities listing
│   ├── Dashboard.jsx        # Admin dashboard
│   ├── ManageBlogs.jsx      # Blog management
│   ├── ManageHotels.jsx     # Hotel management
│   └── NotFound.jsx         # 404 page
├── App.jsx                   # Main app component
└── main.jsx                  # Entry point
```

## 🎨 Design System

### Colors
- **Primary**: Teal gradient (#14b8a6)
- **Secondary**: Blue gradient (#3b82f6)
- **Dark Mode**: Full support with smooth transitions

### Components
- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Responsive Grid**: Mobile-first design with Tailwind

## 🔐 Authentication

### User Login
1. Navigate to `/login`
2. Enter credentials
3. JWT token stored in localStorage
4. Redirected to home page

### Admin Access
1. Login with admin credentials
2. Access admin panel at `/admin/dashboard`
3. Manage content with full CRUD operations

## 📱 Pages Overview

### User Pages
- **Home**: Hero section with featured content
- **Blogs**: Paginated blog list with search and language filter
- **Hotels**: Hotel search with location, price, and rating filters
- **Places**: Grid of travel destinations
- **Activities**: Activity listings with filters

### Admin Pages
- **Dashboard**: Statistics cards and charts
- **Manage Blogs**: Create, edit, delete blogs
- **Manage Hotels**: Full hotel management
- **Manage Places**: Place CRUD operations
- **Manage Activities**: Activity management

## 🌐 API Integration

The frontend connects to the Zentoura backend API:

```javascript
Base URL: http://localhost:5000/api
```

### Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /blogs` - Fetch blogs
- `GET /hotels` - Fetch hotels
- `POST /blogs` - Create blog (admin)
- `PUT /hotels/:id` - Update hotel (admin)
- `DELETE /places/:id` - Delete place (admin)

## 🎯 Key Features

### Dark Mode
Toggle between light and dark themes with smooth transitions. Preference saved in localStorage.

### Protected Routes
- User routes: Require authentication
- Admin routes: Require admin role
- Automatic redirect to login if unauthorized

### Responsive Design
- Mobile hamburger menu
- Responsive grid layouts
- Touch-friendly interactions

### Loading States
- Skeleton loaders for better UX
- Smooth transitions
- Loading spinners

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables if needed

## 📝 Environment Variables

Create a `.env` file if you need to change the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Then update `src/api/axios.js` to use `import.meta.env.VITE_API_URL`

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: { ... },
  secondary: { ... }
}
```

### Animations
Modify animations in `tailwind.config.js` and `src/index.css`

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in backend
- Verify API endpoints

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

ISC

## 👨‍💻 Author

Zentoura Development Team

---

**Ready to explore the world with Zentoura!** ✈️🌍
