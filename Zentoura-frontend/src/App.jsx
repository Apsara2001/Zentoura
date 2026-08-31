import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog.jsx';
import EditBlog from './pages/EditBlog.jsx';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails.jsx';
import Places from './pages/Places';
import PlaceDetails from './pages/PlaceDetails';
import Activities from './pages/Activities';
import ActivityDetails from './pages/ActivityDetails.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import NotFound from './pages/NotFound';
import UserBookings from './pages/UserBookings.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import Profile from './pages/Profile.jsx';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ManageBlogs from './pages/ManageBlogs';
import ManageHotels from './pages/ManageHotels';
import ManagePlaces from './pages/ManagePlaces.jsx';
import ManageActivities from './pages/ManageActivities.jsx';
import ManageRooms from './pages/ManageRooms.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import ManageMessages from './pages/ManageMessages.jsx';
import ManageActivityBookings from './pages/ManageActivityBookings.jsx';

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                        {/* Public Routes with MainLayout */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/blogs" element={<Blogs />} />
                            <Route path="/blogs/:id" element={<BlogDetails />} />
                            <Route path="/blogs/create" element={
                                <ProtectedRoute>
                                    <CreateBlog />
                                </ProtectedRoute>
                            } />
                            <Route path="/blogs/edit/:id" element={
                                <ProtectedRoute>
                                    <EditBlog />
                                </ProtectedRoute>
                            } />
                            <Route path="/hotels" element={<Hotels />} />
                            <Route path="/hotels/:id" element={<HotelDetails />} />
                            <Route path="/places" element={<Places />} />
                            <Route path="/places/:id" element={<PlaceDetails />} />
                            <Route path="/activities" element={<Activities />} />
                            <Route path="/activities/:id" element={<ActivityDetails />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/my-bookings" element={
                                <ProtectedRoute>
                                    <UserBookings />
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                        </Route>

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin-login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<ManageUsers />} />
                            <Route path="blogs" element={<ManageBlogs />} />
                            <Route path="hotels" element={<ManageHotels />} />
                            <Route path="hotels/:hotelId/rooms" element={<ManageRooms />} />
                            <Route path="places" element={<ManagePlaces />} />
                            <Route path="activities" element={<ManageActivities />} />
                            <Route path="messages" element={<ManageMessages />} />
                            <Route path="activity-bookings" element={<ManageActivityBookings />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </BrowserRouter>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
